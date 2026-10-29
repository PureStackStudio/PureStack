import fs from 'node:fs/promises'
import path from 'node:path'
import { disableLogger } from 'logpot'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { definePlugin } from '../plugins/plugin'
import { makeRepoTempDir } from '../test/repoTempDir'
import { type DevServerHandle, startDevServer } from './server'

describe('dev server error responses', () => {
  let root: string
  let contentDir: string
  let outDir: string
  let server: DevServerHandle | undefined

  beforeAll(() => disableLogger())
  beforeEach(async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-errors-')
    contentDir = path.join(root, 'content')
    outDir = path.join(root, 'out')
    await writeFile(path.join(contentDir, 'index.md'), '# Home')
  })
  afterEach(async () => {
    await server?.close()
    await fs.rm(root, { recursive: true, force: true })
    server = undefined
  })

  it.each(['mdx', 'html'])(
    'serves the exact 404 output on demand from %s under a base path',
    async (format) => {
      await writeFile(
        path.join(
          contentDir,
          format === 'mdx' ? 'error/404.mdx' : 'error/404/index.html',
        ),
        format === 'mdx'
          ? '---\nindex: false\n---\n# Lost café\n\n<PageScript src="/retry.ts"/> '
          : '<html><body>Lost café</body></html>',
      )
      await writeFile(
        path.join(contentDir, 'error/error.mdx'),
        '---\nindex: false\n---\n# Generic recovery',
      )
      await writeFile(
        path.join(contentDir, 'retry.ts'),
        "console.log('retry ready')",
      )
      server = await startDevServer({
        host: '127.0.0.1',
        port: 0,
        watch: false,
        build: {
          siteConfig: {
            rootDir: root,
            contentDir,
            outDir,
            basePath: '/docs',
            mdx: { disableHighlighter: true },
          },
        },
      })
      await expect(
        fs.access(path.join(outDir, 'error/404/index.html')),
      ).rejects.toThrow()

      const requestedUrl = new URL(
        'missing/deep-page/?from=old-link',
        server.url,
      )
      const response = await fetch(requestedUrl)
      const body = await response.text()
      expect(response.status).toBe(404)
      expect(response.url).toBe(requestedUrl.href)
      expect(response.headers.get('cache-control')).toBe('no-store')
      expect(response.headers.get('content-type')).toBe(
        'text/html; charset=utf-8',
      )
      expect(Number(response.headers.get('content-length'))).toBe(
        Buffer.byteLength(body),
      )
      expect(body).toContain('Lost café')
      expect(body).not.toContain('Generic recovery')
      expect(body).toContain('/docs/__ts-ssg/events')
      if (format === 'mdx') {
        const script = /<script\b[^>]*\bsrc="([^"]+\.js)"/.exec(body)?.[1]
        expect(script).toBeTruthy()
        const asset = await fetch(new URL(script ?? '', server.url))
        expect(asset.status).toBe(200)
        expect(await asset.text()).toContain('retry ready')
      }

      const head = await fetch(requestedUrl, { method: 'HEAD' })
      expect(head.status).toBe(404)
      expect(head.headers.get('content-length')).toBe(
        response.headers.get('content-length'),
      )
      expect(head.headers.get('cache-control')).toBe('no-store')
      expect(await head.text()).toBe('')
      const missingAsset = await fetch(new URL('missing.png', server.url))
      expect(missingAsset.status).toBe(404)
      expect(await missingAsset.text()).toContain('Lost café')
      const outsideBase = await fetch(new URL('/outside/', server.url))
      expect(outsideBase.status).toBe(404)
      expect(await outsideBase.text()).toContain('Lost café')
      const preview = await fetch(new URL('error/404/', server.url))
      expect(preview.status).toBe(200)
      expect(await preview.text()).toContain('Lost café')
    },
    20_000,
  )

  it.each([true, false])(
    'preserves 500 and HEAD semantics with a specific page present: %s',
    async (specific) => {
      await writeFile(
        path.join(contentDir, 'error/error.mdx'),
        '# General issue — try again',
      )
      if (specific)
        await writeFile(
          path.join(contentDir, 'error/500.mdx'),
          '# Server recovery',
        )
      server = await startDevServer({
        host: '127.0.0.1',
        port: 0,
        watch: false,
        liveReload: false,
        build: {
          siteConfig: { rootDir: root, contentDir, outDir },
          options: {
            plugins: [
              definePlugin({
                name: 'failing-middleware',
                devMiddleware(request, response) {
                  if (request.url !== '/broken') return
                  response.setHeader('Content-Type', 'application/json')
                  response.setHeader('Content-Length', '9999')
                  response.setHeader('Content-Encoding', 'gzip')
                  response.setHeader('Transfer-Encoding', 'chunked')
                  response.setHeader('Cache-Control', 'public, max-age=9999')
                  throw new Error('middleware failed')
                },
              }),
            ],
          },
        },
      })
      const response = await fetch(new URL('/broken', server.url))
      const body = await response.text()
      expect(response.status).toBe(500)
      expect(response.headers.get('cache-control')).toBe('no-store')
      expect(response.headers.get('content-type')).toBe(
        'text/html; charset=utf-8',
      )
      expect(response.headers.get('content-encoding')).toBeNull()
      expect(response.headers.get('transfer-encoding')).toBeNull()
      expect(Number(response.headers.get('content-length'))).toBe(
        Buffer.byteLength(body),
      )
      expect(body).toContain(
        specific ? 'Server recovery' : 'General issue — try again',
      )
      expect(body).not.toContain('__ts-ssg/events')
      if (specific) expect(body).not.toContain('General issue — try again')
      const head = await fetch(new URL('/broken', server.url), {
        method: 'HEAD',
      })
      expect(head.status).toBe(500)
      expect(head.headers.get('content-length')).toBe(
        response.headers.get('content-length'),
      )
      expect(await head.text()).toBe('')
      const missing = await fetch(new URL('/missing/', server.url))
      expect(missing.status).toBe(404)
      expect(await missing.text()).toContain('General issue — try again')
    },
    20_000,
  )

  it('uses plain text when exact outputs are absent and leaves started responses alone', async () => {
    await writeFile(path.join(contentDir, '404.html'), '<p>Wrong location</p>')
    await writeFile(
      path.join(contentDir, 'error/404.index.html'),
      '<p>Wrong filename</p>',
    )
    server = await startDevServer({
      host: '127.0.0.1',
      port: 0,
      watch: false,
      build: {
        siteConfig: { rootDir: root, contentDir, outDir },
        options: {
          plugins: [
            definePlugin({
              name: 'failing-middleware',
              devMiddleware(request, response) {
                if (request.url === '/partial') {
                  response.writeHead(202, { 'Content-Type': 'text/plain' })
                  response.write('Already started')
                  throw new Error('too late to replace the response')
                }
                if (request.url === '/broken')
                  throw new Error('middleware failed')
              },
            }),
          ],
        },
      },
    })
    for (const [pathname, status, text] of [
      ['/missing/', 404, 'Not found'],
      ['/broken', 500, 'Internal server error'],
    ] as const) {
      const response = await fetch(new URL(pathname, server.url))
      expect(response.status).toBe(status)
      expect(response.headers.get('cache-control')).toBe('no-store')
      expect(response.headers.get('content-type')).toBe(
        'text/plain; charset=utf-8',
      )
      expect(await response.text()).toBe(text)
      const head = await fetch(new URL(pathname, server.url), {
        method: 'HEAD',
      })
      expect(head.status).toBe(status)
      expect(Number(head.headers.get('content-length'))).toBe(
        Buffer.byteLength(text),
      )
      expect(await head.text()).toBe('')
    }
    const partial = await fetch(new URL('/partial', server.url))
    expect(partial.status).toBe(202)
    expect(await partial.text()).toBe('Already started')
    const home = await fetch(server.url)
    expect(home.status).toBe(200)
    expect(await home.text()).toContain('Home')
  }, 20_000)

  it('falls back to the general page when the specific output cannot be read', async () => {
    await writeFile(path.join(contentDir, 'error/404.mdx'), '# Missing output')
    await writeFile(
      path.join(contentDir, 'error/error.mdx'),
      '# General recovery',
    )
    server = await startDevServer({
      host: '127.0.0.1',
      port: 0,
      watch: false,
      build: {
        siteConfig: { rootDir: root, contentDir, outDir },
        options: {
          plugins: [
            definePlugin({
              name: 'remove-specific-output',
              hooks: {
                async onPageWritten(_context, page) {
                  if (
                    page.file.relPath.replaceAll('\\', '/') === 'error/404.mdx'
                  )
                    await fs.rm(page.outPath)
                },
              },
            }),
          ],
        },
      },
    })
    const response = await fetch(new URL('/missing/', server.url))
    expect(response.status).toBe(404)
    expect(response.headers.get('cache-control')).toBe('no-store')
    expect(await response.text()).toContain('General recovery')
  }, 20_000)
})

async function writeFile(filePath: string, content: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf8')
}
