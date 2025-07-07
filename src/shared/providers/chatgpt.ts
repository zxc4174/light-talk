import { v4 as uuidv4 } from 'uuid';
import { GenerateAnswerParams } from '../types';
import { fetchSSE } from '../fetch-sse';
import { BaseProvider } from './base';
import { CHATGPT_API_BASE_URL } from '../constants';

async function request(token: string, method: string, path: string, data?: unknown) {
  return fetch(`${CHATGPT_API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: data === undefined ? undefined : JSON.stringify(data),
  })
}

export async function setConversationProperty(
  token: string,
  conversationId: string,
  propertyObject: object,
) {
  await request(token, 'PATCH', `/conversation/${conversationId}`, propertyObject)
}

interface ConversationBody {
  action: 'next';
  messages: Array<{
    id: string;
    role: 'user';
    content: { content_type: 'text'; parts: string[] };
  }>;
  model: string;
  parent_message_id: string;
  conversation_id?: string;
}
export class ChatGPTProvider extends BaseProvider {
  constructor(
    token: string,
    model: string,
    private conversationId: string | null,
    private parentMessageId: string | null,
  ) {
    super(token, model);
  }

  async generateAnswer(params: GenerateAnswerParams) {
    const cleanup = () => {
      if (this.conversationId) {
        setConversationProperty(this.token, this.conversationId, { is_visible: false })
      }
    }

    const body: ConversationBody = {
      action: 'next',
      messages: [
        {
          id: uuidv4(),
          role: 'user',
          content: {
            content_type: 'text',
            parts: [params.prompt],
          },
        },
      ],
      model: this.model,
      parent_message_id: this.parentMessageId ?? uuidv4(),
    }
    if (this.conversationId) {
      body.conversation_id = this.conversationId;
    }

    await fetchSSE(`${CHATGPT_API_BASE_URL}/conversation`, {
      method: 'POST',
      signal: params.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify(body),
      onMessage(message: string) {
        console.debug('sse message', message)
        if (message === '[DONE]') {
          params.onEvent({ type: 'done' })
          cleanup()
          return
        }
        let data
        try {
          data = JSON.parse(message)
        } catch (err) {
          console.error(err)
          return
        }
        const text = data.message?.content?.parts?.[0]
        const messageId = data.message?.id
        if (text) {
          params.onEvent({
            type: 'answer',
            data: {
              role: 'assistant',
              content: text,
              conversationId: data.conversation_id,
              parent_message_id: messageId
            },
          })
        }
      },
    })
    return { cleanup }
  }
}