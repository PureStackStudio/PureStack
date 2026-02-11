import matter from 'gray-matter'

/**
 * Frontmatter options that influence page layout rendering.
 */
export interface FrontmatterLayoutOptions {
  /**
   * Navigation rendering mode for doc pages.
   * - `sidebar`: fixed side navigation (default)
   * - `drawer`: collapsible drawer navigation
   */
  navMode?: 'sidebar' | 'drawer'
  /**
   * Expands main content area to full available width.
   */
  fullWidthMain?: boolean
  /**
   * Enables the table-of-contents panel and related script.
   */
  showToc?: boolean
  /**
   * Enables the default footer.
   * Defaults to `true` when omitted.
   */
  showFooter?: boolean
  /**
   * Allows custom, project-specific layout fields.
   */
  [key: string]: unknown
}

/**
 * Frontmatter options specific to navigation metadata.
 */
export interface FrontmatterNavOptions {
  /**
   * Explicit label used in navigation menus.
   */
  title?: string
  /**
   * Sort order priority (lower values appear first).
   */
  order?: number
  /**
   * Hides the page from generated navigation.
   */
  hidden?: boolean
  /**
   * Allows custom, project-specific nav fields.
   */
  [key: string]: unknown
}

/**
 * Canonical frontmatter schema used by ts-ssg.
 *
 * Known fields are documented for editor hints and maintainability.
 * Additional keys are allowed so teams can carry custom metadata.
 */
export interface PageFrontmatter {
  /**
   * Human-readable page title.
   */
  title?: string
  /**
   * Meta description used for SEO/social previews.
   */
  description?: string
  /**
   * Merged into the generated `<head>` config.
   */
  head?: Record<string, unknown>
  /**
   * Name of the page template to render (e.g. `doc`, `splash`).
   */
  template?: string
  /**
   * Fallback navigation order when `nav.order` is not provided.
   */
  order?: number
  /**
   * Hides the page from generated navigation.
   */
  hidden?: boolean
  /**
   * Marks the page as draft and hidden from generated navigation.
   */
  draft?: boolean
  /**
   * Navigation-specific metadata overrides.
   */
  nav?: FrontmatterNavOptions
  /**
   * Layout-specific rendering controls.
   */
  layout?: FrontmatterLayoutOptions
  /**
   * Allows custom, project-specific frontmatter fields.
   */
  [key: string]: unknown
}

export interface ParsedFrontmatterSource {
  body: string
  frontmatter: PageFrontmatter
}

export type FrontmatterNavMode = 'sidebar' | 'drawer'

export function parseFrontmatterSource(source: string): ParsedFrontmatterSource {
  const parsed = matter(source)
  return {
    body: parsed.content,
    frontmatter: normalizeFrontmatter(parsed.data),
  }
}

export function normalizeFrontmatter(data: unknown): PageFrontmatter {
  return isPlainObject(data) ? (data as PageFrontmatter) : {}
}

export function resolveFrontmatterTemplate(
  frontmatter: PageFrontmatter | undefined,
): string | undefined {
  const template = frontmatter?.template
  return typeof template === 'string' ? template : undefined
}

export function resolveFrontmatterNavMode(
  frontmatter: PageFrontmatter | undefined,
): FrontmatterNavMode {
  const navMode = getFrontmatterLayout(frontmatter)?.navMode
  return navMode === 'drawer' ? 'drawer' : 'sidebar'
}

export function resolveFrontmatterFullWidthMain(
  frontmatter: PageFrontmatter | undefined,
): boolean {
  return getFrontmatterLayout(frontmatter)?.fullWidthMain === true
}

export function resolveFrontmatterTocEnabled(
  frontmatter: PageFrontmatter | undefined,
): boolean {
  return getFrontmatterLayout(frontmatter)?.showToc === true
}

export function resolveFrontmatterFooterEnabled(
  frontmatter: PageFrontmatter | undefined,
): boolean {
  const showFooter = getFrontmatterLayout(frontmatter)?.showFooter
  if (typeof showFooter === 'boolean') return showFooter
  return true
}

export function getFrontmatterLayout(
  frontmatter: PageFrontmatter | undefined,
): FrontmatterLayoutOptions | undefined {
  return isPlainObject(frontmatter?.layout)
    ? (frontmatter.layout as FrontmatterLayoutOptions)
    : undefined
}

export function getFrontmatterNav(
  frontmatter: PageFrontmatter | undefined,
): FrontmatterNavOptions | undefined {
  return isPlainObject(frontmatter?.nav)
    ? (frontmatter.nav as FrontmatterNavOptions)
    : undefined
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
