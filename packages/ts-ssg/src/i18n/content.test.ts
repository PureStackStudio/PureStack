import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import type { ContentFile } from '../discover/content'
import { assertUniqueContentRoutes } from '../routing/route'
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

  it('keeps content outside configured locale folders as ordinary site content', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'prefix-all',
      },
    })

    const files = resolveContentFiles(config, [
      file('index.mdx'),
      file('about.md'),
      file('en.mdx'),
      file('en/docs/index.md'),
    ])
    const home = findFile(files, 'index.mdx')
    const about = findFile(files, 'about.md')
    const namedLocalePage = findFile(files, 'en.mdx')
    const localizedDocs = findFile(files, 'en/docs/index.md')

    expect(home).toMatchObject({
      routeRelPath: 'index.mdx',
      outputRelPath: 'index.mdx',
      urlPath: '/',
    })
    expect(home.locale).toBeUndefined()
    expect(home.translationKey).toBeUndefined()
    expect(about).toMatchObject({
      routeRelPath: 'about.md',
      outputRelPath: 'about.md',
      urlPath: '/about/',
    })
    expect(about.locale).toBeUndefined()
    expect(namedLocalePage).toMatchObject({
      routeRelPath: 'en.mdx',
      outputRelPath: 'en.mdx',
      urlPath: '/en/',
    })
    expect(namedLocalePage.locale).toBeUndefined()
    expect(localizedDocs).toMatchObject({
      locale: 'en',
      routeRelPath: 'docs/index.md',
      outputRelPath: 'en/docs/index.md',
      urlPath: '/en/docs/',
      translationKey: 'docs',
    })
  })

  it('still rejects route collisions between global and localized content', () => {
    const config = resolveSiteConfig({
      rootDir: process.cwd(),
      i18n: {
        defaultLocale: 'en',
        locales: ['en', 'tr'],
        urlStrategy: 'hidden',
      },
    })

    expect(() =>
      assertUniqueContentRoutes(
        resolveContentFiles(config, [file('index.mdx'), file('en/index.mdx')]),
      ),
    ).toThrow('Duplicate content routes detected. /: en/index.mdx, index.mdx')
  })
})

function file(relPath: string): ContentFile {
  return {
    absPath: path.join('content', relPath),
    relPath,
    ext: path.extname(relPath),
  }
}

function findFile<T extends ContentFile>(files: T[], relPath: string): T {
  const file = files.find((entry) => entry.relPath === relPath)
  if (!file) throw new Error(`Missing content file: ${relPath}`)
  return file
}
