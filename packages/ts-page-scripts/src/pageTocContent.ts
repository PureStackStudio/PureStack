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
      const children = item.children?.length
        ? renderList(item.children, true)
        : ''
      const classes = nested
        ? 'page-toc__link--sub fw-200 fs-xs'
        : 'fw-400 fs-sm'
      return `<li class="page-toc__item page-toc__item--h${item.depth ?? (nested ? 3 : 2)}"><a class="btn tone-text underline-hover page-toc__link justify-start w-full ws-normal tone-fill-button-active tone-text-button-active py-1 pl-2 ${classes}" href="#${escapeHtml(item.id)}"><span class="btn__label">${escapeHtml(item.title)}</span></a>${children}</li>`
    })
    .join('')}</ul>`
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}
