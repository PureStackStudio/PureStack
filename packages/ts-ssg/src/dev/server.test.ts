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

  it.each([true, false])(
    'does not generate sitemap or robots with fullRender %s',
    async (fullRender) => {
      root = await makeRepoTempDir('.tmp-ts-ssg-dev-sitemap-')
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(path.join(contentDir, 'index.md'), '# Home')
      await writeFile(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({
          sitemap: {
            enabled: true,
            baseUrl: 'https://example.com',
            robots: { enabled: true },
          },
        }),
      )
      const port = await findFreePort()
      server = await startDevServer({
        host: HOST,
        port,
        watch: false,
        fullRender,
        build: {
          siteConfig: {
            rootDir: root,
            contentDir,
            outDir,
            sitemap: {
              enabled: true,
              baseUrl: 'https://example.com',
              robots: { enabled: true },
            },
          },
        },
      })
      const response = await fetch(`http://${HOST}:${port}/`)
      expect(response.status).toBe(200)
      await response.text()
      await expect(
        fs.stat(path.join(outDir, 'sitemap.xml')),
      ).rejects.toMatchObject({ code: 'ENOENT' })
      await expect(
        fs.stat(path.join(outDir, 'robots.txt')),
      ).rejects.toMatchObject({ code: 'ENOENT' })
    },
  )

  it.each([true, false])(
    'renders only requested pages and copies requested assets (clean %s)',
    async (cleanOutDir) => {
      root = await makeRepoTempDir('.tmp-ts-ssg-dev-startup-')
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.mdx'),
        '# Home\n\n<RegorApp src="./home.ts" id="home-app" />',
      )
      await writeFile(path.join(contentDir, 'unused.mdx'), '# Unused page')
      await writeFile(
        path.join(contentDir, 'home.ts'),
        "console.log('home ready')",
      )
      await writeFile(
        path.join(contentDir, 'assets', 'wanted.txt'),
        'wanted asset',
      )
      await writeFile(
        path.join(contentDir, 'assets', 'unused.txt'),
        'unused asset',
      )
      await writeFile(path.join(outDir, 'index.html'), 'stale page')
      const renders: string[] = []
      const port = await findFreePort()
      server = await startDevServer({
        host: HOST,
        port,
        watch: false,
        build: {
          siteConfig: {
            rootDir: root,
            contentDir,
            outDir,
            mdx: { disableHighlighter: true },
          },
          options: {
            cleanOutDir,
            plugins: [
              definePlugin({
                name: 'render-count',
                hooks: {
                  onPageStart(_context, file) {
                    renders.push(file.relPath)
                  },
                },
              }),
            ],
          },
        },
      })
      liveReload = listenForLiveReload(port)
      await liveReload.reachVersion(1)
      expect(renders).toEqual([])
      await expect(
        fs.access(path.join(outDir, 'unused', 'index.html')),
      ).rejects.toThrow()
      await expect(
        fs.access(path.join(outDir, 'assets', 'wanted.txt')),
      ).rejects.toThrow()
      const origin = `http://${HOST}:${port}`
      const responses = await Promise.all([fetch(origin), fetch(origin)])
      for (const response of responses) {
        expect(response.status).toBe(200)
        const html = await response.text()
        expect(html).toContain('Home')
        expect(html).not.toContain('stale page')
        const script = /<script\b[^>]*\bsrc="([^"]+\.js)"/.exec(html)?.[1]
        if (!script) throw new Error('Expected the home script bundle')
        const bundle = await fetch(new URL(script, origin))
        expect(bundle.status).toBe(200)
        expect(await bundle.text()).toContain('home ready')
        const styles = [...html.matchAll(/<link\b[^>]*href="([^"]+\.css)"/g)]
        expect(styles.length).toBeGreaterThan(0)
        for (const [, href] of styles) {
          const css = await fetch(new URL(href, origin))
          expect(css.status).toBe(200)
          expect((await css.text()).length).toBeGreaterThan(0)
        }
      }
      expect(await get(port, '/')).toContain('Home')
      expect(renders).toEqual(['index.mdx'])
      expect(await get(port, '/assets/wanted.txt')).toBe('wanted asset')
      await expect(
        fs.access(path.join(outDir, 'assets', 'unused.txt')),
      ).rejects.toThrow()
      expect(await get(port, '/unused/')).toContain('Unused page')
      expect(renders).toEqual(['index.mdx', 'unused.mdx'])
    },
    20_000,
  )
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

  it('fully builds once at startup and renders watched edits on request', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-full-')
    const contentDir = path.join(root, 'content')
    const outDir = path.join(root, 'out')
    await writeFile(path.join(contentDir, 'index.mdx'), '# Home')
    await writeFile(path.join(contentDir, 'other.mdx'), '# Other')
    await writeFile(path.join(contentDir, 'asset.txt'), 'Copied asset')
    const renders: string[] = []
    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      fullRender: true,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir,
          mdx: { disableHighlighter: true },
        },
        options: {
          cleanOutDir: true,
          plugins: [
            definePlugin({
              name: 'count',
              hooks: {
                onPageStart(_context, file) {
                  renders.push(file.relPath)
                },
              },
            }),
          ],
        },
      },
    })
    liveReload = listenForLiveReload(port)
    await liveReload.reachVersion(1)
    expect(renders).toEqual(['index.mdx', 'other.mdx'])
    expect(
      await fs.readFile(path.join(outDir, 'other', 'index.html'), 'utf8'),
    ).toContain('Other')
    expect(await fs.readFile(path.join(outDir, 'asset.txt'), 'utf8')).toBe(
      'Copied asset',
    )
    await expect(
      fs.access(path.join(outDir, 'pagefind', 'pagefind.js')),
    ).resolves.toBeUndefined()
    expect(await get(port, '/')).toContain('Home')
    expect(renders).toHaveLength(2)
    await writeFile(path.join(contentDir, 'header.mdx'), '<p>New header</p>')
    await liveReload.reachVersion(2)
    expect(renders).toEqual(['index.mdx', 'other.mdx'])
    expect(
      await fs.readFile(path.join(outDir, 'other', 'index.html'), 'utf8'),
    ).not.toContain('New header')
    expect(await get(port, '/')).toContain('New header')
    expect(renders).toEqual(['index.mdx', 'other.mdx', 'index.mdx'])
    expect(await get(port, '/other/')).toContain('New header')
    expect(renders).toHaveLength(4)
    await writeFile(path.join(contentDir, 'index.mdx'), '# Updated home')
    await liveReload.reachVersion(3)
    expect(renders).toHaveLength(4)
    expect(await get(port, '/')).toContain('Updated home')
    expect(renders).toHaveLength(5)
  }, 20_000)

  it('invalidates edited pages and scripts without rendering until requested', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-edits-')
    const contentDir = path.join(root, 'content')
    const outDir = path.join(root, 'out')
    const home = path.join(contentDir, 'index.mdx')
    const unused = path.join(contentDir, 'unused.mdx')
    const dependency = path.join(contentDir, '_dependency.ts')
    const asset = path.join(contentDir, 'asset.txt')
    const app = '<RegorApp src="./home.ts" id="home-app" />'
    await writeFile(home, `# Home\n\n${app}`)
    await writeFile(unused, '# Unused')
    await writeFile(
      path.join(contentDir, 'home.ts'),
      "import { marker } from './_dependency'; console.log(marker)",
    )
    await writeFile(dependency, "export const marker = 'dependency v1'")
    await writeFile(asset, 'asset v1')
    const renders: string[] = []
    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir,
          mdx: { disableHighlighter: true },
        },
        options: {
          plugins: [
            definePlugin({
              name: 'count',
              hooks: {
                onPageStart(_context, file) {
                  renders.push(file.relPath)
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
    expect(renders).toEqual(['index.mdx'])

    await writeFile(unused, '# Unused changed')
    await liveReload.reachVersion(2)
    expect(renders).toEqual(['index.mdx'])
    await writeFile(home, `# Updated home\n\n${app}`)
    await liveReload.reachVersion(3)
    expect(renders).toEqual(['index.mdx'])
    expect(await get(port, '/')).toContain('Updated home')
    expect(renders).toEqual(['index.mdx', 'index.mdx'])

    await writeFile(dependency, "export const marker = 'dependency v2'")
    await liveReload.reachVersion(4)
    expect(renders).toHaveLength(2)
    await writeFile(dependency, "export const marker = 'dependency v3'")
    await liveReload.reachVersion(5)
    expect(renders).toHaveLength(2)
    const html = await get(port, '/')
    const script = /<script\b[^>]*\bsrc="([^"]+\.js)"/.exec(html)?.[1]
    if (!script) throw new Error('Expected a script bundle')
    expect(await get(port, script)).toContain('dependency v3')
    expect(renders).toEqual(['index.mdx', 'index.mdx', 'index.mdx'])

    expect(await get(port, '/asset.txt')).toBe('asset v1')
    await writeFile(asset, 'asset v2')
    await liveReload.reachVersion(6)
    await expect(fs.access(path.join(outDir, 'asset.txt'))).rejects.toThrow()
    expect(await get(port, '/asset.txt')).toBe('asset v2')
    await fs.rm(unused)
    await liveReload.reachVersion(7)
    expect((await fetch(`http://${HOST}:${port}/unused/`)).status).toBe(404)
    expect(renders).toHaveLength(3)
  }, 20_000)

  it('invalidates an edit made after a page renders during the full startup build', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-startup-edit-')
    const contentDir = path.join(root, 'content')
    const home = path.join(contentDir, 'index.mdx')
    await writeFile(home, '# Original home')
    await writeFile(path.join(contentDir, 'other.mdx'), '# Other')
    const renders: string[] = []
    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      fullRender: true,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir: path.join(root, 'out'),
        },
        options: {
          plugins: [
            definePlugin({
              name: 'startup-edit',
              hooks: {
                async onPageStart(_context, file) {
                  renders.push(file.relPath)
                  if (file.relPath === 'other.mdx')
                    await writeFile(home, '# Changed during startup')
                },
              },
            }),
          ],
        },
      },
    })
    liveReload = listenForLiveReload(port)
    await liveReload.reachVersion(2)
    expect(renders).toEqual(['index.mdx', 'other.mdx'])
    expect(await get(port, '/')).toContain('Changed during startup')
    expect(renders).toEqual(['index.mdx', 'other.mdx', 'index.mdx'])
  }, 20_000)

  it('serves extensionless assets, static directories, encoded routes, and direct page outputs', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-paths-')
    const contentDir = path.join(root, 'content')
    const outDir = path.join(root, 'out')
    await writeFile(path.join(contentDir, 'download'), 'extensionless asset')
    await writeFile(
      path.join(contentDir, 'static', 'index.html'),
      '<html><body>Static directory</body></html>',
    )
    await writeFile(path.join(contentDir, 'café.mdx'), '# Encoded page')
    await writeFile(path.join(contentDir, 'guide.mdx'), '# Guide')
    await writeFile(
      path.join(outDir, 'removed', 'index.html'),
      'stale deleted page',
    )
    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      watch: false,
      build: {
        siteConfig: { rootDir: root, contentDir, outDir },
      },
    })
    expect(await get(port, '/download')).toBe('extensionless asset')
    expect(await get(port, '/static/')).toContain('Static directory')
    expect(await get(port, '/caf%C3%A9/')).toContain('Encoded page')
    expect(await get(port, '/guide/index.html')).toContain('Guide')
    expect(
      (await fetch(`http://${HOST}:${port}/removed/index.html`)).status,
    ).toBe(404)
  }, 20_000)

  it('builds dev search from opened pages without rendering unopened pages', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-search-')
    const contentDir = path.join(root, 'content')
    const outDir = path.join(root, 'out')
    await writeFile(path.join(contentDir, 'index.mdx'), '# Home')
    await writeFile(path.join(contentDir, 'unused.mdx'), '# Unused')
    const renders: string[] = []
    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      watch: false,
      build: {
        siteConfig: { rootDir: root, contentDir, outDir },
        options: {
          plugins: [
            definePlugin({
              name: 'count',
              hooks: {
                onPageStart(_context, file) {
                  renders.push(file.relPath)
                },
              },
            }),
          ],
        },
      },
    })
    liveReload = listenForLiveReload(port)
    await liveReload.reachVersion(1)
    await expect(fs.access(path.join(outDir, 'pagefind'))).rejects.toThrow()
    expect(await get(port, '/')).toContain('Home')
    expect(
      (await fetch(`http://${HOST}:${port}/pagefind/pagefind.js`)).status,
    ).toBe(200)
    expect(renders).toEqual(['index.mdx'])
    await expect(
      fs.access(path.join(outDir, 'unused', 'index.html')),
    ).rejects.toThrow()
  }, 20_000)

  it('renders the requested hidden locale under a base path', async () => {
    root = await makeRepoTempDir('.tmp-ts-ssg-dev-locale-')
    const contentDir = path.join(root, 'content')
    await writeFile(path.join(contentDir, 'en', 'index.mdx'), '# English home')
    await writeFile(path.join(contentDir, 'de', 'index.mdx'), '# German home')
    const renders: string[] = []
    const port = await findFreePort()
    server = await startDevServer({
      host: HOST,
      port,
      watch: false,
      build: {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir: path.join(root, 'out'),
          basePath: '/docs',
          i18n: {
            enabled: true,
            locales: ['en', 'de'],
            defaultLocale: 'en',
            urlStrategy: 'hidden',
            queryParam: 'lang',
          },
        },
        options: {
          plugins: [
            definePlugin({
              name: 'count',
              hooks: {
                onPageStart(_context, file) {
                  renders.push(file.relPath.replaceAll('\\', '/'))
                },
              },
            }),
          ],
        },
      },
    })
    expect(await get(port, '/docs/?lang=de')).toContain('German home')
    expect(renders).toEqual(['de/index.mdx'])
    expect(await get(port, '/docs/?lang=en')).toContain('English home')
    expect(renders).toEqual(['de/index.mdx', 'en/index.mdx'])
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
    // The first signal announces that shared request state is ready.
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
