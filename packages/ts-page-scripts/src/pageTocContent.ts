import type { PageOutlineItem } from '@purestack/ts-common'
import { visiblePageOutline } from '../../ts-common/src/pageOutline'

/** Shared static markup for server output and explicit browser refreshes. */
export function renderPageTocContent(outline: PageOutlineItem[]) {
  const items = visiblePageOutline(outline)
  if (!items.length)
    return '<div class="page-toc__empty">No sections yet.</div>'
  return renderList(items, false)
}

function renderList(items: PageOutlineItem[], nested: boolean): string {
  return `<ul class="page-toc__list${nested ? ' page-toc__list--nested' : ''}">${items
    .map((item) => {
      const children =
        Array.isArray(item.children) && item.children.length
          ? renderList(item.children, true)
          : ''
      const classes = nested
        ? 'page-toc__link--sub fw-200 fs-xs'
        : 'fw-400 fs-sm'
      const depth = headingDepth(item.depth) ?? (nested ? 3 : 2)
      return `<li class="page-toc__item page-toc__item--h${depth}"><a class="btn tone-text underline-hover page-toc__link justify-start w-full ws-normal tone-fill-button-active tone-text-button-active py-1 pl-2 ${classes}" href="#${escapeHtml(item.id)}"><span class="btn__label">${escapeHtml(item.title)}</span></a>${children}</li>`
    })
    .join('')}</ul>`
}

/** The outline is library input, so only a heading level reaches the markup. */
function headingDepth(value: unknown) {
  return typeof value === 'number' &&
    Number.isInteger(value) &&
    value >= 1 &&
    value <= 6
    ? value
    : undefined
}

function escapeHtml(value: unknown) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
