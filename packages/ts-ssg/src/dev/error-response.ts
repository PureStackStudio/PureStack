import fs from 'node:fs/promises'
import type http from 'node:http'
import path from 'node:path'
import { logError } from '@purestack/ts-util'
import type { Logger } from 'logpot'
import type { IncrementalBuilder } from '../build/incremental'
import { injectLiveReload } from './live-reload'

interface ErrorResponseInput {
  req: http.IncomingMessage
  res: http.ServerResponse
  statusCode: number
  fallbackText: string
  outDir: string
  incremental?: IncrementalBuilder
  liveReload: boolean
  liveReloadPath: string
  liveReloadVersion: number
  log: Logger
}

/** Serves only the conventional error outputs, without redirecting the request. */
export async function writeErrorResponse(input: ErrorResponseInput) {
  const { req, res, statusCode, fallbackText, outDir, incremental, log } = input
  if (res.destroyed || res.writableEnded) return
  if (res.headersSent) {
    res.end()
    return
  }

  let body = fallbackText
  let contentType = 'text/plain; charset=utf-8'
  for (const relativePath of [
    `error/${statusCode}/index.html`,
    'error/index.html',
  ]) {
    try {
      if (incremental) {
        const urlPath = `/${relativePath}`
        if (!(await incremental.prepareAssetByUrlPath(urlPath)))
          await incremental.renderByUrlPath(urlPath)
      }
      const html = await fs.readFile(path.join(outDir, relativePath), 'utf8')
      await incremental?.preparePageAssets()
      body = input.liveReload
        ? injectLiveReload(html, input.liveReloadPath, input.liveReloadVersion)
        : html
      contentType = 'text/html; charset=utf-8'
      break
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        (error.code === 'ENOENT' || error.code === 'ENOTDIR')
      )
        continue
      logError(log, error, `error page unavailable: ${relativePath}`)
    }
  }

  if (res.destroyed || res.writableEnded) return
  res.removeHeader('Content-Encoding')
  res.removeHeader('Transfer-Encoding')
  res.writeHead(statusCode, {
    'Content-Type': contentType,
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    Connection: 'close',
  })
  res.end(req.method === 'HEAD' ? undefined : body)
}
