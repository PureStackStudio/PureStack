import fs from 'node:fs/promises'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../../config/config'
import { makeRepoTempDir } from '../../test/repoTempDir'
import { createEmptyManifest, readManifest, writeManifest } from '../manifest'
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
      options: { writeErrorPages: true },
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
})
