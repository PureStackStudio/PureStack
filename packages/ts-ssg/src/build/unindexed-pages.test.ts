import fs from 'node:fs/promises'
import path from 'node:path'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { makeRepoTempDir } from '../test/repoTempDir'
import { createIncrementalBuilder } from './incremental'
import { readManifest } from './manifest'
import type { BuildInput } from './site'

describe('index: false', () => {
  let logger: Logger | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('keeps a page out of navigation, search, and the sitemap, while still building it', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-unindexed-')
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.writeFile(path.join(contentDir, 'index.mdx'), '# Home')
      await fs.writeFile(path.join(contentDir, 'guide.mdx'), '# Guide')
      await fs.writeFile(
        path.join(contentDir, 'preview.mdx'),
        '---\nindex: false\nhead:\n  robots: index\n---\n# Preview',
      )
      const options: BuildInput = {
        siteConfig: {
          rootDir: root,
          contentDir,
          outDir,
          navigation: { mode: 'auto' },
          sitemap: { enabled: true, baseUrl: 'https://example.com' },
          pagefind: { enabled: true },
        },
        options: {
          plugins: [
            {
              name: 'previews',
              pages: () => [
                {
                  path: 'generated-preview.mdx',
                  source: '---\nindex: false\n---\n# Generated preview',
                },
              ],
            },
          ],
        },
      }
      const builder = await createIncrementalBuilder(options)
      await builder.buildAll('initial')

      const read = (...parts: string[]) =>
        fs.readFile(path.join(outDir, ...parts), 'utf8')
      const preview = await read('preview', 'index.html')
      expect(preview).toContain('<meta name="robots" content="noindex">')
      expect(preview).toContain('Preview')
      const home = await read('index.html')
      expect(home).toContain('/guide/')
      expect(home).not.toContain('/preview/')
      const sitemap = await read('sitemap.xml')
      expect(sitemap).toContain('https://example.com/guide/')
      expect(sitemap).not.toContain('/preview/')
      expect(sitemap).not.toContain('/generated-preview/')
      expect(await read('generated-preview', 'index.html')).toContain(
        '<meta name="robots" content="noindex">',
      )
      const search = JSON.parse(await read('pagefind', 'pagefind-entry.json'))
      expect(
        Object.values(
          search.languages as Record<string, { page_count: number }>,
        ).reduce((count, language) => count + language.page_count, 0),
      ).toBe(2)
      expect((await readManifest(outDir))?.content['preview.mdx']?.index).toBe(
        false,
      )

      // Restarting from a manifest retains the exclusion when a page is rendered.
      const resumed = await createIncrementalBuilder(options)
      await resumed.renderByUrlPath('/preview/')
      expect((await readManifest(outDir))?.content['preview.mdx']?.index).toBe(
        false,
      )

      // While serve runs, the flag follows the page's frontmatter.
      await resumed.applyChange(
        await writeAndReturn(path.join(contentDir, 'preview.mdx'), '# Preview'),
      )
      expect(
        (await readManifest(outDir))?.content['preview.mdx']?.index,
      ).toBeUndefined()
      expect(await read('sitemap.xml')).toContain(
        'https://example.com/preview/',
      )
      await resumed.buildAll('reindex')
      const updatedSearch = JSON.parse(
        await read('pagefind', 'pagefind-entry.json'),
      )
      expect(
        Object.values(
          updatedSearch.languages as Record<string, { page_count: number }>,
        ).reduce((count, language) => count + language.page_count, 0),
      ).toBe(3)
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})

async function writeAndReturn(filePath: string, contents: string) {
  await fs.writeFile(filePath, contents)
  return filePath
}
