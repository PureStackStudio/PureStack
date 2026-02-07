import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import { performance } from 'node:perf_hooks'

import { createLogger, getLogger, Logger } from 'logpot'

import {
  createIncrementalBuilder,
  type IncrementalBuilder,
} from '../build/incremental'
import { type BuildInput, type BuildResult, buildSite } from '../build/site'
import { resolveSiteConfig } from '../config/config'
import { discoverContent, discoverStaticAssets } from '../discover/content'
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

const DEFAULT_HOST = '0.0.0.0'
const DEFAULT_PORT = 4173
const LIVE_RELOAD_PATH = '/__ts-ssg/events'
const REQUEST_TIMEOUT_MS = 30000
const LIVE_RELOAD_MAX_CLIENTS = 8
const LIVE_RELOAD_MAX_PER_ADDRESS = 1

type ResolvedDevServerOptions = {
  host: string
  port: number
  watch: boolean
  liveReload: boolean
  incrementalEnabled: boolean
}

type RebuildRequestState = {
  inFlight: boolean
  pending: boolean
  timer: NodeJS.Timeout | undefined
  reason: string
  changedPaths: Set<string>
}

export async function startDevServer(
  input: DevServerInput = {},
): Promise<DevServerHandle> {
  const startupStart = performance.now()
  const config = resolveSiteConfig(input)
  const logger = await createLogger()
  const log = getLogger()

  const { host, port, watch, liveReload, incrementalEnabled } =
    resolveDevServerOptions(input)

  const clients = new Map<
    http.ServerResponse,
    { createdAt: number; address?: string }
  >()
  const backgroundRenderTasks = new Map<string, Promise<void>>()
  let liveReloadVersion = 0
  let initialBuildDone = false
  let shuttingDown = false
  let watcher: { close: () => void } | undefined
  const requestState = createRebuildRequestState()

  const emitState = (reason: string) => {
    if (!liveReload) return
    broadcastJson(clients, 'state', {
      version: liveReloadVersion,
      reason,
    })
  }

  const notifyReload = (reason: string) => {
    liveReloadVersion += 1
    if (!liveReload) return
    emitState(reason)
  }

  const notifyPageRendered = (pathname: string) => {
    if (!liveReload) return
    broadcastJson(clients, 'page-rendered', { path: pathname })
  }

  const scheduleRebuild = (reason: string, filePath?: string) => {
    if (shuttingDown) return
    requestState.reason = reason
    if (filePath) requestState.changedPaths.add(filePath)
    if (requestState.timer) clearTimeout(requestState.timer)
    requestState.timer = setTimeout(() => {
      requestState.timer = undefined
      void requestRebuild()
    }, 120)
  }

  const requestRebuild = async () => {
    if (shuttingDown) return
    requestState.pending = true
    if (requestState.inFlight) return
    requestState.inFlight = true
    try {
      while (requestState.pending) {
        requestState.pending = false
        if (requestState.changedPaths.size > 0) {
          await rebuildChanged()
        } else {
          await rebuild(requestState.reason)
        }
      }
    } catch (error) {
      logError(log, error, 'rebuild failed')
    } finally {
      requestState.inFlight = false
    }
  }

  const incremental = incrementalEnabled
    ? await createIncrementalBuilder(input)
    : createFullRebuildBuilder(input, config)

  const logInitialBuildMetrics = (result: BuildResult) => {
    const startupMs = Math.round(performance.now() - startupStart)
    const contentCounts = result.content
    const assetCounts = result.assets
    log.info('initial build completed', {
      reason: 'initial build',
      metrics: {
        startupMs,
        pages: result.pages ?? 0,
        contentTotal: contentCounts?.total ?? 0,
        contentMd: contentCounts?.byExt['.md'] ?? 0,
        contentMdx: contentCounts?.byExt['.mdx'] ?? 0,
        assetTotal: assetCounts?.total ?? 0,
        assetByExt: assetCounts?.byExt ?? {},
      },
    })
  }

  const rebuild = async (reason: string) => {
    try {
      const result = await incremental.buildAll(reason)
      if (!initialBuildDone) {
        logInitialBuildMetrics(result)
      }
      if (!initialBuildDone) {
        initialBuildDone = true
      }
      notifyReload(reason)
    } catch (error) {
      logError(log, error, 'build failed')
    } finally {
      // ensure rebuild flow completes even when build throws
    }
  }

  const rebuildChanged = async () => {
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
    if (touched) {
      notifyReload(requestState.reason)
    }
  }

  const server = http.createServer(
    createDevServerRequestHandler({
      host,
      port,
      outDir: config.outDir,
      liveReload,
      incrementalEnabled,
      incremental,
      clients,
      getLiveReloadVersion: () => liveReloadVersion,
      backgroundRenderTasks,
      notifyPageRendered,
      log,
    }),
  )
  server.on('error', (error) => {
    logError(log, error, 'dev server error')
  })
  server.on('clientError', (_error, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })
  server.keepAliveTimeout = 1000
  server.headersTimeout = 5000
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

  void requestRebuild()

  const shutdown = async () => {
    if (shuttingDown) return
    shuttingDown = true
    if (requestState.timer) {
      clearTimeout(requestState.timer)
      requestState.timer = undefined
    }
    process.off('SIGINT', handleSignal)
    process.off('SIGTERM', handleSignal)
    watcher?.close()
    await new Promise<void>((resolve) => server.close(() => resolve()))
    await logger.close()
  }

  const handleSignal = (signal: NodeJS.Signals) => {
    log.info('dev server shutting down', { signal })
    void shutdown().finally(() => {
      process.exitCode = 0
    })
  }

  process.on('SIGINT', handleSignal)
  process.on('SIGTERM', handleSignal)

  return { close: shutdown }
}

