import { once } from 'node:events'
import http from 'node:http'
import { describe, expect, it } from 'vitest'
import { attachWebSockets, type DevWebSocketConnection } from './websocket'
import {
  encodeWebSocketFrame,
  WebSocketFrameDecoder,
  WebSocketProtocolError,
} from './websocket-frames'

function clientFrame(opcode: number, text: string | Buffer, final = true) {
  const data = Buffer.from(text)
  const header = Buffer.alloc(data.length < 126 ? 2 : 4)
  header[0] = (final ? 0x80 : 0) | opcode
  header[1] = 0x80 | Math.min(data.length, 126)
  if (header.length === 4) header.writeUInt16BE(data.length, 2)
  const mask = Buffer.from([1, 2, 3, 4])
  for (let i = 0; i < data.length; i++) data[i] ^= mask[i % 4]
  return Buffer.concat([header, mask, data])
}

describe('WebSocket framing', () => {
  it('reassembles split frames, fragmented UTF-8 and interleaved ping frames', () => {
    const decoder = new WebSocketFrameDecoder(1024)
    const frames: { opcode: number; text: string }[] = []
    const unicode = Buffer.from('Hello 🌍')
    const stream = Buffer.concat([
      clientFrame(1, unicode.subarray(0, 8), false),
      clientFrame(9, 'ping'),
      clientFrame(0, unicode.subarray(8)),
      clientFrame(2, 'binary'),
    ])
    for (const byte of stream)
      decoder.push(Buffer.from([byte]), (frame) => {
        frames.push({ opcode: frame.opcode, text: frame.data.toString() })
        return true
      })
    expect(frames).toEqual([
      { opcode: 9, text: 'ping' },
      { opcode: 1, text: 'Hello 🌍' },
      { opcode: 2, text: 'binary' },
    ])
  })

  it.each([
    ['unmasked', encodeWebSocketFrame(1, Buffer.from('hello')), 1002],
    ['unexpected continuation', clientFrame(0, 'hello'), 1002],
    ['fragmented ping', clientFrame(9, 'ping', false), 1002],
    ['invalid UTF-8', clientFrame(1, Buffer.from([0xff])), 1007],
    ['oversized frame', clientFrame(2, Buffer.alloc(1025)), 1009],
    [
      'overlapping messages',
      Buffer.concat([clientFrame(1, 'one', false), clientFrame(1, 'two')]),
      1002,
    ],
    [
      'oversized fragmented message',
      Buffer.concat([
        clientFrame(1, 'a'.repeat(600), false),
        clientFrame(0, 'b'.repeat(600)),
      ]),
      1009,
    ],
  ])('rejects %s', (_name, bytes, code) => {
    try {
      new WebSocketFrameDecoder(1024).push(bytes, () => true)
      throw new Error('Invalid frame was accepted.')
    } catch (error) {
      expect(error).toBeInstanceOf(WebSocketProtocolError)
      expect((error as WebSocketProtocolError).code).toBe(code)
    }
  })
})

describe('WebSocket endpoints on an existing HTTP listener', () => {
  it('routes and authorizes before upgrading, supports server push and closes peers on shutdown', async () => {
    const server = http.createServer((_req, res) => res.end('ordinary HTTP'))
    const errors: unknown[] = []
    let peer: DevWebSocketConnection | undefined
    const close = attachWebSockets(
      server,
      [
        {
          path: '/session',
          authorize: (request) => request.url === '/session?token=secret',
          connect: (connection) => {
            peer = connection
            connection.send('welcome')
            connection.onMessage((message) => connection.send(message))
          },
        },
      ],
      (error) => errors.push(error),
    )
    server.listen(0, '127.0.0.1')
    await once(server, 'listening')
    const address = server.address()
    if (!address || typeof address === 'string') throw new Error('No port.')
    const base = `http://127.0.0.1:${address.port}`
    let client: WebSocket | undefined
    try {
      expect(await fetch(base).then((response) => response.text())).toBe(
        'ordinary HTTP',
      )
      expect(await upgradeStatus(base, '/unknown')).toBe(404)
      expect(await upgradeStatus(base, '/session')).toBe(403)
      client = new WebSocket(
        `${base.replace('http:', 'ws:')}/session?token=secret`,
      )
      const messages: string[] = []
      client.addEventListener('message', (event) =>
        messages.push(String(event.data)),
      )
      await new Promise<void>((resolve, reject) => {
        client?.addEventListener('open', () => resolve(), { once: true })
        client?.addEventListener('error', reject, { once: true })
      })
      client.send('hello')
      await waitFor(() => messages.includes('hello'))
      peer?.send('server initiated')
      await waitFor(() => messages.includes('server initiated'))
      expect(messages).toEqual(['welcome', 'hello', 'server initiated'])
      client.binaryType = 'arraybuffer'
      const binary = new Promise<ArrayBuffer>((resolve) =>
        client?.addEventListener(
          'message',
          (event) => {
            if (event.data instanceof ArrayBuffer) resolve(event.data)
          },
          { once: true },
        ),
      )
      const payload = new Uint8Array(70000).fill(42)
      client.send(payload)
      expect(new Uint8Array(await binary)).toEqual(payload)
      const closed = new Promise<CloseEvent>((resolve) =>
        client?.addEventListener('close', resolve, { once: true }),
      )
      await close()
      expect((await closed).code).toBe(1001)
      expect(errors).toEqual([])
    } finally {
      client?.close()
      await close()
      await new Promise<void>((resolve) => server.close(() => resolve()))
    }
  })
})

async function upgradeStatus(base: string, pathname: string) {
  return new Promise<number>((resolve, reject) => {
    const request = http.get(
      new URL(pathname, base),
      {
        headers: {
          Connection: 'Upgrade',
          Upgrade: 'websocket',
          'Sec-WebSocket-Version': '13',
          'Sec-WebSocket-Key': 'AQIDBAUGBwgJCgsMDQ4PEC==',
        },
      },
      (response) => {
        response.resume()
        resolve(response.statusCode ?? 0)
      },
    )
    request.on('error', reject)
  })
}

async function waitFor(condition: () => boolean) {
  const deadline = Date.now() + 2000
  while (!condition()) {
    if (Date.now() > deadline) throw new Error('WebSocket message timed out.')
    await new Promise((resolve) => setTimeout(resolve, 10))
  }
}
