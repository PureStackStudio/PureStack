import fsPromises from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'
import type { I18nConfig } from '@purestack/ts-common'
import { logError, stripBasePath, withBasePath } from '@purestack/ts-util'
import { getLogger, type Logger } from 'logpot'
import { resolveBuildSiteConfig } from '../build/build-config'
import {
  createIncrementalBuilder,
  type IncrementalBuilder,
} from '../build/incremental'
import { ensureLogger } from '../build/logger'
import type { BuildInput } from '../build/site'
import { loadProjectConfig, withProjectConfig } from '../config/project-config'
import { composeDevMiddleware } from '../plugins/plugin'
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
import { toPathKey, watchFiles, watchTree } from './watch-tree'

export interface DevServerOptions {
  host?: string
  port?: number
  watch?: boolean
  liveReload?: boolean
  /** Builds the complete site once at startup, then renders changes on request. */
  fullRender?: boolean
}

export interface DevServerInput extends DevServerOptions {
  build?: BuildInput
  /**
   * A `purestack.config.ts` whose plugins the server adds to the build. It
   * loads again when the config or a local file it imports changes.
   */
  configFile?: string
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
  fullRender: boolean
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
  await ensureLogger()
  const logger = getLogger()
  const baseBuildInput: BuildInput = {
    ...input.build,
    options: {
      writeErrorPages: true,
      ...input.build?.options,
    },
  }
  const projectConfig = trackProjectConfig(input.configFile)
  let buildInput = await projectConfig.load(baseBuildInput)
  const config = resolveBuildSiteConfig(buildInput)
  let devMiddleware = composeDevMiddleware(buildInput.options?.plugins ?? [])
  const log = getLogger()

  const { host, port, watch, liveReload, fullRender } =
    resolveDevServerOptions(input)
  let fullBuild: Promise<unknown> | undefined

  const clients: LiveReloadClients = new Map()
  let liveReloadVersion = 0
  let initialSetupDone = false
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

  // The content watcher already sees config files inside the content folder.
  let dependencyWatcher: { close: () => void } | undefined
  const watchConfigDependencies = () => {
    dependencyWatcher?.close()
    dependencyWatcher = watch
      ? watchFiles(projectConfig.outside(config.contentDir), (filePath) => {
          scheduleRebuild(`config change: ${filePath}`, filePath)
        })
      : undefined
  }

  const displayHost = host === '0.0.0.0' ? LOOPBACK_HOST : host
  let incremental = await createIncrementalBuilder(buildInput)

  const rebuild = async (
    reason: string,
    options?: { recreateBuilder?: boolean; reloadConfig?: boolean },
  ) => {
    try {
      if (options?.reloadConfig) {
        buildInput = await projectConfig.load(baseBuildInput)
        watchConfigDependencies()
      }
      if (options?.recreateBuilder || options?.reloadConfig) {
        incremental = await createIncrementalBuilder(buildInput)
      }
      if (options?.reloadConfig) {
        devMiddleware = composeDevMiddleware(buildInput.options?.plugins ?? [])
      }
      if (fullRender && !initialSetupDone) {
        fullBuild = incremental.buildAll(reason)
        await fullBuild
      }
      await incremental.prepareForRequests()
      if (!initialSetupDone) {
        log.info('serving at', {
          url: `http://${displayHost}:${port}${withBasePath(config.basePath, '/')}`,
        })
        initialSetupDone = true
      }
      notifyReload(reason)
    } catch (error) {
      logError(log, error, 'dev setup failed')
    }
  }

  const rebuildChanged = async () => {
    const paths = [...requestState.changedPaths]
    requestState.changedPaths.clear()
    if (paths.length === 0) {
      await rebuild(requestState.reason)
      return
    }
    if (paths.some((filePath) => projectConfig.isDependency(filePath))) {
      await rebuild(requestState.reason, { reloadConfig: true })
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
        change.deletedAssets > 0 ||
        change.markedPages > 0
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
      waitForFullBuild: async () => {
        if (fullRender) await fullBuild
      },
      // Config changes replace the builder, so requests ask for the current one.
      getIncremental: () => incremental,
      handlePluginRequest: (req, res) => devMiddleware(req, res),
      clients,
      getLiveReloadVersion: () => liveReloadVersion,
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
      fullRender,
    })
  })

  if (watch) {
    watcher = await watchTree(config.contentDir, (filePath) => {
      scheduleRebuild(`content change: ${filePath}`, filePath)
    })
    log.info('watching content', { contentDir: config.contentDir })
  }
  watchConfigDependencies()

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
    dependencyWatcher?.close()
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

