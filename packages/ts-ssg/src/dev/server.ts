import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'

import { createLogger, getLogger } from 'logpot'

import { createIncrementalBuilder } from '../build/incremental'
import { type BuildInput, buildSite } from '../build/site'
import { resolveSiteConfig } from '../config/config'
import { logError } from '../util/logging'

export interface DevServerOptions {
  host?: string
  port?: number
  watch?: boolean
  liveReload?: boolean
  incremental?: boolean
}

export type DevServerInput = BuildInput & DevServerOptions

export interface DevServerHandle {
  close: () => Promise<void>
}

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 4173
const LIVE_RELOAD_PATH = '/__ts-ssg/events'
const HEALTH_PATH = '/__ts-ssg/health'
const LIVE_RELOAD_HEARTBEAT_MS = 25000
const REQUEST_TIMEOUT_MS = 30000
const SLOW_REQUEST_MS = 1000
const LIVE_RELOAD_MAX_CLIENTS = 8
const LIVE_RELOAD_MAX_PER_ADDRESS = 2

export async function startDevServer(
  input: DevServerInput = {},
): Promise<DevServerHandle> {
  const config = resolveSiteConfig(input)
  const logger = await createLogger()
  const log = getLogger()
  const debug =
    process.env.TS_SSG_DEV_DEBUG === '1' ||
    process.env.TS_SSG_DEV_DEBUG === 'true'
  const debugLog = (message: string, data?: Record<string, unknown>) => {
    if (!debug) return
    log.info(message, data)
  }

  const host = input.host ?? DEFAULT_HOST
  const port = input.port ?? DEFAULT_PORT
  const watch = input.watch ?? true
  const liveReload = input.liveReload ?? true
  const incrementalEnabled = input.incremental ?? true

  const clients = new Map<
    http.ServerResponse,
    { createdAt: number; address?: string }
  >()
  let startupReloadPending = true
  let initialBuildDone = false
  let watcher: { close: () => void } | undefined
  let healthTimer: NodeJS.Timeout | undefined
  let heartbeatTimer: NodeJS.Timeout | undefined
  let lastRebuildStartedAt = 0
  let lastRebuildEndedAt = 0
  let lastRebuildReason = 'initial build'
  let lastRebuildError: string | undefined
  let activeRequests = 0
  let activeConnections = 0
  let requestCounter = 0

  const requestState = {
    inFlight: false,
    pending: false,
    timer: undefined as NodeJS.Timeout | undefined,
    reason: 'initial build',
    changedPaths: new Set<string>(),
  }

  const scheduleRebuild = (reason: string, filePath?: string) => {
    requestState.reason = reason
    if (filePath) requestState.changedPaths.add(filePath)
    if (requestState.timer) clearTimeout(requestState.timer)
    requestState.timer = setTimeout(() => {
      requestState.timer = undefined
      debugLog('rebuild scheduled', {
        reason: requestState.reason,
        pending: requestState.pending,
        inFlight: requestState.inFlight,
        queuedPaths: requestState.changedPaths.size,
      })
      void requestRebuild()
    }, 120)
  }

  const requestRebuild = async () => {
    requestState.pending = true
    if (requestState.inFlight) return
    requestState.inFlight = true
    try {
      while (requestState.pending) {
        requestState.pending = false
        if (requestState.changedPaths.size > 0) {
          lastRebuildReason = 'incremental changes'
          await rebuildChanged()
        } else {
          lastRebuildReason = requestState.reason
          await rebuild(requestState.reason)
        }
      }
    } catch (error) {
      lastRebuildError =
        error instanceof Error ? error.message : String(error)
      logError(log, error, 'rebuild failed')
    } finally {
      requestState.inFlight = false
    }
  }

  const incremental = incrementalEnabled
    ? await createIncrementalBuilder(input)
    : createFullRebuildBuilder(input, config)

  const rebuild = async (reason: string) => {
    lastRebuildStartedAt = Date.now()
    lastRebuildError = undefined
    debugLog('rebuild started', { reason })
    try {
      await incremental.buildAll(reason)
      if (!initialBuildDone) {
        initialBuildDone = true
        if (startupReloadPending && clients.size > 0) {
          startupReloadPending = false
          broadcast(clients, 'reload', 'server restart')
        }
      }
      if (liveReload) broadcast(clients, 'reload', reason)
    } catch (error) {
      lastRebuildError =
        error instanceof Error ? error.message : String(error)
      logError(log, error, 'build failed')
    } finally {
      lastRebuildEndedAt = Date.now()
      debugLog('rebuild finished', {
        reason,
        durationMs: lastRebuildEndedAt - lastRebuildStartedAt,
      })
    }
  }

  const rebuildChanged = async () => {
    lastRebuildStartedAt = Date.now()
    lastRebuildError = undefined
    debugLog('incremental rebuild started', {
      changedPaths: requestState.changedPaths.size,
    })
    const paths = [...requestState.changedPaths]
    requestState.changedPaths.clear()
    if (paths.length === 0) {
      await rebuild(requestState.reason)
      return
    }
    let requiresFull = false
    let touched = false
    for (const filePath of paths) {
      let change: Awaited<ReturnType<typeof incremental.applyChange>>
      try {
        change = await incremental.applyChange(filePath)
      } catch (error) {
        logError(log, error, 'incremental apply failed')
        requiresFull = true
        break
      }
      if (change.fullRebuild) {
        requiresFull = true
        break
      }
      touched =
        touched ||
        change.changedPages > 0 ||
        change.changedAssets > 0 ||
        change.deletedPages > 0 ||
        change.deletedAssets > 0
    }
    if (requiresFull) {
      await rebuild(requestState.reason)
      return
    }
    if (touched && liveReload) {
      broadcast(clients, 'reload', requestState.reason)
    }
    lastRebuildEndedAt = Date.now()
    debugLog('incremental rebuild finished', {
      durationMs: lastRebuildEndedAt - lastRebuildStartedAt,
      touched,
      requiresFull,
    })
  }

  await rebuild('initial build')

  const server = http.createServer(async (req, res) => {
    const requestId = (requestCounter += 1)
    const requestStartedAt = Date.now()
    let requestPathname = ''
    activeRequests += 1
    res.on('finish', () => {
      activeRequests = Math.max(0, activeRequests - 1)
      const durationMs = Date.now() - requestStartedAt
      if (
        debug &&
        requestPathname !== LIVE_RELOAD_PATH &&
        durationMs >= SLOW_REQUEST_MS
      ) {
        debugLog('slow request finished', {
          id: requestId,
          method: req.method,
          url: req.url,
          durationMs,
        })
      }
    })
    res.on('close', () => {
      activeRequests = Math.max(0, activeRequests - 1)
      const durationMs = Date.now() - requestStartedAt
      if (
        debug &&
        requestPathname !== LIVE_RELOAD_PATH &&
        durationMs >= SLOW_REQUEST_MS
      ) {
        debugLog('slow request closed', {
          id: requestId,
          method: req.method,
          url: req.url,
          durationMs,
        })
      }
    })
    if (!req.url) {
      res.writeHead(400)
      res.end()
      return
    }

    const { pathname } = new URL(req.url, `http://${host}:${port}`)
    requestPathname = pathname

    if (pathname === HEALTH_PATH) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
      res.end(
        JSON.stringify(
          {
            inFlight: requestState.inFlight,
            pending: requestState.pending,
            queuedPaths: requestState.changedPaths.size,
            clients: clients.size,
            activeRequests,
            activeConnections,
            lastRebuildReason,
            lastRebuildStartedAt,
            lastRebuildEndedAt,
            lastRebuildError,
          },
          null,
          2,
        ),
      )
      return
    }

  if (liveReload && pathname === LIVE_RELOAD_PATH) {
      req.setTimeout(0)
      res.setTimeout(0)
      res.socket?.setTimeout(0)
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      })
      res.write('event: ping\ndata: ready\n\n')
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
          LIVE_RELOAD_MAX_PER_ADDRESS - 1,
        )
      }
      clients.set(res, { createdAt: Date.now(), address })
      debugLog('live reload client connected', {
        clients: clients.size,
        address,
      })
      if (startupReloadPending && initialBuildDone) {
        startupReloadPending = false
        broadcast(clients, 'reload', 'server restart')
      }
      req.on('close', () => {
        clients.delete(res)
        debugLog('live reload client closed', {
          clients: clients.size,
        })
      })
      res.on('error', () => {
        clients.delete(res)
        debugLog('live reload client error', {
          clients: clients.size,
        })
      })
      return
    }

    res.setTimeout(REQUEST_TIMEOUT_MS, () => {
      debugLog('request timeout', {
        id: requestId,
        method: req.method,
        url: req.url,
        timeoutMs: REQUEST_TIMEOUT_MS,
      })
      res.destroy()
    })

    const fileResult = await resolveStaticFile(config.outDir, pathname)
    if (!fileResult) {
      res.writeHead(404)
      res.end('Not found')
      return
    }

    const { filePath, ext } = fileResult
    try {
      if (ext === '.html') {
        const html = await fsPromises.readFile(filePath, 'utf8')
        const injected = liveReload
          ? injectLiveReload(html, LIVE_RELOAD_PATH)
          : html
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          Connection: 'close',
        })
        res.end(injected)
        return
      }

      const contentType = contentTypeForExt(ext)
      if (contentType) {
        res.writeHead(200, {
          'Content-Type': contentType,
          Connection: 'close',
        })
      } else {
        res.writeHead(200, { Connection: 'close' })
      }
      const stream = fs.createReadStream(filePath)
      let streamClosed = false
      const closeStream = () => {
        if (streamClosed) return
        streamClosed = true
        try {
          stream.destroy()
        } catch {
          // ignore stream close errors
        }
      }
      req.on('aborted', () => {
        closeStream()
      })
      res.on('close', () => {
        closeStream()
      })
      res.on('error', () => {
        closeStream()
      })
      stream.on('error', (error) => {
        logError(log, error, 'static stream failed')
        if (!res.headersSent) {
          res.writeHead(500)
        }
        res.end()
      })
      stream.pipe(res)
    } catch (error) {
      res.writeHead(500)
      res.end('Internal server error')
      logError(log, error, 'serve failed')
    }
  })
  server.on('error', (error) => {
    logError(log, error, 'dev server error')
  })
  server.on('clientError', (_error, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })
  server.on('connection', (socket) => {
    activeConnections += 1
    socket.on('close', () => {
      activeConnections = Math.max(0, activeConnections - 1)
    })
  })
  server.listen(port, host, () => {
    log.info('dev server listening', {
      url: `http://${host}:${port}/`,
      host,
      port,
      outDir: config.outDir,
      liveReload,
      watch,
      incremental: incrementalEnabled,
    })
  })

  if (watch) {
    watcher = await watchTree(config.contentDir, (filePath) => {
      scheduleRebuild(`content change: ${filePath}`, filePath)
    })
    log.info('watching content', { contentDir: config.contentDir })
  }

  if (liveReload) {
    heartbeatTimer = setInterval(() => {
      broadcast(clients, 'ping', 'heartbeat')
      debugLog('live reload heartbeat', { clients: clients.size })
    }, LIVE_RELOAD_HEARTBEAT_MS)
  }

  if (debug) {
    healthTimer = setInterval(() => {
      debugLog('dev server health', {
        inFlight: requestState.inFlight,
        pending: requestState.pending,
        queuedPaths: requestState.changedPaths.size,
        clients: clients.size,
        lastRebuildReason,
        lastRebuildStartedAt,
        lastRebuildEndedAt,
        lastRebuildError,
      })
    }, 10000)
  }

  const shutdown = async () => {
    watcher?.close()
    if (healthTimer) clearInterval(healthTimer)
    if (heartbeatTimer) clearInterval(heartbeatTimer)
    await new Promise<void>((resolve) => server.close(() => resolve()))
    await logger.close()
  }

  const handleSignal = (signal: NodeJS.Signals) => {
    log.info('dev server shutting down', { signal })
    void shutdown().finally(() => {
      process.exitCode = 0
  })
  server.keepAliveTimeout = 1000
  server.headersTimeout = 5000
}

  process.on('SIGINT', handleSignal)
  process.on('SIGTERM', handleSignal)

  return { close: shutdown }
}

