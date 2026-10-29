import {
  renderSearchMessage,
  renderSearchResults,
  type SearchRecord,
} from './pagefindSearchResults'
import { createSearchViewport } from './pagefindSearchViewport'

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

declare global {
  interface Window {
    tsSsgPagefindBasePath?: string
  }
}

function isPagefindApi(value: unknown): value is PagefindApi {
  return (
    typeof value === 'object' &&
    value !== null &&
    'search' in value &&
    typeof value.search === 'function'
  )
}

function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }
  fn()
}

function resolveSearchInput(root: HTMLElement): HTMLInputElement | null {
  const target = root.querySelector('[data-pagefind-input]')
  if (target instanceof HTMLInputElement) return target
  if (!(target instanceof HTMLElement)) return null
  return target.querySelector('input')
}

function isSearchVisible(input: HTMLElement) {
  const rect = input.getBoundingClientRect()
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.left < window.innerWidth &&
    rect.right > 0 &&
    !input.closest('[inert]')
  )
}

function resolveBasePath() {
  const raw = window.tsSsgPagefindBasePath
  if (typeof raw !== 'string') return ''
  const trimmed = raw.trim()
  if (!trimmed || trimmed === '/') return ''
  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  return normalized.replace(/\/+$/, '')
}

function withBasePath(basePath: string, url: string) {
  if (!basePath || !url.startsWith('/')) return url
  if (url === basePath || url.startsWith(`${basePath}/`)) return url
  if (url === '/') return `${basePath}/`
  return `${basePath}${url}`
}

