const PAGEFIND_ROOT = '[data-pagefind-search]'
const MIN_QUERY_LENGTH = 2
const RESULT_LIMIT = 8

type PagefindRecord = {
  url?: string
  excerpt?: string
  meta?: {
    title?: string
  }
}

type PagefindSearchResult = {
  data: () => Promise<PagefindRecord>
}

type PagefindSearchResponse = {
  results?: PagefindSearchResult[]
}

type PagefindApi = {
  search: (query: string) => Promise<PagefindSearchResponse>
}

function isPagefindApi(value: unknown): value is PagefindApi {
  return (
    typeof value === 'object' &&
    value !== null &&
    'search' in value &&
    typeof (value as { search?: unknown }).search === 'function'
  )
}

function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }
  fn()
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    if (char === '&') return '&amp;'
    if (char === '<') return '&lt;'
    if (char === '>') return '&gt;'
    if (char === '"') return '&quot;'
    return '&#39;'
  })
}

function escapeRegex(value: string) {
  const chars = '\\^$.*+?()[]{}|'
  let out = ''
  for (let i = 0; i < value.length; i += 1) {
    const ch = value.charAt(i)
    out += chars.indexOf(ch) !== -1 ? `\\${ch}` : ch
  }
  return out
}

function decodeHtml(value: string) {
  if (!value) return ''
  const text = document.createElement('textarea')
  text.innerHTML = value
  return text.value
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTerms(query: string) {
  const parts = query
    .toLowerCase()
    .split(/\s+/)
    .filter((part) => part.length >= 2)
  const unique: string[] = []
  for (const part of parts) {
    if (!unique.includes(part)) unique.push(part)
  }
  unique.sort((a, b) => b.length - a.length)
  return unique
}

function highlightText(text: string, terms: string[]) {
  if (!text) return ''
  if (!terms.length) return escapeHtml(text)
  const pattern = terms.map(escapeRegex).join('|')
  if (!pattern) return escapeHtml(text)
  const regex = new RegExp(`(${pattern})`, 'gi')
  let out = ''
  let lastIndex = 0
  text.replace(regex, (match, _group, offset) => {
    out += escapeHtml(text.slice(lastIndex, offset))
    out += `<mark class="site-search__highlight">${escapeHtml(match)}</mark>`
    lastIndex = offset + match.length
    return match
  })
  out += escapeHtml(text.slice(lastIndex))
  return out
}

function renderMessage(
  container: HTMLElement,
  message: string,
  modifier: string,
) {
  container.innerHTML = `<p class="site-search__message ${modifier}">${escapeHtml(message)}</p>`
  container.hidden = false
}

type SearchRecord = { url: string; title: string; excerpt: string }

function renderResults(
  container: HTMLElement,
  results: SearchRecord[],
  query: string,
) {
  if (!results.length) {
    renderMessage(container, 'No results found.', 'site-search__message--empty')
    return
  }
  const terms = extractTerms(query)
  let html = '<ul class="site-search__list">'
  for (const result of results) {
    const titleRaw = result.title?.trim() ? result.title.trim() : 'Untitled'
    const title = decodeHtml(titleRaw)
    const excerptRaw = result.excerpt ? stripHtml(result.excerpt) : ''
    const excerpt = decodeHtml(excerptRaw)
    html += `<li class="site-search__item"><a class="site-search__link" href="${escapeHtml(result.url)}"><span class="site-search__title">${highlightText(title, terms)}</span>${excerpt ? `<span class="site-search__excerpt">${highlightText(excerpt, terms)}</span>` : ''}</a></li>`
  }
  html += '</ul>'
  container.innerHTML = html
  container.hidden = false
}

function resolveSearchInput(root: HTMLElement): HTMLInputElement | null {
  const target = root.querySelector('[data-pagefind-input]')
  if (target instanceof HTMLInputElement) return target
  if (!(target instanceof HTMLElement)) return null
  return target.querySelector('input')
}

async function setupSearch(root: HTMLElement) {
  const input = resolveSearchInput(root)
  const output = root.querySelector<HTMLElement>('[data-pagefind-results]')
  if (
    !(input instanceof HTMLInputElement) ||
    !(output instanceof HTMLElement)
  ) {
    return
  }
  const searchInput = input
  const searchOutput = output

  let loadPromise: Promise<PagefindApi> | undefined
  function loadPagefind(): Promise<PagefindApi> {
    const promise =
      loadPromise ??
      (() => {
        const dynamicImport = new Function(
          "return import('/pagefind/pagefind.js')",
        ) as () => Promise<{
          default?: PagefindApi
          search?: PagefindApi['search']
        }>
        const next = dynamicImport().then((mod) => {
          const candidate = mod.default ?? mod
          if (!isPagefindApi(candidate)) {
            throw new Error('Invalid pagefind module')
          }
          return candidate
        })
        loadPromise = next
        return next
      })()
    return promise
  }

  let debounceTimer: ReturnType<typeof globalThis.setTimeout> | 0 = 0
  let requestId = 0

  function hideResults() {
    searchOutput.hidden = true
    searchOutput.innerHTML = ''
  }

  async function performSearch() {
    const query = searchInput.value.trim()
    if (query.length < MIN_QUERY_LENGTH) {
      hideResults()
      return
    }

    const currentRequest = ++requestId
    let pagefind: PagefindApi
    try {
      pagefind = await loadPagefind()
    } catch {
      renderMessage(
        searchOutput,
        'Search index is unavailable. Build the site to enable search.',
        'site-search__message--error',
      )
      return
    }

    let response: PagefindSearchResponse
    try {
      response = await pagefind.search(query)
    } catch {
      renderMessage(
        searchOutput,
        'Search failed. Please try again.',
        'site-search__message--error',
      )
      return
    }

    if (currentRequest !== requestId) return

    const matches = response?.results
      ? response.results.slice(0, RESULT_LIMIT)
      : []
    if (!matches.length) {
      renderResults(searchOutput, [], query)
      return
    }

    const records = await Promise.all(matches.map((match) => match.data()))
    if (currentRequest !== requestId) return

    const mapped = records.map((record): SearchRecord => {
      const meta = record?.meta ?? {}
      return {
        url: record?.url || '/',
        title: typeof meta.title === 'string' ? meta.title : '',
        excerpt: record?.excerpt || '',
      }
    })
    renderResults(searchOutput, mapped, query)
  }

  searchInput.addEventListener('input', () => {
    if (debounceTimer) globalThis.clearTimeout(debounceTimer)
    debounceTimer = globalThis.setTimeout(() => {
      void performSearch()
    }, 120)
  })
  searchInput.addEventListener('focus', () => {
    if (searchInput.value.trim().length >= MIN_QUERY_LENGTH)
      void performSearch()
  })
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      hideResults()
      searchInput.blur()
    }
  })
  document.addEventListener('click', (event) => {
    if (!root.contains(event.target as Node | null)) hideResults()
  })
}

function init() {
  const roots = Array.from(document.querySelectorAll(PAGEFIND_ROOT))
  for (const root of roots) {
    if (root instanceof HTMLElement) void setupSearch(root)
  }
}

ready(init)

export {}
