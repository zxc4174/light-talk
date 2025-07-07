export type QueryMode = 'completion' | 'chat' | 'translate' | 'edit'

export type QueryStatus = 'success' | 'error' | 'stop' | undefined

export type Role = 'system' | 'assistant' | 'user'

export type PopoverWidthSize = 'md' | 'lg'

export interface Answer {
    role: Role
    content: string
    conversationId?: string
    finishReason?: string
    parent_message_id?: string
}

export interface OpenAIModel {
    id: string
    object: string
    created: number
    parent: string
    owned_by: string
    permission: Record<string, unknown>[]
}

export interface ChatGPTModel {
    slug: string
    title: string
    max_tokens: number
    description: string
    tags: string[]
    qualitative_properties: {
        reasoning: number[]
        speed: number[]
        conciseness: number[]
    }
}

export interface openAIError {
    message: string,
    type: string,
    param: string,
    code: string,
}

export type Event =
    | {
        type: 'answer'
        data: Answer
    }
    | {
        type: 'done'
    }

export interface GenerateAnswerParams {
    prompt: string
    onEvent: (event: Event) => void
    signal?: AbortSignal
}

export interface Provider {
    generateAnswer(params: GenerateAnswerParams): Promise<{ cleanup?: () => void }>
}