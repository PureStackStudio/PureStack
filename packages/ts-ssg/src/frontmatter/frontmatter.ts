import type {
  FrontmatterEmbedOptions,
  FrontmatterLayoutOptions,
  PageFrontmatter,
  ParsedFrontmatterSource,
  PreviewConfig,
} from '@purestack/ts-common'
import { pickSemanticTone } from '@purestack/ts-style'
import matter from 'gray-matter'

export function parseFrontmatterSource(
  source: string,
  sourceLabel?: string,
  options?: NormalizeFrontmatterOptions,
): ParsedFrontmatterSource {
  const parsed = matter(source)
  return {
    body: parsed.content,
    frontmatter: normalizeFrontmatter(parsed.data, sourceLabel, options),
  }
}

export interface NormalizeFrontmatterOptions {
  defaultShowToc?: boolean
}

export function normalizeFrontmatter(
  data: unknown,
  sourceLabel?: string,
  options: NormalizeFrontmatterOptions = {},
): PageFrontmatter {
  const raw = isPlainObject(data) ? data : {}
  const rawLayout = resolveObject(raw, 'layout') ?? {}
  const rawNav = resolveObject(raw, 'nav') ?? {}
  const showFooter = resolveKey(rawLayout, 'showFooter')
  const showToc = resolveKey(rawLayout, 'showToc')

  return {
    ...raw,
    title: resolveString(resolveKey(raw, 'title')),
    description: resolveString(resolveKey(raw, 'description')),
    head: resolveObject(raw, 'head'),
    preview: resolvePreviewConfig(raw),
    template: resolveString(resolveKey(raw, 'template')) ?? 'doc',
    order: resolveNumber(resolveKey(raw, 'order')),
    hidden: resolveKey(raw, 'hidden') === true,
    draft: resolveKey(raw, 'draft') === true,
    nav: {
      ...rawNav,
      title: resolveString(resolveKey(rawNav, 'title')),
      order: resolveNumber(resolveKey(rawNav, 'order')),
      badge: resolveString(resolveKey(rawNav, 'badge')),
      icon: resolveString(resolveKey(rawNav, 'icon')),
      tone: pickSemanticTone(resolveKey(rawNav, 'tone')),
      hidden: resolveKey(rawNav, 'hidden') === true,
    },
    layout: {
      ...rawLayout,
      navMode: resolveLayoutNavMode(
        resolveKey(rawLayout, 'navMode'),
        sourceLabel,
      ),
      fullWidth: resolveKey(rawLayout, 'fullWidth') === true,
      showToc:
        typeof showToc === 'boolean'
          ? showToc
          : options.defaultShowToc === true,
      showNav: resolveKey(rawLayout, 'showNav') !== false,
      tocTone: pickSemanticTone(resolveKey(rawLayout, 'tocTone')),
      tocCollapsed: resolveKey(rawLayout, 'tocCollapsed') === true,
      showFooter: typeof showFooter === 'boolean' ? showFooter : true,
    },
    embed: resolveEmbedOptions(raw, sourceLabel),
  }
}

function resolvePreviewConfig(
  source: Record<string, unknown>,
): PreviewConfig | undefined {
  const rawPreview = resolveObject(source, 'preview')
  if (!rawPreview) return undefined
  const preview: PreviewConfig = {
    title: resolveString(resolveKey(rawPreview, 'title')),
    description: resolveString(resolveKey(rawPreview, 'description')),
    image: resolveString(resolveKey(rawPreview, 'image')),
    imageAlt: resolveString(resolveKey(rawPreview, 'imageAlt')),
    imageWidth: resolvePositiveInteger(resolveKey(rawPreview, 'imageWidth')),
    imageHeight: resolvePositiveInteger(resolveKey(rawPreview, 'imageHeight')),
    siteName: resolveString(resolveKey(rawPreview, 'siteName')),
    type: resolveString(resolveKey(rawPreview, 'type')),
    locale: resolveString(resolveKey(rawPreview, 'locale')),
    twitterCard: resolveString(resolveKey(rawPreview, 'twitterCard')),
    twitterSite: resolveString(resolveKey(rawPreview, 'twitterSite')),
    twitterCreator: resolveString(resolveKey(rawPreview, 'twitterCreator')),
  }
  return hasPreviewValue(preview) ? preview : undefined
}

function hasPreviewValue(preview: PreviewConfig): boolean {
  return Object.values(preview).some((value) => {
    if (typeof value === 'string') return value.length > 0
    return typeof value === 'number'
  })
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

function resolvePositiveInteger(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
    ? value
    : undefined
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
    modal: resolveEmbedModalPosition(
      resolveKey(rawEmbed, 'modal'),
      sourceLabel,
    ),
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

function resolveEmbedModalPosition(
  value: unknown,
  sourceLabel?: string,
): FrontmatterEmbedOptions['modal'] {
  if (value === undefined) return undefined
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'head' || normalized === 'body') return normalized
  }
  const location = sourceLabel ? ` in ${sourceLabel}` : ''
  throw new Error(
    `Invalid frontmatter.embed.modal${location}: expected "head" or "body", received ${formatValue(value)}.`,
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
