import fs from 'node:fs'
import fsPromises from 'node:fs/promises'
import type http from 'node:http'
import path from 'node:path'
import { logError } from '@purestack/ts-util'
import type { Logger } from 'logpot'

export function isLikelyHtmlPath(pathname: string) {
  return pathname.endsWith('/') || path.extname(pathname) === ''
}

export function writeHtmlResponse(
  res: http.ServerResponse,
  statusCode: number,
  body: string,
) {
  res.writeHead(statusCode, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    Connection: 'close',
  })
  res.end(body)
}

export async function resolveStaticFile(outDir: string, pathname: string) {
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

export function serveStaticStream(
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