/** Loads the project config and tells which changed files belong to it. */
function trackProjectConfig(configFile: string | undefined) {
  let dependencies: string[] = []
  let keys = new Set<string>()
  return {
    async load(input: BuildInput) {
      if (!configFile) return input
      const loaded = await loadProjectConfig(configFile)
      dependencies = loaded.dependencies
      keys = new Set(dependencies.map(toPathKey))
      return withProjectConfig(input, loaded)
    },
    isDependency(filePath: string) {
      return keys.has(toPathKey(filePath))
    },
    outside(dir: string) {
      return dependencies.filter((filePath) => !isInsideDir(dir, filePath))
    },
  }
}

function isInsideDir(dir: string, filePath: string) {
  const relative = path.relative(dir, filePath)
  return (
    relative.length > 0 &&
    !relative.startsWith('..') &&
    !path.isAbsolute(relative)
  )
}

function resolveDevServerOptions(
  input: DevServerInput,
): ResolvedDevServerOptions {
  return {
    host: input.host ?? DEFAULT_HOST,
    port: input.port ?? DEFAULT_PORT,
    watch: input.watch ?? true,
    liveReload: input.liveReload ?? true,
    fullRender: input.fullRender ?? false,
  }
}

function createRebuildRequestState(): RebuildRequestState {
  return {
    // Serializes queued rebuild requests to avoid overlapping incremental mutations.
    inFlight: false,
    pending: false,
    timer: undefined,
    reason: 'initial setup',
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
  waitForFullBuild: () => Promise<void>
  getIncremental: () => IncrementalBuilder
  /** Resolves true when a plugin's dev middleware responded. */
  handlePluginRequest: (
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ) => Promise<boolean>
  clients: LiveReloadClients
  getLiveReloadVersion: () => number
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
    waitForFullBuild,
    getIncremental,
    handlePluginRequest,
    clients,
    getLiveReloadVersion,
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

    try {
      if (await handlePluginRequest(req, res)) return
    } catch (error) {
      logError(log, error, 'dev middleware failed')
      if (!res.headersSent) res.writeHead(500)
      res.end()
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

    let fileResult: Awaited<ReturnType<typeof resolveRequestFile>>
    let incremental: IncrementalBuilder
    try {
      await waitForFullBuild()
      incremental = getIncremental()
      res.setTimeout(REQUEST_TIMEOUT_MS, () => {
        res.destroy()
      })
      fileResult = await resolveRequestFile({
        outDir,
        pathname: internalPathname,
        locale: localePreference.locale,
        i18n,
        incremental,
      })
    } catch (error) {
      logError(log, error, 'request preparation failed')
      if (!res.headersSent) res.writeHead(500)
      res.end('Internal server error')
      return
    }
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
      liveReloadPath,
      liveReload,
      liveReloadVersion,
      incremental,
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
}

async function resolveRequestFile(input: ResolveRequestFileInput) {
  const { outDir, pathname, locale, i18n, incremental } = input
  let decodedPathname: string
  try {
    decodedPathname = decodeURIComponent(pathname)
  } catch {
    return null
  }
  const asset = await incremental.prepareAssetByUrlPath(pathname)
  if (
    !asset &&
    (isLikelyHtmlPath(decodedPathname) ||
      decodedPathname.endsWith('/index.html'))
  ) {
    if (!(await incremental.renderByUrlPath(decodedPathname, locale)))
      return null
  }
  let fileResult =
    i18n.enabled && i18n.urlStrategy === 'hidden' && locale
      ? await resolveStaticFile(outDir, withHiddenLocale(locale, pathname))
      : null
  fileResult ??= await resolveStaticFile(outDir, pathname)
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
  liveReloadPath: string
  liveReload: boolean
  liveReloadVersion: number
  incremental: IncrementalBuilder
  log: Logger
}

async function serveResolvedFile(input: ServeResolvedFileInput): Promise<void> {
  const {
    req,
    res,
    filePath,
    ext,
    liveReloadPath,
    liveReload,
    liveReloadVersion,
    incremental,
    log,
  } = input
  try {
    if (ext === '.html') {
      // A page marked dirty renders before it is served, so the response
      // always reflects the latest change.
      await incremental.renderIfDirtyByOutPath(filePath)
      await incremental.preparePageAssets()
      const html = await fsPromises.readFile(filePath, 'utf8')
      const injected = liveReload
        ? injectLiveReload(html, liveReloadPath, liveReloadVersion)
        : html
      writeHtmlResponse(res, 200, injected)
      return
    }

    serveStaticStream(req, res, filePath, ext, log)
  } catch (error) {
    res.writeHead(500)
    res.end('Internal server error')
    logError(log, error, 'serve failed')
  }
}
