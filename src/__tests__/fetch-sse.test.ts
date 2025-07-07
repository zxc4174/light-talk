import { fetchSSE } from '../shared/fetch-sse';

describe('fetchSSE', () => {
  test('parses streamed server-sent events', async () => {
    const chunks = [
      'data: first\n\n',
      'data: second\n\n',
      'data: [DONE]\n\n'
    ];
    const stream = new ReadableStream({
      start(controller) {
        chunks.forEach(c => controller.enqueue(new TextEncoder().encode(c)));
        controller.close();
      }
    });

    global.fetch = jest.fn(() =>
      Promise.resolve(new Response(stream, { status: 200 }))
    ) as any;

    const messages: string[] = [];
    await fetchSSE('https://example.com', {
      method: 'POST',
      onMessage: m => messages.push(m)
    });

    expect(messages).toEqual(['first', 'second', '[DONE]']);
  });
});
