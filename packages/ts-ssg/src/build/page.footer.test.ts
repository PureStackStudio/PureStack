import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import type { SiteConfig } from '@purestack/ts-common'
import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { resolveSiteConfig } from '../config/config'
import { discoverContent } from '../discover/content'
import {
  type ResolvedContentFile,
  resolveContentFiles,
  resolvePlainContentFile,
} from '../i18n/content'
import { initBuiltinComponents } from '../regor/initBuiltinComponents'
import { ContentRouteIndex } from './content-hrefs'
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
      const contentRoutes = await indexContent(config)
      const footerHtmlByDir = await resolveFooterHtmlByDirectory({ config })

      const rootPage = await renderPageFromFile(
        {
          config,
          contentRoutes,
          footerHtmlByDir,
        },
        toContentFile(contentDir, 'index.mdx'),
      )
      expect(rootPage.html).toContain('Root Footer')

      const guidePage = await renderPageFromFile(
        {
          config,
          contentRoutes,
          footerHtmlByDir,
        },
        toContentFile(contentDir, path.join('guide', 'index.mdx')),
      )
      expect(guidePage.html).toContain('Guide Footer')

      const guideSubPage = await renderPageFromFile(
        {
          config,
          contentRoutes,
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
      const contentRoutes = await indexContent(config)
      const headerHtmlByDir = await resolveHeaderHtmlByDirectory({ config })

      const page = await renderPageFromFile(
        {
          config,
          contentRoutes,
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

  it('resolves header links relative to the header file, not the page', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'guides', 'header.mdx'),
        '<nav><a href="./themes">Themes</a><a href="../">Home</a></nav>',
      )
      await writeFile(path.join(contentDir, 'index.mdx'), '# Home')
      await writeFile(path.join(contentDir, 'guides', 'themes.mdx'), '# Themes')
      await writeFile(
        path.join(contentDir, 'guides', 'deep', 'page.mdx'),
        '# Deep',
      )

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const contentRoutes = await indexContent(config)
      const headerHtmlByDir = await resolveHeaderHtmlByDirectory({ config })
      const page = await renderPageFromFile(
        { config, contentRoutes, headerHtmlByDir },
        toContentFile(contentDir, path.join('guides', 'deep', 'page.mdx')),
      )

      expect(page.html).toContain('href="/guides/themes/"')
      expect(page.html).toContain('href="/"')
      expect(page.html).not.toContain('/guides/deep/themes')
      expect(page.html).not.toContain('purestack-content-source')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('fails pages that show a header link matching no page', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'header.mdx'),
        '<nav><a href="./missing">Missing</a></nav>',
      )
      await writeFile(path.join(contentDir, 'index.mdx'), '# Home')

      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const contentRoutes = await indexContent(config)
      const headerHtmlByDir = await resolveHeaderHtmlByDirectory({ config })
      await expect(
        renderPageFromFile(
          { config, contentRoutes, headerHtmlByDir },
          toContentFile(contentDir, 'index.mdx'),
        ),
      ).rejects.toThrow(
        'Content link "./missing" in "header.mdx" does not match any page.',
      )
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})

async function indexContent(config: SiteConfig) {
  return new ContentRouteIndex(
    resolveContentFiles(config, await discoverContent(config.contentDir)),
  )
}

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
