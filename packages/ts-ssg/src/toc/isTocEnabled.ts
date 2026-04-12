import type { PageFrontmatter, PageOutlineItem } from '@purestack/ts-common'

export function isTocEnabled(
  frontmatter: PageFrontmatter,
  outline: PageOutlineItem[] | undefined,
) {
  return frontmatter.layout.showToc && (outline?.length ?? 0) > 0
}
