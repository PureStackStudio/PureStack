import fs from 'node:fs/promises'
import net from 'node:net'
import path from 'node:path'
import { runInDom } from '@purestack/ts-minidom'
import { disableLogger, getLogger } from 'logpot'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { buildSite } from '../build/site'
import { runCli } from '../cli-runner'
import { type DevServerHandle, startDevServer } from '../dev/server'
import { makeRepoTempDir } from '../test/repoTempDir'
import { resolveConfiguredPlugins } from './plugin-modules'

const marker = `
export default function markerPlugin() {
  let label = 'Not initialized'
  return {
    name: 'example:marker',
    config: { normalize: ({ config }) => ({ extensions: { marker: { label: config.extensions.marker?.label ?? 'Default' } } }) },
    hooks: {
      onConfigResolved({ config }) { label = config.extensions.marker.label },
      onPageDocument(_context, page) { page.document.body.setAttribute('data-marker', label) },
    },
    devMiddleware(request, response) { if (request.url === '/marker') response.end(label) },
  }
}
export { markerPlugin }
`

const layout = `
export const layoutPlugin = {
  name: 'example:layout',
  templates: {
    doc: ({ head, bodyHtml }) => ({ toHtml: () => '<html>' + head.toHtml() + '<body>' + bodyHtml + '</body></html>' }),
  },
}
`

