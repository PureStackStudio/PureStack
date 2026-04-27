import type { TsSsgContext } from '@purestack/ts-common'

import { resolveTsSsgContext } from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue } from 'regor'
import type { ComponentVariant } from '../componentVariant'

export interface SearchBox {
  placeholder?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
}

const searchBoxTemplate = html`<div class="site-search" data-pagefind-search>
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
  <div
    class="site-search__results doc-content"
    data-pagefind-results
    hidden
  ></div>
</div>`

function defineSearchBoxComponent() {
  return defineComponent<SearchBox>(searchBoxTemplate, {
    props: ['tone', 'variant', 'placeholder'],
    context: (head) => ({
      tone: head.props.tone,
      variant: head.props.variant,
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
