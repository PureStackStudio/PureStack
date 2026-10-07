import fs from 'node:fs/promises'
import path from 'node:path'
import { styleBuilder } from '@purestack/ts-style'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { resolveSiteConfig } from '../../config/config'
import { parseFrontmatterSource } from '../../frontmatter/frontmatter'
import type { PureStackPlugin } from '../../plugins/plugin'
import { makeRepoTempDir } from '../../test/repoTempDir'
import { createEmptyManifest, readManifest, writeManifest } from '../manifest'
import type { BuildHooks } from '../site'
import { createIncrementalBuilder } from './index'

async function withTempDir<T>(worker: (dir: string) => Promise<T>) {
  const base = await makeRepoTempDir('.tmp-ts-ssg-')
  try {
    return await worker(base)
  } finally {
    await fs.rm(base, { recursive: true, force: true })
  }
}

async function fileExists(filePath: string) {
  try {
    await fs.stat(filePath)
    return true
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') return false
    throw error
  }
}

async function readScriptBundle(
  outDir: string,
  pageRelPath = path.join('hosts', 'index.html'),
) {
  const pageHtml = await fs.readFile(path.join(outDir, pageRelPath), 'utf8')
  const match = /<script\b[^>]*\bsrc="([^"]+\.js)"[^>]*>/.exec(pageHtml)
  if (!match) {
    throw new Error(`Expected script bundle in ${pageRelPath}`)
  }
  const bundlePath = path.join(outDir, match[1].replace(/^\/+/, ''))
  return {
    path: bundlePath,
    content: await fs.readFile(bundlePath, 'utf8'),
  }
}

