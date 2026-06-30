import type { PageFrontmatter, PageOutlineItem } from '@purestack/ts-common'

export function isTocEnabled(
  frontmatter: PageFrontmatter,
  outline: PageOutlineItem[] | undefined,
) {
  return frontmatter.layout.showToc && hasVisibleTocItems(outline ?? [])
}

function hasVisibleTocItems(outline: PageOutlineItem[]) {
  const [item] = outline
  if (!item) return false
  if (outline.length !== 1 || !isDocumentHeading(item)) return true
  return (item.children?.length ?? 0) > 0
}

function isDocumentHeading(item: PageOutlineItem) {
  return item.depth === 1
}
