import { fetchSSE } from '../fetch-sse'
import { GenerateAnswerParams, Provider } from '../types'

interface Prompt {
  role: string
  content: string
}

export class OpenAIProvider implements Provider {
  constructor(
    private token: string,
    private organizationId: string = undefined,
    private model: string,
    private prompts: Prompt[] = [],
    private maxTokens: number = 2048,
    private temperature: number = 1,
    private topP: number = 1,
  ) {
    this.token = token
    this.model = model
    this.prompts = prompts
    this.organizationId = organizationId
    this.maxTokens = maxTokens
    this.temperature = temperature
    this.topP = topP
  }

  async generateAnswer(params: GenerateAnswerParams) {
    let result = ''
    await fetchSSE('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        'OpenAI-Organization': this.organizationId,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [...this.prompts, {
          role: "user",
          content: params.prompt
        }],
        stream: true,
        max_tokens: this.maxTokens,
        temperature: this.temperature,
        top_p: this.topP,
      }),
      onMessage: (message) => {
        if (message === '[DONE]') {
          params.onEvent({ type: 'done' })
          return
        }
        let data
        try {
          data = JSON.parse(message)
          const text = data.choices[0]?.delta?.content
          if (text === undefined || text === '<|im_end|>' || text === '<|im_sep|>') {
            return
          }
          result += text
          params.onEvent({
            type: 'answer',
            data: {
              role: 'assistant',
              content: result,
              conversationId: data.id,
            },
          })
        } catch (err) {
          console.error(err)
          return
        }
      },
    })
    return {}
  }
}
