import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../../config/config'
import { createEmptyManifest, readManifest, writeManifest } from '../manifest'
import { createIncrementalBuilder } from './index'

async function withTempDir<T>(worker: (dir: string) => Promise<T>) {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-'))
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
          href: '/site.css',
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
            href: '/site.css',
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
            href: '/site.css',
          },
          mdx: {
            highlighter: 'highlightjs',
          },
        },
      })

      await builder.buildAll('test highlightjs styles')

      const lightCss = await fs.readFile(path.join(outDir, 'site.css'), 'utf8')
      const darkCss = await fs.readFile(
        path.join(outDir, 'site.dark.css'),
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
        path.join(contentDir, 'hosts.ts'),
        "import { message } from './common/message'\nconsole.log(message)\n",
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
            href: '/site.css',
          },
          mdx: {
            disableHighlighter: true,
          },
        },
      })

      await builder.applyChange(path.join(contentDir, 'hosts.mdx'))

      const hostsBundlePath = path.join(outDir, 'hosts', 'hosts.js')
      expect(await fs.readFile(hostsBundlePath, 'utf8')).toContain('before')

      await fs.writeFile(
        path.join(contentDir, 'common', 'message.ts'),
        "export const message = 'after'\n",
        'utf8',
      )
      const result = await builder.applyChange(
        path.join(contentDir, 'common', 'message.ts'),
      )

      expect(result.changedAssets).toBeGreaterThan(0)
      expect(await fs.readFile(hostsBundlePath, 'utf8')).toContain('after')
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
            href: '/site.css',
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
      const bundlePath = path.join(outDir, 'hosts', 'hosts.js')
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
})
