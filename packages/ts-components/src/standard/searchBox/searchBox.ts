import type { PageContext } from '@purestack/ts-common'

import { resolvePageContext } from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue } from 'regor'
import type { ComponentVariant } from '../componentVariant'

export interface SearchBox {
  placeholder?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
}

const searchBoxTemplate = html`<div class="site-search" data-pagefind-search>
  <div class="site-search__control">
    <FormInputField
      icon="tabler:search"
      :tone="tone"
      :variant="variant"
      type="search"
      name="q"
      :placeholder="placeholder"
      autocomplete="off"
      spellcheck="false"
      data-pagefind-input
      aria-label="Search site content"/>
    <kbd class="site-search__shortcut" aria-hidden="true">/</kbd>
    <button
      class="site-search__close"
      type="button"
      data-pagefind-close
      aria-label="Close search"
    >
      <Icon name="tabler:x"/>
    </button>
  </div>
  <span class="site-search__sr-only" data-pagefind-status role="status"></span>
  <div
    class="site-search__results"
    data-pagefind-results
    role="region"
    aria-label="Site search"
    hidden
  ></div>
</div>`

function defineSearchBoxComponent() {
  return defineComponent<SearchBox>(searchBoxTemplate, {
    props: ['tone', 'variant', 'placeholder'],
    context: (head) => ({
      tone: head.props.tone,
      variant: head.props.variant,
      placeholder:
        head.props.placeholder ??
        resolveSearchPlaceholder(resolvePageContext(head)),
    }),
  })
}

export function defineSearchComponents() {
  return { searchBox: defineSearchBoxComponent() }
}

function resolveSearchPlaceholder(context: PageContext): string {
  const title = context?.site?.siteTitle
  if (typeof title !== 'string') return 'Search'
  const trimmed = title.trim()
  if (trimmed.length === 0) return 'Search'
  return `Search ${trimmed}`
}
