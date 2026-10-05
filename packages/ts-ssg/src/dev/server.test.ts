import fs from 'node:fs/promises'
import http from 'node:http'
import net from 'node:net'
import path from 'node:path'
import { themeSkins } from '@purestack/ts-style'
import { disableLogger } from 'logpot'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { definePlugin } from '../plugins/plugin'
import { makeRepoTempDir } from '../test/repoTempDir'
import { type DevServerHandle, startDevServer } from './server'

const HOST = '127.0.0.1'
const LIVE_RELOAD_PATH = '/__ts-ssg/events'

describe('dev server', () => {
  let root: string | undefined
  let server: DevServerHandle | undefined
  let liveReload: LiveReloadListener | undefined

  beforeAll(() => {
    disableLogger()
  })

  afterEach(async () => {
    liveReload?.close()
    await server?.close()
    if (root) await fs.rm(root, { recursive: true, force: true })
    liveReload = undefined
    server = undefined
    root = undefined
  })

  it('reloads purestack.config.ts when a file it imports changes', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-config-')
    const contentDir = path.join(root, 'content')
    const markerPath = path.join(root, 'plugins', 'marker.ts')
    const configFile = path.join(contentDir, 'purestack.config.ts')
    await writeFile(path.join(contentDir, 'index.mdx'), '# Home')
    await writeFile(markerPath, "export const marker = 'marker v1'")
    await writeFile(
      configFile,
      [
        "import { marker } from '../plugins/marker'",
        'export default {',
        '  plugins: [{',
        "    name: 'marker',",
        '    hooks: {',
        '      onPageRendered(_context: unknown, page: { html: string }) {',
        // biome-ignore lint/suspicious/noTemplateCurlyInString: Literal TypeScript source for the config file.
        "        page.html = page.html.replace('</body>', `<!-- ${marker} --></body>`)",
        '      },',
        '    },',
        '  }],',
        '}',
      ].join('\n'),
    )

    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      configFile,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir: path.join(root, 'out'),
        },
      },
    })
    liveReload = listenForLiveReload(port)
    await liveReload.reachVersion(1)
    expect(await get(port, '/')).toContain('<!-- marker v1 -->')

    // The plugin file sits outside the content folder.
    await writeFile(markerPath, "export const marker = 'marker v2'")
    await liveReload.reachVersion(2)

    expect(await get(port, '/')).toContain('<!-- marker v2 -->')
  }, 20_000)

  it('starts with a plugin skin selected in the site config', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-')
    const contentDir = path.join(root, 'content')
    await writeFile(path.join(contentDir, 'index.mdx'), '# Home')

    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir: path.join(root, 'out'),
          style: { theme: { skin: 'dev-plugin-skin' } },
        },
        options: {
          plugins: [
            definePlugin({
              name: 'skin',
              skins: {
                'dev-plugin-skin': {
                  create: () => themeSkins.standard.create(),
                },
              },
            }),
          ],
        },
      },
    })
    liveReload = listenForLiveReload(port)
    await liveReload.reachVersion(1)

    expect(await get(port, '/')).toContain('Home')
  }, 20_000)

  it('lets plugin dev middleware answer requests before the site', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-middleware-')
    const contentDir = path.join(root, 'content')
    await writeFile(path.join(contentDir, 'index.mdx'), '# Home')

    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir: path.join(root, 'out'),
        },
        options: {
          plugins: [
            definePlugin({
              name: 'headers',
              devMiddleware: (_request, response) => {
                response.setHeader('x-dev', 'on')
              },
            }),
            definePlugin({
              name: 'api',
              devMiddleware: async (request, response) => {
                if (request.url === '/api/broken') throw new Error('No time.')
                if (request.url !== '/api/time') return
                await new Promise((resolve) => setTimeout(resolve, 10))
                response.writeHead(200, { 'content-type': 'application/json' })
                response.end('{"time":1}')
              },
            }),
            definePlugin({
              name: 'late',
              devMiddleware: (_request, response) => {
                response.end('late')
              },
            }),
          ],
        },
      },
    })
    liveReload = listenForLiveReload(port)
    await liveReload.reachVersion(1)
    const origin = `http://${HOST}:${port}`

    const api = await fetch(`${origin}/api/time`)
    expect(await api.json()).toEqual({ time: 1 })
    expect(api.headers.get('x-dev')).toBe('on')
    // The first plugin to respond ends the chain, so "late" answers the rest.
    expect(await (await fetch(`${origin}/`)).text()).toBe('late')
    const broken = await fetch(`${origin}/api/broken`)
    expect(broken.status).toBe(500)
  }, 20_000)

  it('serves the site when no dev middleware responds', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-middleware-')
    const contentDir = path.join(root, 'content')
    await writeFile(path.join(contentDir, 'index.mdx'), '# Home')

    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir: path.join(root, 'out'),
        },
        options: {
          plugins: [
            definePlugin({
              name: 'headers',
              devMiddleware: (_request, response) => {
                response.setHeader('x-dev', 'on')
              },
            }),
          ],
        },
      },
    })
    liveReload = listenForLiveReload(port)
    await liveReload.reachVersion(1)

    const page = await fetch(`http://${HOST}:${port}/`)
    expect(await page.text()).toContain('Home')
    expect(page.headers.get('x-dev')).toBe('on')
  }, 20_000)

  it('serves the new header on the reload a header edit triggers', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-')
    const contentDir = path.join(root, 'content')
    const headerPath = path.join(contentDir, 'guides', 'header.mdx')
    await writeFile(headerPath, '<p>Header v1</p>')
    await writeFile(path.join(contentDir, 'guides', 'index.mdx'), '# Guides')
    await writeFile(path.join(contentDir, 'index.mdx'), '# Home')

    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir: path.join(root, 'out'),
        },
      },
    })
    liveReload = listenForLiveReload(port)
    // The initial build ends with the first reload signal.
    await liveReload.reachVersion(1)
    expect(await get(port, '/guides/')).toContain('Header v1')

    await writeFile(headerPath, '<p>Header v2</p>')
    await liveReload.reachVersion(2)

    // The one request a browser makes after the reload signal must already
    // show the change; no later signal announces a background render.
    expect(await get(port, '/guides/')).toContain('Header v2')
  }, 20_000)
})

