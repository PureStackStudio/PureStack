import fs from 'node:fs/promises'
import path from 'node:path'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { runCli } from '../cli-runner'
import { makeRepoTempDir } from '../test/repoTempDir'
import {
  defineConfig,
  findProjectConfig,
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

  it.each([
    [
      'export const plugins = []',
      'must export its config as the default export: export default defineConfig({ plugins: [...] })',
    ],
    [
      'export default { plugin: [] }',
      'has an unknown field "plugin". Config fields: plugins.',
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
