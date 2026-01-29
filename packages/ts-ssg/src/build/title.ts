import path from 'node:path'

export function resolveTitle(
  frontmatter: Record<string, unknown>,
  relPath: string,
) {
  const title = frontmatter.title
  const normalizedTitle = typeof title === 'string' ? title.trim() : ''
  const hasTitle = normalizedTitle.length > 0
  if (hasTitle) return normalizedTitle
  const base = path.basename(relPath, path.extname(relPath))
  const isIndex = base === 'index'
  return isIndex ? '' : base
}
