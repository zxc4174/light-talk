import ExpiryMap from "expiry-map";
import { getUserConfig } from "./config";
import { OpenAIModel, ChatGPTModel } from "./types";
import { OPENAI_API_BASE_URL, CHATGPT_API_BASE_URL, CHATGPT_SESSION_URL } from "./constants";


// OpenAI API

export const fetchOpenAIModels = async (): Promise<OpenAIModel[]> => {
    const config = await getUserConfig();
    if (!config.apiKey) return [];

    const response = await fetch(`${OPENAI_API_BASE_URL}/models`, {
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

const cache = new ExpiryMap(10 * 1000);

export const getChatGPTAccessToken = async (token: string): Promise<string> => {
    if (cache.get(token)) {
        return cache.get(token)
    }
    const resp = await fetch(CHATGPT_SESSION_URL)
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

export const fetchChatGPTModels = async (): Promise<ChatGPTModel[]> => {
    const config = await getUserConfig()

    const token = await getChatGPTAccessToken(config?.apiKey ?? 'ACCESS_TOKEN')
    const response = await fetch(`${CHATGPT_API_BASE_URL}/models`, {
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
    return fetch(`${CHATGPT_API_BASE_URL}/conversation/message_feedback`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: data === undefined ? undefined : JSON.stringify(data),
    })
}