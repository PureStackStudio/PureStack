import fs from 'node:fs/promises'
import path from 'node:path'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { runCli } from '../cli-runner'
import { makeRepoTempDir } from '../test/repoTempDir'
import {
  defineConfig,
  findProjectConfig,
  loadPluginExport,
  loadProjectConfig,
  PROJECT_CONFIG_FILENAME,
  withProjectConfig,
} from './project-config'

describe('purestack.config.ts', () => {
  let logger: Logger | undefined
  let root: string | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  afterEach(async () => {
    if (root) await fs.rm(root, { recursive: true, force: true })
    root = undefined
  })

  async function createProject(files: Record<string, string>) {
    root = await makeRepoTempDir('.tmp-ts-ssg-config-')
    for (const [relPath, contents] of Object.entries(files)) {
      const filePath = path.join(root, relPath)
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, contents, 'utf8')
    }
    return root
  }

  it('returns the config it defines', () => {
    const config = { plugins: [] }

    expect(defineConfig(config)).toBe(config)
  })

  it('finds the config next to siteConfig.json, if there is one', async () => {
    const projectRoot = await createProject({
      'with/purestack.config.ts': 'export default {}',
      'without/index.mdx': '# Home',
    })

    expect(findProjectConfig(path.join(projectRoot, 'with'))).toBe(
      path.join(projectRoot, 'with', PROJECT_CONFIG_FILENAME),
    )
    expect(findProjectConfig(path.join(projectRoot, 'without'))).toBeUndefined()
  })

  it('loads plugins from local TypeScript files and lists them as dependencies', async () => {
    const projectRoot = await createProject({
      'plugins/marker.ts': [
        "const label: string = 'from a local file'",
        "export const markerPlugin = { name: 'marker', hooks: { onBuildComplete() {} } }",
        'export { label }',
      ].join('\n'),
      'content/purestack.config.ts': [
        "import { label, markerPlugin } from '../plugins/marker'",
        'export default { plugins: [{ ...markerPlugin, name: label }] }',
      ].join('\n'),
    })
    const configFile = path.join(
      projectRoot,
      'content',
      PROJECT_CONFIG_FILENAME,
    )

    const loaded = await loadProjectConfig(configFile)

    expect(loaded.config.plugins?.map((plugin) => plugin.name)).toEqual([
      'from a local file',
    ])
    expect(loaded.dependencies.sort()).toEqual(
      [configFile, path.join(projectRoot, 'plugins', 'marker.ts')].sort(),
    )
  })

  it("uses PureStack's package copy for both JSON declarations and TypeScript imports", async () => {
    const projectRoot = await createProject({
      'node_modules/logpot/package.json': JSON.stringify({
        name: 'logpot',
        type: 'module',
        exports: './index.mjs',
      }),
      'node_modules/logpot/index.mjs':
        'throw new Error("The site copy must not load"); export function getLogger() {}',
      'content/purestack.config.ts': [
        "import { getLogger } from 'logpot'",
        'export default { plugins: [{ name: "shared", hooks: { onBuildComplete: getLogger } }] }',
      ].join('\n'),
    })
    const contentDir = path.join(projectRoot, 'content')
    const fromJson = await loadPluginExport(
      'logpot',
      'getLogger',
      path.join(contentDir, 'siteConfig.json'),
    )
    const fromTs = await loadProjectConfig(
      path.join(contentDir, PROJECT_CONFIG_FILENAME),
    )
    expect(fromJson).toBeTypeOf('function')
    expect(fromJson).toBe(fromTs.config.plugins?.[0].hooks?.onBuildComplete)
  })

  it('uses the same site-only package copy for JSON declarations and TypeScript imports', async () => {
    const projectRoot = await createProject({
      'node_modules/site-only-plugin/package.json': JSON.stringify({
        name: 'site-only-plugin',
        type: 'module',
        exports: './index.mjs',
      }),
      'node_modules/site-only-plugin/index.mjs':
        'export const plugin = { name: "site-only" }',
      'content/purestack.config.ts': [
        "import { plugin } from 'site-only-plugin'",
        'export default { plugins: [plugin] }',
      ].join('\n'),
    })
    const contentDir = path.join(projectRoot, 'content')
    const fromJson = await loadPluginExport(
      'site-only-plugin',
      'plugin',
      path.join(contentDir, 'siteConfig.json'),
    )
    const fromTs = await loadProjectConfig(
      path.join(contentDir, PROJECT_CONFIG_FILENAME),
    )
    expect(fromJson).toEqual({ name: 'site-only' })
    expect(fromJson).toBe(fromTs.config.plugins?.[0])
  })

  it.each([
    [
      'export const plugins = []',
      'must export its config as the default export: export default defineConfig({ plugins: [...] })',
    ],
    [
      'export default { plugin: [] }',
      'has an unknown field "plugin". Config fields: plugins, defaultPlugins.',
    ],
    [
      'export default { defaultPlugins: [] }',
      'needs defaultPlugins to be a boolean.',
    ],
    ['export default {', 'Could not bundle'],
    ["throw new Error('Config failed on purpose.')", 'Could not run'],
  ])('rejects %j', async (source, message) => {
    const projectRoot = await createProject({
      [PROJECT_CONFIG_FILENAME]: source,
    })

    await expect(
      loadProjectConfig(path.join(projectRoot, PROJECT_CONFIG_FILENAME)),
    ).rejects.toThrow(message)
  })

  it('adds config plugins after the plugins a build already lists', () => {
    const first = { name: 'first' }
    const fromConfig = { name: 'from-config' }

    const input = withProjectConfig(
      { options: { cleanOutDir: true, plugins: [first] } },
      { filePath: '', dependencies: [], config: { plugins: [fromConfig] } },
    )

    expect(input.options).toEqual({
      cleanOutDir: true,
      plugins: [first, fromConfig],
    })
  })

  it('loads and applies default plugin selection without a plugins array', async () => {
    const projectRoot = await createProject({
      [PROJECT_CONFIG_FILENAME]: 'export default { defaultPlugins: false }',
    })
    const loaded = await loadProjectConfig(
      path.join(projectRoot, PROJECT_CONFIG_FILENAME),
    )
    expect(withProjectConfig({}, loaded).options?.defaultPlugins).toBe(false)
  })

  it('builds with the config when the CLI finds one', async () => {
    const projectRoot = await createProject({
      'content/siteConfig.json': JSON.stringify({ outDir: '../out' }),
      'content/index.mdx': '# Home',
      'content/purestack.config.ts': [
        'export default {',
        '  plugins: [{',
        "    name: 'marker',",
        '    hooks: {',
        '      onPageRendered(_context: unknown, page: { html: string }) {',
        "        page.html = page.html.replace('</body>', '<!-- from config --></body>')",
        '      },',
        '    },',
        '  }],',
        '}',
      ].join('\n'),
    })

    await runCli(['build', '--content', path.join(projectRoot, 'content')])

    const html = await fs.readFile(
      path.join(projectRoot, 'out', 'index.html'),
      'utf8',
    )
    expect(html).toContain('<!-- from config -->')
  })
})
