import {
  STUDIO_SOCKET_PATH,
  type StudioCommand,
  type StudioEvent,
} from './shared/protocol'

export type StudioConnectionState =
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'closed'

/** Browser transport only: reconnects never resubmit a mutating command. */
export class StudioConnection {
  private socket?: WebSocket
  private retry?: ReturnType<typeof setTimeout>
  private stopped = false
  private attempts = 0

  constructor(
    private readonly receive: (event: StudioEvent) => void,
    private readonly state: (value: StudioConnectionState) => void,
  ) {}

  connect(location: Location) {
    const token = new URLSearchParams(location.hash.slice(1)).get('token')
    if (!token) {
      this.state('closed')
      this.receive({
        type: 'error',
        message:
          'Open Studio using the complete link printed in your terminal.',
      })
      return
    }
    const url = new URL(STUDIO_SOCKET_PATH, location.href)
    url.protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
    url.searchParams.set('token', token)
    const open = () => {
      if (this.stopped) return
      this.state(this.attempts ? 'reconnecting' : 'connecting')
      const socket = new WebSocket(url)
      this.socket = socket
      socket.onopen = () => {
        this.attempts = 0
        this.state('connected')
      }
      socket.onmessage = (message) => {
        try {
          const event = JSON.parse(String(message.data)) as StudioEvent
          if (event.type !== 'snapshot' && event.type !== 'error')
            throw new Error('Unknown message.')
          if (event.type === 'snapshot' && event.snapshot.status === 'closing')
            this.stopped = true
          this.receive(event)
        } catch {
          this.receive({
            type: 'error',
            message: 'Studio received an invalid response.',
          })
          socket.close(4002, 'Invalid response')
        }
      }
      socket.onclose = () => {
        if (this.stopped) {
          this.state('closed')
          return
        }
        this.state('reconnecting')
        this.retry = setTimeout(
          open,
          Math.min(5000, 300 * 2 ** Math.min(this.attempts++, 5)),
        )
      }
      socket.onerror = () => {
        /* close schedules a single reconnect. */
      }
    }
    open()
  }

  send(command: StudioCommand) {
    if (this.socket?.readyState !== WebSocket.OPEN) return false
    this.socket.send(JSON.stringify(command))
    return true
  }

  close() {
    this.stopped = true
    if (this.retry) clearTimeout(this.retry)
    this.socket?.close()
  }
}
