import { h, TSNode } from '@purestack/ts-html'

/**
 * Allowed values for the `name` attribute of `<meta name="...">`.
 */
export type MetaName =
  | 'description'
  | 'keywords'
  | 'robots'
  | 'author'
  | 'viewport'
  | 'application-name'
  | 'mobile-web-app-capable'
  | 'theme-color'
  | 'generator'
  | 'referrer'
  | 'format-detection'
  | 'language'
  | (string & {})

/**
 * Represents a `<meta name="..." content="...">` element.
 *
 * @example
 * ```html
 * <head>
 *   <meta name="description" content="A concise description of the page.">
 * </head>
 * ```
 * ```ts
 * const nameMeta: NameMetaTag = {
 *   name: 'description',
 *   content: 'A concise description of the page.'
 * };
 * ```
 */
export interface NameMetaTag {
  /** The `name` attribute value. */
  name: MetaName
  /** The `content` attribute value. */
  content: string
}

/**
 * Allowed values for Open Graph `<meta property="...">`.
 */
export type OpenGraphProperty =
  | 'og:title'
  | 'og:description'
  | 'og:url'
  | 'og:image'
  | 'og:image:alt'
  | 'og:type'
  | 'og:site_name'
  | 'og:locale'
  | (string & {})

/**
 * Represents a `<meta property="..." content="...">` element.
 *
 * @example
 * ```html
 * <head>
 *   <meta property="og:title" content="My App Home">
 * </head>
 * ```
 * ```ts
 * const propertyMeta: PropertyMetaTag = {
 *   property: 'og:title',
 *   content: 'My App Home'
 * };
 * ```
 */
export interface PropertyMetaTag {
  /** The `property` attribute value. */
  property: OpenGraphProperty
  /** The `content` attribute value. */
  content: string
}

/**
 * Allowed values for `<meta http-equiv="...">`.
 */
export type HttpEquiv =
  | 'content-type'
  | 'refresh'
  | 'x-ua-compatible'
  | 'content-security-policy'
  | (string & {})

/**
 * Represents a `<meta http-equiv="..." content="...">` element.
 *
 * @example
 * ```html
 * <head>
 *   <meta http-equiv="content-security-policy" content="default-src 'self'">
 * </head>
 * ```
 * ```ts
 * const httpEquivMeta: HttpEquivMetaTag = {
 *   httpEquiv: 'content-security-policy',
 *   content: "default-src 'self'"
 * };
 * ```
 */
export interface HttpEquivMetaTag {
  /** The `http-equiv` attribute value. */
  httpEquiv: HttpEquiv
  /** The `content` attribute value. */
  content: string
}

/**
 * Allowed values for the `rel` attribute of `<link>` elements.
 *
 * @example
 * ```html
 * <head>
 *   <link rel="stylesheet" href="/styles.css">
 * </head>
 * ```
 * ```ts
 * const linkRel: LinkRel = 'stylesheet';
 * ```
 */
export type LinkRel =
  | 'stylesheet'
  | 'icon'
  | 'shortcut icon'
  | 'preload'
  | 'prefetch'
  | 'dns-prefetch'
  | 'preconnect'
  | 'alternate'
  | 'manifest'
  | 'canonical'
  | 'sitemap'
  | 'apple-touch-icon'
  | 'mask-icon'
  | 'search'
  | (string & {})

/**
 * Allowed values for the `as` attribute of `<link rel="preload">`.
 *
 * @example
 * ```html
 * <head>
 *   <link rel="preload" href="/app.js" as="script">
 * </head>
 * ```
 * ```ts
 * const linkAs: LinkAs = 'script';
 * ```
 */
export type LinkAs =
  | 'script'
  | 'style'
  | 'font'
  | 'image'
  | 'document'
  | 'fetch'
  | 'audio'
  | 'video'
  | (string & {})

/**
 * Pattern-checked values for `sizes` attribute on icon links (e.g. "32x32" or "any").
 *
 * @example
 * ```html
 * <head>
 *   <link rel="icon" href="/favicon.png" sizes="32x32">
 * </head>
 * ```
 * ```ts
 * const iconSizes: IconSizes = '32x32';
 * ```
 */
