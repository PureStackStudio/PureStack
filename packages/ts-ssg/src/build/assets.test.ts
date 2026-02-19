import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  type CopyStaticAssetsResult,
  copyStaticAssets,
  resolveStaticOutPath,
} from './assets'

async function writeFile(filePath: string, contents: string) {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, contents, 'utf8')
}

function hasAsset(
  result: CopyStaticAssetsResult,
  relPath: string,
  ext: string,
): boolean {
  return result.files.some(
    (file) => file.relPath === relPath && file.ext === ext,
  )
}

describe('static assets', () => {
  let logger: Logger | undefined

  beforeAll(async () => {
    disableLogger()
    logger = getLogger()
  })

  afterAll(async () => {
    await logger?.close()
  })

  it('resolves .ts assets to .js output paths', () => {
    const outDir = '/tmp/out'
    const tsOut = resolveStaticOutPath(outDir, {
      absPath: '/tmp/content/login.ts',
      relPath: 'login.ts',
      ext: '.ts',
    })
    const txtOut = resolveStaticOutPath(outDir, {
      absPath: '/tmp/content/notes.txt',
      relPath: 'notes.txt',
      ext: '.txt',
    })

    expect(tsOut).toBe(path.join(outDir, 'login', 'login.js'))
    expect(txtOut).toBe(path.join(outDir, 'notes.txt'))
  })

  it('compiles .ts assets to .js and copies non-ts assets', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-assets-'))
    const outDir = path.join(root, 'dist')
    try {
      await writeFile(
        path.join(root, 'login.ts'),
        'const x: number = 7\nconsole.log(x)',
      )
      await writeFile(path.join(root, 'notes.txt'), 'hello')

      const result = await copyStaticAssets(root, outDir)

      expect(result.assets).toBe(2)
      expect(hasAsset(result, 'login.ts', '.ts')).toBe(true)
      expect(hasAsset(result, 'notes.txt', '.txt')).toBe(true)

      const jsPath = path.join(outDir, 'login', 'login.js')
      const txtPath = path.join(outDir, 'notes.txt')

      await expect(fs.stat(jsPath)).resolves.toBeTruthy()
      await expect(fs.stat(txtPath)).resolves.toBeTruthy()
      await expect(fs.stat(path.join(outDir, 'login.ts'))).rejects.toBeTruthy()

      const jsOutput = await fs.readFile(jsPath, 'utf8')
      const txtOutput = await fs.readFile(txtPath, 'utf8')
      expect(jsOutput).toContain('console.log')
      expect(txtOutput).toBe('hello')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})
