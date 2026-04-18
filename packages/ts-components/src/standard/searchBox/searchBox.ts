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
      <Icon name="tabler:search"/>
    </span>
    <input
      class="site-search__input"
      type="search"
      name="q"
      :placeholder="placeholder"
      autocomplete="off"
      spellcheck="false"
      data-pagefind-input
      aria-label="Search site content"/>
  </label>
  <div
    class="site-search__results doc-content"
    data-pagefind-results
    hidden
  ></div>
</div>`

function defineSearchBoxComponent() {
  return defineComponent<SearchBox>(searchBoxTemplate, {
    context: (head) => ({
      placeholder: resolveSearchPlaceholder(resolveTsSsgContext(head)),
    }),
  })
}

export function defineSearchComponents() {
  return { searchBox: defineSearchBoxComponent() }
}

function resolveSearchPlaceholder(context: TsSsgContext): string {
  const title = context?.site?.siteTitle
  if (typeof title !== 'string') return 'Search'
  const trimmed = title.trim()
  if (trimmed.length === 0) return 'Search'
  return `Search ${trimmed}`
}
