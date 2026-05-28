import { describe, expect, it } from 'vitest'

import {
  dirnamePosix,
  isTypeScriptAssetPath,
  joinPosix,
  normalizePosixPath,
  toOutputAssetRelPath,
  toPosixPath,
} from './assetPath'

describe('assetPath', () => {
  it('detects TypeScript asset paths case-insensitively', () => {
    expect(isTypeScriptAssetPath('entry.ts')).toBe(true)
    expect(isTypeScriptAssetPath('scripts/ENTRY.TS')).toBe(true)
    expect(isTypeScriptAssetPath('.hidden.ts')).toBe(true)
    expect(isTypeScriptAssetPath('entry.tsx')).toBe(false)
    expect(isTypeScriptAssetPath('.ts')).toBe(false)
    expect(isTypeScriptAssetPath('entry')).toBe(false)
  })

  it('maps TypeScript asset paths to emitted output paths', () => {
    expect(toOutputAssetRelPath('login.ts')).toBe('login/login.js')
    expect(toOutputAssetRelPath('nested/app.ts')).toBe('nested/app/app.js')
    expect(toOutputAssetRelPath('nested/path/ENTRY.TS')).toBe(
      'nested/path/ENTRY/ENTRY.js',
    )
    expect(toOutputAssetRelPath('v1.2/app.ts')).toBe('v1.2/app/app.js')
    expect(toOutputAssetRelPath('.hidden.ts')).toBe('.hidden/.hidden.js')
    expect(toOutputAssetRelPath('types/foo.d.ts')).toBe('types/foo.d/foo.d.js')
  })

  it('adds cache keys to emitted TypeScript filenames', () => {
    expect(toOutputAssetRelPath('login.ts', { cacheKey: 'm4x9p2' })).toBe(
      'login/login.m4x9p2.js',
    )
    expect(
      toOutputAssetRelPath('nested/app.ts', { cacheKey: 'build:42' }),
    ).toBe('nested/app/app.build42.js')
  })

  it('preserves non-TypeScript asset paths', () => {
    expect(toOutputAssetRelPath('styles/site.css')).toBe('styles/site.css')
    expect(toOutputAssetRelPath('scripts/app.tsx')).toBe('scripts/app.tsx')
  })

  it('normalizes Windows separators before rewriting output paths', () => {
    expect(toOutputAssetRelPath('nested\\app.ts')).toBe('nested/app/app.js')
    expect(toOutputAssetRelPath('nested\\path\\ENTRY.TS')).toBe(
      'nested/path/ENTRY/ENTRY.js',
    )
  })

  it('converts paths to posix separators', () => {
    expect(toPosixPath('nested\\page\\entry.ts')).toBe('nested/page/entry.ts')
    expect(toPosixPath('nested/page/entry.ts')).toBe('nested/page/entry.ts')
  })

  it('returns posix directory names', () => {
    expect(dirnamePosix('entry.ts')).toBe('.')
    expect(dirnamePosix('nested/page/entry.ts')).toBe('nested/page')
    expect(dirnamePosix('/entry.ts')).toBe('/')
    expect(dirnamePosix('nested\\page\\entry.ts')).toBe('nested/page')
  })

  it('normalizes posix paths without escaping absolute roots', () => {
    expect(normalizePosixPath('./')).toBe('.')
    expect(normalizePosixPath('nested/..')).toBe('.')
    expect(normalizePosixPath('nested/./page.ts')).toBe('nested/page.ts')
    expect(normalizePosixPath('nested//page/../entry.ts')).toBe(
      'nested/entry.ts',
    )
    expect(normalizePosixPath('../../entry.ts')).toBe('../../entry.ts')
    expect(normalizePosixPath('nested/../../entry.ts')).toBe('../entry.ts')
    expect(normalizePosixPath('../nested/../entry.ts')).toBe('../entry.ts')
    expect(normalizePosixPath('/')).toBe('/')
    expect(normalizePosixPath('/nested/../entry.ts')).toBe('/entry.ts')
    expect(normalizePosixPath('/../../entry.ts')).toBe('/entry.ts')
    expect(normalizePosixPath('')).toBe('.')
  })

  it('joins and normalizes posix path segments', () => {
    expect(joinPosix('')).toBe('.')
    expect(joinPosix('', '')).toBe('.')
    expect(joinPosix('nested', 'page', 'entry.ts')).toBe('nested/page/entry.ts')
    expect(joinPosix('nested/page', '../entry.ts')).toBe('nested/entry.ts')
    expect(joinPosix('', './scripts', 'boot.ts')).toBe('scripts/boot.ts')
    expect(joinPosix('/', 'scripts', 'boot.ts')).toBe('/scripts/boot.ts')
    expect(joinPosix('/nested', '../entry.ts')).toBe('/entry.ts')
  })

  it('normalizes Windows separators in helper functions', () => {
    expect(dirnamePosix('nested\\file.ts')).toBe('nested')
    expect(normalizePosixPath('nested\\..\\file.ts')).toBe('file.ts')
  })
})
