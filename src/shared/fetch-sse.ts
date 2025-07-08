import { isEmpty } from './utils'

export async function fetchSSE(
  resource: string,
  options: RequestInit & { onMessage: (message: string) => void },
) {
  const { onMessage, ...fetchOptions } = options
  const resp = await fetch(resource, fetchOptions)
  if (!resp.ok) {
    const error = await resp.json().catch(() => ({}))
    throw new Error(!isEmpty(error) ? JSON.stringify(error) : `${resp.status} ${resp.statusText}`)
  }

  const reader = resp.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let boundary = buffer.indexOf('\n\n')
    while (boundary !== -1) {
      const chunk = buffer.slice(0, boundary).trim()
      buffer = buffer.slice(boundary + 2)
      if (chunk.startsWith('data:')) {
        onMessage(chunk.slice(5).trim())
      }
      boundary = buffer.indexOf('\n\n')
    }
  }

  const trimmed = buffer.trim()
  if (trimmed.startsWith('data:')) {
    onMessage(trimmed.slice(5).trim())
  }
}
