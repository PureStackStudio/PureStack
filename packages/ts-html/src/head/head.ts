import { Attributes } from '../tsNode'

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
export interface NameMetaTag extends Attributes {
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
export interface PropertyMetaTag extends Attributes {
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
export interface LinkTag extends Attributes {
  /** Specifies the relationship between the document and the linked resource. */
  rel?: LinkRel
  /** URL of the linked resource. */
  href?: string
  /** Human-readable title (e.g. for rel="search") */
  title?: string
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
  crossorigin?: 'anonymous' | 'use-credentials' | (string & {})
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
export interface BaseTag extends Attributes {
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
  /** Subresource Integrity hash */
  integrity?: string
  /** CSP nonce value */
  nonce?: string
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
