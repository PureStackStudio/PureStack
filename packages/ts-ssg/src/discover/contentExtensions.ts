export const MARKDOWN_CONTENT_EXT = '.md'
export const MDX_CONTENT_EXT = '.mdx'
export const REGOR_MDX_CONTENT_EXT = '.rmdx'
export const CONTENT_EXTS = new Set([
  MARKDOWN_CONTENT_EXT,
  MDX_CONTENT_EXT,
  REGOR_MDX_CONTENT_EXT,
])
export const REGOR_MDX_CONTENT_EXTS = new Set([
  MDX_CONTENT_EXT,
  REGOR_MDX_CONTENT_EXT,
])

export function isContentExt(ext: string) {
  return CONTENT_EXTS.has(normalizeExt(ext))
}

export function isRegorMdxContentExt(ext: string) {
  return REGOR_MDX_CONTENT_EXTS.has(normalizeExt(ext))
}

function normalizeExt(ext: string) {
  return ext.toLowerCase()
}