function createFullRebuildBuilder(
  input: BuildInput,
  config: ReturnType<typeof resolveSiteConfig>,
) {
  return {
    buildAll: async () => buildSite({ ...input, ...config }),
    applyChange: async (filePath: string) => ({
      fullRebuild: true,
      changedPages: 0,
      changedAssets: 0,
      deletedPages: 0,
      deletedAssets: 0,
      reason: `content change: ${filePath}`,
    }),
  }
}

function broadcast(
  clients: Map<http.ServerResponse, { createdAt: number; address?: string }>,
  event: string,
  data: string,
) {
  for (const client of clients.keys()) {
    if (!isLiveReloadClientAlive(client)) {
      clients.delete(client)
      continue
    }
    try {
      const okEvent = client.write(`event: ${event}\n`)
      const okData = client.write(`data: ${data}\n\n`)
      if (!okEvent || !okData) {
        clients.delete(client)
        try {
          client.end()
        } catch {
          // ignore secondary close errors
        }
      }
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

function pruneLiveReloadClients(
  clients: Map<http.ServerResponse, { createdAt: number; address?: string }>,
) {
  for (const client of clients.keys()) {
    if (!isLiveReloadClientAlive(client)) {
      clients.delete(client)
    }
  }
}

function closeOldestLiveReloadClients(
  clients: Map<http.ServerResponse, { createdAt: number; address?: string }>,
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
  clients: Map<http.ServerResponse, { createdAt: number; address?: string }>,
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

function injectLiveReload(html: string, endpoint: string) {
  if (html.includes('data-ts-ssg-live-reload')) return html
  const snippet =
    `<script data-ts-ssg-live-reload>` +
    `(() => {` +
    `const source = new EventSource('${endpoint}');` +
    `source.addEventListener('reload', () => location.reload());` +
    `})();` +
    `</script>`

  const bodyIndex = html.lastIndexOf('</body>')
  if (bodyIndex !== -1) {
    return html.slice(0, bodyIndex) + snippet + html.slice(bodyIndex)
  }

  const headIndex = html.lastIndexOf('</head>')
  if (headIndex !== -1) {
    return html.slice(0, headIndex) + snippet + html.slice(headIndex)
  }

  return html + snippet
}

async function resolveStaticFile(outDir: string, pathname: string) {
  let safePath: string
  try {
    safePath = decodeURIComponent(pathname)
  } catch {
    return null
  }
  const normalized = path.normalize(safePath).replace(/^(\.\.[/\\])+/, '')
  const root = path.resolve(outDir)
  let candidate = path.resolve(root, `.${normalized}`)
  if (!candidate.startsWith(root)) return null

  try {
    const stats = await fsPromises.stat(candidate)
    if (stats.isDirectory()) {
      candidate = path.join(candidate, 'index.html')
    }
  } catch {
    // ignore missing; we will try index.html for extension-less routes below
  }

  if (!path.extname(candidate)) {
    candidate = path.join(candidate, 'index.html')
  }

  try {
    const finalStats = await fsPromises.stat(candidate)
    if (!finalStats.isFile()) return null
  } catch {
    return null
  }

  return { filePath: candidate, ext: path.extname(candidate).toLowerCase() }
}

function contentTypeForExt(ext: string) {
  switch (ext) {
    case '.html':
      return 'text/html; charset=utf-8'
    case '.css':
      return 'text/css; charset=utf-8'
    case '.js':
      return 'text/javascript; charset=utf-8'
    case '.json':
      return 'application/json; charset=utf-8'
    case '.svg':
      return 'image/svg+xml'
    case '.png':
      return 'image/png'
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg'
    case '.gif':
      return 'image/gif'
    case '.ico':
      return 'image/x-icon'
    case '.txt':
      return 'text/plain; charset=utf-8'
    case '.xml':
      return 'application/xml; charset=utf-8'
    case '.webp':
      return 'image/webp'
    default:
      return undefined
  }
}

async function watchTree(root: string, onChange: (filePath: string) => void) {
  const watchers: fs.FSWatcher[] = []
  const supportsRecursive =
    process.platform === 'win32' || process.platform === 'darwin'

  if (supportsRecursive) {
    const watcher = fs.watch(root, { recursive: true }, (_event, filename) => {
      const label = filename ? path.join(root, filename.toString()) : root
      onChange(label)
    })
    watchers.push(watcher)
  } else {
    const dirs = await collectDirs(root)
    for (const dir of dirs) {
      const watcher = fs.watch(dir, (_event, filename) => {
        const label = filename ? path.join(dir, filename.toString()) : dir
        onChange(label)
      })
      watchers.push(watcher)
    }
  }

  return {
    close() {
      for (const watcher of watchers) {
        watcher.close()
      }
    },
  }
}

async function collectDirs(root: string) {
  const result = [root]
  const queue = [root]
  while (queue.length > 0) {
    const current = queue.pop()
    if (!current) break
    const entries = await fsPromises.readdir(current, {
      withFileTypes: true,
    })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const next = path.join(current, entry.name)
      result.push(next)
      queue.push(next)
    }
  }
  return result
}
