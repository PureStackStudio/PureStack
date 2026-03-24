type TrailingSlashMode = 'preserve' | 'always' | 'never'

interface NormalizeHrefOptions {
  trailingSlash?: TrailingSlashMode
}

export const urlNormalizer = {
  isExternalHref(href: string): boolean {
    return (
      href.startsWith('#') ||
      href.startsWith('?') ||
      href.startsWith('//') ||
      href.startsWith('../') ||
      /^[a-zA-Z][a-zA-Z+.-]*:/.test(href)
    )
  },

  splitSuffix(href: string): { base: string; suffix: string } {
    const hashIndex = href.indexOf('#')
    const queryIndex = href.indexOf('?')
    const index =
      hashIndex === -1
        ? queryIndex
        : queryIndex === -1
          ? hashIndex
          : Math.min(hashIndex, queryIndex)
    if (index === -1) return { base: href, suffix: '' }
    return { base: href.slice(0, index), suffix: href.slice(index) }
  },

  normalizeHref(
    value: string | undefined,
    options: NormalizeHrefOptions = {},
  ): string | undefined {
    if (typeof value !== 'string') return undefined
    const trimmed = value.trim()
    if (!trimmed) return undefined
    if (urlNormalizer.isExternalHref(trimmed)) return trimmed

    const { base, suffix } = urlNormalizer.splitSuffix(trimmed)
    const withoutDot = base.replace(/^\.\/+/, '')
    const withLeadingSlash = withoutDot.startsWith('/')
      ? withoutDot
      : `/${withoutDot}`
    const trailingSlash = options.trailingSlash ?? 'preserve'
    const hasExt = hasPathExtension(withLeadingSlash)

    if (hasExt || withLeadingSlash === '/') {
      return `${withLeadingSlash}${suffix}`
    }

    if (trailingSlash === 'always' && !withLeadingSlash.endsWith('/')) {
      return `${withLeadingSlash}/${suffix}`
    }
    if (trailingSlash === 'never' && withLeadingSlash.endsWith('/')) {
      return `${withLeadingSlash.slice(0, -1)}${suffix}`
    }
    return `${withLeadingSlash}${suffix}`
  },

  normalizeUrlPath(urlPath: string): string {
    const normalized = urlNormalizer.normalizeHref(urlPath, {
      trailingSlash: 'always',
    })
    return normalized || '/'
  },
}

function hasPathExtension(value: string) {
  const lastSlashIndex = value.lastIndexOf('/')
  const segment = lastSlashIndex >= 0 ? value.slice(lastSlashIndex + 1) : value
  if (!segment || segment === '.' || segment === '..') return false
  const dotIndex = segment.lastIndexOf('.')
  return dotIndex > 0 && dotIndex < segment.length - 1
}
