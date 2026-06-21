/**
 * Basic head section configuration.
 */
export interface BasicHeadConfig {
  /**
   * Page title, displayed in browser tabs and search engine results.
   */
  title?: string

  /**
   * Meta description tag content, used by search engines.
   */
  description?: string

  /**
   * Known charset for `<meta charset="...">`.
   *
   * @example
   * ```html
   * <head>
   *   <meta charset="utf-8">
   * </head>
   * ```
   * ```ts
   * const charsetMeta: CharsetMetaTag = { charset: 'utf-8' };
   * ```
   */
  charset?: 'utf-8' | (string & {})

  /**
   * Viewport meta tag.
   */
  viewport?: 'width=device-width,initial-scale=1' | (string & {})

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
    /** Alt text for the Open Graph image. */
    imageAlt?: string
    /** Width of the Open Graph image in pixels. */
    imageWidth?: number
    /** Height of the Open Graph image in pixels. */
    imageHeight?: number
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
    /** Alt text for Twitter Card image. */
    imageAlt?: string
  }

  /**
   * Theme color for mobile browsers and PWA.
   * */
  themeColor?: string

  /**
   * Application name for Windows tiles or Progressive Web Apps.
   */
  applicationName?: string

  /**
   * Favicon.
   */
  favIcon?: {
    rel?: 'shortcut icon' | (string & {})
    href?: string
    type?: 'image/svg+xml' | (string & {})
  }
}