function resolveDevServerOptions(
  input: DevServerInput,
): ResolvedDevServerOptions {
  return {
    host: input.host ?? DEFAULT_HOST,
    port: input.port ?? DEFAULT_PORT,
    watch: input.watch ?? true,
    liveReload: input.liveReload ?? true,
    incrementalEnabled: input.incremental ?? true,
  }
}

function createRebuildRequestState(): RebuildRequestState {
  return {
    // Serializes queued rebuild requests to avoid overlapping incremental mutations.
    inFlight: false,
    pending: false,
    timer: undefined,
    reason: 'initial build',
    changedPaths: new Set<string>(),
  }
}

type DevServerRequestHandlerInput = {
  host: string
  port: number
  outDir: string
  liveReload: boolean
  incrementalEnabled: boolean
  incremental: IncrementalBuilder
  clients: LiveReloadClients
  getLiveReloadVersion: () => number
  backgroundRenderTasks: Map<string, Promise<void>>
  notifyPageRendered: (pathname: string) => void
  log: Logger
}

function createDevServerRequestHandler(input: DevServerRequestHandlerInput) {
  const {
    host,
    port,
    outDir,
    liveReload,
    incrementalEnabled,
    incremental,
    clients,
    getLiveReloadVersion,
    backgroundRenderTasks,
    notifyPageRendered,
    log,
  } = input

  return async (req: http.IncomingMessage, res: http.ServerResponse) => {
    if (!req.url) {
      res.writeHead(400)
      res.end()
      return
    }

    const { pathname } = new URL(req.url, `http://${host}:${port}`)

    if (liveReload && pathname === LIVE_RELOAD_PATH) {
      registerLiveReloadClient(clients, req, res, getLiveReloadVersion())
      return
    }

    res.setTimeout(REQUEST_TIMEOUT_MS, () => {
      res.destroy()
    })

    const fileResult = await resolveRequestFile({
      outDir,
      pathname,
      incrementalEnabled,
      incremental,
      log,
    })
    if (!fileResult) {
      res.writeHead(404)
      res.end('Not found')
      return
    }

    const liveReloadVersion = getLiveReloadVersion()
    await serveResolvedFile({
      req,
      res,
      filePath: fileResult.filePath,
      ext: fileResult.ext,
      pathname,
      liveReload,
      liveReloadVersion,
      incrementalEnabled,
      incremental,
      backgroundRenderTasks,
      notifyPageRendered,
      log,
    })
  }
}

type ResolveRequestFileInput = {
  outDir: string
  pathname: string
  incrementalEnabled: boolean
  incremental: IncrementalBuilder
  log: Logger
}

async function resolveRequestFile(input: ResolveRequestFileInput) {
  const { outDir, pathname, incrementalEnabled, incremental, log } = input
  let fileResult = await resolveStaticFile(outDir, pathname)
  if (!fileResult && incrementalEnabled && isLikelyHtmlPath(pathname)) {
    try {
      const rendered = await incremental.renderByUrlPath(pathname)
      if (rendered) {
        fileResult = await resolveStaticFile(outDir, pathname)
      }
    } catch (error) {
      logError(log, error, 'lazy route render failed')
    }
  }
  return fileResult
}

