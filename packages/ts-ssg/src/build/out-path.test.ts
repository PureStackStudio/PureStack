import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { resolvePlainContentFile } from '../i18n/content'
import { assertUniqueContentRoutes, resolveRouteInfo } from '../routing/route'
import { resolveOutPath } from './out-path'

const root = path.join('dist', 'site')

function file(relPath: string, ext: string) {
  return {
    absPath: path.join('content', relPath),
    relPath,
    ext,
  }
}

function resolvedFile(relPath: string, ext: string) {
  return resolvePlainContentFile(file(relPath, ext))
}

describe('resolveRouteInfo', () => {
  it('resolves index routes', () => {
    const info = resolveRouteInfo(file('index.mdx', '.mdx'))
    expect(info.urlPath).toBe('/')
  })

  it('resolves Regor MDX index routes', () => {
    const info = resolveRouteInfo(file('index.rmdx', '.rmdx'))
    expect(info.urlPath).toBe('/')
  })

  it('resolves nested index routes', () => {
    const relPath = path.join('guide', 'index.md')
    const info = resolveRouteInfo(file(relPath, '.md'))
    expect(info.urlPath).toBe('/guide/')
  })

  it('resolves same-name folder index routes', () => {
    const relPath = path.join('account', 'account.mdx')
    const info = resolveRouteInfo(file(relPath, '.mdx'))
    expect(info.urlPath).toBe('/account/')
    expect(info.isFolderIndex).toBe(true)
  })

  it('resolves nested routes', () => {
    const relPath = path.join('guide', 'overview.md')
    const info = resolveRouteInfo(file(relPath, '.md'))
    expect(info.urlPath).toBe('/guide/overview/')
  })

  it('resolves nested Regor MDX routes', () => {
    const relPath = path.join('guide', 'overview.rmdx')
    const info = resolveRouteInfo(file(relPath, '.rmdx'))
    expect(info.urlPath).toBe('/guide/overview/')
  })

  it('normalizes backslash separators in route paths', () => {
    const info = resolveRouteInfo(file('guide\\overview.md', '.md'))
    expect(info.urlPath).toBe('/guide/overview/')
  })

  it('throws on duplicate content routes', () => {
    expect(() =>
      assertUniqueContentRoutes([
        resolvedFile(path.join('account', 'index.mdx'), '.mdx'),
        resolvedFile(path.join('account', 'account.mdx'), '.mdx'),
      ]),
    ).toThrow(
      'Duplicate content routes detected. /account/: account/account.mdx, account/index.mdx',
    )
  })

  it('throws when .mdx and .rmdx resolve to the same route', () => {
    expect(() =>
      assertUniqueContentRoutes([
        resolvedFile(path.join('guide', 'intro.mdx'), '.mdx'),
        resolvedFile(path.join('guide', 'intro.rmdx'), '.rmdx'),
      ]),
    ).toThrow(
      'Duplicate content routes detected. /guide/intro/: guide/intro.mdx, guide/intro.rmdx',
    )
  })
})

describe('resolveOutPath', () => {
  it('writes index to root index.html', () => {
    const outPath = resolveOutPath(root, resolvedFile('index.mdx', '.mdx'))
    expect(outPath).toBe(path.join(root, 'index.html'))
  })

  it('writes nested index to its folder', () => {
    const relPath = path.join('guide', 'index.md')
    const outPath = resolveOutPath(root, resolvedFile(relPath, '.md'))
    expect(outPath).toBe(path.join(root, 'guide', 'index.html'))
  })

  it('writes same-name folder index to its folder', () => {
    const relPath = path.join('account', 'account.mdx')
    const outPath = resolveOutPath(root, resolvedFile(relPath, '.mdx'))
    expect(outPath).toBe(path.join(root, 'account', 'index.html'))
  })

  it('writes nested content to clean url folder', () => {
    const relPath = path.join('guide', 'overview.md')
    const outPath = resolveOutPath(root, resolvedFile(relPath, '.md'))
    expect(outPath).toBe(path.join(root, 'guide', 'overview', 'index.html'))
  })

  it('writes Regor MDX content to clean url folders', () => {
    const relPath = path.join('guide', 'overview.rmdx')
    const outPath = resolveOutPath(root, resolvedFile(relPath, '.rmdx'))
    expect(outPath).toBe(path.join(root, 'guide', 'overview', 'index.html'))
  })

  it('uses outputRelPath for localized output folders', () => {
    const outPath = resolveOutPath(root, {
      ...file('en/docs/index.md', '.md'),
      routeRelPath: 'docs/index.md',
      outputRelPath: 'en/docs/index.md',
      urlPath: '/docs/',
      locale: 'en',
    })

    expect(outPath).toBe(path.join(root, 'en', 'docs', 'index.html'))
  })
})
