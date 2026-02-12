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
  navMode: 'sidebar' | 'drawer'
  /**
   * Expands main content area to full available width.
   */
  fullWidthMain: boolean
  /**
   * Enables the table-of-contents panel and related script.
   */
  showToc: boolean
  /**
   * Keeps table-of-contents enabled but starts collapsed with toggle visible.
   */
  tocCollapsed?: boolean
  /**
   * Enables the default footer.
   * Defaults to `true` when omitted.
   */
  showFooter: boolean
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
  hidden: boolean
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
  template: string
  /**
   * Fallback navigation order when `nav.order` is not provided.
   */
  order?: number
  /**
   * Hides the page from generated navigation.
   */
  hidden: boolean
  /**
   * Marks the page as draft and hidden from generated navigation.
   */
  draft: boolean
  /**
   * Navigation-specific metadata overrides.
   */
  nav: FrontmatterNavOptions
  /**
   * Layout-specific rendering controls.
   */
  layout: FrontmatterLayoutOptions
  /**
   * Allows custom, project-specific frontmatter fields.
   */
  [key: string]: unknown
}

export interface ParsedFrontmatterSource {
  body: string
  frontmatter: PageFrontmatter
}

export function parseFrontmatterSource(
  source: string,
  sourceLabel?: string,
): ParsedFrontmatterSource {
  const parsed = matter(source)
  return {
    body: parsed.content,
    frontmatter: normalizeFrontmatter(parsed.data, sourceLabel),
  }
}

export function normalizeFrontmatter(
  data: unknown,
  sourceLabel?: string,
): PageFrontmatter {
  const raw = isPlainObject(data) ? data : {}
  const rawLayout = isPlainObject(raw.layout) ? raw.layout : {}
  const rawNav = isPlainObject(raw.nav) ? raw.nav : {}

  return {
    ...raw,
    title: resolveString(raw.title),
    description: resolveString(raw.description),
    head: isPlainObject(raw.head) ? raw.head : undefined,
    template: resolveString(raw.template) ?? 'doc',
    order: resolveNumber(raw.order),
    hidden: raw.hidden === true,
    draft: raw.draft === true,
    nav: {
      ...rawNav,
      title: resolveString(rawNav.title),
      order: resolveNumber(rawNav.order),
      hidden: rawNav.hidden === true,
    },
    layout: {
      ...rawLayout,
      navMode: resolveLayoutNavMode(rawLayout.navMode, sourceLabel),
      fullWidthMain: rawLayout.fullWidthMain === true,
      showToc: rawLayout.showToc === true,
      tocCollapsed: rawLayout.tocCollapsed === true,
      showFooter:
        typeof rawLayout.showFooter === 'boolean' ? rawLayout.showFooter : true,
    },
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function resolveString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : undefined
}

function resolveNumber(value: unknown): number | undefined {
  return typeof value === 'number' && !Number.isNaN(value) ? value : undefined
}

function resolveLayoutNavMode(
  value: unknown,
  sourceLabel?: string,
): FrontmatterLayoutOptions['navMode'] {
  if (value === undefined) return 'sidebar'
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'sidebar' || normalized === 'drawer') {
      return normalized
    }
  }
  const location = sourceLabel ? ` in ${sourceLabel}` : ''
  throw new Error(
    `Invalid frontmatter.layout.navMode${location}: expected "sidebar" or "drawer", received ${formatValue(value)}.`,
  )
}

function formatValue(value: unknown): string {
  if (typeof value === 'string') return `"${value}"`
  try {
    return JSON.stringify(value)
  } catch {
    return String(value)
  }
}
