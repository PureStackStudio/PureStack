import fs from 'node:fs/promises'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../config/config'
import { createEmptyManifest, readManifest, writeManifest } from '../manifest'
import { createIncrementalBuilder } from './index'

async function withTempDir<T>(worker: (dir: string) => Promise<T>) {
  const base = await fs.mkdtemp(path.join(process.cwd(), '.tmp-ts-ssg-'))
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
})
