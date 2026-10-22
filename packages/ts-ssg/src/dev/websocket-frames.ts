import { isUtf8 } from 'node:buffer'

export class WebSocketProtocolError extends Error {
  constructor(
    readonly code: number,
    message: string,
  ) {
    super(message)
  }
}

export interface WebSocketFrame {
  opcode: number
  final: boolean
  data: Buffer
}

/** Incremental RFC 6455 client-frame decoder; no compression is negotiated. */
export class WebSocketFrameDecoder {
  private buffer: Buffer = Buffer.alloc(0)
  private fragmentOpcode = 0
  private fragments: Buffer[] = []
  private fragmentSize = 0

  constructor(private readonly maxPayload: number) {}

  push(chunk: Buffer, receive: (frame: WebSocketFrame) => boolean) {
    this.buffer = this.buffer.length
      ? Buffer.concat([this.buffer, chunk])
      : chunk
    while (this.buffer.length >= 2) {
      const frame = this.readFrame()
      if (!frame) return
      if (frame.opcode >= 8) {
        if (!receive(frame)) return
        continue
      }
      if (frame.opcode === 0) {
        if (!this.fragmentOpcode) this.fail('Unexpected continuation.')
      } else {
        if (this.fragmentOpcode) this.fail('Unfinished fragmented message.')
        this.fragmentOpcode = frame.opcode
      }
      this.fragmentSize += frame.data.length
      if (this.fragmentSize > this.maxPayload)
        throw new WebSocketProtocolError(1009, 'Message too large.')
      this.fragments.push(frame.data)
      if (!frame.final) continue
      const data = Buffer.concat(this.fragments, this.fragmentSize)
      const opcode = this.fragmentOpcode
      this.fragments = []
      this.fragmentOpcode = 0
      this.fragmentSize = 0
      if (opcode === 1 && !isUtf8(data))
        throw new WebSocketProtocolError(1007, 'Invalid UTF-8.')
      if (!receive({ opcode, final: true, data })) return
    }
  }

  private readFrame(): WebSocketFrame | undefined {
    const first = this.buffer[0]
    const second = this.buffer[1]
    const opcode = first & 0x0f
    const final = Boolean(first & 0x80)
    if (first & 0x70 || !(second & 0x80))
      this.fail('Client frames must be masked without extensions.')
    if (![0, 1, 2, 8, 9, 10].includes(opcode)) this.fail('Invalid opcode.')
    let size = second & 0x7f
    let offset = 2
    if (opcode >= 8 && (!final || size > 125))
      this.fail('Invalid control frame.')
    if (size === 126) {
      if (this.buffer.length < 4) return
      size = this.buffer.readUInt16BE(2)
      if (size < 126) this.fail('Noncanonical length.')
      offset = 4
    } else if (size === 127) {
      if (this.buffer.length < 10) return
      const length = this.buffer.readBigUInt64BE(2)
      if (length < 65536n || length >> 63n) this.fail('Invalid length.')
      if (length > BigInt(this.maxPayload))
        throw new WebSocketProtocolError(1009, 'Message too large.')
      size = Number(length)
      offset = 10
    }
    if (size > this.maxPayload)
      throw new WebSocketProtocolError(1009, 'Frame too large.')
    if (this.buffer.length < offset + 4 + size) return
    const mask = this.buffer.subarray(offset, offset + 4)
    offset += 4
    const data = Buffer.from(this.buffer.subarray(offset, offset + size))
    for (let i = 0; i < data.length; i++) data[i] ^= mask[i % 4]
    this.buffer = this.buffer.subarray(offset + size)
    return { opcode, final, data }
  }

  private fail(message: string): never {
    throw new WebSocketProtocolError(1002, message)
  }
}

export function encodeWebSocketFrame(opcode: number, data: Uint8Array) {
  const size = data.byteLength
  const header = Buffer.alloc(size < 126 ? 2 : size < 65536 ? 4 : 10)
  header[0] = 0x80 | opcode
  header[1] = size < 126 ? size : size < 65536 ? 126 : 127
  if (header.length === 4) header.writeUInt16BE(size, 2)
  if (header.length === 10) header.writeBigUInt64BE(BigInt(size), 2)
  return Buffer.concat([header, data])
}

export function validCloseCode(code: number) {
  return (
    (code >= 1000 && code <= 1014 && ![1004, 1005, 1006].includes(code)) ||
    (code >= 3000 && code <= 4999)
  )
}

export function validateClose(data: Buffer) {
  if (data.length === 1)
    throw new WebSocketProtocolError(1002, 'Invalid close payload.')
  if (data.length >= 2) {
    if (!validCloseCode(data.readUInt16BE(0)))
      throw new WebSocketProtocolError(1002, 'Invalid close code.')
    if (!isUtf8(data.subarray(2)))
      throw new WebSocketProtocolError(1007, 'Invalid close reason.')
  }
}
