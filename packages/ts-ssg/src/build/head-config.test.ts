import { describe, expect, it } from 'vitest'
import { resolveSiteConfig } from '../config/config'
import { normalizeFrontmatter } from '../frontmatter/frontmatter'
import { resolveHeadConfig } from './head-config'

describe('head configuration composition', () => {
  it('awaits metadata defaults in order and preserves explicit page overrides', async () => {
    const input = {
      site: resolveSiteConfig({ siteTitle: 'Docs' }),
      pageInfo: {
        relPath: 'index.mdx',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({
          title: 'Home',
          head: {
            openGraph: { title: 'Explicit' },
            canonicalUrl: 'https://explicit.example/',
          },
        }),
      },
    }
    const calls: string[] = []
    const head = await resolveHeadConfig(input, [
      async () => {
        calls.push('first')
        return {
          openGraph: { title: 'Generated', image: '/preview.png' },
          canonicalUrl: 'https://generated.example/',
        }
      },
      () => {
        calls.push('second')
        return { twitter: { title: 'Social' } }
      },
    ])
    expect(calls).toEqual(['first', 'second'])
    expect(head.title).toBe('Docs | Home')
    expect(head.openGraph).toEqual({ title: 'Explicit', image: '/preview.png' })
    expect(head.canonicalUrl).toBe('https://explicit.example/')
    expect(head.twitter?.title).toBe('Social')
  })

  it('keeps noindex enforcement and basic metadata without a metadata plugin', async () => {
    const head = await resolveHeadConfig({
      site: resolveSiteConfig({
        siteTitle: 'Docs',
        preview: { image: '/preview.png' },
      }),
      pageInfo: {
        relPath: 'index.mdx',
        urlPath: '/',
        frontmatter: normalizeFrontmatter({
          title: 'Home',
          description: 'Description',
          index: false,
          head: { robots: 'index,follow' },
        }),
      },
    })
    expect(head).toMatchObject({
      title: 'Docs | Home',
      description: 'Description',
      robots: 'noindex',
    })
    expect(head.openGraph).toBeUndefined()
    expect(head.twitter).toBeUndefined()
    expect(head.canonicalUrl).toBeUndefined()
  })
})
