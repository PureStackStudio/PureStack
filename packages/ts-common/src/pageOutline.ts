import type { PageOutlineItem } from './ts-ssg-context'

/** Custom templates can mark their article with data-page-content. */
export function resolvePageContent(document: Document) {
  return (
    document.querySelector('[data-page-content]') ??
    document.querySelector('.doc-main .doc-content') ??
    document.querySelector('main') ??
    document.body
  )
}

function slugifyHeading(title: string) {
  return (
    title
      .toLowerCase()
      .replace(/['"`]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  )
}

/** One DOM query reserves page IDs; only headings in the article become entries. */
export function collectPageOutline(content: Element): PageOutlineItem[] {
  const documentRoot = content.ownerDocument?.documentElement
  const root = documentRoot?.contains(content) ? documentRoot : content
  const elements = root.querySelectorAll<HTMLElement>('h1, h2, h3, [id]')
  const ids = new Set<string>()
  if (root.id) ids.add(root.id)
  for (const element of elements) {
    if (element.id) ids.add(element.id)
  }
  const outline: PageOutlineItem[] = []
  const ancestors: PageOutlineItem[] = []
  const counts = new Map<string, number>()
  for (const element of elements) {
    const tag = element.tagName.toLowerCase()
    if (tag !== 'h1' && tag !== 'h2' && tag !== 'h3') continue
    if (!content.contains(element)) continue
    if (element.closest('[data-toc-ignore], .page-toc, pre, template, dialog'))
      continue
    const title = element.textContent?.trim() ?? ''
    if (!title) continue
    if (!element.id) {
      const base = slugifyHeading(title)
      let count = counts.get(base) ?? 1
      let id = count === 1 ? base : `${base}-${count}`
      while (ids.has(id)) {
        count += 1
        id = `${base}-${count}`
      }
      counts.set(base, count + 1)
      ids.add(id)
      element.id = id
    }
    const depth = Number(tag[1])
    const item: PageOutlineItem = { id: element.id, title, depth }
    while (ancestors.length && (ancestors.at(-1)?.depth ?? 0) >= depth) {
      ancestors.pop()
    }
    const parent = ancestors.at(-1)
    if (parent) {
      parent.children ??= []
      parent.children.push(item)
    } else outline.push(item)
    ancestors.push(item)
  }
  return outline
}

export function visiblePageOutline(outline: PageOutlineItem[]) {
  const [item] = outline
  return outline.length === 1 && item?.depth === 1
    ? (item.children ?? [])
    : outline
}
