import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../config/config'
import {
  type ResolvedContentFile,
  resolvePlainContentFile,
} from '../i18n/content'
import { initBuiltinComponents } from '../regor/initBuiltinComponents'
import {
  renderPageFromFile,
  resolveFooterHtmlByDirectory,
  resolveHeaderHtmlByDirectory,
} from './page'

async function writeFile(filePath: string, contents = '') {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents)
}

describe('footer hierarchy', () => {
  let logger: Logger | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
    initBuiltinComponents()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('uses nearest Regor MDX footer from page folder ancestry', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'footer.mdx'),
        '<site-footer><p>Root Footer</p></site-footer>',
      )
      await writeFile(
        path.join(contentDir, 'guide', 'footer.rmdx'),
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

  it('resolves header PageScript sources relative to the Regor MDX header file', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'header.rmdx'),
        '<PageScript src="./auth-state.ts" teleport="head" />',
      )
      await writeFile(path.join(contentDir, 'auth-state.ts'), 'export {}')
      await writeFile(
        path.join(contentDir, 'account', 'settings.mdx'),
        '# Settings',
      )

      const config = resolveSiteConfig({
        rootDir: root,
        contentDir,
        outDir,
      })
      const headerHtmlByDir = await resolveHeaderHtmlByDirectory(
        config,
        undefined,
      )

      const page = await renderPageFromFile(
        {
          config,
          headerHtmlByDir,
          resolveScriptPublicPath: () => '/auth-state.m4x9p2.js',
        },
        toContentFile(contentDir, path.join('account', 'settings.mdx')),
      )

      expect(page.html).toContain('src="/auth-state.m4x9p2.js"')
      expect(page.html).not.toContain('/account/auth-state.js')
      expect(page.scriptEntrypoints).toEqual(['auth-state.ts'])
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})

function toContentFile(
  contentDir: string,
  relPath: string,
): ResolvedContentFile {
  return resolvePlainContentFile({
    absPath: path.join(contentDir, relPath),
    relPath,
    ext: path.extname(relPath),
  })
}
