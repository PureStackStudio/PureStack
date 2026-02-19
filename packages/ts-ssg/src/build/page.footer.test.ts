import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../config/config'
import type { ContentFile } from '../discover/content'
import { renderPageFromFile, resolveFooterHtmlByDirectory } from './page'

async function writeFile(filePath: string, contents = '') {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents)
}

describe('footer hierarchy', () => {
  let logger: Logger | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('uses nearest footer.mdx from page folder ancestry', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'footer.mdx'),
        '<site-footer><p>Root Footer</p></site-footer>',
      )
      await writeFile(
        path.join(contentDir, 'guide', 'footer.mdx'),
        '<site-footer><p>Guide Footer</p></site-footer>',
      )
      await writeFile(path.join(contentDir, 'index.mdx'), '# Home')
      await writeFile(path.join(contentDir, 'guide', 'index.mdx'), '# Guide')
      await writeFile(
        path.join(contentDir, 'guide', 'sub', 'page.mdx'),
        '# Sub',
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
      })
      const footerHtmlByDir = await resolveFooterHtmlByDirectory(
        config,
        undefined,
      )

      const rootPage = await renderPageFromFile(
        {
          config,
          footerHtmlByDir,
        },
        toContentFile(contentDir, 'index.mdx'),
      )
      expect(rootPage.html).toContain('Root Footer')

      const guidePage = await renderPageFromFile(
        {
          config,
          footerHtmlByDir,
        },
        toContentFile(contentDir, path.join('guide', 'index.mdx')),
      )
      expect(guidePage.html).toContain('Guide Footer')

      const guideSubPage = await renderPageFromFile(
        {
          config,
          footerHtmlByDir,
        },
        toContentFile(contentDir, path.join('guide', 'sub', 'page.mdx')),
      )
      expect(guideSubPage.html).toContain('Guide Footer')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})

function toContentFile(contentDir: string, relPath: string): ContentFile {
  return {
    absPath: path.join(contentDir, relPath),
    relPath,
    ext: path.extname(relPath),
  }
}
