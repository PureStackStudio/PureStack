import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import type { ContentFile } from '../discover/content'
import { renderPageFromFile } from './page'

async function writeFile(filePath: string, contents = '') {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents)
}

describe('page content compilation', () => {
  let logger: Logger | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('compiles markdown pages through the MDX content pipeline', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.md'),
        ['# Home', '', '<Badge tone="accent" />'].join('\n'),
      )

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        { config },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.bodyHtml).toContain('<Badge tone="accent" />')
      expect(page.bodyHtml).not.toContain(
        '&#x3C;Badge tone="accent" />',
      )
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('keeps the markdown compiler route when compileMdAsMdx is false', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.md'),
        ['# Home', '', '<Badge tone="accent" />'].join('\n'),
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
        mdx: {
          compileMdAsMdx: false,
        },
      })
      const page = await renderPageFromFile(
        { config },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.bodyHtml).toContain('&#x3C;Badge tone="accent" />')
      expect(page.bodyHtml).not.toContain('<Badge tone="accent" />')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('uses pageToc.enabled as the default toc behavior', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-page-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.md'),
        ['# Home', '', '## Section'].join('\n'),
      )

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        { config },
        toContentFile(contentDir, 'index.md'),
      )

      expect(page.frontmatter.layout.showToc).toBe(true)
      expect(page.html).toContain('class="doc-toc"')
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
