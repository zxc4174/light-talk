import { getUserConfig } from "./config";
import { OpenAIModel } from "./types";
import { OPENAI_API_BASE_URL } from "./constants";


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
    });

    if (!response.ok) {
        throw new Error("Failed to fetch models");
    }

    const data = await response.json();
    return data.data;
}