function setupSearch(root: HTMLElement, index: number) {
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
  const status = root.querySelector('[data-pagefind-status]')
  const basePath = resolveBasePath()
  searchOutput.id = `site-search-results-${index}`
  searchInput.setAttribute('aria-controls', searchOutput.id)
  const viewport = createSearchViewport(root, searchOutput)

  function showMessage(
    title: string,
    detail: string,
    state: 'idle' | 'loading' | 'empty' | 'error',
  ) {
    renderSearchMessage(searchOutput, title, detail, state)
    viewport.update()
  }

  let loadPromise: Promise<PagefindApi> | undefined
  function loadPagefind(): Promise<PagefindApi> {
    const promise =
      loadPromise ??
      (() => {
        const pagefindPath = `${basePath}/pagefind/pagefind.js`
        const dynamicImport = new Function(
          `return import(${JSON.stringify(pagefindPath)})`,
        ) as () => Promise<{ default?: unknown; search?: unknown }>
        const next = dynamicImport().then((mod) => {
          const candidate = mod.default ?? mod
          if (!isPagefindApi(candidate)) {
            throw new Error('Invalid pagefind module')
          }
          return candidate
        })
        loadPromise = next.catch((error: unknown) => {
          loadPromise = undefined
          throw error
        })
        return loadPromise
      })()
    return promise
  }

  let debounceTimer: ReturnType<typeof globalThis.setTimeout> | 0 = 0
  let requestId = 0

  function announce(message: string) {
    if (status) status.textContent = message
  }

  function cancelSearch() {
    requestId += 1
    if (debounceTimer) globalThis.clearTimeout(debounceTimer)
    searchOutput.removeAttribute('aria-busy')
  }

  function hideResults() {
    cancelSearch()
    viewport.hide()
    searchOutput.hidden = true
    searchOutput.innerHTML = ''
    announce('')
  }

  async function performSearch(query: string, currentRequest: number) {
    searchOutput.setAttribute('aria-busy', 'true')
    showMessage(
      'Searching…',
      'Finding the best matches across this site.',
      'loading',
    )
    announce('Searching')
    let pagefind: PagefindApi
    try {
      pagefind = await loadPagefind()
    } catch {
      if (currentRequest !== requestId) return
      searchOutput.removeAttribute('aria-busy')
      showMessage(
        'Search is unavailable',
        'The search index is unavailable. Please try again later.',
        'error',
      )
      announce('Search is unavailable')
      return
    }

    if (currentRequest !== requestId) return
    try {
      const response = await pagefind.search(query)
      if (currentRequest !== requestId) return
      const allMatches = response?.results ?? []
      const matches = allMatches.slice(0, RESULT_LIMIT)
      const records = await Promise.all(matches.map((match) => match.data()))
      if (currentRequest !== requestId) return
      const mapped = records.map((record): SearchRecord => {
        const meta = record?.meta ?? {}
        return {
          url: withBasePath(basePath, record?.url || '/'),
          title: typeof meta.title === 'string' ? meta.title : '',
          excerpt: record?.excerpt || '',
        }
      })
      renderSearchResults(
        searchOutput,
        mapped,
        query,
        allMatches.length,
        basePath,
      )
      viewport.update()
      announce(
        `${allMatches.length} ${allMatches.length === 1 ? 'result' : 'results'} for ${query}`,
      )
    } catch {
      if (currentRequest !== requestId) return
      showMessage(
        'We couldn’t finish that search',
        'Please try your search again in a moment.',
        'error',
      )
      announce('Search failed. Please try again.')
    } finally {
      if (currentRequest === requestId)
        searchOutput.removeAttribute('aria-busy')
    }
  }

  function scheduleSearch() {
    cancelSearch()
    const query = searchInput.value.trim()
    if (query.length < MIN_QUERY_LENGTH) {
      showMessage(
        query ? 'Keep typing…' : 'What are you looking for?',
        `Search this site with at least ${MIN_QUERY_LENGTH} characters.`,
        'idle',
      )
      announce('')
      return
    }
    // Remove old links immediately so Enter cannot open a stale result.
    searchOutput.hidden = true
    searchOutput.innerHTML = ''
    viewport.update()
    const currentRequest = requestId
    debounceTimer = globalThis.setTimeout(() => {
      void performSearch(query, currentRequest)
    }, 120)
  }

  searchInput.addEventListener('input', scheduleSearch)
  root.querySelector('[data-pagefind-close]')?.addEventListener('click', () => {
    hideResults()
    searchInput.blur()
  })
  searchInput.addEventListener('focus', () => {
    if (searchOutput.hidden) scheduleSearch()
  })
  root.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      searchInput.focus()
      hideResults()
      searchInput.blur()
      return
    }
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    if (
      searchOutput.hidden ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.isComposing
    )
      return
    const links = Array.from(
      searchOutput.querySelectorAll<HTMLAnchorElement>('.site-search__link'),
    )
    if (!links.length) return
    event.preventDefault()
    const activeElement = document.activeElement
    const current =
      activeElement instanceof HTMLAnchorElement
        ? links.indexOf(activeElement)
        : -1
    const next =
      event.key === 'ArrowDown'
        ? current + 1
        : current < 0
          ? links.length - 1
          : current - 1
    if (next < 0 || next >= links.length) searchInput.focus()
    else links[next].focus()
  })
  root.addEventListener('focusout', (event) => {
    if (
      !(event.relatedTarget instanceof Node) ||
      !root.contains(event.relatedTarget)
    )
      hideResults()
  })
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Node) || !root.contains(event.target))
      hideResults()
  })
  document.addEventListener('keydown', (event) => {
    if (
      event.key !== '/' ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey ||
      event.isComposing ||
      event.defaultPrevented
    )
      return
    const target = event.target
    if (
      target instanceof HTMLElement &&
      target.closest(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]',
      )
    )
      return
    // Only the first visible SearchBox handles the global shortcut.
    const first = Array.from(
      document.querySelectorAll<HTMLElement>('[data-pagefind-input]'),
    ).find(isSearchVisible)
    if (first !== searchInput) return
    event.preventDefault()
    searchInput.focus()
  })
}

function init() {
  const roots = Array.from(document.querySelectorAll(PAGEFIND_ROOT))
  roots.forEach((root, index) => {
    if (root instanceof HTMLElement) setupSearch(root, index)
  })
}

ready(init)
