import type http from 'node:http'

const LIVE_RELOAD_MAX_CLIENTS = 8
const LIVE_RELOAD_MAX_PER_ADDRESS = 1

export type LiveReloadClientMeta = { createdAt: number; address?: string }

export type LiveReloadClients = Map<http.ServerResponse, LiveReloadClientMeta>

export function registerLiveReloadClient(
  clients: LiveReloadClients,
  req: http.IncomingMessage,
  res: http.ServerResponse,
  version: number,
) {
  req.setTimeout(0)
  res.setTimeout(0)
  res.socket?.setTimeout(0)
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  })
  writeSseEvent(res, 'ping', 'ready')
  writeSseEvent(res, 'state', JSON.stringify({ version, reason: 'connect' }))
  pruneLiveReloadClients(clients)
  if (clients.size >= LIVE_RELOAD_MAX_CLIENTS) {
    closeOldestLiveReloadClients(
      clients,
      clients.size - LIVE_RELOAD_MAX_CLIENTS + 1,
    )
  }
  const address = req.socket.remoteAddress
  if (address) {
    closeLiveReloadClientsForAddress(
      clients,
      address,
      LIVE_RELOAD_MAX_PER_ADDRESS,
    )
  }
  clients.set(res, { createdAt: Date.now(), address })
  req.on('close', () => {
    clients.delete(res)
  })
  res.on('error', () => {
    clients.delete(res)
  })
}

export function broadcastJson(
  clients: LiveReloadClients,
  event: string,
  payload: Record<string, unknown>,
) {
  broadcast(clients, event, JSON.stringify(payload))
}

function writeSseEvent(res: http.ServerResponse, event: string, data: string) {
  res.write(`event: ${event}\n`)
  res.write(`data: ${data}\n\n`)
}

function broadcast(clients: LiveReloadClients, event: string, data: string) {
  for (const client of clients.keys()) {
    if (!isLiveReloadClientAlive(client)) {
      clients.delete(client)
      continue
    }
    try {
      writeSseEvent(client, event, data)
    } catch {
      clients.delete(client)
      try {
        client.end()
      } catch {
        // ignore secondary close errors
      }
    }
  }
}

function isLiveReloadClientAlive(client: http.ServerResponse) {
  return client.writable && !client.writableEnded && !client.destroyed
}

function pruneLiveReloadClients(clients: LiveReloadClients) {
  for (const client of clients.keys()) {
    if (!isLiveReloadClientAlive(client)) {
      clients.delete(client)
    }
  }
}

function closeOldestLiveReloadClients(
  clients: LiveReloadClients,
  count: number,
) {
  const entries = [...clients.entries()].sort(
    (left, right) => left[1].createdAt - right[1].createdAt,
  )
  for (const [client] of entries.slice(0, count)) {
    clients.delete(client)
    try {
      client.end()
    } catch {
      // ignore close errors
    }
  }
}

function closeLiveReloadClientsForAddress(
  clients: LiveReloadClients,
  address: string,
  keepNewest: number,
) {
  const entries = [...clients.entries()]
    .filter(([, meta]) => meta.address === address)
    .sort((left, right) => left[1].createdAt - right[1].createdAt)
  const toClose = Math.max(0, entries.length - keepNewest)
  for (const [client] of entries.slice(0, toClose)) {
    clients.delete(client)
    try {
      client.end()
    } catch {
      // ignore close errors
    }
  }
}

export function injectLiveReload(html: string, endpoint: string, version: number) {
  if (html.includes('data-ts-ssg-live-reload')) return html
  const snippet =
    `<script data-ts-ssg-live-reload>` +
    `(() => {` +
    `const pageVersion = __PAGE_VERSION__;` +
    `const parseJSON = (value) => {` +
    `try { return JSON.parse(value); } catch { return null; }` +
    `};` +
    `const normalize = (value) => {` +
    `if (!value) return '/';` +
    `let next = value.startsWith('/') ? value : '/' + value;` +
    `if (next.length > 1 && next.endsWith('/')) next = next.slice(0, -1);` +
    `return next;` +
    `};` +
    `const source = new EventSource('${endpoint}');` +
    `source.addEventListener('state', (event) => {` +
    `const payload = parseJSON(event.data);` +
    `const next = Number(payload?.version);` +
    `if (!Number.isFinite(next)) return;` +
    `if (next > pageVersion) location.reload();` +
    `});` +
    `source.addEventListener('page-rendered', (event) => {` +
    `const payload = parseJSON(event.data);` +
    `if (normalize(payload?.path) === normalize(location.pathname)) location.reload();` +
    `});` +
    `})();` +
    `</script>`
  const withVersion = snippet.replace('__PAGE_VERSION__', String(version))

  const bodyIndex = html.lastIndexOf('</body>')
  if (bodyIndex !== -1) {
    return html.slice(0, bodyIndex) + withVersion + html.slice(bodyIndex)
  }

  const headIndex = html.lastIndexOf('</head>')
  if (headIndex !== -1) {
    return html.slice(0, headIndex) + withVersion + html.slice(headIndex)
  }

  return html + withVersion
}