describe('incremental builder', () => {
  let logger: Logger | undefined

  beforeAll(async () => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('keeps style changes during CSS generation pending for the next request', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      await fs.mkdir(contentDir)
      await fs.writeFile(path.join(contentDir, 'index.md'), '# Home')
      let writes = 0
      const builder = await createIncrementalBuilder({
        siteConfig: { rootDir: base, contentDir, outDir },
        options: {
          plugins: [
            {
              name: 'count-css',
              hooks: {
                onStylesWritten() {
                  writes += 1
                },
              },
            },
          ],
        },
      })
      await builder.prepareForRequests()
      await builder.renderByUrlPath('/')
      const render = styleBuilder.render.bind(styleBuilder)
      let changed = false
      const spy = vi
        .spyOn(styleBuilder, 'render')
        .mockImplementation(async (theme, pretty) => {
          const css = await render(theme, pretty)
          if (!changed) {
            changed = true
            styleBuilder.select('.concurrent-style', 'light').color('red')
          }
          return css
        })
      try {
        await builder.preparePageAssets()
        expect(writes).toBe(1)
        await builder.preparePageAssets()
        expect(writes).toBe(2)
        expect(
          await fs.readFile(path.join(outDir, 'assets', 'site.css'), 'utf8'),
        ).toContain('.concurrent-style')
        await builder.preparePageAssets()
        expect(writes).toBe(2)
      } finally {
        spy.mockRestore()
      }
    })
  })

  it.each(['none', 'hybrid'] as const)(
    'shares discovery across watcher bursts with %s navigation',
    async (mode) => {
      await withTempDir(async (base) => {
        const contentDir = path.join(base, 'content')
        const outDir = path.join(base, 'out')
        await fs.mkdir(contentDir)
        const files = Array.from({ length: 10 }, (_, index) =>
          path.join(contentDir, `page${index}.md`),
        )
        for (const file of files) await fs.writeFile(file, '# Original')
        let discoveries = 0
        const builder = await createIncrementalBuilder({
          siteConfig: {
            rootDir: base,
            contentDir,
            outDir,
            navigation: { mode },
          },
          options: {
            plugins: [
              {
                name: 'count-discoveries',
                pages() {
                  discoveries += 1
                  return []
                },
              },
            ],
          },
        })
        await builder.prepareForRequests()
        await builder.renderByUrlPath('/page0/')
        discoveries = 0
        expect(await builder.applyChanges([...files, files[0]])).toHaveLength(
          10,
        )
        expect(discoveries).toBe(1)

        await fs.writeFile(files[0], '# Updated')
        await fs.rm(files[1])
        const added = path.join(contentDir, 'added.md')
        await fs.writeFile(added, '# Added')
        await builder.applyChanges([files[0], files[1], added])
        expect(discoveries).toBe(2)
        expect(await builder.renderByUrlPath('/page0/')).toBe(true)
        expect(
          await fs.readFile(path.join(outDir, 'page0', 'index.html'), 'utf8'),
        ).toContain('Updated')
        expect(await builder.renderByUrlPath('/added/')).toBe(true)
        expect(await builder.renderByUrlPath('/page1/')).toBe(false)
      })
    },
  )

  it('stops a change batch on abort and clears its discovery cache after failure', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(contentDir)
      const first = path.join(contentDir, 'first.md')
      const second = path.join(contentDir, 'second.md')
      await fs.writeFile(first, '# First')
      await fs.writeFile(second, '# Second')
      const controller = new AbortController()
      let abort = false
      let fail = false
      const builder = await createIncrementalBuilder({
        siteConfig: {
          rootDir: base,
          contentDir,
          outDir: path.join(base, 'out'),
        },
        options: {
          plugins: [
            {
              name: 'control-discovery',
              pages() {
                if (fail) throw new Error('discovery failed')
                if (abort) controller.abort()
                return []
              },
            },
          ],
        },
      })
      await builder.prepareForRequests()
      abort = true
      expect(
        await builder.applyChanges([first, second], controller.signal),
      ).toHaveLength(1)
      expect(await builder.applyChanges([second], controller.signal)).toEqual(
        [],
      )
      abort = false
      fail = true
      await expect(builder.applyChanges([first])).rejects.toThrow(
        'discovery failed',
      )
      fail = false
      expect(await builder.applyChanges([first, second])).toHaveLength(2)
    })
  })

  it('ignores directory notifications and refreshes removed subtrees without deleting directories as files', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      const assetsDir = path.join(contentDir, 'assets')
      const emptyDir = path.join(contentDir, 'empty')
      await fs.mkdir(assetsDir, { recursive: true })
      await fs.mkdir(emptyDir)
      await fs.mkdir(path.join(outDir, 'empty'), { recursive: true })
      await fs.writeFile(path.join(assetsDir, 'example.txt'), 'asset content')
      await fs.writeFile(path.join(contentDir, 'index.mdx'), '# Home')
      const builder = await createIncrementalBuilder({
        siteConfig: { rootDir: base, contentDir, outDir },
      })
      await builder.prepareForRequests()
      await builder.prepareAssetByUrlPath('/assets/example.txt')
      expect((await builder.applyChange(assetsDir)).fullRebuild).toBe(false)
      expect((await builder.applyChange(contentDir)).fullRebuild).toBe(false)
      expect(
        await fs.readFile(path.join(outDir, 'assets', 'example.txt'), 'utf8'),
      ).toBe('asset content')
      await fs.rmdir(emptyDir)
      expect((await builder.applyChange(emptyDir)).fullRebuild).toBe(false)
      expect((await fs.stat(path.join(outDir, 'empty'))).isDirectory()).toBe(
        true,
      )
      await fs.rm(assetsDir, { recursive: true, force: true })
      expect((await builder.applyChange(assetsDir)).fullRebuild).toBe(true)
      expect(
        await fs.readFile(path.join(outDir, 'assets', 'example.txt'), 'utf8'),
      ).toBe('asset content')
    })
  })

  it('removes deleted content outputs and updates manifest', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.mkdir(outDir, { recursive: true })

      const config = resolveSiteConfig({
        rootDir: base,
        contentDir,
        outDir,
        siteTitle: 'Test Site',
        style: {
          fileName: 'site.css',
          href: '/assets/site.css',
        },
      })

      const manifest = createEmptyManifest(config)
      const outPath = path.join(outDir, 'index.html')
      await fs.writeFile(outPath, '<html></html>', 'utf8')
      manifest.content['index.md'] = {
        relPath: 'index.md',
        ext: '.md',
        outPath,
        mtimeMs: 1,
        size: 1,
      }
      await writeManifest(outDir, manifest)

      const builder = await createIncrementalBuilder({
        siteConfig: {
          rootDir: base,
          contentDir,
          outDir,
          siteTitle: 'Test Site',
          style: {
            fileName: 'site.css',
            href: '/assets/site.css',
          },
        },
      })

      const result = await builder.applyChange(
        path.join(contentDir, 'index.md'),
      )
      expect(result.deletedPages).toBe(1)
      expect(await fileExists(outPath)).toBe(false)

      const next = await readManifest(outDir)
      expect(next?.content['index.md']).toBeUndefined()
    })
  })

  it('treats new .rmdx files as Regor MDX content changes', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'index.rmdx'),
        ['# Home', '', '<Badge tone="accent" />'].join('\n'),
        'utf8',
      )

      const builder = await createIncrementalBuilder({
        siteConfig: {
          rootDir: base,
          contentDir,
          outDir,
          siteTitle: 'Test Site',
          style: {
            fileName: 'site.css',
            href: '/assets/site.css',
          },
          mdx: {
            compileMdAsMdx: false,
          },
        },
      })

      const result = await builder.applyChange(
        path.join(contentDir, 'index.rmdx'),
      )
      expect(result.changedPages).toBe(1)

      const html = await fs.readFile(path.join(outDir, 'index.html'), 'utf8')
      expect(html).toContain('class="badge')
      expect(html).not.toContain('&#x3C;Badge tone="accent" />')
      const manifest = await readManifest(outDir)
      expect(manifest?.content['index.rmdx']?.ext).toBe('.rmdx')
    })
  })

  it('does not emit shiki selectors when highlightjs is selected', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'index.md'),
        '```ts\nconst x = 1\n```',
        'utf8',
      )

      const builder = await createIncrementalBuilder({
        siteConfig: {
          rootDir: base,
          contentDir,
          outDir,
          siteTitle: 'Test Site',
          style: {
            fileName: 'site.css',
            href: '/assets/site.css',
          },
          mdx: {
            highlighter: 'highlightjs',
          },
        },
      })

      await builder.buildAll('test highlightjs styles')

      const lightCss = await fs.readFile(
        path.join(outDir, 'assets', 'site.css'),
        'utf8',
      )
      const darkCss = await fs.readFile(
        path.join(outDir, 'assets', 'site.dark.css'),
        'utf8',
      )

      expect(lightCss).not.toContain('pre.shiki.shiki-themes')
      expect(darkCss).not.toContain('pre.shiki.shiki-themes')
      expect(lightCss).toContain('.hljs')
      expect(darkCss).toContain('.hljs')
    })
  })

  it('rebuilds ts entry bundles when an imported ts dependency changes', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      await fs.mkdir(path.join(contentDir, 'common'), { recursive: true })
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'hosts.mdx'),
        '<RegorApp src="./hosts.ts" id="hosts-admin-app" />',
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'account.mdx'),
        '<RegorApp src="./account.ts" id="account-admin-app" />',
        'utf8',
      )

      await fs.writeFile(
        path.join(contentDir, 'hosts.ts'),
        "import { message } from './common/message'\nconsole.log(message)\n",
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'account.ts'),
        "console.log('account')\n",
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'common', 'message.ts'),
        "export const message = 'before'\n",
        'utf8',
      )

      const builder = await createIncrementalBuilder({
        siteConfig: {
          rootDir: base,
          contentDir,
          outDir,
          siteTitle: 'Test Site',
          style: {
            fileName: 'site.css',
            href: '/assets/site.css',
          },
          mdx: {
            disableHighlighter: true,
          },
        },
      })

      await builder.buildAll('initial')

      const beforeBundle = await readScriptBundle(outDir)
      expect(beforeBundle.content).toContain('before')
      const accountBundle = await readScriptBundle(
        outDir,
        path.join('account', 'index.html'),
      )
      expect(accountBundle.content).toContain('account')

      await fs.writeFile(
        path.join(contentDir, 'common', 'message.ts'),
        "export const message = 'after'\n",
        'utf8',
      )
      const result = await builder.applyChange(
        path.join(contentDir, 'common', 'message.ts'),
      )

      expect(result.changedAssets).toBeGreaterThan(0)
      expect(result.changedPages).toBe(1)
      const afterBundle = await readScriptBundle(outDir)
      expect(afterBundle.content).toContain('after')
      const nextAccountBundle = await readScriptBundle(
        outDir,
        path.join('account', 'index.html'),
      )
      expect(nextAccountBundle.path).toBe(accountBundle.path)
      expect(nextAccountBundle.content).toBe(accountBundle.content)
      expect(await fileExists(beforeBundle.path)).toBe(false)
    })
  })

  it('removes ts entry bundle after deleting a scripted page with navigation enabled', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'hosts.mdx'),
        '<RegorApp src="./hosts.ts" id="hosts-admin-app" />',
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'hosts.ts'),
        "console.log('hello')\n",
        'utf8',
      )

      const builder = await createIncrementalBuilder({
        siteConfig: {
          rootDir: base,
          contentDir,
          outDir,
          siteTitle: 'Test Site',
          style: {
            fileName: 'site.css',
            href: '/assets/site.css',
          },
          navigation: {
            mode: 'auto',
          },
          mdx: {
            disableHighlighter: true,
          },
        },
      })

      await builder.applyChange(path.join(contentDir, 'hosts.mdx'))
      const { path: bundlePath } = await readScriptBundle(outDir)
      expect(await fileExists(bundlePath)).toBe(true)

      await fs.rm(path.join(contentDir, 'hosts.mdx'))
      const result = await builder.applyChange(
        path.join(contentDir, 'hosts.mdx'),
      )
      expect(result.deletedPages).toBe(1)

      const manifest = await readManifest(outDir)
      expect(manifest?.assets['hosts.ts']).toBeUndefined()
      expect(await fileExists(bundlePath)).toBe(false)
    })
  })

  it('uses stable script filenames when script cache busting is disabled', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'hosts.mdx'),
        '<RegorApp src="./hosts.ts" id="hosts-admin-app" />',
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'hosts.ts'),
        "console.log('stable')\n",
        'utf8',
      )

      const builder = await createIncrementalBuilder({
        siteConfig: {
          rootDir: base,
          contentDir,
          outDir,
          siteTitle: 'Test Site',
          scripts: {
            cacheBusting: false,
          },
          style: {
            fileName: 'site.css',
            href: '/assets/site.css',
          },
          mdx: {
            disableHighlighter: true,
          },
        },
      })

      await builder.buildAll('stable scripts')

      const bundle = await readScriptBundle(outDir)
      expect(bundle.path).toBe(path.join(outDir, 'hosts.js'))
      expect(bundle.content).toContain('stable')
    })
  })

  it('builds same-name folder pages with colocated script entrypoints', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      const outDir = path.join(base, 'out')
      await fs.mkdir(path.join(contentDir, 'account'), { recursive: true })
      await fs.mkdir(outDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'account', 'account.mdx'),
        '<RegorApp src="./account.ts" id="account-admin-app" />',
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'account', 'account.ts'),
        "console.log('colocated account')\n",
        'utf8',
      )

      const builder = await createIncrementalBuilder({
        siteConfig: {
          rootDir: base,
          contentDir,
          outDir,
          siteTitle: 'Test Site',
          style: {
            fileName: 'site.css',
            href: '/assets/site.css',
          },
          mdx: {
            disableHighlighter: true,
          },
        },
      })

      await builder.buildAll('same-name folder page')

      const bundle = await readScriptBundle(
        outDir,
        path.join('account', 'index.html'),
      )
      expect(path.dirname(bundle.path)).toBe(path.join(outDir, 'account'))
      expect(path.basename(bundle.path)).toMatch(/^account\.[\w-]+\.js$/)
      expect(bundle.content).toContain('colocated account')

      const manifest = await readManifest(outDir)
      expect(
        manifest?.content[path.join('account', 'account.mdx')]?.outPath,
      ).toBe(path.join(outDir, 'account', 'index.html'))
      expect(manifest?.assets['account/account.ts']?.outPath).toBe(bundle.path)
    })
  })

  async function createSite(
    base: string,
    mode: 'auto' | 'hybrid' | 'none',
    files: Record<string, string>,
    plugins: PureStackPlugin[] = [],
  ) {
    const contentDir = path.join(base, 'content')
    const outDir = path.join(base, 'out')
    const write = async (relPath: string, contents: string) => {
      const filePath = path.join(contentDir, relPath)
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, contents, 'utf8')
      return filePath
    }
    for (const [relPath, contents] of Object.entries(files)) {
      await write(relPath, contents)
    }
    const builder = await createIncrementalBuilder({
      siteConfig: {
        rootDir: base,
        contentDir,
        outDir,
        navigation: { mode },
      },
      options: { writeErrorPages: true, plugins },
    })
    await builder.buildAll('initial')
    const outPath = (urlPath: string) =>
      path.join(outDir, ...urlPath.split('/').filter(Boolean), 'index.html')
    return {
      builder,
      contentDir,
      outPath,
      read: (urlPath: string) => fs.readFile(outPath(urlPath), 'utf8'),
      change: async (relPath: string, contents: string) =>
        builder.applyChange(await write(relPath, contents)),
      remove: async (relPath: string) => {
        const filePath = path.join(contentDir, relPath)
        await fs.rm(filePath)
        return builder.applyChange(filePath)
      },
      renderIfDirty: (urlPath: string) =>
        builder.renderIfDirtyByOutPath(outPath(urlPath)),
    }
  }

  describe('content links', () => {
    async function createLinkSite(
      base: string,
      mode: 'auto' | 'none',
      files: Record<string, string>,
    ) {
      const site = await createSite(base, mode, files)
      return {
        ...site,
        indexOutPath: site.outPath('/'),
        readIndex: () => site.read('/'),
      }
    }

    it.each(['auto', 'none'] as const)(
      're-renders a linking page once its missing target is added (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          const site = await createLinkSite(base, mode, {
            'index.mdx': '[Guide](./guide)',
          })
          expect(await site.readIndex()).toContain('does not match any page')

          const guidePath = path.join(site.contentDir, 'guide.mdx')
          await fs.writeFile(guidePath, '# Guide', 'utf8')
          await site.builder.applyChange(guidePath)

          expect(
            await site.builder.renderIfDirtyByOutPath(site.indexOutPath),
          ).toBe(true)
          expect(await site.readIndex()).toContain('href="/guide/"')
        })
      },
    )

    it.each(['auto', 'none'] as const)(
      're-renders a linking page once its target is deleted (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          const site = await createLinkSite(base, mode, {
            'index.mdx': '[Guide](./guide)',
            'guide.mdx': '# Guide',
          })
          expect(await site.readIndex()).toContain('href="/guide/"')

          const guidePath = path.join(site.contentDir, 'guide.mdx')
          await fs.rm(guidePath)
          const result = await site.builder.applyChange(guidePath)

          expect(result.deletedPages).toBe(1)
          expect(
            await site.builder.renderIfDirtyByOutPath(site.indexOutPath),
          ).toBe(true)
          expect(await site.readIndex()).toContain('does not match any page')
        })
      },
    )

    it.each(['auto', 'none'] as const)(
      're-renders pages whose header link target is deleted (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          const site = await createLinkSite(base, mode, {
            'header.mdx': '<nav><a href="./guide">Guide</a></nav>',
            'index.mdx': '# Home',
            'guide.mdx': '# Guide',
          })
          expect(await site.readIndex()).toContain('href="/guide/"')

          const guidePath = path.join(site.contentDir, 'guide.mdx')
          await fs.rm(guidePath)
          await site.builder.applyChange(guidePath)

          expect(
            await site.builder.renderIfDirtyByOutPath(site.indexOutPath),
          ).toBe(true)
          const indexHtml = await site.readIndex()
          expect(indexHtml).toContain('header.mdx')
          expect(indexHtml).toContain('does not match any page')
        })
      },
    )

    it.each(['auto', 'none'] as const)(
      're-renders a page once its missing image is added (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          const site = await createLinkSite(base, mode, {
            'index.mdx': '![Logo](./images/logo.png)',
          })
          expect(await site.readIndex()).toContain('points to a missing file')

          const logoPath = path.join(site.contentDir, 'images', 'logo.png')
          await fs.mkdir(path.dirname(logoPath), { recursive: true })
          await fs.writeFile(logoPath, 'png', 'utf8')
          const result = await site.builder.applyChange(logoPath)

          expect(result.changedAssets).toBe(1)
          expect(
            await site.builder.renderIfDirtyByOutPath(site.indexOutPath),
          ).toBe(true)
          expect(await site.readIndex()).toContain('src="/images/logo.png"')
        })
      },
    )

    it.each(['auto', 'none'] as const)(
      're-renders a page once its image is deleted (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          const site = await createLinkSite(base, mode, {
            'index.mdx': '![Logo](./logo.png)',
            'logo.png': 'png',
          })
          expect(await site.readIndex()).toContain('src="/logo.png"')

          const logoPath = path.join(site.contentDir, 'logo.png')
          await fs.rm(logoPath)
          const result = await site.builder.applyChange(logoPath)

          expect(result.deletedAssets).toBe(1)
          expect(
            await site.builder.renderIfDirtyByOutPath(site.indexOutPath),
          ).toBe(true)
          expect(await site.readIndex()).toContain('points to a missing file')
        })
      },
    )

    it('keeps pages clean when an image changes in place', async () => {
      await withTempDir(async (base) => {
        const site = await createLinkSite(base, 'none', {
          'index.mdx': '![Logo](./logo.png)',
          'logo.png': 'png',
        })

        const logoPath = path.join(site.contentDir, 'logo.png')
        await fs.writeFile(logoPath, 'png, edited', 'utf8')
        const result = await site.builder.applyChange(logoPath)

        expect(result.changedAssets).toBe(1)
        expect(
          await site.builder.renderIfDirtyByOutPath(site.indexOutPath),
        ).toBe(false)
      })
    })

    it('keeps other pages clean when an edit keeps the same pages', async () => {
      await withTempDir(async (base) => {
        const site = await createLinkSite(base, 'none', {
          'index.mdx': '[Guide](./guide)',
          'guide.mdx': '# Guide',
        })

        const guidePath = path.join(site.contentDir, 'guide.mdx')
        await fs.writeFile(guidePath, '# Guide, edited', 'utf8')
        const result = await site.builder.applyChange(guidePath)

        expect(result.changedPages).toBe(1)
        expect(
          await site.builder.renderIfDirtyByOutPath(site.indexOutPath),
        ).toBe(false)
      })
    })
  })

  describe('shared partials and navigation', () => {
    it.each(['auto', 'none'] as const)(
      'marks only the pages under an edited folder header (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          const site = await createSite(base, mode, {
            'index.mdx': '# Home',
            'guides/header.mdx': '<p>Guides header v1</p>',
            'guides/a.mdx': '# A',
            'guides/deep/header.mdx': '<p>Deep header</p>',
            'guides/deep/b.mdx': '# B',
            'components/c.mdx': '# C',
          })

          const result = await site.change(
            'guides/header.mdx',
            '<p>Guides header v2</p>',
          )

          expect(result.fullRebuild).toBe(false)
          expect(result.changedPages).toBe(0)
          expect(result.markedPages).toBe(1)
          expect(await site.renderIfDirty('/guides/a/')).toBe(true)
          expect(await site.read('/guides/a/')).toContain('Guides header v2')
          expect(await site.renderIfDirty('/guides/deep/b/')).toBe(false)
          expect(await site.renderIfDirty('/components/c/')).toBe(false)
          expect(await site.renderIfDirty('/')).toBe(false)
        })
      },
    )

    it('marks the pages that gain or lose a folder header', async () => {
      await withTempDir(async (base) => {
        const site = await createSite(base, 'none', {
          'header.mdx': '<p>Root header</p>',
          'index.mdx': '# Home',
          'guides/a.mdx': '# A',
          'components/c.mdx': '# C',
        })

        const added = await site.change(
          'components/header.mdx',
          '<p>Components header</p>',
        )
        expect(added.markedPages).toBe(1)
        expect(await site.renderIfDirty('/components/c/')).toBe(true)
        expect(await site.read('/components/c/')).toContain('Components header')
        expect(await site.renderIfDirty('/guides/a/')).toBe(false)

        const removed = await site.remove('components/header.mdx')
        expect(removed.markedPages).toBe(1)
        expect(await site.renderIfDirty('/components/c/')).toBe(true)
        expect(await site.read('/components/c/')).toContain('Root header')
        expect(await site.renderIfDirty('/')).toBe(false)
      })
    })

    it('marks every page when the root footer changes', async () => {
      await withTempDir(async (base) => {
        const site = await createSite(base, 'none', {
          'footer.mdx': '<p>Footer v1</p>',
          'index.mdx': '# Home',
          'guides/a.mdx': '# A',
        })

        const result = await site.change('footer.mdx', '<p>Footer v2</p>')

        expect(result.fullRebuild).toBe(false)
        expect(result.markedPages).toBe(2)
        expect(await site.renderIfDirty('/')).toBe(true)
        expect(await site.renderIfDirty('/guides/a/')).toBe(true)
        expect(await site.read('/guides/a/')).toContain('Footer v2')
      })
    })

    it('marks other pages only when an edit changes navigation', async () => {
      await withTempDir(async (base) => {
        const site = await createSite(base, 'auto', {
          'index.mdx': '# Home',
          'a.mdx': ['---', 'title: A', '---', 'First draft.'].join('\n'),
          'b.mdx': '# B',
        })

        const bodyEdit = await site.change(
          'a.mdx',
          ['---', 'title: A', '---', 'Second draft.'].join('\n'),
        )
        expect(bodyEdit.changedPages).toBe(1)
        expect(bodyEdit.markedPages).toBe(0)
        expect(await site.renderIfDirty('/b/')).toBe(false)

        const titleEdit = await site.change(
          'a.mdx',
          ['---', 'title: Alpha', '---', 'Second draft.'].join('\n'),
        )
        expect(titleEdit.changedPages).toBe(1)
        expect(titleEdit.markedPages).toBeGreaterThan(0)
        expect(await site.renderIfDirty('/b/')).toBe(true)
        expect(await site.read('/b/')).toContain('Alpha')
      })
    })

    it('marks pages after a nav file edit only when navigation changes', async () => {
      await withTempDir(async (base) => {
        const site = await createSite(base, 'hybrid', {
          'index.mdx': '# Home',
          'a.mdx': '# A',
          'b.mdx': '# B',
          '_nav.json': '{"sequence":["a.mdx","b.mdx"]}',
        })

        const formatting = await site.change(
          '_nav.json',
          '{ "sequence": [ "a.mdx", "b.mdx" ] }\n',
        )
        expect(formatting.changedPages).toBe(0)
        expect(formatting.markedPages).toBe(0)

        const reorder = await site.change(
          '_nav.json',
          '{"sequence":["b.mdx","a.mdx"]}',
        )
        expect(reorder.changedPages).toBe(0)
        expect(reorder.markedPages).toBeGreaterThan(0)
        expect(await site.renderIfDirty('/a/')).toBe(true)
      })
    })
  })

  describe('page hooks', () => {
    function recordPageHooks() {
      const calls: string[] = []
      const record = (name: string, relPath: string) => {
        calls.push(`${name}:${relPath.replaceAll('\\', '/')}`)
      }
      const hooks: BuildHooks = {
        onPageStart: (_context, file) => record('start', file.relPath),
        onPageDocument: (_context, page) =>
          record('document', page.file.relPath),
        onPageRendered: (_context, page) => {
          record('rendered', page.file.relPath)
          page.html = page.html.replace('</body>', '<!-- hooked --></body>')
        },
        onPageWritten: (_context, page) => record('written', page.file.relPath),
      }
      return { calls, hooks }
    }

    it('runs the page hooks for every render, not only full builds', async () => {
      await withTempDir(async (base) => {
        const { calls, hooks } = recordPageHooks()
        const site = await createSite(
          base,
          'none',
          {
            'header.mdx': '<p>Header v1</p>',
            'index.mdx': '# Home',
            'guides/a.mdx': '# A',
          },
          [{ name: 'test', hooks }],
        )
        expect(calls).toEqual(
          expect.arrayContaining([
            'start:index.mdx',
            'document:index.mdx',
            'rendered:index.mdx',
            'written:index.mdx',
            'start:guides/a.mdx',
            'document:guides/a.mdx',
            'rendered:guides/a.mdx',
            'written:guides/a.mdx',
          ]),
        )

        calls.length = 0
        await site.change('guides/a.mdx', '# A, edited')
        expect(calls).toEqual([
          'start:guides/a.mdx',
          'document:guides/a.mdx',
          'rendered:guides/a.mdx',
          'written:guides/a.mdx',
        ])
        expect(await site.read('/guides/a/')).toContain('<!-- hooked -->')

        calls.length = 0
        await site.change('header.mdx', '<p>Header v2</p>')
        expect(calls).toEqual([])
        expect(await site.renderIfDirty('/')).toBe(true)
        expect(calls).toEqual([
          'start:index.mdx',
          'document:index.mdx',
          'rendered:index.mdx',
          'written:index.mdx',
        ])
        const html = await site.read('/')
        expect(html).toContain('Header v2')
        expect(html).toContain('<!-- hooked -->')
      })
    })

    it('lets onPageDocument await and change the document, resolving the links it adds', async () => {
      await withTempDir(async (base) => {
        const site = await createSite(
          base,
          'none',
          { 'index.mdx': '# Home', 'guides/a.mdx': '# A' },
          [
            {
              name: 'test',
              hooks: {
                async onPageDocument(
                  _context,
                  { document, file, frontmatter },
                ) {
                  await new Promise((resolve) => setTimeout(resolve, 5))
                  if (file.relPath !== 'index.mdx') return
                  const link = document.createElement('a')
                  link.setAttribute('href', './guides/a')
                  link.textContent = `After ${frontmatter.title}`
                  document.body.appendChild(link)
                },
              },
            },
          ],
        )

        expect(await site.read('/')).toContain(
          '<a href="/guides/a/">After Home</a>',
        )
      })
    })

    it('keeps each page on its own document while renders overlap', async () => {
      await withTempDir(async (base) => {
        const delays: Record<string, number> = { '/': 30, '/guides/a/': 1 }
        const site = await createSite(
          base,
          'none',
          {
            'header.mdx': '<p>Header v1</p>',
            'index.mdx': '# Home',
            'guides/a.mdx': '# A',
          },
          [
            {
              name: 'test',
              hooks: {
                async onPageDocument(_context, { urlPath }) {
                  await new Promise((resolve) =>
                    setTimeout(resolve, delays[urlPath]),
                  )
                  // The global document, as code a plugin calls would use it.
                  const marker = globalThis.document.createElement('meta')
                  marker.setAttribute('name', `page:${urlPath}`)
                  globalThis.document.head.appendChild(marker)
                },
              },
            },
          ],
        )

        await site.change('header.mdx', '<p>Header v2</p>')
        await Promise.all([
          site.renderIfDirty('/'),
          site.renderIfDirty('/guides/a/'),
        ])

        const home = await site.read('/')
        const guide = await site.read('/guides/a/')
        expect(home).toContain('Header v2')
        expect(home).toContain('<meta name="page:/">')
        expect(home).not.toContain('page:/guides/a/')
        expect(guide).toContain('<meta name="page:/guides/a/">')
        expect(guide).not.toContain('<meta name="page:/">')
      })
    })

    it('writes an error page when a page hook fails during a re-render', async () => {
      await withTempDir(async (base) => {
        let failing = false
        const site = await createSite(base, 'none', { 'index.mdx': '# Home' }, [
          {
            name: 'test',
            hooks: {
              onPageRendered: () => {
                if (failing) throw new Error('Hook failed on purpose.')
              },
            },
          },
        ])

        failing = true
        await site.change('index.mdx', '# Home, edited')

        expect(await site.read('/')).toContain(
          'Plugin &quot;test&quot; failed in onPageRendered: Hook failed on purpose.',
        )
      })
    })
  })

  describe('code imports', () => {
    const text = (html: string) => html.replace(/<[^>]+>/g, '')

    it.each(['auto', 'none'] as const)(
      'shows an imported file as code and renders its pages again when it changes (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          const site = await createSite(base, mode, {
            'index.mdx':
              '<div class="demo">\n  <import-codeblock src="./demo.ts"/>\n</div>',
            'demo.ts': 'export const answer = 1',
          })
          expect(text(await site.read('/'))).toContain(
            'export const answer = 1',
          )

          const result = await site.change('demo.ts', 'export const answer = 2')

          expect(result.markedPages).toBeGreaterThan(0)
          expect(await site.renderIfDirty('/')).toBe(true)
          expect(text(await site.read('/'))).toContain(
            'export const answer = 2',
          )
        })
      },
    )

    it('renders a page again once the file it imports exists', async () => {
      await withTempDir(async (base) => {
        const site = await createSite(base, 'none', {
          'index.mdx': '<import-codeblock src="./later.ts"/>',
        })
        expect(await site.read('/')).toContain(
          'Code block import &quot;./later.ts&quot; in &quot;index.mdx&quot; does not match any file.',
        )

        const result = await site.change('later.ts', 'const later = true')

        expect(result.markedPages).toBeGreaterThan(0)
        expect(await site.renderIfDirty('/')).toBe(true)
        expect(text(await site.read('/'))).toContain('const later = true')
      })
    })

    it('refreshes the headers that import a changed file', async () => {
      await withTempDir(async (base) => {
        const site = await createSite(base, 'none', {
          'header.mdx': '<import-codeblock src="./snippet.ts"/>',
          'index.mdx': '# Home',
          'snippet.ts': 'const version = 1',
        })
        expect(text(await site.read('/'))).toContain('const version = 1')

        await site.change('snippet.ts', 'const version = 2')

        expect(await site.renderIfDirty('/')).toBe(true)
        expect(text(await site.read('/'))).toContain('const version = 2')
      })
    })

    it.each(['auto', 'none'] as const)(
      'shows shared content, which never becomes a page, and renders its pages again when it changes (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          const site = await createSite(base, mode, {
            'index.mdx': '# Home\n\n<import-content src="./_shared/note.mdx"/>',
            '_shared/note.mdx': 'Shared note, version 1.',
            '_intro.mdx': 'An unused shared file.',
          })
          expect(text(await site.read('/'))).toContain(
            'Shared note, version 1.',
          )
          expect(await fileExists(site.outPath('/_shared/note/'))).toBe(false)
          expect(await fileExists(site.outPath('/_intro/'))).toBe(false)

          const result = await site.change(
            '_shared/note.mdx',
            'Shared note, version 2.',
          )

          expect(result.markedPages).toBeGreaterThan(0)
          expect(result.changedPages).toBe(0)
          expect(await site.renderIfDirty('/')).toBe(true)
          expect(text(await site.read('/'))).toContain(
            'Shared note, version 2.',
          )
          expect(await fileExists(site.outPath('/_shared/note/'))).toBe(false)
          const manifest = await readManifest(path.join(base, 'out'))
          expect(
            Object.keys(manifest?.content ?? {}).some((relPath) =>
              relPath.includes('_'),
            ),
          ).toBe(false)
        })
      },
    )
  })

  describe('generated pages', () => {
    /** One page per tag in the posts' frontmatter, listing their titles. */
    const tagPages: PureStackPlugin = {
      name: 'tags',
      async pages({ files }) {
        const titlesByTag = new Map<string, string[]>()
        for (const file of files) {
          const source = await fs.readFile(file.absPath, 'utf8')
          const { frontmatter } = parseFrontmatterSource(source, file.relPath)
          for (const tag of (frontmatter.tags as string[] | undefined) ?? []) {
            const titles = titlesByTag.get(tag) ?? []
            titlesByTag.set(tag, [...titles, String(frontmatter.title)])
          }
        }
        return [...titlesByTag].map(([tag, titles]) => ({
          path: `tags/${tag}.mdx`,
          source: titles.map((title) => `- ${title}`).join('\n'),
        }))
      },
    }
    const post = (title: string, tags: string[]) =>
      [
        '---',
        `title: ${title}`,
        `tags: [${tags.join(', ')}]`,
        '---',
        title,
      ].join('\n')

    it.each(['auto', 'none'] as const)(
      'regenerates a page when the content it reads changes (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          const site = await createSite(
            base,
            mode,
            {
              'index.mdx': '# Home',
              'post.mdx': post('First post', ['regor']),
            },
            [tagPages],
          )
          expect(await site.read('/tags/regor/')).toContain('First post')

          const result = await site.change(
            'post.mdx',
            post('Renamed post', ['regor']),
          )

          expect(result.markedPages).toBeGreaterThan(0)
          expect(await site.renderIfDirty('/tags/regor/')).toBe(true)
          expect(await site.read('/tags/regor/')).toContain('Renamed post')
        })
      },
    )

    it.each(['auto', 'none'] as const)(
      'reads a source function again for each render after a regeneration (navigation %s)',
      async (mode) => {
        await withTempDir(async (base) => {
          let version = 'v1'
          const site = await createSite(base, mode, { 'index.mdx': '# Home' }, [
            {
              name: 'status',
              pages: () => [
                { path: 'status.mdx', source: () => `# Status ${version}` },
              ],
            },
          ])
          expect(await site.read('/status/')).toContain('Status v1')

          // The plugin's data changes; any content change regenerates pages.
          version = 'v2'
          await site.change('index.mdx', '# Home, edited')

          expect(await site.renderIfDirty('/status/')).toBe(true)
          expect(await site.read('/status/')).toContain('Status v2')
        })
      },
    )

    it('prepares content once when a request arrives during a build', async () => {
      await withTempDir(async (base) => {
        const contentDir = path.join(base, 'content')
        await fs.mkdir(contentDir, { recursive: true })
        await fs.writeFile(path.join(contentDir, 'index.mdx'), '# Home')
        let generations = 0
        const builder = await createIncrementalBuilder({
          siteConfig: {
            rootDir: base,
            contentDir,
            outDir: path.join(base, 'out'),
          },
          options: {
            plugins: [
              {
                name: 'status',
                pages: () => {
                  generations += 1
                  return [{ path: 'status.mdx', source: '# Status' }]
                },
              },
            ],
          },
        })
        expect(generations).toBe(0)

        await Promise.all([
          builder.buildAll('initial'),
          builder.renderByUrlPath('/status/'),
        ])

        expect(generations).toBe(1)
      })
    })

    it('removes the output of a page that is no longer generated', async () => {
      await withTempDir(async (base) => {
        const site = await createSite(
          base,
          'none',
          { 'index.mdx': '# Home', 'post.mdx': post('First post', ['regor']) },
          [tagPages],
        )
        const tagOutPath = site.outPath('/tags/regor/')
        expect(await fileExists(tagOutPath)).toBe(true)

        await site.change('post.mdx', post('First post', []))

        expect(await fileExists(tagOutPath)).toBe(false)
        const manifest = await readManifest(path.join(base, 'out'))
        expect(
          manifest?.content[path.join('tags', 'regor.mdx')],
        ).toBeUndefined()
      })
    })

    it('renders a newly generated page on its first request', async () => {
      await withTempDir(async (base) => {
        const site = await createSite(
          base,
          'none',
          { 'index.mdx': '# Home', 'post.mdx': post('First post', ['regor']) },
          [tagPages],
        )

        await site.change('post.mdx', post('First post', ['regor', 'css']))

        expect(await site.builder.renderByUrlPath('/tags/css/')).toBe(true)
        expect(await site.read('/tags/css/')).toContain('First post')
      })
    })

    it('regenerates pages when a data file they read changes', async () => {
      await withTempDir(async (base) => {
        const menu: PureStackPlugin = {
          name: 'menu',
          async pages({ config }) {
            const data = await fs.readFile(
              path.join(config.contentDir, 'data', 'menu.json'),
              'utf8',
            )
            const items = JSON.parse(data) as string[]
            return [
              {
                path: 'menu.mdx',
                source: items.map((i) => `- ${i}`).join('\n'),
              },
            ]
          },
        }
        const site = await createSite(
          base,
          'none',
          { 'index.mdx': '# Home', 'data/menu.json': '["Soup"]' },
          [menu],
        )
        expect(await site.read('/menu/')).toContain('Soup')

        await site.change('data/menu.json', '["Soup", "Salad"]')

        expect(await site.renderIfDirty('/menu/')).toBe(true)
        expect(await site.read('/menu/')).toContain('Salad')
      })
    })
  })
})
