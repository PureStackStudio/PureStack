import fs from 'node:fs/promises'
import path from 'node:path'
import type { SiteStyles } from '@purestack/ts-common'
import { styleBuilder, themes } from '@purestack/ts-style'
import { disableLogger, getLogger } from 'logpot'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { createIncrementalBuilder } from '../build/incremental'
import { readManifest } from '../build/manifest'
import { makeRepoTempDir } from '../test/repoTempDir'

describe('independent site builders', () => {
  let root: string
  beforeAll(() => disableLogger())
  afterAll(async () => getLogger().close())
  afterEach(async () => {
    if (root) await fs.rm(root, { recursive: true, force: true })
  })

  it.each(['lazy', 'full'])(
    'isolates concurrent %s builds, async hooks, palettes, CSS, and incremental revisions',
    async (mode) => {
      root = await makeRepoTempDir('.tmp-isolated-plugins-')
      let release!: () => void
      const bothStarted = new Promise<void>((resolve) => {
        release = resolve
      })
      let started = 0
      const providers: Record<string, SiteStyles> = {}
      async function site(name: string, accent: string) {
        const contentDir = path.join(root, name, 'content')
        const outDir = path.join(root, name, 'out')
        await fs.mkdir(contentDir, { recursive: true })
        const contentPath = path.join(contentDir, 'index.md')
        await fs.writeFile(contentPath, `# Site ${name}`)
        const builder = await createIncrementalBuilder({
          siteConfig: {
            rootDir: root,
            contentDir,
            outDir,
            mdx: { disableHighlighter: true },
            pagefind: { enabled: false },
          },
          options: {
            plugins: [
              {
                name: `site-${name}`,
                components() {
                  styleBuilder.select(`.factory-${name}`, 'light').color(accent)
                  return {}
                },
                hooks: {
                  async onConfigResolved(context) {
                    if (!context.config.style)
                      throw new Error('Expected theme settings')
                    if (!context.styles)
                      throw new Error('Expected site stylesheet provider')
                    providers[name] = context.styles
                    await Promise.resolve()
                    if (name === 'a') {
                      context.config.style.theme.palette.light.accent = accent
                      return
                    }
                    const options = themes.getOptions()
                    themes.setOptions({
                      ...options,
                      palette: {
                        ...options.palette,
                        light: { ...options.palette.light, accent },
                      },
                    })
                    expect(
                      context.config.style.theme.palette.light.accent,
                    ).toBe(accent)
                  },
                  async onPageStart() {
                    if (++started === 2) release()
                    await bothStarted
                    styleBuilder.select(`.page-${name}`, 'light').color(accent)
                  },
                },
              },
            ],
          },
        })
        return { builder, outDir, contentPath }
      }
      const a = await site('a', '#112233')
      const b = await site('b', '#aabbcc')
      if (mode === 'lazy') {
        await Promise.all([
          a.builder.prepareForRequests(),
          b.builder.prepareForRequests(),
        ])
        await Promise.all([
          a.builder.renderByUrlPath('/'),
          b.builder.renderByUrlPath('/'),
        ])
      } else {
        await Promise.all([
          a.builder.buildAll('site a'),
          b.builder.buildAll('site b'),
        ])
      }
      await Promise.all([
        a.builder.preparePageAssets(),
        b.builder.preparePageAssets(),
      ])
      for (const [name, site, accent, other] of [
        ['a', a, '#112233', 'b'],
        ['b', b, '#aabbcc', 'a'],
      ] as const) {
        const html = await fs.readFile(
          path.join(site.outDir, 'index.html'),
          'utf8',
        )
        expect(html).toContain(
          `name="theme-color" media="(prefers-color-scheme: light)" content="${accent}"`,
        )
        const manifest = await readManifest(site.outDir)
        if (!manifest) throw new Error('Expected a built site manifest')
        const css = await fs.readFile(manifest.styles.outputs[0], 'utf8')
        expect(css).toContain(`.factory-${name}`)
        expect(css).toContain(`.page-${name}`)
        expect(css).not.toContain(`.factory-${other}`)
        expect(css).not.toContain(`.page-${other}`)
      }
      const bManifest = await readManifest(b.outDir)
      if (!bManifest) throw new Error('Expected site B manifest')
      const bCssPath = bManifest.styles.outputs[0]
      const bBefore = await fs.stat(bCssPath)
      const bRevision = providers.b.revision
      await fs.writeFile(a.contentPath, '# Changed A')
      await a.builder.applyChange(a.contentPath)
      await a.builder.renderByUrlPath('/')
      await a.builder.preparePageAssets()
      await b.builder.preparePageAssets()
      expect(providers.b.revision).toBe(bRevision)
      expect((await fs.stat(bCssPath)).mtimeMs).toBe(bBefore.mtimeMs)
      expect(
        await fs.readFile(path.join(a.outDir, 'index.html'), 'utf8'),
      ).toContain('Changed A')
    },
  )
})
