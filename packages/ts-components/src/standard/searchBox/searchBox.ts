import type { TsSsgContext } from '@purestack/ts-common'

import { resolveTsSsgContext } from '@purestack/ts-common'
import { defineComponent, html } from 'regor'

export interface SearchBox {
  placeholder: string
}

const searchBoxTemplate = html`<div class="site-search" data-pagefind-search>
  <label class="site-search__field">
    <span class="site-search__sr-only">Search site</span>
    <span class="site-search__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="11" cy="11" r="6.5"></circle>
        <path d="M16 16l4.25 4.25"></path>
      </svg>
    </span>
    <input
      class="site-search__input"
      type="search"
      name="q"
      :placeholder="placeholder"
      autocomplete="off"
      spellcheck="false"
      data-pagefind-input
      aria-label="Search site content"
    />
  </label>
  <div
    class="site-search__results doc-content"
    data-pagefind-results
    hidden
  ></div>
</div>`

function createSearchBoxComponent() {
  return defineComponent<SearchBox>(searchBoxTemplate, {
    context: (head) => ({
      placeholder: resolveSearchPlaceholder(resolveTsSsgContext(head)),
    }),
  })
}

export function createSearchComponents() {
  return { siteSearch: createSearchBoxComponent() }
}

function resolveSearchPlaceholder(context: TsSsgContext): string {
  const title = context?.site?.siteTitle
  if (typeof title !== 'string') return 'Search'
  const trimmed = title.trim()
  if (trimmed.length === 0) return 'Search'
  return `Search ${trimmed}`
}