export type IconSizes = `${number}x${number}` | 'any' | (string & {})

/**
 * Represents a generic `<link>` element with common attributes.
 *
 * @example
 * ```html
 * <head>
 *   <link rel="stylesheet" href="/styles.css">
 * </head>
 * ```
 * ```ts
 * const stylesheetLink: LinkTag = { rel: 'stylesheet', href: '/styles.css' };
 * ```
 */
export interface LinkTag {
  /** Specifies the relationship between the document and the linked resource. */
  rel: LinkRel
  /** URL of the linked resource. */
  href: string
  /** Optional MIME type of the linked resource. */
  type?: string
  /** For icon links, defines dimensions or "any". */
  sizes?: IconSizes
  /** Media query for applying the link. */
  media?: string
  /** Language of the linked resource. */
  hreflang?: string
  /** Defines the fetch destination for preload links. */
  as?: LinkAs
  /** CORS setting for the resource. */
  crossOrigin?: 'anonymous' | 'use-credentials' | (string & {})
  /** Importance hint (e.g. for preload priority). */
  importance?: 'low' | 'high' | (string & {})
}

/**
 * Represents the `<base>` element, which sets a base URL for relative links.
 *
 * @example
 * ```html
 * <head>
 *   <base href="https://example.com/" target="_blank">
 * </head>
 * ```
 * ```ts
 * const baseTag: BaseTag = { href: 'https://example.com/', target: '_blank' };
 * ```
 */
export interface BaseTag {
  /** Base URL for all relative URLs in the document. */
  href: string
  /** Default browsing context for linked URLs. */
  target?: string | (string & {})
}

/**
 * Represents a `<style>` element with inline CSS text.
 *
 * @example
 * ```html
 * <head>
 *   <style>body { margin: 0; }</style>
 * </head>
 * ```
 * ```ts
 * const styleTag: StyleTag = { cssText: 'body { margin: 0; }' };
 * ```
 */
export interface StyleTag {
  /** Raw CSS text to be injected in a `<style>` block. */
  cssText: string
}

/**
 * Allowed values for the `type` attribute of `<script>` elements.
 */
export type ScriptType =
  | 'text/javascript'
  | 'application/javascript'
  | 'module'
  | 'application/ld+json'
  | (string & {})

/**
 * Represents a `<script>` element, either external or inline.
 *
 * @example
 * ```html
 * <head>
 *   <script src="/bundle.js" type="module" defer></script>
 * </head>
 * ```
 * ```ts
 * const scriptTag: ScriptTag = { src: '/bundle.js', type: 'module', defer: true };
 * ```
 */
export interface ScriptTag {
  /** URL of the external script file. */
  src?: string
  /** MIME type or module indicator. */
  type?: ScriptType
  /** Load script asynchronously. */
  async?: boolean
  /** Defer execution until after parsing. */
  defer?: boolean
  /** Inline script or JSON text. */
  content?: string
}

/**
 * Represents a `<noscript>` element, used to provide fallback content when scripts are disabled.
 *
 * @example
 * ```html
 * <head>
 *   <noscript>Please enable JavaScript to view this site.</noscript>
 * </head>
 * ```
 * ```ts
 * const noscriptTag: NoScriptTag = {
 *   content: '<link rel="stylesheet" href="nojs.css">'
 * };
 * ```
 */
export interface NoScriptTag {
  /** HTML content to render if JavaScript is disabled. */
  content: string
}

