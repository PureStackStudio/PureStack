import type { PageFrontmatter, PreviewConfig } from '@purestack/ts-common'
import type { BasicHeadConfig } from '@purestack/ts-html'
import { merge, withBasePath } from '@purestack/ts-util'

export interface HeadConfigOptions {
  siteTitle?: string
  sitePreview?: PreviewConfig
  basePath?: string
  baseUrl?: string
  urlPath?: string
}

export function resolveHeadConfig(
  frontmatter: PageFrontmatter,
  options: HeadConfigOptions = {},
) {
  const title = frontmatter.title
  const description = frontmatter.description
  const head = frontmatter.head
  const siteTitle = options.siteTitle
  const preview = resolvePreviewConfig(frontmatter, options)
  const resolvedTitle =
    typeof title === 'string'
      ? siteTitle
        ? `${siteTitle} | ${title}`
        : title
      : typeof siteTitle === 'string'
        ? siteTitle
        : undefined

  const base: BasicHeadConfig = {
    ...(typeof resolvedTitle === 'string' ? { title: resolvedTitle } : {}),
    ...(typeof description === 'string' ? { description } : {}),
    ...preview,
  }

  return isPlainObject(head) ? merge(base, head) : base
}

function resolvePreviewConfig(
  frontmatter: PageFrontmatter,
  options: HeadConfigOptions,
): BasicHeadConfig {
  const pagePreview = frontmatter.preview
  const sitePreview = options.sitePreview
  const previewTitle = pickString(
    pagePreview?.title,
    frontmatter.title,
    sitePreview?.title,
    options.siteTitle,
  )
  const previewDescription = pickString(
    pagePreview?.description,
    frontmatter.description,
    sitePreview?.description,
  )
  const previewImage = resolvePreviewImage(pagePreview, sitePreview, options)
  const imageAlt = pickString(pagePreview?.imageAlt, sitePreview?.imageAlt)
  const pageUrl = resolvePageUrl(options)
  const siteName = pickString(sitePreview?.siteName, options.siteTitle)
  const openGraph = pruneObject({
    title: previewTitle,
    description: previewDescription,
    url: pageUrl,
    image: previewImage?.url,
    imageAlt,
    imageWidth: previewImage?.width,
    imageHeight: previewImage?.height,
    type: pickString(pagePreview?.type, sitePreview?.type, 'website'),
    siteName,
    locale: pickString(pagePreview?.locale, sitePreview?.locale),
  })
  const twitter = pruneObject({
    cardType: pickString(
      pagePreview?.twitterCard,
      sitePreview?.twitterCard,
      previewImage ? 'summary_large_image' : undefined,
    ),
    site: pickString(pagePreview?.twitterSite, sitePreview?.twitterSite),
    creator: pickString(
      pagePreview?.twitterCreator,
      sitePreview?.twitterCreator,
    ),
    title: previewTitle,
    description: previewDescription,
    image: previewImage?.url,
    imageAlt,
  })

  return {
    ...(pageUrl ? { canonicalUrl: pageUrl } : {}),
    ...(Object.keys(openGraph).length > 0 ? { openGraph } : {}),
    ...(Object.keys(twitter).length > 0 ? { twitter } : {}),
  }
}

type ResolvedPreviewImage = {
  url: string
  width?: number
  height?: number
}

function resolvePreviewImage(
  pagePreview: PreviewConfig | undefined,
  sitePreview: PreviewConfig | undefined,
  options: HeadConfigOptions,
): ResolvedPreviewImage | undefined {
  if (pagePreview?.image) {
    const url = resolvePreviewImageUrl(pagePreview.image, options)
    return url
      ? {
          url,
          width: pagePreview.imageWidth,
          height: pagePreview.imageHeight,
        }
      : undefined
  }
  if (!sitePreview?.image) return undefined
  const url = resolvePreviewImageUrl(sitePreview.image, options)
  return url
    ? {
        url,
        width: sitePreview.imageWidth,
        height: sitePreview.imageHeight,
      }
    : undefined
}

function resolvePreviewImageUrl(
  image: string,
  options: HeadConfigOptions,
): string | undefined {
  if (isAbsoluteUrl(image)) return image
  const sitePath = image.startsWith('/') ? image : `/${image}`
  const publicPath = withBasePath(options.basePath ?? '', sitePath)
  return resolveAbsoluteUrl(publicPath, options.baseUrl) ?? publicPath
}

function resolvePageUrl(options: HeadConfigOptions): string | undefined {
  if (!options.urlPath) return undefined
  const publicPath = withBasePath(options.basePath ?? '', options.urlPath)
  return resolveAbsoluteUrl(publicPath, options.baseUrl)
}

function resolveAbsoluteUrl(
  publicPath: string,
  baseUrl: string | undefined,
): string | undefined {
  if (isAbsoluteUrl(publicPath)) return publicPath
  const normalizedBaseUrl = normalizeBaseUrl(baseUrl)
  if (!normalizedBaseUrl) return undefined
  try {
    return new URL(publicPath, `${normalizedBaseUrl}/`).toString()
  } catch {
    return undefined
  }
}

function normalizeBaseUrl(value: string | undefined): string | undefined {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim().replace(/\/+$/, '')
  return trimmed.length > 0 ? trimmed : undefined
}

function pickString(...values: Array<string | undefined>): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.length > 0) return value
  }
  return undefined
}

function pruneObject<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T
}

function isAbsoluteUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
