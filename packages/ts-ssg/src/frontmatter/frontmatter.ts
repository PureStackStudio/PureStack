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
  fullWidth: boolean
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

export interface FrontmatterEmbedOptions {
  /**
   * Tabs runtime embed target.
   * - `body`: appends runtime script to the end of body
   * - `head`: appends runtime script to document head
   */
  tabs?: 'head' | 'body'
  /**
   * Allows custom, project-specific embed fields.
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
   * Runtime embed controls.
   */
  embed?: FrontmatterEmbedOptions
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
  const rawLayout = resolveObject(raw, 'layout') ?? {}
  const rawNav = resolveObject(raw, 'nav') ?? {}
  const showFooter = resolveKey(rawLayout, 'showFooter')

  return {
    ...raw,
    title: resolveString(resolveKey(raw, 'title')),
    description: resolveString(resolveKey(raw, 'description')),
    head: resolveObject(raw, 'head'),
    template: resolveString(resolveKey(raw, 'template')) ?? 'doc',
    order: resolveNumber(resolveKey(raw, 'order')),
    hidden: resolveKey(raw, 'hidden') === true,
    draft: resolveKey(raw, 'draft') === true,
    nav: {
      ...rawNav,
      title: resolveString(resolveKey(rawNav, 'title')),
      order: resolveNumber(resolveKey(rawNav, 'order')),
      hidden: resolveKey(rawNav, 'hidden') === true,
    },
    layout: {
      ...rawLayout,
      navMode: resolveLayoutNavMode(
        resolveKey(rawLayout, 'navMode'),
        sourceLabel,
      ),
      fullWidth: resolveKey(rawLayout, 'fullWidth') === true,
      showToc: resolveKey(rawLayout, 'showToc') === true,
      tocCollapsed: resolveKey(rawLayout, 'tocCollapsed') === true,
      showFooter: typeof showFooter === 'boolean' ? showFooter : true,
    },
    embed: resolveEmbedOptions(raw, sourceLabel),
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function resolveObject(
  source: Record<string, unknown>,
  key: string,
): Record<string, unknown> | undefined {
  const value = resolveKey(source, key)
  return isPlainObject(value) ? value : undefined
}

function resolveKey(source: Record<string, unknown>, key: string): unknown {
  if (Object.hasOwn(source, key)) return source[key]
  const target = key.toLowerCase()
  for (const [entryKey, entryValue] of Object.entries(source)) {
    if (entryKey.toLowerCase() === target) return entryValue
  }
  return undefined
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

function resolveEmbedOptions(
  source: Record<string, unknown>,
  sourceLabel?: string,
): FrontmatterEmbedOptions | undefined {
  const rawEmbed = resolveObject(source, 'embed')
  if (!rawEmbed) return undefined
  return {
    ...rawEmbed,
    tabs: resolveEmbedTabsPosition(resolveKey(rawEmbed, 'tabs'), sourceLabel),
  }
}

function resolveEmbedTabsPosition(
  value: unknown,
  sourceLabel?: string,
): FrontmatterEmbedOptions['tabs'] {
  if (value === undefined) return undefined
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'head' || normalized === 'body') return normalized
  }
  const location = sourceLabel ? ` in ${sourceLabel}` : ''
  throw new Error(
    `Invalid frontmatter.embed.tabs${location}: expected "head" or "body", received ${formatValue(value)}.`,
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
