import {
  tabler_arrow_up_right,
  tabler_file_text,
  tabler_search,
} from '@purestack/ts-svg-icons'

export type SearchRecord = { url: string; title: string; excerpt: string }

export function escapeSearchHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    if (char === '&') return '&amp;'
    if (char === '<') return '&lt;'
    if (char === '>') return '&gt;'
    if (char === '"') return '&quot;'
    return '&#39;'
  })
}

function decodeHtml(value: string) {
  const text = document.createElement('textarea')
  text.innerHTML = value
  return text.value
}

function highlightText(text: string, query: string) {
  const terms = [...new Set(query.toLowerCase().split(/\s+/))]
    .filter((term) => term.length >= 2)
    .sort((a, b) => b.length - a.length)
  if (!terms.length) return escapeSearchHtml(text)
  const pattern = terms
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|')
  const regex = new RegExp(pattern, 'gi')
  let html = ''
  let lastIndex = 0
  for (const match of text.matchAll(regex)) {
    html += escapeSearchHtml(text.slice(lastIndex, match.index))
    html += `<mark class="site-search__highlight">${escapeSearchHtml(match[0])}</mark>`
    lastIndex = match.index + match[0].length
  }
  return html + escapeSearchHtml(text.slice(lastIndex))
}

function resultPath(url: string, basePath: string) {
  try {
    let path = new URL(url, window.location.href).pathname
    if (basePath && path.startsWith(`${basePath}/`)) {
      path = path.slice(basePath.length)
    }
    const segments = decodeURIComponent(path)
      .split('/')
      .filter(Boolean)
      .map((segment) => segment.replace(/\.html$/, '').replace(/[-_]/g, ' '))
    return segments.length ? segments.join(' / ') : 'Home'
  } catch {
    return 'Page'
  }
}

function renderResult(result: SearchRecord, query: string, basePath: string) {
  const title = decodeHtml(result.title.trim() || 'Untitled')
  const excerpt = decodeHtml(result.excerpt.replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
  return `<li class="site-search__item">
    <a class="site-search__link" href="${escapeSearchHtml(result.url)}">
      <span class="site-search__result-icon" aria-hidden="true">${tabler_file_text}</span>
      <span class="site-search__result-copy">
        <span class="site-search__path">${escapeSearchHtml(resultPath(result.url, basePath))}</span>
        <span class="site-search__title">${highlightText(title, query)}</span>
        ${excerpt ? `<span class="site-search__excerpt">${highlightText(excerpt, query)}</span>` : ''}
      </span>
      <span class="site-search__arrow" aria-hidden="true">${tabler_arrow_up_right}</span>
    </a>
  </li>`
}

function renderPanel(
  container: HTMLElement,
  heading: string,
  badge: string,
  content: string,
) {
  container.innerHTML = `<div class="site-search__header">
    <span class="site-search__header-icon" aria-hidden="true">${tabler_search}</span>
    <div><span class="site-search__eyebrow">Site search</span><p class="site-search__heading">${escapeSearchHtml(heading)}</p></div>
    ${badge ? `<span class="site-search__count">${escapeSearchHtml(badge)}</span>` : ''}
  </div>
  <div class="site-search__body">${content}</div>
  <div class="site-search__footer" aria-hidden="true">
    <span><kbd>↑</kbd><kbd>↓</kbd> navigate <kbd>↵</kbd> open</span>
    <span><kbd>esc</kbd> close</span>
  </div>`
  container.hidden = false
}

export function renderSearchMessage(
  container: HTMLElement,
  title: string,
  detail: string,
  state: 'idle' | 'loading' | 'empty' | 'error',
) {
  renderPanel(
    container,
    'Find your next page',
    '',
    `<div class="site-search__message site-search__message--${state}">
      <span class="site-search__message-icon" aria-hidden="true">${tabler_search}</span>
      <p class="site-search__message-title">${escapeSearchHtml(title)}</p>
      <p class="site-search__message-detail">${escapeSearchHtml(detail)}</p>
    </div>`,
  )
}

export function renderSearchResults(
  container: HTMLElement,
  results: SearchRecord[],
  query: string,
  total: number,
  basePath: string,
) {
  if (!results.length) {
    renderSearchMessage(
      container,
      `No matches for “${query}”`,
      'Try a different keyword or a more general term.',
      'empty',
    )
    return
  }
  const count = total === 1 ? '1 result' : `${total} results`
  renderPanel(
    container,
    `Results for “${query}”`,
    total > results.length ? `${results.length} of ${count}` : count,
    `<ul class="site-search__list">${results.map((result) => renderResult(result, query, basePath)).join('')}</ul>`,
  )
}
