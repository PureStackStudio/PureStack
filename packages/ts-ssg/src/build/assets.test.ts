import { execFile } from 'node:child_process'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { promisify } from 'node:util'

import { disableLogger, getLogger, type Logger } from 'logpot'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { makeRepoTempDir } from '../test/repoTempDir'

import {
  type CopyStaticAssetsResult,
  copyStaticAsset,
  copyStaticAssets,
  resolveStaticOutPath,
} from './assets'
import { SharedLibraryCache } from './shared-libraries'

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
      await expect(
        fs.stat(path.join(outDir, 'assets', 'runtime')),
      ).rejects.toMatchObject({
        code: 'ENOENT',
      })
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('shares reactive identity across independently built and rebuilt scripts', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-assets-')
    const outDir = path.join(root, 'output with spaces')
    try {
      await writeFile(
        path.join(root, 'first.ts'),
        "import { sref } from 'regor'\nexport { sref }\nexport const value = sref(1)",
      )
      await writeFile(
        path.join(root, 'shared.ts'),
        "export { sref, isRef } from 'regor'",
      )
      await writeFile(
        path.join(root, 'nested', 'second.ts'),
        "export { sref, isRef } from '../shared'",
      )
      const files = ['first.ts', 'nested/second.ts'].map((relPath) => ({
        absPath: path.join(root, relPath),
        relPath,
        ext: '.ts',
      }))
      const batch = await copyStaticAssets(root, outDir, { files })
      expect(batch.tsDependencyIndex['nested/second.ts']).toContain('shared.ts')
      await writeFile(path.join(outDir, 'package.json'), '{"type":"module"}')
      const firstPath = path.join(outDir, 'first.js')
      const secondPath = path.join(outDir, 'nested', 'second.js')
      const runtimeDir = path.join(outDir, 'assets', 'runtime')
      const runtimeFiles = await fs.readdir(runtimeDir)
      expect(runtimeFiles).toHaveLength(1)
      const runtimePath = path.join(runtimeDir, runtimeFiles[0])
      const before = await fs.stat(runtimePath)

      const rebuilt = await copyStaticAsset(root, outDir, files[1], {
        minifyScripts: true,
        scriptCacheKey: 'rebuilt',
        failOnError: true,
      })
      expect(await fs.readdir(runtimeDir)).toEqual(runtimeFiles)
      expect((await fs.stat(runtimePath)).mtimeMs).toBe(before.mtimeMs)
      await expect(fs.stat(secondPath)).rejects.toMatchObject({
        code: 'ENOENT',
      })
      for (const scriptPath of [firstPath, rebuilt.outPath]) {
        const code = await fs.readFile(scriptPath, 'utf8')
        expect(code).not.toContain('regor.runtime')
        expect(code).toContain(runtimeFiles[0])
      }

      // A fresh process gives the emitted modules their own realm, just as a
      // browser does, without reusing the test runner's Regor runtime.
      await promisify(execFile)(process.execPath, [
        '--input-type=module',
        '-e',
        [
          "import assert from 'node:assert/strict'",
          `const first = await import(${JSON.stringify(pathToFileURL(firstPath).href)})`,
          `const second = await import(${JSON.stringify(pathToFileURL(rebuilt.outPath).href)})`,
          'assert.equal(first.sref, second.sref)',
          'assert.equal(second.isRef(first.value), true)',
        ].join('\n'),
      ])

      // A clean build must restore the shared file.
      await fs.rm(runtimePath)
      await copyStaticAsset(root, outDir, files[0], { failOnError: true })
      await expect(fs.stat(runtimePath)).resolves.toBeTruthy()
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('reuses one library build across concurrent entries and invalidates only library changes', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-library-cache-')
    const outDir = path.join(root, 'out')
    try {
      await writeFile(
        path.join(root, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: { paths: { 'fixture-library': ['./shared.ts'] } },
        }),
      )
      const libraryPath = path.join(root, 'shared.ts')
      await writeFile(libraryPath, 'export const value = { count: 1 }')
      const files = ['first.ts', 'nested/second.ts'].map((relPath) => ({
        absPath: path.join(root, relPath),
        relPath,
        ext: '.ts',
      }))
      for (const file of files)
        await writeFile(file.absPath, "export { value } from 'fixture-library'")
      const reserveOutput = vi.fn()
      const cache = new SharedLibraryCache({
        contentDir: root,
        outDir,
        libraries: ['fixture-library'],
        reserveOutput,
      })
      const buildEntries = () =>
        Promise.all(
          files.map((file) =>
            copyStaticAsset(root, outDir, file, {
              sharedLibraryCache: cache,
              failOnError: true,
            }),
          ),
        )
      const first = await buildEntries()
      const runtimeDir = path.join(outDir, 'assets', 'runtime')
      const outputCount = (await fs.readdir(runtimeDir)).length
      expect(reserveOutput).toHaveBeenCalledTimes(outputCount)
      for (const result of first)
        expect(result.dependencyRelPaths).toContain('shared.ts')
      const before = await fs.readFile(first[0].outPath, 'utf8')

      cache.invalidate(files[0].absPath)
      await buildEntries()
      expect(reserveOutput).toHaveBeenCalledTimes(outputCount)

      await writeFile(libraryPath, 'export const value = { count: 2 }')
      cache.invalidate(libraryPath)
      await buildEntries()
      expect(reserveOutput).toHaveBeenCalledTimes(outputCount * 2)
      expect(await fs.readFile(first[0].outPath, 'utf8')).not.toBe(before)

      await writeFile(
        path.join(root, 'replacement.ts'),
        'export const value = { count: 3 }',
      )
      const configPath = path.join(root, 'tsconfig.json')
      await writeFile(
        configPath,
        JSON.stringify({
          compilerOptions: {
            paths: { 'fixture-library': ['./replacement.ts'] },
          },
        }),
      )
      cache.invalidate(configPath)
      const replaced = await buildEntries()
      expect(reserveOutput).toHaveBeenCalledTimes(outputCount * 3)
      for (const result of replaced) {
        expect(result.dependencyRelPaths).toContain('replacement.ts')
        expect(result.dependencyRelPaths).not.toContain('shared.ts')
      }

      cache.invalidate()
      // Clear only this fixture's generated runtime, as a clean build does.
      expect(path.relative(root, runtimeDir)).toBe(
        path.join('out', 'assets', 'runtime'),
      )
      await fs.rm(runtimeDir, { recursive: true })
      await buildEntries()
      expect(reserveOutput).toHaveBeenCalledTimes(outputCount * 4)
      expect(await fs.readdir(runtimeDir)).toHaveLength(outputCount)
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it.each(['truncated', 'same-size'])(
    'repairs %s shared-runtime output on the next build',
    async (damage) => {
      const root = await makeRepoTempDir('.tmp-ts-ssg-library-repair-')
      const outDir = path.join(root, 'out')
      try {
        const file = {
          absPath: path.join(root, 'entry.ts'),
          relPath: 'entry.ts',
          ext: '.ts',
        }
        await writeFile(file.absPath, "export { sref } from 'regor'")
        const cache = new SharedLibraryCache({ contentDir: root, outDir })
        const options = { sharedLibraryCache: cache, failOnError: true }
        await copyStaticAsset(root, outDir, file, options)
        const runtimeDir = path.join(outDir, 'assets', 'runtime')
        const runtimePath = path.join(
          runtimeDir,
          (await fs.readdir(runtimeDir))[0],
        )
        const original = await fs.readFile(runtimePath)
        await fs.writeFile(
          runtimePath,
          damage === 'truncated'
            ? 'partial'
            : Buffer.alloc(original.length, 'x'),
        )
        cache.invalidate()
        await copyStaticAsset(root, outDir, file, options)
        expect(await fs.readFile(runtimePath)).toEqual(original)
        expect(
          (await fs.readdir(runtimeDir)).filter((name) =>
            name.endsWith('.tmp'),
          ),
        ).toEqual([])
      } finally {
        await fs.rm(root, { recursive: true, force: true })
      }
    },
  )

  it('preserves the previous file and retries when atomic runtime publication fails', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-library-publication-')
    const outDir = path.join(root, 'out')
    try {
      const file = {
        absPath: path.join(root, 'entry.ts'),
        relPath: 'entry.ts',
        ext: '.ts',
      }
      await writeFile(file.absPath, "export { sref } from 'regor'")
      const cache = new SharedLibraryCache({ contentDir: root, outDir })
      const options = { sharedLibraryCache: cache, failOnError: true }
      await copyStaticAsset(root, outDir, file, options)
      const runtimeDir = path.join(outDir, 'assets', 'runtime')
      const runtimePath = path.join(
        runtimeDir,
        (await fs.readdir(runtimeDir))[0],
      )
      const original = await fs.readFile(runtimePath)
      await fs.writeFile(runtimePath, 'partial')
      cache.invalidate()
      const rename = vi
        .spyOn(fs, 'rename')
        .mockRejectedValueOnce(new Error('Interrupted publication'))
      try {
        await expect(
          copyStaticAsset(root, outDir, file, options),
        ).rejects.toThrow('Interrupted publication')
      } finally {
        rename.mockRestore()
      }
      expect(await fs.readFile(runtimePath, 'utf8')).toBe('partial')
      expect(
        (await fs.readdir(runtimeDir)).filter((name) => name.endsWith('.tmp')),
      ).toEqual([])
      await copyStaticAsset(root, outDir, file, options)
      expect(await fs.readFile(runtimePath)).toEqual(original)
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('retries a failed shared-library build after its source is fixed', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-library-retry-')
    const outDir = path.join(root, 'out')
    try {
      await writeFile(
        path.join(root, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: { paths: { 'fixture-library': ['./shared.ts'] } },
        }),
      )
      await writeFile(path.join(root, 'shared.ts'), 'export const value = ;')
      const file = {
        absPath: path.join(root, 'entry.ts'),
        relPath: 'entry.ts',
        ext: '.ts',
      }
      await writeFile(file.absPath, "export { value } from 'fixture-library'")
      const cache = new SharedLibraryCache({
        contentDir: root,
        outDir,
        libraries: ['fixture-library'],
      })
      const options = { sharedLibraryCache: cache, failOnError: true }
      await expect(
        copyStaticAsset(root, outDir, file, options),
      ).rejects.toThrow()
      await writeFile(path.join(root, 'shared.ts'), 'export const value = 1')
      await expect(
        copyStaticAsset(root, outDir, file, options),
      ).resolves.toMatchObject({ copied: true })
    } finally {
      await fs.rm(root, { recursive: true, force: true })
    }
  })

  it('shares configured libraries, subpaths, and their dependencies as one graph', async () => {
    const root = await makeRepoTempDir('.tmp-ts-ssg-libraries-')
    const outDir = path.join(root, 'out')
    try {
      const stateDir = path.join(root, 'node_modules', '@fixture', 'state')
      const wrapperDir = path.join(root, 'node_modules', '@fixture', 'wrapper')
      await writeFile(
        path.join(stateDir, 'package.json'),
        JSON.stringify({
          name: '@fixture/state',
          type: 'module',
          exports: { '.': './index.js', './extra': './extra.js' },
        }),
      )
      await writeFile(
        path.join(stateDir, 'index.js'),
        'export const value = { count: 7 }; export default value',
      )
      await writeFile(
        path.join(stateDir, 'extra.js'),
        "export { value } from './index.js'",
      )
      await writeFile(
        path.join(wrapperDir, 'package.json'),
        JSON.stringify({
          name: '@fixture/wrapper',
          type: 'module',
          exports: './index.js',
        }),
      )
      await writeFile(
        path.join(wrapperDir, 'index.js'),
        "export { value } from '@fixture/state'",
      )
      const nestedState = path.join(
        wrapperDir,
        'node_modules',
        '@fixture',
        'state',
      )
      await writeFile(
        path.join(nestedState, 'package.json'),
        JSON.stringify({
          name: '@fixture/state',
          type: 'module',
          exports: './index.js',
        }),
      )
      await writeFile(
        path.join(nestedState, 'index.js'),
        'export const value = { count: -1 }',
      )
      const libraries = [
        '@fixture/state',
        '@fixture/state/extra',
        '@fixture/wrapper',
      ]
      const sources = [
        "export { default as value } from '@fixture/state'; export { value as wrapped } from '@fixture/wrapper'",
        "export { value } from '@fixture/state/extra'",
      ]
      const built = []
      for (const [index, source] of sources.entries()) {
        const relPath = `nested/entry-${index}.ts`
        await writeFile(path.join(root, relPath), source)
        built.push(
          await copyStaticAsset(
            root,
            outDir,
            {
              absPath: path.join(root, relPath),
              relPath,
              ext: '.ts',
            },
            { sharedLibraries: libraries, failOnError: true },
          ),
        )
      }
      expect(built[0].dependencyRelPaths).toContain(
        'node_modules/@fixture/state/index.js',
      )
      await writeFile(path.join(outDir, 'package.json'), '{"type":"module"}')
      await promisify(execFile)(process.execPath, [
        '--input-type=module',
        '-e',
        [
          "import assert from 'node:assert/strict'",
          `const first = await import(${JSON.stringify(pathToFileURL(built[0].outPath).href)})`,
          `const second = await import(${JSON.stringify(pathToFileURL(built[1].outPath).href)})`,
          'assert.equal(first.value, second.value)',
          'assert.equal(first.value, first.wrapped)',
          'assert.equal(first.value.count, 7)',
        ].join('\n'),
      ])
      const runtimeFiles = await fs.readdir(
        path.join(outDir, 'assets', 'runtime'),
      )
      expect(runtimeFiles).toContain('chunks')
      expect(runtimeFiles.some((file) => file.startsWith('regor.'))).toBe(true)
      await expect(
        fs.stat(path.join(outDir, '_assets', 'runtime')),
      ).rejects.toMatchObject({ code: 'ENOENT' })

      await expect(
        copyStaticAsset(
          root,
          outDir,
          {
            absPath: path.join(root, 'nested/entry-1.ts'),
            relPath: 'nested/entry-1.ts',
            ext: '.ts',
          },
          { sharedLibraries: ['@fixture/state'], failOnError: true },
        ),
      ).rejects.toThrow('Add "@fixture/state/extra" to scripts.sharedLibraries')
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
