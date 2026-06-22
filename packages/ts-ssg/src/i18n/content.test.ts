import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import type { ContentFile } from '../discover/content'
import { resolveContentFiles } from './content'

describe('resolveContentFiles', () => {
  it('resolves route-ready content when i18n is disabled', () => {
    const config = resolveSiteConfig({ rootDir: process.cwd() })
    const files = [file('index.mdx')]

    expect(resolveContentFiles(config, files)).toEqual([
      {
        ...files[0],
        routeRelPath: 'index.mdx',
        outputRelPath: 'index.mdx',
        urlPath: '/',
      },
    ])
  })

  it('prefixes public URLs for prefix-all strategy', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'prefix-all',
      },
    })

    const [home, docs] = resolveContentFiles(config, [
      file('en/index.mdx'),
      file('tr/docs/index.md'),
    ])

    expect(home).toMatchObject({
      locale: 'en',
      routeRelPath: 'index.mdx',
      outputRelPath: 'en/index.mdx',
      urlPath: '/en/',
      translationKey: 'index',
    })
    expect(docs).toMatchObject({
      locale: 'tr',
      routeRelPath: 'docs/index.md',
      outputRelPath: 'tr/docs/index.md',
      urlPath: '/tr/docs/',
      translationKey: 'docs',
    })
  })

  it('keeps canonical public URLs unprefixed for hidden strategy', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'hidden',
      },
    })

    const localized = resolveContentFiles(config, [
      file('en/docs/index.md'),
      file('tr/docs/index.md'),
    ])

    expect(localized.map((entry) => entry.urlPath)).toEqual([
      '/docs/',
      '/docs/',
    ])
    expect(localized.map((entry) => entry.outputRelPath)).toEqual([
      'en/docs/index.md',
      'tr/docs/index.md',
    ])
  })

  it('rejects content outside configured locale folders when i18n is enabled', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'tr'],
      },
    })

    expect(() => resolveContentFiles(config, [file('index.mdx')])).toThrowError(
      /locale folder/,
    )
  })
})

function file(relPath: string): ContentFile {
  return {
    absPath: path.join('content', relPath),
    relPath,
    ext: path.extname(relPath),
  }
}
