import ExpiryMap from "expiry-map"
import { getUserConfig } from "./config"
import { OpenAIModel } from "./types"


// OpenAI API
const BASE_OPEN_AI_URL = "https://api.openai.com/v1"

export const fetchOpenAIModels = async (): Promise<OpenAIModel[]> => {
    const config = await getUserConfig()
    if (!config.apiKey) return

    const response = await fetch(`${BASE_OPEN_AI_URL}/models`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.apiKey}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to fetch models")
    }

    const data = await response.json()
    return data.data
}

// ChatGPT API

const BASE_CHAT_GPT_URL = "https://chat.openai.com/backend-api"

const cache = new ExpiryMap(10 * 1000)

export const getChatGPTAccessToken = async (token: string): Promise<string> => {
    if (cache.get(token)) {
        return cache.get(token)
    }
    const resp = await fetch('https://chat.openai.com/api/auth/session')
    if (resp.status === 403) {
        throw new Error('CLOUDFLARE')
    }
    const data = await resp.json().catch(() => ({}))
    if (!data.accessToken) {
        throw new Error('UNAUTHORIZED')
    }
    cache.set(token, data.accessToken)
    return data.accessToken
}

export const fetchChatGPTModels = async (): Promise<any> => {
    const config = await getUserConfig()

    const token = await getChatGPTAccessToken(config?.apiKey ?? 'ACCESS_TOKEN')
    const response = await fetch(`${BASE_CHAT_GPT_URL}/models`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error("Failed to fetch models")
    }

    const data = await response.json()
    return data?.models
}

export async function sendMessageFeedback(token: string, data: unknown) {
    return fetch(`${BASE_CHAT_GPT_URL}/conversation/message_feedback`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: data === undefined ? undefined : JSON.stringify(data),
    })
}