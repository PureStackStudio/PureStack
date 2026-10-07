import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { expandImports } from '../packages/ts-ssg/src/mdx/imports'
import { ensureLegalContent } from './ensureLegalContent'

async function withContentDir(run: (directory: string) => Promise<void>) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'purestack-legal-'))
  try {
    await run(directory)
  } finally {
    await fs.rm(directory, { recursive: true, force: true })
  }
}

describe('private legal content', () => {
  it('creates importable placeholders when files are missing', async () => {
    await withContentDir(async (contentDir) => {
      await ensureLegalContent(contentDir)
      for (const page of ['imprint', 'privacy']) {
        const content = await expandImports(
          `<import-content src="./_private/${page}.mdx"/>`,
          { contentDir, sourceRelPath: `legal/${page}.mdx` },
        )
        expect(content).toContain('Content required.')
        expect(content).toContain(`legal/_private/${page}.mdx`)
        expect(content).toContain('<h1')
        expect(content).not.toContain('Legal basis:')
      }
    })
  })

  it.each(['', '<p>Existing private legal content.</p>'])(
    'preserves an existing file and creates only the missing file (%j)',
    async (content) => {
      await withContentDir(async (contentDir) => {
        const directory = path.join(contentDir, 'legal', '_private')
        await fs.mkdir(directory, { recursive: true })
        const filePath = path.join(directory, 'imprint.mdx')
        await fs.writeFile(filePath, content)
        await ensureLegalContent(contentDir)
        await ensureLegalContent(contentDir)
        expect(await fs.readFile(filePath, 'utf8')).toBe(content)
        expect(
          await fs.readFile(path.join(directory, 'privacy.mdx'), 'utf8'),
        ).toContain('Content required.')
      })
    },
  )

  it('safely handles concurrent initialization', async () => {
    await withContentDir(async (contentDir) => {
      await Promise.all([
        ensureLegalContent(contentDir),
        ensureLegalContent(contentDir),
      ])
      expect(
        await fs.readdir(path.join(contentDir, 'legal', '_private')),
      ).toEqual(['imprint.mdx', 'privacy.mdx'])
    })
  })
})
