import { HeadConfig, LinkTag, NameMetaTag, PropertyMetaTag } from './head'

/**
 * Basic SEO-optimized head section configuration.
 */
export interface SEOHead {
  /**
   * Page title, displayed in browser tabs and search engine results.
   */
  title: string

  /**
   * Meta description tag content, used by search engines.
   */
  description?: string

  /**
   * Keywords relevant to the page, separated into an array.
   */
  keywords?: string[]

  /**
   * Canonical URL to indicate the preferred version of a page.
   */
  canonicalUrl?: string

  /**
   * Directives for web crawlers, e.g. "index,follow" or "noindex,nofollow".
   */
  robots?: 'index,follow' | 'noindex,nofollow' | (string & {})

  /**
   * Open Graph properties for social media sharing.
   */
  openGraph?: {
    /** Title for Open Graph. */
    title?: string
    /** Description for Open Graph. */
    description?: string
    /** URL for Open Graph. */
    url?: string
    /** Image URL for Open Graph. */
    image?: string
    /** Type of content, e.g., "website", "article". */
    type?: string
    /** Site name for Open Graph. */
    siteName?: string
    /** Locale for Open Graph, e.g., "en_US". */
    locale?: string
  }

  /**
   * Twitter Card metadata for Twitter sharing.
   */
  twitter?: {
    /**
     * Card type, e.g., "summary", "summary_large_image".
     */
    cardType?:
      | 'summary'
      | 'summary_large_image'
      | 'app'
      | 'player'
      | (string & {})
    /** Twitter username for the website. */
    site?: string
    /** Twitter username for the content creator. */
    creator?: string
    /** Title for Twitter Card. */
    title?: string
    /** Description for Twitter Card. */
    description?: string
    /** Image URL for Twitter Card. */
    image?: string
  }

  /**
   * Theme color for mobile browsers and PWA. */
  themeColor?: string

  /**
   * Application name for Windows tiles or Progressive Web Apps. */
  applicationName?: string
}

/**
 * Converts an SEOHead object into a HeadConfig structure.
 *
 * @param seo - The SEOHead configuration.
 * @returns A HeadConfig suitable for low-level rendering.
 *
 * @example
 * ```ts
 * const seo: SEOHead = {
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
 * const headConfig = seoHeadToHeadConfig(seo);
 * ```
 */
export function seoHeadToHeadConfig(seo: SEOHead): HeadConfig {
  const config: HeadConfig = {}

  config.title = seo.title

  const nameMetas: NameMetaTag[] = []
  const propertyMetas: PropertyMetaTag[] = []
  const links: LinkTag[] = []

  if (seo.description) {
    nameMetas.push({ name: 'description', content: seo.description })
  }
  if (seo.keywords) {
    nameMetas.push({ name: 'keywords', content: seo.keywords.join(',') })
  }
  if (seo.robots) {
    nameMetas.push({ name: 'robots', content: seo.robots })
  }

  if (seo.canonicalUrl) {
    links.push({ rel: 'canonical', href: seo.canonicalUrl })
  }

  if (seo.openGraph) {
    const og = seo.openGraph
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

  if (seo.twitter) {
    const tw = seo.twitter
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

  if (seo.themeColor) {
    nameMetas.push({ name: 'theme-color', content: seo.themeColor })
  }
  if (seo.applicationName) {
    nameMetas.push({ name: 'application-name', content: seo.applicationName })
  }

  if (nameMetas.length) config.nameMetas = nameMetas
  if (propertyMetas.length) config.propertyMetas = propertyMetas
  if (links.length) config.links = links

  return config
}
