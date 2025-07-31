import { HeadConfig, NameMetaTag, PropertyMetaTag } from './head'

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

  if (seo.description) {
    config.nameMetas = [{ name: 'description', content: seo.description }]
  }
  if (seo.keywords) {
    config.nameMetas = [
      ...(config.nameMetas || []),
      { name: 'keywords', content: seo.keywords.join(',') },
    ]
  }
  if (seo.robots) {
    config.nameMetas = [
      ...(config.nameMetas || []),
      { name: 'robots', content: seo.robots },
    ]
  }

  // Canonical link
  if (seo.canonicalUrl) {
    config.links = [{ rel: 'canonical', href: seo.canonicalUrl }]
  }

  // Open Graph
  if (seo.openGraph) {
    const props: PropertyMetaTag[] = []
    const og = seo.openGraph
    if (og.title) props.push({ property: 'og:title', content: og.title })
    if (og.description)
      props.push({ property: 'og:description', content: og.description })
    if (og.url) props.push({ property: 'og:url', content: og.url })
    if (og.image) props.push({ property: 'og:image', content: og.image })
    if (og.type) props.push({ property: 'og:type', content: og.type })
    if (og.siteName)
      props.push({ property: 'og:site_name', content: og.siteName })
    if (og.locale) props.push({ property: 'og:locale', content: og.locale })
    if (props.length) {
      config.propertyMetas = props
    }
  }

  // Twitter Cards
  if (seo.twitter) {
    const tm: NameMetaTag[] = []
    const tw = seo.twitter
    if (tw.cardType) tm.push({ name: 'twitter:card', content: tw.cardType })
    if (tw.site) tm.push({ name: 'twitter:site', content: tw.site })
    if (tw.creator) tm.push({ name: 'twitter:creator', content: tw.creator })
    if (tw.title) tm.push({ name: 'twitter:title', content: tw.title })
    if (tw.description)
      tm.push({ name: 'twitter:description', content: tw.description })
    if (tw.image) tm.push({ name: 'twitter:image', content: tw.image })
    config.nameMetas = [...(config.nameMetas || []), ...tm]
  }

  // Theme color & application name
  if (seo.themeColor) {
    config.nameMetas = [
      ...(config.nameMetas || []),
      { name: 'theme-color', content: seo.themeColor },
    ]
  }
  if (seo.applicationName) {
    config.nameMetas = [
      ...(config.nameMetas || []),
      { name: 'application-name', content: seo.applicationName },
    ]
  }

  return config
}