/**
 * Aggregates all supported head elements into separate collections.
 *
 * @example
 * ```html
 * <head>
 *   <title>My App</title>
 *   <base href="https://example.com/">
 *   <meta charset="utf-8">
 *   <meta name="viewport" content="width=device-width,initial-scale=1">
 *   <meta property="og:url" content="https://example.com">
 *   <meta http-equiv="refresh" content="30">
 *   <link rel="icon" href="/favicon.ico" sizes="32x32">
 *   <style>body { background: #fff; }</style>
 *   <script src="/main.js" type="module" defer></script>
 *   <noscript>Please enable JavaScript to view this site.</noscript>
 *   <template><meta name="theme-color" content="#fff"></template>
 * </head>
 * ```
 * ```ts
 * const headConfig: HeadConfig = {
 *   title: { title: 'My App' },
 *   base: { href: 'https://example.com/' },
 *   charset: 'utf-8'
 *   nameMetas: [ { name: 'viewport', content: 'width=device-width,initial-scale=1' } ],
 *   propertyMetas: [ { property: 'og:url', content: 'https://example.com' } ],
 *   httpEquivMetas: [ { httpEquiv: 'refresh', content: '30' } ],
 *   links: [ { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } ],
 *   styles: [ { cssText: 'body { background: #fff; }' } ],
 *   scripts: [ { src: '/main.js', type: 'module', defer: true } ],
 *   noscript: { content: 'Please enable JavaScript to view this site.' },
 *   templates: [ { html: '<meta name="theme-color" content="#fff">' } ]
 * };
 * ```
 */
export interface HeadConfig {
  /** The text content of the `<title>` element. */
  title?: string
  /** `<base>` element data. */
  base?: BaseTag
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
  charset?: 'utf-8' | 'utf-16' | (string & {})
  /** `<meta name>` elements. */
  nameMetas?: NameMetaTag[]
  /** `<meta property>` elements. */
  propertyMetas?: PropertyMetaTag[]
  /** `<meta http-equiv>` elements. */
  httpEquivMetas?: HttpEquivMetaTag[]
  /** `<link>` elements (icons, stylesheets, preloads, etc.). */
  links?: LinkTag[]
  /** Inline `<style>` blocks. */
  styles?: StyleTag[]
  /** `<script>` elements, inline or external. */
  scripts?: ScriptTag[]
  /** `<noscript>` fallback. */
  noscript?: NoScriptTag
}

export function createHead(config: HeadConfig): TSNode<'head'> {
  const head = h('head')
  const children = new Array<TSNode<''>>()

  // <title>
  if (config.title) {
    children.push(h('title').children(h().text(config.title)))
  }

  // <base>
  if (config.base) {
    const { href, target } = config.base
    children.push(h('base').attrAll({ href, target }))
  }

  // <meta charset>
  if (config.charset) {
    children.push(h('meta').attr({ charset: config.charset }))
  }

  // <meta name="...">
  config.nameMetas?.forEach((m: NameMetaTag) => {
    children.push(
      h('meta').attr({
        name: m.name,
        content: m.content,
      }),
    )
  })

  // <meta property="...">
  config.propertyMetas?.forEach((m: PropertyMetaTag) => {
    children.push(
      h('meta').attrCustom({
        property: m.property,
        content: m.content,
      }),
    )
  })

  // <meta http-equiv="...">
  config.httpEquivMetas?.forEach((m: HttpEquivMetaTag) => {
    children.push(
      h('meta').attrCustom({
        'http-equiv': m.httpEquiv,
        content: m.content,
      }),
    )
  })

  // <link …>
  config.links?.forEach((link: LinkTag) => {
    const attrs: Record<string, string> = {
      rel: link.rel,
      href: link.href,
    }
    if (link.type) attrs.type = link.type
    if (link.sizes) attrs.sizes = link.sizes
    if (link.media) attrs.media = link.media
    if (link.hreflang) attrs.hreflang = link.hreflang
    if (link.as) attrs.as = link.as
    if (link.crossOrigin) attrs.crossorigin = link.crossOrigin
    if (link.importance) attrs.importance = link.importance

    children.push(h('link').attrCustom(attrs))
  })

  // <style>…</style>
  config.styles?.forEach((style: StyleTag) => {
    children.push(h('style').children(h().raw(style.cssText)))
  })

  // <script …>…</script>
  config.scripts?.forEach((script: ScriptTag) => {
    const attrs: Record<string, string> = {}
    if (script.src) attrs.src = script.src
    if (script.type) attrs.type = script.type
    if (script.async) attrs.async = '' // boolean attrs rendered as present
    if (script.defer) attrs.defer = ''

    const node = h('script').attrCustom(attrs)
    children.push(
      script.content ? node.children(h().raw(script.content)) : node,
    )
  })

  // <noscript>…</noscript>
  if (config.noscript) {
    children.push(h('noscript').raw(config.noscript.content))
  }

  return head.children(...children)
}
