import fsPromises from 'node:fs/promises'
import http from 'node:http'
import type { I18nConfig } from '@purestack/ts-common'
import { logError, stripBasePath, withBasePath } from '@purestack/ts-util'
import { getLogger, type Logger } from 'logpot'
import { resolveBuildSiteConfig } from '../build/build-config'
import {
  createIncrementalBuilder,
  type IncrementalBuilder,
} from '../build/incremental'
import type { BuildInput } from '../build/site'
import {
  broadcastJson,
  injectLiveReload,
  type LiveReloadClients,
  registerLiveReloadClient,
} from './live-reload'
import {
  buildLocalePreferenceCookie,
  type RequestLocalePreference,
  resolveRequestLocale,
} from './locale-preference'
import {
  isLikelyHtmlPath,
  resolveStaticFile,
  serveStaticStream,
  writeHtmlResponse,
} from './static-files'
import { watchTree } from './watch-tree'

export interface DevServerOptions {
  host?: string
  port?: number
  watch?: boolean
  liveReload?: boolean
}

export interface DevServerInput extends DevServerOptions {
  build?: BuildInput
}

export interface DevServerHandle {
  close: () => Promise<void>
}

const DEFAULT_HOST = '0.0.0.0'
const DEFAULT_PORT = 4173
const LIVE_RELOAD_PATH = '/__ts-ssg/events'
const REQUEST_TIMEOUT_MS = 30000
const LOOPBACK_HOST = '127.0.0.1'

type ResolvedDevServerOptions = {
  host: string
  port: number
  watch: boolean
  liveReload: boolean
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
  const logger = getLogger()
  const baseBuildInput = input.build ?? {}
  const buildInput: BuildInput = {
    ...baseBuildInput,
    options: {
      writeErrorPages: true,
      ...(baseBuildInput.options ?? {}),
    },
  }
  const config = resolveBuildSiteConfig(buildInput)
  const log = getLogger()

  const { host, port, watch, liveReload } = resolveDevServerOptions(input)

  const clients: LiveReloadClients = new Map()
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

  const displayHost = host === '0.0.0.0' ? LOOPBACK_HOST : host
  let incremental = await createIncrementalBuilder(buildInput)

  const rebuild = async (
    reason: string,
    options?: { recreateBuilder?: boolean },
  ) => {
    try {
      if (options?.recreateBuilder) {
        incremental = await createIncrementalBuilder(buildInput)
      }
      await incremental.buildAll(reason)
      if (!initialBuildDone) {
        log.info('serving at', {
          url: `http://${displayHost}:${port}${withBasePath(config.basePath, '/')}`,
        })
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
      await rebuild(requestState.reason, { recreateBuilder: true })
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
      basePath: config.basePath,
      i18n: config.i18n,
      liveReload,
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
      host,
      port,
      outDir: config.outDir,
      liveReload,
      watch,
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
  basePath: string
  i18n: I18nConfig
  liveReload: boolean
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
    basePath,
    i18n,
    liveReload,
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
    const liveReloadPath = withBasePath(basePath, LIVE_RELOAD_PATH)

    if (liveReload && pathname === liveReloadPath) {
      registerLiveReloadClient(clients, req, res, getLiveReloadVersion())
      return
    }

    if (!isRequestUnderBasePath(basePath, pathname)) {
      res.writeHead(404)
      res.end('Not found')
      return
    }

    const internalPathname = stripBasePath(basePath, pathname)
    const localePreference = resolveRequestLocale(req, i18n)
    persistQueryLocalePreference(res, i18n, localePreference)

    res.setTimeout(REQUEST_TIMEOUT_MS, () => {
      res.destroy()
    })

    const fileResult = await resolveRequestFile({
      outDir,
      pathname: internalPathname,
      locale: localePreference.locale,
      i18n,
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
      publicPathname: pathname,
      liveReloadPath,
      liveReload,
      liveReloadVersion,
      incremental,
      backgroundRenderTasks,
      notifyPageRendered,
      log,
    })
  }
}

function isRequestUnderBasePath(basePath: string, pathname: string) {
  if (!basePath) return true
  return pathname === basePath || pathname.startsWith(`${basePath}/`)
}

type ResolveRequestFileInput = {
  outDir: string
  pathname: string
  locale?: string
  i18n: I18nConfig
  incremental: IncrementalBuilder
  log: Logger
}

async function resolveRequestFile(input: ResolveRequestFileInput) {
  const { outDir, pathname, locale, i18n, incremental, log } = input
  let fileResult = await resolveStaticFile(outDir, pathname)
  if (!fileResult && i18n.enabled && i18n.urlStrategy === 'hidden' && locale) {
    fileResult = await resolveStaticFile(
      outDir,
      withHiddenLocale(locale, pathname),
    )
  }
  if (!fileResult && isLikelyHtmlPath(pathname)) {
    try {
      const rendered = await incremental.renderByUrlPath(pathname)
      if (rendered) {
        fileResult = await resolveStaticFile(outDir, pathname)
        if (
          !fileResult &&
          i18n.enabled &&
          i18n.urlStrategy === 'hidden' &&
          locale
        ) {
          fileResult = await resolveStaticFile(
            outDir,
            withHiddenLocale(locale, pathname),
          )
        }
      }
    } catch (error) {
      logError(log, error, 'lazy route render failed')
    }
  }
  return fileResult
}

function persistQueryLocalePreference(
  res: http.ServerResponse,
  i18n: I18nConfig,
  preference: RequestLocalePreference,
) {
  if (!i18n.enabled || i18n.urlStrategy !== 'hidden') return
  if (preference.source !== 'query' || !preference.locale) return
  res.setHeader(
    'Set-Cookie',
    buildLocalePreferenceCookie(i18n.cookieName, preference.locale),
  )
}

function withHiddenLocale(locale: string, pathname: string) {
  if (pathname === '/') return `/${locale}/`
  return `/${locale}${pathname}`
}

type ServeResolvedFileInput = {
  req: http.IncomingMessage
  res: http.ServerResponse
  filePath: string
  ext: string
  publicPathname: string
  liveReloadPath: string
  liveReload: boolean
  liveReloadVersion: number
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
    publicPathname,
    liveReloadPath,
    liveReload,
    liveReloadVersion,
    incremental,
    backgroundRenderTasks,
    notifyPageRendered,
    log,
  } = input
  try {
    if (ext === '.html') {
      const html = await fsPromises.readFile(filePath, 'utf8')
      const injected = liveReload
        ? injectLiveReload(html, liveReloadPath, liveReloadVersion)
        : html
      writeHtmlResponse(res, 200, injected)
      queueBackgroundRender({
        filePath,
        pathname: publicPathname,
        incremental,
        backgroundRenderTasks,
        notifyPageRendered,
        log,
      })
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
