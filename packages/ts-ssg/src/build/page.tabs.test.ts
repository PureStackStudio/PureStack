import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import {
  defineIconComponents,
  defineTabsComponents,
} from '@purestack/ts-components'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { disableLogger, getLogger, type Logger } from 'logpot'
import type { Component } from 'regor'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import type { ContentFile } from '../discover/content'
import { renderPageFromFile } from './page'

async function writeFile(filePath: string, contents = '') {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents)
}

describe('tabs runtime embedding', () => {
  let logger: Logger | undefined

  beforeAll(() => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('injects tabs runtime at bottom when Tabs component is rendered', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-tabs-'))
    const cleanupDom = ensureDomGlobals()
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.mdx'),
        `<Tabs id="demo">
  <TabPane id="a" label="A">A</TabPane>
  <TabPane id="b" label="B">B</TabPane>
</Tabs>`,
      )
      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        {
          config,
          components: {
            ...defineIconComponents(getSvgIcon),
            ...defineTabsComponents(),
          } as unknown as Record<string, Component>,
        },
        toContentFile(contentDir, 'index.mdx'),
      )

      expect(page.html).toContain('class="tabs')
      expect(page.html).toContain('tabs__overflow-toggle')
      const tabsScriptIndex = page.html.indexOf('tabs__overflow-toggle')
      const bodyCloseIndex = page.html.lastIndexOf('</body>')
      expect(tabsScriptIndex).toBeGreaterThan(0)
      expect(tabsScriptIndex).toBeLessThan(bodyCloseIndex)
    } finally {
      cleanupDom()
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('injects tabs runtime at bottom when frontmatter embed.tabs is body', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-tabs-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.mdx'),
        `---
embed:
  tabs: body
---

# Hello
`,
      )
      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        {
          config,
        },
        toContentFile(contentDir, 'index.mdx'),
      )

      expect(page.html).toContain('tabs__overflow-toggle')
      const tabsScriptIndex = page.html.indexOf('tabs__overflow-toggle')
      const bodyCloseIndex = page.html.lastIndexOf('</body>')
      expect(tabsScriptIndex).toBeGreaterThan(0)
      expect(tabsScriptIndex).toBeLessThan(bodyCloseIndex)
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('injects tabs runtime into head when frontmatter embed.tabs is head', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-tabs-'))
    try {
      const contentDir = path.join(root, 'content')
      const outDir = path.join(root, 'out')
      await writeFile(
        path.join(contentDir, 'index.mdx'),
        `---
embed:
  tabs: head
---

# Hello
`,
      )
      const config = resolveSiteConfig({ rootDir: root, contentDir, outDir })
      const page = await renderPageFromFile(
        {
          config,
        },
        toContentFile(contentDir, 'index.mdx'),
      )

      expect(page.html).toContain('tabs__overflow-toggle')
      const tabsScriptIndex = page.html.indexOf('tabs__overflow-toggle')
      const headCloseIndex = page.html.indexOf('</head>')
      const bodyOpenIndex = page.html.indexOf('<body')
      expect(tabsScriptIndex).toBeGreaterThan(0)
      expect(tabsScriptIndex).toBeLessThan(headCloseIndex)
      expect(tabsScriptIndex).toBeLessThan(bodyOpenIndex)
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
