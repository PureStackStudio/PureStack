import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import http from 'node:http'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createLogger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import {
  type DevServerHandle,
  type DevServerInput,
  startDevServer,
} from './server'

let logger: Awaited<ReturnType<typeof createLogger>>
beforeAll(async () => {
  logger = await createLogger({ filter: () => false })
})
afterAll(async () => {
  await logger.close()
})

describe('embedded dev server', () => {
  it.each([
    ['0.0.0.0', '127.0.0.1'],
    ['::', '[::1]'],
    ['::1', '[::1]'],
  ])('logs and serves a browsable URL for host %s', async (host, urlHost) => {
    const root = await mkdtemp(path.join(tmpdir(), 'purestack-server-url-'))
    const info = vi.spyOn(logger, 'info')
    let server: DevServerHandle | undefined
    try {
      await writeFile(path.join(root, 'index.mdx'), '# Browsable site')
      server = await startDevServer({
        host,
        port: 0,
        handleSignals: false,
        watch: false,
        liveReload: false,
        build: {
          siteConfig: {
            rootDir: root,
            contentDir: root,
            outDir: path.join(root, 'out'),
            basePath: '/docs',
          },
          options: { cache: false },
        },
      })
      const url = server.url
      expect(new URL(url)).toMatchObject({
        protocol: 'http:',
        hostname: urlHost,
        pathname: '/docs/',
      })
      expect(info).toHaveBeenCalledWith('serving at', { url })
      const html = await new Promise<string>((resolve, reject) => {
        http
          .get(url, (response) => {
            let body = ''
            response.setEncoding('utf8')
            response.on('data', (chunk: string) => {
              body += chunk
            })
            response.on('end', () => resolve(body))
            response.on('error', reject)
          })
          .on('error', reject)
      })
      expect(html).toContain('Browsable site')
    } finally {
      info.mockRestore()
      await server?.close()
      await rm(root, { recursive: true, force: true })
    }
  })

  it('returns a ready ephemeral URL, rejects a busy port and closes idempotently', async () => {
    const closeLogger = vi.spyOn(logger, 'close')
    const root = await mkdtemp(path.join(tmpdir(), 'purestack-server-'))
    await writeFile(path.join(root, 'index.md'), '# Embedded site')
    const input = {
      host: '127.0.0.1',
      port: 0,
      handleSignals: false,
      watch: false,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir: root,
          outDir: path.join(root, 'out'),
        },
        options: { cache: false },
      },
    }
    const listeners = process.listenerCount('SIGINT')
    const server = await startDevServer(input)
    try {
      expect(new URL(server.url).port).not.toBe('0')
      expect(
        await fetch(server.url).then((response) => response.text()),
      ).toContain('Embedded site')
      await expect(
        startDevServer({
          ...input,
          port: Number(new URL(server.url).port),
          build: {
            ...input.build,
            siteConfig: {
              ...input.build.siteConfig,
              outDir: path.join(root, 'other-out'),
            },
          },
        }),
      ).rejects.toMatchObject({ code: 'EADDRINUSE' })
      expect(closeLogger).not.toHaveBeenCalled()
      expect(process.listenerCount('SIGINT')).toBe(listeners)
      await Promise.all([server.close(), server.close()])
      expect(closeLogger).not.toHaveBeenCalled()
    } finally {
      await server.close()
      closeLogger.mockRestore()
      await rm(root, { recursive: true, force: true })
    }
  })
})

describe('initial dev build failures', () => {
  async function brokenSite(fullRender: boolean) {
    const root = await mkdtemp(path.join(tmpdir(), 'purestack-broken-server-'))
    const dataFile = path.join(root, 'pages.json')
    await writeFile(path.join(root, 'index.mdx'), '# Recovered site')
    await writeFile(dataFile, '{')
    const prepared = vi.fn()
    const input: DevServerInput = {
      host: '127.0.0.1',
      port: 0,
      handleSignals: false,
      liveReload: false,
      fullRender,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir: root,
          outDir: path.join(root, 'out'),
        },
        options: {
          cache: false,
          plugins: [
            {
              name: 'fixture-data',
              pages: async () => {
                JSON.parse(await readFile(dataFile, 'utf8'))
                prepared()
                return []
              },
            },
          ],
        },
      },
    }
    return { root, dataFile, input, prepared }
  }

  it.each([false, true])(
    'keeps watching and recovers after fixing plugin data (fullRender %s)',
    async (fullRender) => {
      const { root, dataFile, input, prepared } = await brokenSite(fullRender)
      let server: DevServerHandle | undefined
      try {
        server = await startDevServer(input)
        const url = server.url
        const broken = await fetch(url)
        await broken.text()
        expect(broken.status).toBe(500)
        expect(prepared).not.toHaveBeenCalled()
        await writeFile(dataFile, '{}')
        await expect
          .poll(() => prepared.mock.calls.length, { timeout: 5000 })
          .toBeGreaterThan(0)
        const response = await fetch(url)
        expect(response.ok).toBe(true)
        expect(await response.text()).toContain('Recovered site')
      } finally {
        await server?.close()
        await rm(root, { recursive: true, force: true })
      }
    },
  )

  it.each([false, true])(
    'rejects initial build failures when explicitly requested (fullRender %s)',
    async (fullRender) => {
      const { root, input } = await brokenSite(fullRender)
      let server: DevServerHandle | undefined
      try {
        await expect(
          startDevServer({ ...input, failOnInitialBuildError: true }).then(
            (handle) => {
              server = handle
              return handle
            },
          ),
        ).rejects.toThrow(/Plugin "fixture-data" failed in pages/)
      } finally {
        await server?.close()
        await rm(root, { recursive: true, force: true })
      }
    },
  )
})
