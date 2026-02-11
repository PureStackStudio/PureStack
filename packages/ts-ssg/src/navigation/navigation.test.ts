import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { discoverContent } from '../discover/content'
import { buildNavigation } from './navigation'

async function withTempDir<T>(worker: (dir: string) => Promise<T>) {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-nav-'))
  try {
    return await worker(base)
  } finally {
    await fs.rm(base, { recursive: true, force: true })
  }
}

describe('navigation', () => {
  let logger: Logger | undefined

  beforeAll(async () => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('builds auto navigation with nested folders', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(path.join(contentDir, 'guide'), { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'index.mdx'),
        `---\ntitle: Home\n---\n# Home\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'guide', 'index.mdx'),
        `---\ntitle: Guide\n---\n# Guide\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'guide', 'basics.mdx'),
        `---\ntitle: Basics\norder: 1\n---\n# Basics\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, 'guide', 'advanced.mdx'),
        `---\ntitle: Advanced\norder: 2\n---\n# Advanced\n`,
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, { maxDepth: 2 })
      expect(nav).toBeTruthy()
      const rootItems = nav?.byFolder[''] ?? []
      expect(rootItems.map((item) => item.title)).toEqual(['Home', 'Guide'])
      const guide = rootItems.find((item) => item.title === 'Guide')
      expect(guide?.children?.map((item) => item.title)).toEqual([
        'Basics',
        'Advanced',
      ])
    })
  })

  it('applies custom navigation overrides', async () => {
    await withTempDir(async (base) => {
      const contentDir = path.join(base, 'content')
      await fs.mkdir(contentDir, { recursive: true })
      await fs.writeFile(
        path.join(contentDir, 'index.mdx'),
        `---\ntitle: Home\n---\n# Home\n`,
        'utf8',
      )
      await fs.writeFile(
        path.join(contentDir, '_nav.json'),
        JSON.stringify(
          {
            mode: 'override',
            items: [
              { title: 'Start', url: '/' },
              { title: 'Docs', url: '/guide/' },
            ],
          },
          null,
          2,
        ),
        'utf8',
      )

      const files = await discoverContent(contentDir)
      const nav = await buildNavigation(contentDir, files, { mode: 'hybrid' })
      const rootItems = nav?.byFolder[''] ?? []
      expect(rootItems.map((item) => item.title)).toEqual(['Start', 'Docs'])
    })
  })
})
