import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { resolveOutPath, resolveRouteInfo } from './out-path'

const root = path.join('dist', 'site')

function file(relPath: string, ext: string) {
  return {
    absPath: path.join('content', relPath),
    relPath,
    ext,
  }
}

describe('resolveRouteInfo', () => {
  it('resolves index routes', () => {
    const info = resolveRouteInfo(file('index.mdx', '.mdx'))
    expect(info.urlPath).toBe('/')
  })

  it('resolves nested index routes', () => {
    const relPath = path.join('guide', 'index.md')
    const info = resolveRouteInfo(file(relPath, '.md'))
    expect(info.urlPath).toBe('/guide/')
  })

  it('resolves nested routes', () => {
    const relPath = path.join('guide', 'overview.md')
    const info = resolveRouteInfo(file(relPath, '.md'))
    expect(info.urlPath).toBe('/guide/overview/')
  })
})

describe('resolveOutPath', () => {
  it('writes index to root index.html', () => {
    const outPath = resolveOutPath(root, file('index.mdx', '.mdx'))
    expect(outPath).toBe(path.join(root, 'index.html'))
  })

  it('writes nested index to its folder', () => {
    const relPath = path.join('guide', 'index.md')
    const outPath = resolveOutPath(root, file(relPath, '.md'))
    expect(outPath).toBe(path.join(root, 'guide', 'index.html'))
  })

  it('writes nested content to clean url folder', () => {
    const relPath = path.join('guide', 'overview.md')
    const outPath = resolveOutPath(root, file(relPath, '.md'))
    expect(outPath).toBe(path.join(root, 'guide', 'overview', 'index.html'))
  })
})
