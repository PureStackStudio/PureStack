import { createHash } from 'node:crypto'
import type { IncomingMessage, Server } from 'node:http'
import type { Duplex } from 'node:stream'
import {
  encodeWebSocketFrame,
  validateClose,
  validCloseCode,
  WebSocketFrameDecoder,
  WebSocketProtocolError,
} from './websocket-frames'

export type DevWebSocketMessage = string | Uint8Array
export interface DevWebSocketConnection {
  readonly open: boolean
  send(message: DevWebSocketMessage): boolean
  close(code?: number, reason?: string): void
  onMessage(listener: (message: DevWebSocketMessage) => void): () => void
  onClose(listener: () => void): () => void
}

export interface DevWebSocketEndpoint {
  /** Exact URL pathname, independent of the site's basePath. */
  path: string
  maxPayload?: number
  /** Runs before accepting the handshake. Return false to reject with 403. */
  authorize?: (request: IncomingMessage) => boolean
  connect(connection: DevWebSocketConnection, request: IncomingMessage): void
}

const DEFAULT_MAX_PAYLOAD = 1024 * 1024

/** Attaches optional endpoints to the existing HTTP server, including cleanup. */
export function attachWebSockets(
  server: Server,
  endpoints: readonly DevWebSocketEndpoint[],
  reportError: (error: unknown) => void,
) {
  const routes = new Map<string, DevWebSocketEndpoint>()
  const peers = new Set<WebSocketPeer>()
  for (const endpoint of endpoints) {
    if (
      !endpoint.path.startsWith('/') ||
      /[?#]/.test(endpoint.path) ||
      routes.has(endpoint.path)
    )
      throw new Error(`Invalid or duplicate WebSocket path: ${endpoint.path}`)
    const limit = endpoint.maxPayload ?? DEFAULT_MAX_PAYLOAD
    if (!Number.isSafeInteger(limit) || limit < 125)
      throw new Error(
        'WebSocket maxPayload must be an integer of at least 125.',
      )
    routes.set(endpoint.path, endpoint)
  }
  const upgrade = (request: IncomingMessage, socket: Duplex, head: Buffer) => {
    socket.on('error', () => socket.destroy())
    try {
      const endpoint = routes.get(
        new URL(request.url ?? '/', 'http://localhost').pathname,
      )
      if (!endpoint) return reject(socket, 404, 'Not Found')
      if (endpoint.authorize && !endpoint.authorize(request))
        return reject(socket, 403, 'Forbidden')
      const key = request.headers['sec-websocket-key']
      if (
        request.method !== 'GET' ||
        request.headers.upgrade?.toLowerCase() !== 'websocket' ||
        !request.headers.connection
          ?.toLowerCase()
          .split(/\s*,\s*/)
          .includes('upgrade') ||
        request.headers['sec-websocket-version'] !== '13' ||
        typeof key !== 'string' ||
        !/^[A-Za-z0-9+/]{22}==$/.test(key)
      )
        return reject(socket, 400, 'Bad Request')
      const accept = createHash('sha1')
        .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
        .digest('base64')
      socket.write(
        `HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: ${accept}\r\n\r\n`,
      )
      const peer = new WebSocketPeer(
        socket,
        endpoint.maxPayload ?? DEFAULT_MAX_PAYLOAD,
        reportError,
      )
      peers.add(peer)
      peer.onClose(() => peers.delete(peer))
      endpoint.connect(peer, request)
      if (head.length) peer.receive(head)
    } catch (error) {
      reportError(error)
      socket.destroy()
    }
  }
  if (routes.size) server.on('upgrade', upgrade)
  return async () => {
    server.off('upgrade', upgrade)
    await Promise.all([...peers].map((peer) => peer.shutdown()))
  }
}

function reject(socket: Duplex, code: number, reason: string) {
  socket.end(
    `HTTP/1.1 ${code} ${reason}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`,
  )
}

class WebSocketPeer implements DevWebSocketConnection {
  private readonly decoder: WebSocketFrameDecoder
  private readonly messages = new Set<(message: DevWebSocketMessage) => void>()
  private readonly closed = new Set<() => void>()
  private closing = false
  private timer?: NodeJS.Timeout
  private readonly finished = Promise.withResolvers<void>()

  constructor(
    private readonly socket: Duplex,
    private readonly maxPayload: number,
    private readonly reportError: (error: unknown) => void,
  ) {
    this.decoder = new WebSocketFrameDecoder(maxPayload)
    socket.on('data', (chunk: Buffer) => this.receive(chunk))
    socket.once('close', () => {
      this.closing = true
      if (this.timer) clearTimeout(this.timer)
      for (const listener of this.closed) {
        try {
          listener()
        } catch (error) {
          this.reportError(error)
        }
      }
      this.closed.clear()
      this.messages.clear()
      this.finished.resolve()
    })
    socket.once('end', () => socket.end())
  }

  get open() {
    return !this.closing && !this.socket.destroyed
  }

  send(message: DevWebSocketMessage) {
    if (!this.open) return false
    const data = typeof message === 'string' ? Buffer.from(message) : message
    if (
      data.byteLength > this.maxPayload ||
      this.socket.writableLength > this.maxPayload * 4
    ) {
      this.close(1009, 'Outgoing queue too large.')
      return false
    }
    this.socket.write(
      encodeWebSocketFrame(typeof message === 'string' ? 1 : 2, data),
    )
    return true
  }

  onMessage(listener: (message: DevWebSocketMessage) => void) {
    this.messages.add(listener)
    return () => {
      this.messages.delete(listener)
    }
  }

  onClose(listener: () => void) {
    this.closed.add(listener)
    return () => {
      this.closed.delete(listener)
    }
  }

  close(code = 1000, reason = '') {
    if (!validCloseCode(code) || Buffer.byteLength(reason) > 123)
      throw new Error('Invalid WebSocket close code or reason.')
    const data = Buffer.alloc(2 + Buffer.byteLength(reason))
    data.writeUInt16BE(code)
    data.write(reason, 2)
    this.end(data)
  }

  async shutdown() {
    this.close(1001, 'Server shutting down.')
    await this.finished.promise
  }

  receive(chunk: Buffer) {
    try {
      this.decoder.push(chunk, ({ opcode, data }) => {
        if (opcode === 8) {
          validateClose(data)
          if (!this.closing) this.end(data)
          this.socket.end()
          return false
        }
        if (this.closing) return true
        if (opcode === 9) this.socket.write(encodeWebSocketFrame(10, data))
        else if (opcode !== 10) {
          for (const listener of this.messages)
            listener(opcode === 1 ? data.toString('utf8') : data)
        }
        return true
      })
    } catch (error) {
      if (!(error instanceof WebSocketProtocolError)) this.reportError(error)
      this.close(
        error instanceof WebSocketProtocolError ? error.code : 1011,
        'Connection error.',
      )
    }
  }

  private end(data: Buffer) {
    if (!this.open) return
    this.closing = true
    this.socket.write(encodeWebSocketFrame(8, data))
    this.timer = setTimeout(() => this.socket.destroy(), 500)
    this.timer.unref()
  }
}
