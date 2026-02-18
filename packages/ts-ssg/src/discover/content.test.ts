import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { discoverContent, discoverStaticAssets } from './content'

async function writeFile(filePath: string, contents = '') {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents)
}

describe('discoverContent + discoverStaticAssets', () => {
  let logger: Logger | undefined

  beforeAll(async () => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('separates markdown content from static assets', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-'))
    try {
      await writeFile(path.join(root, 'index.mdx'), '# Home')
      await writeFile(path.join(root, 'footer.mdx'), '<SiteFooter />')
      await writeFile(path.join(root, 'guide', 'overview.md'), '# Guide')
      await writeFile(path.join(root, 'assets', 'logo.png'), 'png')
      await writeFile(path.join(root, 'siteConfig.json'), '{}')
      await writeFile(path.join(root, 'notes.txt'), 'notes')
      await writeFile(path.join(root, 'README'), 'readme')

      const content = await discoverContent(root)
      const assets = await discoverStaticAssets(root)

      const contentRel = content.map((file) => file.relPath)
      expect(contentRel).toEqual([
        path.join('guide', 'overview.md'),
        'index.mdx',
      ])

      const assetRel = assets.map((file) => file.relPath)
      const expectedAssets = [
        path.join('assets', 'logo.png'),
        'README',
        'notes.txt',
      ].sort((a, b) => a.localeCompare(b))
      expect(assetRel).toEqual(expectedAssets)
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})
