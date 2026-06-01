import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import {
  type CopyStaticAssetsResult,
  copyStaticAsset,
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

  it('resolves .ts assets to cache-keyed output paths', () => {
    const outDir = '/tmp/out'
    const tsOut = resolveStaticOutPath(
      outDir,
      {
        absPath: '/tmp/content/login.ts',
        relPath: 'login.ts',
        ext: '.ts',
      },
      { scriptCacheKey: 'm4x9p2' },
    )

    expect(tsOut).toBe(path.join(outDir, 'login', 'login.m4x9p2.js'))
  })

  it('copies non-ts assets and skips .ts files during static discovery', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-assets-'))
    const outDir = path.join(root, 'dist')
    try {
      await writeFile(
        path.join(root, 'login.ts'),
        'const x: number = 7\nconsole.log(x)',
      )
      await writeFile(path.join(root, 'notes.txt'), 'hello')

      const result = await copyStaticAssets(root, outDir)

      expect(result.assets).toBe(1)
      expect(hasAsset(result, 'login.ts', '.ts')).toBe(false)
      expect(hasAsset(result, 'notes.txt', '.txt')).toBe(true)

      const jsPath = path.join(outDir, 'login', 'login.js')
      const txtPath = path.join(outDir, 'notes.txt')

      await expect(fs.stat(jsPath)).rejects.toBeTruthy()
      await expect(fs.stat(txtPath)).resolves.toBeTruthy()
      await expect(fs.stat(path.join(outDir, 'login.ts'))).rejects.toBeTruthy()

      const txtOutput = await fs.readFile(txtPath, 'utf8')
      expect(txtOutput).toBe('hello')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('minifies compiled ts assets when requested', async () => {
    const root = await fs.mkdtemp(
      path.join(process.cwd(), '.tmp-ts-ssg-assets-'),
    )
    const outDir = path.join(root, 'dist')
    try {
      const entryPath = path.join(root, 'login.ts')
      await writeFile(
        entryPath,
        [
          'const message = "hello world"',
          'function greet(value: string) {',
          '  console.log(value)',
          '}',
          'greet(message)',
        ].join('\n'),
      )

      const result = await copyStaticAsset(
        root,
        outDir,
        {
          absPath: entryPath,
          relPath: 'login.ts',
          ext: '.ts',
        },
        { minifyScripts: true },
      )

      const output = await fs.readFile(result.outPath, 'utf8')
      expect(output).not.toContain('function greet')
      expect(output).not.toContain('\n  ')
      expect(output).toContain('console.log')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('removes stale cache-keyed script siblings after writing a new bundle', async () => {
    const root = await fs.mkdtemp(
      path.join(process.cwd(), '.tmp-ts-ssg-assets-'),
    )
    const outDir = path.join(root, 'dist')
    try {
      const entryPath = path.join(root, 'login.ts')
      await writeFile(entryPath, "console.log('fresh')\n")
      await writeFile(path.join(outDir, 'login', 'login.js'), 'old stable')
      await writeFile(path.join(outDir, 'login', 'login.oldkey.js'), 'old')
      await writeFile(path.join(outDir, 'login', 'other.oldkey.js'), 'keep')

      const result = await copyStaticAsset(
        root,
        outDir,
        {
          absPath: entryPath,
          relPath: 'login.ts',
          ext: '.ts',
        },
        { scriptCacheKey: 'newkey' },
      )

      expect(result.outPath).toBe(path.join(outDir, 'login', 'login.newkey.js'))
      await expect(fs.stat(result.outPath)).resolves.toBeTruthy()
      await expect(
        fs.stat(path.join(outDir, 'login', 'login.js')),
      ).rejects.toBeTruthy()
      await expect(
        fs.stat(path.join(outDir, 'login', 'login.oldkey.js')),
      ).rejects.toBeTruthy()
      await expect(
        fs.stat(path.join(outDir, 'login', 'other.oldkey.js')),
      ).resolves.toBeTruthy()
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})