type ServeResolvedFileInput = {
  req: http.IncomingMessage
  res: http.ServerResponse
  filePath: string
  ext: string
  pathname: string
  liveReload: boolean
  liveReloadVersion: number
  incrementalEnabled: boolean
  incremental: IncrementalBuilder
  backgroundRenderTasks: Map<string, Promise<void>>
  notifyPageRendered: (pathname: string) => void
  log: Logger
}

async function serveResolvedFile(input: ServeResolvedFileInput): Promise<void> {
  const {
    req,
    res,
    filePath,
    ext,
    pathname,
    liveReload,
    liveReloadVersion,
    incrementalEnabled,
    incremental,
    backgroundRenderTasks,
    notifyPageRendered,
    log,
  } = input
  try {
    if (ext === '.html') {
      const html = await fsPromises.readFile(filePath, 'utf8')
      const injected = liveReload
        ? injectLiveReload(html, LIVE_RELOAD_PATH, liveReloadVersion)
        : html
      writeHtmlResponse(res, 200, injected)
      if (incrementalEnabled) {
        queueBackgroundRender({
          filePath,
          pathname,
          incremental,
          backgroundRenderTasks,
          notifyPageRendered,
          log,
        })
      }
      return
    }

    serveStaticStream(req, res, filePath, ext, log)
  } catch (error) {
    res.writeHead(500)
    res.end('Internal server error')
    logError(log, error, 'serve failed')
  }
}

type QueueBackgroundRenderInput = {
  filePath: string
  pathname: string
  incremental: IncrementalBuilder
  backgroundRenderTasks: Map<string, Promise<void>>
  notifyPageRendered: (pathname: string) => void
  log: Logger
}

function queueBackgroundRender(input: QueueBackgroundRenderInput) {
  const {
    filePath,
    pathname,
    incremental,
    backgroundRenderTasks,
    notifyPageRendered,
    log,
  } = input
  const existing = backgroundRenderTasks.get(filePath)
  if (existing) return
  // One background render notification per output file prevents fan-out storms.
  const task = incremental
    .renderIfDirtyByOutPath(filePath)
    .then((rendered) => {
      if (rendered) {
        notifyPageRendered(pathname)
      }
    })
    .catch((error) => {
      logError(log, error, 'background render failed')
    })
    .finally(() => {
      backgroundRenderTasks.delete(filePath)
    })
  backgroundRenderTasks.set(filePath, task)
  void task
}

function serveStaticStream(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  filePath: string,
  ext: string,
  log: Logger,
) {
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
}

function createFullRebuildBuilder(
  input: BuildInput,
  config: ReturnType<typeof resolveSiteConfig>,
) {
  return {
    buildAll: async () => {
      const result = await buildSite({ ...input, ...config })
      const contentFiles = await discoverContent(config.contentDir)
      const assetFiles = await discoverStaticAssets(config.contentDir)
      return {
        ...result,
        content: countByExt(contentFiles),
        assets: countByExt(assetFiles),
      }
    },
    applyChange: async (filePath: string) => ({
      fullRebuild: true,
      changedPages: 0,
      changedAssets: 0,
      deletedPages: 0,
      deletedAssets: 0,
      reason: `content change: ${filePath}`,
    }),
    renderIfDirtyByOutPath: async () => false,
    renderByUrlPath: async () => false,
  }
}

type LiveReloadClientMeta = { createdAt: number; address?: string }

type LiveReloadClients = Map<http.ServerResponse, LiveReloadClientMeta>

function registerLiveReloadClient(
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

function broadcastJson(
  clients: LiveReloadClients,
  event: string,
  payload: Record<string, unknown>,
) {
  broadcast(clients, event, JSON.stringify(payload))
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

function injectLiveReload(html: string, endpoint: string, version: number) {
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

function isLikelyHtmlPath(pathname: string) {
  return pathname.endsWith('/') || path.extname(pathname) === ''
}

function htmlNoCacheHeaders() {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    Connection: 'close',
  }
}

function writeHtmlResponse(
  res: http.ServerResponse,
  statusCode: number,
  body: string,
) {
  res.writeHead(statusCode, htmlNoCacheHeaders())
  res.end(body)
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

function countByExt(files: Array<{ ext: string }>) {
  const byExt: Record<string, number> = {}
  for (const file of files) {
    const ext = file.ext || ''
    byExt[ext] = (byExt[ext] ?? 0) + 1
  }
  return { total: files.length, byExt }
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