type LiveReloadListener = ReturnType<typeof listenForLiveReload>

/** Follows the dev server's live reload version, like the browser script. */
function listenForLiveReload(port: number) {
  let version = -1
  const waiters: Array<{ target: number; resolve: () => void }> = []
  const request = http.get(
    { host: HOST, port, path: LIVE_RELOAD_PATH },
    (res) => {
      let buffer = ''
      res.setEncoding('utf8')
      res.on('data', (chunk: string) => {
        buffer += chunk
        const messages = buffer.split('\n\n')
        buffer = messages.pop() ?? ''
        for (const message of messages) {
          if (!message.startsWith('event: state')) continue
          const data = message
            .split('\n')
            .find((line) => line.startsWith('data: '))
          version = Number(JSON.parse(data?.slice(6) ?? '{}').version)
          for (const waiter of waiters.filter(
            (entry) => version >= entry.target,
          )) {
            waiters.splice(waiters.indexOf(waiter), 1)
            waiter.resolve()
          }
        }
      })
    },
  )
  request.on('error', () => {})
  return {
    reachVersion(target: number) {
      if (version >= target) return Promise.resolve()
      return new Promise<void>((resolve) => waiters.push({ target, resolve }))
    },
    close() {
      request.destroy()
    },
  }
}

async function writeFile(filePath: string, contents: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents, 'utf8')
}

function findFreePort() {
  return new Promise<number>((resolve, reject) => {
    const probe = net.createServer()
    probe.once('error', reject)
    probe.listen(0, HOST, () => {
      const address = probe.address()
      probe.close(() =>
        typeof address === 'object' && address
          ? resolve(address.port)
          : reject(new Error('No port assigned.')),
      )
    })
  })
}

function get(port: number, pathname: string) {
  return new Promise<string>((resolve, reject) => {
    http
      .get({ host: HOST, port, path: pathname }, (res) => {
        let body = ''
        res.setEncoding('utf8')
        res.on('data', (chunk: string) => {
          body += chunk
        })
        res.on('end', () => resolve(body))
      })
      .on('error', reject)
  })
}
