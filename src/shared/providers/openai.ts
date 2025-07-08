import { fetchSSE } from '../fetch-sse';
import { GenerateAnswerParams } from '../types';
import { BaseProvider } from './base';
import { OPENAI_API_BASE_URL } from '../constants';

interface Prompt {
  role: string
  content: string
}

export class OpenAIProvider extends BaseProvider {
  constructor(
    token: string,
    private organizationId: string | undefined,
    model: string,
    private prompts: Prompt[] = [],
    private maxTokens: number = 2048,
    private temperature: number = 1,
    private topP: number = 1,
  ) {
    super(token, model);
  }

  async generateAnswer(params: GenerateAnswerParams): Promise<{ cleanup?: () => void }> {
    let result = ''
    await fetchSSE(`${OPENAI_API_BASE_URL}/chat/completions`, {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
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
