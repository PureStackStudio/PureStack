import { BasicHeadConfig } from './basicHeadConfig'
import { LinkTag, NameMetaTag, PropertyMetaTag } from './head'
import { HeadConfig } from './headConfig'

/**
 * Converts an BasicHeadConfig into a HeadConfig structure.
 *
 * @param basic - The SEOHead configuration.
 * @returns A HeadConfig suitable for low-level rendering.
 *
 * @example
 * ```ts
 * const basic: BasicHeadConfig = {
 *   title: 'My Site',
 *   description: 'Welcome to my site',
 *   keywords: ['blog','tech'],
 *   canonicalUrl: 'https://example.com',
 *   robots: 'index,follow',
 *   openGraph: { title: 'My OG Title', image: '/og.png' },
 *   twitter: { cardType: 'summary_large_image', site: '@example' },
 *   themeColor: '#ffffff',
 *   applicationName: 'MyApp'
 * };
 * const headConfig = seoHeadToHeadConfig(basic);
 * ```
 */

export function getHeadConfig(basic: BasicHeadConfig): HeadConfig {
  const config: HeadConfig = {}
  const nameMetas = new Array<NameMetaTag>()
  const propertyMetas = new Array<PropertyMetaTag>()
  const links = new Array<LinkTag>()

  config.title = basic.title
  config.charset = basic.charset
  if (basic.viewport)
    nameMetas.push({ name: 'viewport', content: basic.viewport })

  if (basic.description)
    nameMetas.push({ name: 'description', content: basic.description })

  if (basic.keywords)
    nameMetas.push({
      name: 'keywords',
      content: basic.keywords.join(', '),
    })

  if (basic.robots) nameMetas.push({ name: 'robots', content: basic.robots })

  if (basic.canonicalUrl)
    links.push({ rel: 'canonical', href: basic.canonicalUrl })

  if (basic.openGraph) {
    const og = basic.openGraph
    if (og.title)
      propertyMetas.push({ property: 'og:title', content: og.title })
    if (og.description)
      propertyMetas.push({
        property: 'og:description',
        content: og.description,
      })
    if (og.url) propertyMetas.push({ property: 'og:url', content: og.url })
    if (og.image)
      propertyMetas.push({ property: 'og:image', content: og.image })
    if (og.type) propertyMetas.push({ property: 'og:type', content: og.type })
    if (og.siteName)
      propertyMetas.push({ property: 'og:site_name', content: og.siteName })
    if (og.locale)
      propertyMetas.push({ property: 'og:locale', content: og.locale })
  }

  if (basic.twitter) {
    const tw = basic.twitter
    if (tw.cardType)
      nameMetas.push({ name: 'twitter:card', content: tw.cardType })
    if (tw.site) nameMetas.push({ name: 'twitter:site', content: tw.site })
    if (tw.creator)
      nameMetas.push({ name: 'twitter:creator', content: tw.creator })
    if (tw.title) nameMetas.push({ name: 'twitter:title', content: tw.title })
    if (tw.description)
      nameMetas.push({ name: 'twitter:description', content: tw.description })
    if (tw.image) nameMetas.push({ name: 'twitter:image', content: tw.image })
  }

  if (basic.themeColor)
    nameMetas.push({ name: 'theme-color', content: basic.themeColor })

  if (basic.applicationName)
    nameMetas.push({
      name: 'application-name',
      content: basic.applicationName,
    })

  if (basic.favIcon)
    links.push({
      rel: basic.favIcon.rel ?? 'shortcut icon',
      href: basic.favIcon.href,
      type: basic.favIcon.type ?? 'image/svg+xml',
    })

  if (nameMetas.length) config.nameMetas = nameMetas
  if (propertyMetas.length) config.propertyMetas = propertyMetas
  if (links.length) config.links = links

  return config
}