describe('siteConfig.json plugin modules', () => {
  let root: string
  let server: DevServerHandle | undefined
  beforeAll(() => disableLogger())
  afterAll(() => getLogger().close())
  afterEach(async () => {
    await server?.close()
    server = undefined
    if (root) await fs.rm(root, { recursive: true, force: true })
  })
  async function fixture(
    plugins: unknown = ['example-plugin'],
    code = marker,
    packageName = 'example-plugin',
  ) {
    root = await makeRepoTempDir('.tmp-json-plugins-')
    const contentDir = path.join(root, 'content')
    const packageDir = path.join(root, 'node_modules', packageName)
    await fs.mkdir(contentDir)
    await fs.mkdir(packageDir, { recursive: true })
    await fs.writeFile(
      path.join(packageDir, 'package.json'),
      JSON.stringify({
        name: packageName,
        type: 'module',
        exports: {
          '.': { import: './index.mjs', require: './unused.cjs' },
          './plugin': './index.mjs',
        },
      }),
    )
    await fs.writeFile(path.join(packageDir, 'index.mjs'), code)
    await fs.writeFile(path.join(contentDir, 'index.md'), '# Home')
    const config = {
      outDir: '../out',
      publishDir: '../publish',
      defaultPlugins: undefined as boolean | undefined,
      plugins,
      extensions: { marker: { label: 'From JSON' } },
      navigation: { mode: 'none' },
      pagefind: { enabled: false },
      mdx: { disableHighlighter: true },
    }
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify(config),
    )
    return { contentDir, config }
  }

  it('builds and publishes from JSON alone using an installed ESM plugin and its settings', async () => {
    const { contentDir } = await fixture()
    for (const command of ['build', 'publish']) {
      await runCli([command, '--content', contentDir])
      const html = await fs.readFile(
        path.join(root, command === 'build' ? 'out' : 'publish', 'index.html'),
        'utf8',
      )
      expect(html).toMatch(/data-marker=(?:"From JSON"|'From JSON')/)
    }
  })

  it('applies the same selection through the programmatic builder', async () => {
    const { contentDir } = await fixture()
    await buildSite({ siteConfig: { contentDir } })
    expect(
      await fs.readFile(path.join(root, 'out', 'index.html'), 'utf8'),
    ).toContain('data-marker="From JSON"')
  })

  it.each([
    [undefined, undefined, undefined, true],
    [undefined, undefined, [], true],
    [true, undefined, ['example-plugin'], true],
    [false, undefined, undefined, false],
    [false, undefined, [], false],
    [false, undefined, ['example-plugin'], false],
    [false, true, ['example-plugin'], true],
    [true, false, undefined, false],
  ] as const)(
    'resolves defaults (JSON=%s, explicit=%s, declarations=%j)',
    async (fileDefault, explicitDefault, declarations, defaultsEnabled) => {
      const { contentDir, config } = await fixture()
      await fs.writeFile(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({
          ...config,
          plugins: declarations,
          defaultPlugins: fileDefault,
        }),
      )
      const selected = await resolveConfiguredPlugins({
        siteConfig: { contentDir },
        options: {
          defaultPlugins: explicitDefault,
          plugins: [{ name: 'explicit' }],
        },
      })
      const names = selected.plugins.map((plugin) => plugin.name)
      const additions = [
        ...(declarations?.length ? ['example:marker'] : []),
        'explicit',
      ]
      if (defaultsEnabled) {
        expect(names).toEqual(
          expect.arrayContaining([
            'purestack:theme',
            'purestack:components',
            'purestack:pagefind',
            ...additions,
          ]),
        )
      } else expect(names).toEqual(additions)
    },
  )

  it.each([null, 'false', 0, [], {}])(
    'rejects a non-boolean defaultPlugins value (%j) without module declarations',
    async (defaultPlugins) => {
      const { contentDir, config } = await fixture()
      await fs.writeFile(
        path.join(contentDir, 'siteConfig.json'),
        JSON.stringify({ ...config, plugins: undefined, defaultPlugins }),
      )
      await expect(buildSite({ siteConfig: { contentDir } })).rejects.toThrow(
        'siteConfig.json defaultPlugins must be a boolean.',
      )
    },
  )

  it('builds and publishes with only the plugins selected in JSON', async () => {
    const { contentDir, config } = await fixture(
      ['example-plugin#layoutPlugin', 'example-plugin#markerPlugin'],
      `${marker}\n${layout}`,
    )
    config.defaultPlugins = false
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify(config),
    )
    for (const command of ['build', 'publish']) {
      await runCli([command, '--content', contentDir])
      const html = await fs.readFile(
        path.join(root, command === 'build' ? 'out' : 'publish', 'index.html'),
        'utf8',
      )
      await runInDom(html, (document) => {
        expect(document.body.getAttribute('data-marker')).toBe('From JSON')
        expect(document.querySelector('h1')?.textContent).toBe('Home')
        expect(document.querySelector('link[rel="stylesheet"]')).toBeNull()
      })
    }
  })

  it('lets the TypeScript config override the JSON defaultPlugins flag', async () => {
    const { contentDir, config } = await fixture()
    config.defaultPlugins = false
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify(config),
    )
    await fs.writeFile(
      path.join(contentDir, 'purestack.config.ts'),
      'export default { defaultPlugins: true }',
    )
    await runCli(['build', '--content', contentDir])
    const html = await fs.readFile(path.join(root, 'out', 'index.html'), 'utf8')
    expect(html).toContain('data-marker="From JSON"')
    expect(html).toContain('data-theme="light"')
  })

  it('builds and publishes with multiple named plugins from a package without a default export', async () => {
    const { contentDir } = await fixture(
      ['example-plugin#markerPlugin', 'example-plugin#auditPlugin'],
      `${marker.replace('export default function', 'function')}
export const auditPlugin = {
  name: 'example:audit',
  hooks: { onPageDocument(_context, page) { page.document.body.setAttribute('data-audit', 'Enabled') } },
}`,
    )
    for (const command of ['build', 'publish']) {
      await runCli([command, '--content', contentDir])
      const html = await fs.readFile(
        path.join(root, command === 'build' ? 'out' : 'publish', 'index.html'),
        'utf8',
      )
      await runInDom(html, (document) => {
        expect(document.body.getAttribute('data-marker')).toBe('From JSON')
        expect(document.body.getAttribute('data-audit')).toBe('Enabled')
      })
    }
  })

  it.each([
    [
      'object',
      'example-plugin/plugin',
      'export default { name: "subpath-plugin" }',
    ],
    [
      'async factory',
      'example-plugin/plugin',
      'export default async () => ({ name: "subpath-plugin" })',
    ],
    [
      'explicit default',
      'example-plugin/plugin#default',
      'export default { name: "subpath-plugin" }',
    ],
  ])(
    'supports package subpaths with a default-exported %s',
    async (_, reference, code) => {
      const { contentDir } = await fixture([reference], code)
      const selected = await resolveConfiguredPlugins({
        siteConfig: { contentDir },
        options: { defaultPlugins: false },
      })
      expect(selected.plugins.map((plugin) => plugin.name)).toEqual([
        'subpath-plugin',
      ])
    },
  )

  it.each([
    ['object', 'export const selectedPlugin = { name: "named-plugin" }'],
    [
      'async factory',
      'export async function selectedPlugin() { return { name: "named-plugin" } }',
    ],
  ])('supports a named %s from a scoped package subpath', async (_, code) => {
    const { contentDir } = await fixture(
      ['@example/plugins/plugin#selectedPlugin'],
      code,
      '@example/plugins',
    )
    const selected = await resolveConfiguredPlugins({
      siteConfig: { contentDir },
      options: { defaultPlugins: false },
    })
    expect(selected.plugins.map((plugin) => plugin.name)).toEqual([
      'named-plugin',
    ])
  })

  it('lets an explicit plugin instance replace a JSON-selected owner', async () => {
    const { contentDir } = await fixture(['example-plugin#markerPlugin'])
    const explicit = { name: 'example:marker' }
    const selected = await resolveConfiguredPlugins({
      siteConfig: { contentDir },
      options: { defaultPlugins: false, plugins: [explicit] },
    })
    expect(selected.plugins).toEqual([explicit])
  })

  it.each([
    null,
    {},
    true,
    [null],
    ['../local.mjs'],
    ['https://example.com/plugin.mjs'],
    ['example-plugin/../other'],
    ['example-plugin/.#markerPlugin'],
    ['example-plugin#'],
    ['example-plugin##markerPlugin'],
    ['example-plugin#markerPlugin#other'],
    ['example-plugin#invalid-name'],
    ['example-plugin#123'],
    ['example-plugin#markerPlugin()'],
    ['example-plugin', 'example-plugin'],
    ['example-plugin', 'example-plugin#default'],
    ['example-plugin#markerPlugin', 'example-plugin#markerPlugin'],
  ])('rejects invalid module declarations (%j)', async (plugins) => {
    const { contentDir } = await fixture(plugins)
    await expect(buildSite({ siteConfig: { contentDir } })).rejects.toThrow(
      /siteConfig.json plugins/,
    )
  })

  it('rejects different exports that declare the same plugin name', async () => {
    const { contentDir } = await fixture([
      'example-plugin',
      'example-plugin#markerPlugin',
    ])
    await expect(buildSite({ siteConfig: { contentDir } })).rejects.toThrow(
      /plugin "example:marker" is listed more than once/,
    )
  })

  it.each([
    [
      'missing-optional-integration',
      marker,
      /Could not load plugin "missing-optional-integration".*Could not resolve/s,
    ],
    [
      'example-plugin',
      'export const plugin = {}',
      /Could not load plugin "example-plugin"/,
    ],
    [
      'example-plugin#missingPlugin',
      marker,
      /Could not load plugin "example-plugin#missingPlugin".*missingPlugin/,
    ],
    [
      'example-plugin#invalidPlugin',
      `${marker}\nexport const invalidPlugin = 42`,
      /Could not load plugin "example-plugin#invalidPlugin"/,
    ],
    [
      'example-plugin',
      'export default () => ({ name: "bad", invalid: true })',
      /unknown field "invalid"/,
    ],
    [
      'example-plugin',
      'export default () => { throw new Error("Factory failed") }',
      /Factory failed/,
    ],
  ])(
    'reports the module and original error for %s',
    async (specifier, code, error) => {
      const { contentDir } = await fixture([specifier], code)
      const result = buildSite({ siteConfig: { contentDir } })
      await expect(result).rejects.toThrow(error)
      await expect(result).rejects.not.toThrow('Install the package')
    },
  )

  it('reloads JSON plugin selection, defaults, settings, and dev middleware', async () => {
    const { contentDir, config } = await fixture(
      undefined,
      `${marker}\n${layout}`,
    )
    const port = await freePort()
    server = await startDevServer({
      host: '127.0.0.1',
      port,
      liveReload: false,
      build: { siteConfig: { contentDir } },
    })
    const origin = `http://127.0.0.1:${port}`
    expect(await (await fetch(`${origin}/marker`)).text()).toBe('From JSON')
    expect(await (await fetch(origin)).text()).toContain(
      'data-marker="From JSON"',
    )
    config.extensions.marker.label = 'Reloaded'
    config.plugins = ['example-plugin#markerPlugin']
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify(config),
    )
    await waitFor(
      async () =>
        (await (await fetch(`${origin}/marker`)).text()) === 'Reloaded',
    )
    expect(await (await fetch(origin)).text()).toContain(
      'data-marker="Reloaded"',
    )
    config.defaultPlugins = false
    config.plugins = [
      'example-plugin#layoutPlugin',
      'example-plugin#markerPlugin',
    ]
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify(config),
    )
    await waitFor(async () => {
      const html = await (await fetch(origin)).text()
      return (
        html.includes('data-marker="Reloaded"') &&
        !html.includes('data-theme="light"')
      )
    })
    expect(await (await fetch(`${origin}/marker`)).text()).toBe('Reloaded')
    config.defaultPlugins = true
    config.plugins = []
    await fs.writeFile(
      path.join(contentDir, 'siteConfig.json'),
      JSON.stringify(config),
    )
    await waitFor(async () => {
      const html = await (await fetch(origin)).text()
      return (
        !html.includes('data-marker=') && html.includes('data-theme="light"')
      )
    })
  })
})

async function freePort() {
  const probe = net.createServer()
  await new Promise<void>((resolve, reject) => {
    probe.once('error', reject)
    probe.listen(0, '127.0.0.1', resolve)
  })
  const address = probe.address()
  await new Promise<void>((resolve) => probe.close(() => resolve()))
  if (!address || typeof address === 'string') throw new Error('Expected port')
  return address.port
}

async function waitFor(check: () => Promise<boolean>) {
  const deadline = Date.now() + 3000
  while (Date.now() < deadline) {
    if (await check()) return
    await new Promise((resolve) => setTimeout(resolve, 25))
  }
  throw new Error('Expected configuration reload')
}
