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

export async function startDevServer(
  input: DevServerInput = {},
): Promise<DevServerHandle> {
  const config = resolveSiteConfig(input)
  const logger = await createLogger()
  const log = getLogger()

  const host = input.host ?? DEFAULT_HOST
  const port = input.port ?? DEFAULT_PORT
  const watch = input.watch ?? true
  const liveReload = input.liveReload ?? true
  const incrementalEnabled = input.incremental ?? true

  const clients = new Set<http.ServerResponse>()
  let startupReloadPending = true
  let initialBuildDone = false
  let watcher: { close: () => void } | undefined

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
      void requestRebuild()
    }, 120)
  }

  const requestRebuild = async () => {
    requestState.pending = true
    if (requestState.inFlight) return
    requestState.inFlight = true
    while (requestState.pending) {
      requestState.pending = false
      if (requestState.changedPaths.size > 0) {
        await rebuildChanged()
      } else {
        await rebuild(requestState.reason)
      }
    }
    requestState.inFlight = false
  }

  const incremental = incrementalEnabled
    ? await createIncrementalBuilder(input)
    : createFullRebuildBuilder(input, config)

  const rebuild = async (reason: string) => {
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
      logError(log, error, 'build failed')
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
      const change = await incremental.applyChange(filePath)
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
  }

  await rebuild('initial build')

  const server = http.createServer(async (req, res) => {
    if (!req.url) {
      res.writeHead(400)
      res.end()
      return
    }

    const { pathname } = new URL(req.url, `http://${host}:${port}`)

    if (liveReload && pathname === LIVE_RELOAD_PATH) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      })
      res.write('event: ping\ndata: ready\n\n')
      clients.add(res)
      if (startupReloadPending && initialBuildDone) {
        startupReloadPending = false
        broadcast(clients, 'reload', 'server restart')
      }
      req.on('close', () => {
        clients.delete(res)
      })
      return
    }

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
        })
        res.end(injected)
        return
      }

      const contentType = contentTypeForExt(ext)
      if (contentType) {
        res.writeHead(200, { 'Content-Type': contentType })
      } else {
        res.writeHead(200)
      }
      fs.createReadStream(filePath).pipe(res)
    } catch (error) {
      res.writeHead(500)
      res.end('Internal server error')
      logError(log, error, 'serve failed')
    }
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

  const shutdown = async () => {
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
  clients: Set<http.ServerResponse>,
  event: string,
  data: string,
) {
  for (const client of clients) {
    client.write(`event: ${event}\n`)
    client.write(`data: ${data}\n\n`)
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
