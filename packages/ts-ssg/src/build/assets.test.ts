import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { makeRepoTempDir } from '../test/repoTempDir'

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

    expect(tsOut).toBe(path.join(outDir, 'login.js'))
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

    expect(tsOut).toBe(path.join(outDir, 'login.m4x9p2.js'))
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

      const jsPath = path.join(outDir, 'login.js')
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

  it('does not copy navigation source files', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'ts-ssg-assets-'))
    const outDir = path.join(root, 'dist')
    try {
      await writeFile(path.join(root, '_nav.json'), '{"items":[]}')
      await writeFile(path.join(root, 'docs', '_nav.json'), '{"items":[]}')
      await writeFile(path.join(root, 'docs', 'data.json'), '{"public":true}')

      const result = await copyStaticAssets(root, outDir)

      expect(result.assets).toBe(1)
      expect(hasAsset(result, '_nav.json', '.json')).toBe(false)
      expect(hasAsset(result, path.join('docs', '_nav.json'), '.json')).toBe(
        false,
      )
      expect(hasAsset(result, path.join('docs', 'data.json'), '.json')).toBe(
        true,
      )

      await expect(fs.stat(path.join(outDir, '_nav.json'))).rejects.toBeTruthy()
      await expect(
        fs.stat(path.join(outDir, 'docs', '_nav.json')),
      ).rejects.toBeTruthy()
      await expect(
        fs.stat(path.join(outDir, 'docs', 'data.json')),
      ).resolves.toBeTruthy()
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('minifies compiled ts assets when requested', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-assets-')
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

  it('bundles source-condition packages after stripping unused Regor template tags', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-assets-')
    const outDir = path.join(root, 'dist')
    try {
      await writeFile(
        path.join(
          root,
          'node_modules',
          'source-component-package',
          'package.json',
        ),
        JSON.stringify(
          {
            name: 'source-component-package',
            type: 'module',
            sideEffects: false,
            exports: {
              '.': {
                source: './src/index.ts',
                import: './dist/index.js',
              },
            },
          },
          null,
          2,
        ),
      )
      await writeFile(
        path.join(
          root,
          'node_modules',
          'source-component-package',
          'src',
          'index.ts',
        ),
        [
          "import { html } from 'regor'",
          'const unusedTemplate = html`<UnusedComponent />`',
          "export const usedValue = 'source-ok'",
          'export function usedComponent() {',
          '  return usedValue',
          '}',
        ].join('\n'),
      )
      await writeFile(
        path.join(
          root,
          'node_modules',
          'source-component-package',
          'dist',
          'index.js',
        ),
        "export const usedValue = 'dist-fallback'\n",
      )

      const entryPath = path.join(root, 'entry.ts')
      await writeFile(
        entryPath,
        [
          "import { usedComponent } from 'source-component-package'",
          'console.log(usedComponent())',
        ].join('\n'),
      )

      const result = await copyStaticAsset(
        root,
        outDir,
        {
          absPath: entryPath,
          relPath: 'entry.ts',
          ext: '.ts',
        },
        { minifyScripts: true },
      )

      const output = await fs.readFile(result.outPath, 'utf8')
      expect(output).toContain('source-ok')
      expect(output).not.toContain('dist-fallback')
      expect(output).not.toContain('UnusedComponent')
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('removes stale cache-keyed script siblings after writing a new bundle', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-assets-')
    const outDir = path.join(root, 'dist')
    try {
      const entryPath = path.join(root, 'login.ts')
      await writeFile(entryPath, "console.log('fresh')\n")
      await writeFile(path.join(outDir, 'login.js'), 'old stable')
      await writeFile(path.join(outDir, 'login.oldkey.js'), 'old')
      await writeFile(path.join(outDir, 'other.oldkey.js'), 'keep')

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

      expect(result.outPath).toBe(path.join(outDir, 'login.newkey.js'))
      await expect(fs.stat(result.outPath)).resolves.toBeTruthy()
      await expect(fs.stat(path.join(outDir, 'login.js'))).rejects.toBeTruthy()
      await expect(
        fs.stat(path.join(outDir, 'login.oldkey.js')),
      ).rejects.toBeTruthy()
      await expect(
        fs.stat(path.join(outDir, 'other.oldkey.js')),
      ).resolves.toBeTruthy()
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })
})
