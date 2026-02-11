import type {
  BaseTag,
  HttpEquivMetaTag,
  LinkTag,
  NameMetaTag,
  NoScriptTag,
  PropertyMetaTag,
  ScriptTag,
  StyleTag,
} from './head'

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
 * </head>
 * ```
 * ```ts
 * const headConfig: HeadConfig = {
 *   title: 'My App',
 *   base: { href: 'https://example.com/' },
 *   charset: 'utf-8',
 *   nameMetas: [ { name: 'viewport', content: 'width=device-width,initial-scale=1' } ],
 *   propertyMetas: [ { property: 'og:url', content: 'https://example.com' } ],
 *   httpEquivMetas: [ { httpEquiv: 'refresh', content: '30' } ],
 *   links: [ { rel: 'icon', href: '/favicon.ico', sizes: '32x32' } ],
 *   styles: [ { cssText: 'body { background: #fff; }' } ],
 *   scripts: [ { src: '/main.js', type: 'module', defer: true } ],
 *   noscript: { content: 'Please enable JavaScript to view this site.' },
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
