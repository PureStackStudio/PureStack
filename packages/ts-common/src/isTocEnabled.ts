import type { PageFrontmatter } from './frontmatter-types'
import { visiblePageOutline } from './pageOutline'
import type { PageOutlineItem } from './ts-ssg-context'

export function isTocEnabled(
  frontmatter: PageFrontmatter,
  outline: PageOutlineItem[],
) {
  const { showToc } = frontmatter.layout
  return (
    showToc === 'always' || (showToc && visiblePageOutline(outline).length > 0)
  )
}
