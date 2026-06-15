import type {
  PageNavigationLink,
  PageNavigationLinks,
  TsSsgContext,
} from '@purestack/ts-common'
import { resolveTsSsgContext } from '@purestack/ts-common'
import { defineComponent, html } from 'regor'

export interface PageLinks extends PageNavigationLinks {
  hasLinks?: boolean
}

const pageLinksTemplate = html`<Grid
  r-if="hasLinks"
  container="nav"
  columns="2"
  class="pt-4 bt-1 b-subtle"
  aria-label="Adjacent pages"
>
  <Flex class="min-w-0" justify="start">
    <BtnLink
      r-if="previous"
      :href="previous.url"
      tone="neutral"
      variant="outline"
      size="sm"
      icon="iconoir:nav-arrow-left"
      iconPosition="start"
      rel="prev"
      class="w-full ws-normal text-start min-w-0 justify-start"
      :ariaLabel="'Previous: ' + previous.title"
    >
      <span class="d-inline-flex flex-column align-flex-start min-w-0">
        <span class="text-eyebrow fs-xxxs">Previous</span>
        <span class="min-w-0 lh-2">{{ previous.title }}</span>
      </span>
    </BtnLink>
  </Flex>
  <Flex class="min-w-0" justify="start" justifySm="end">
    <BtnLink
      r-if="next"
      :href="next.url"
      tone="neutral"
      variant="outline"
      size="sm"
      icon="iconoir:nav-arrow-right"
      iconPosition="end"
      rel="next"
      class="w-full ws-normal text-end min-w-0 justify-end"
      :ariaLabel="'Next: ' + next.title"
    >
      <span class="d-inline-flex flex-column align-flex-end min-w-0">
        <span class="text-eyebrow fs-xxxs">Next</span>
        <span class="min-w-0 lh-2">{{ next.title }}</span>
      </span>
    </BtnLink>
  </Flex>
</Grid>`

function resolvePageLinks(
  props: PageLinks,
  context: TsSsgContext | undefined,
): PageLinks {
  const previous = props.previous ?? context?.navigation?.pageLinks?.previous
  const next = props.next ?? context?.navigation?.pageLinks?.next
  const resolvedPrevious = resolvePageLink(previous)
  const resolvedNext = resolvePageLink(next)
  return {
    previous: resolvedPrevious,
    next: resolvedNext,
    hasLinks: Boolean(resolvedPrevious || resolvedNext),
  }
}

function resolvePageLink(link: PageNavigationLink | undefined) {
  if (!link?.url || !link.title) return undefined
  return link
}

function definePageLinksComponent() {
  return defineComponent<PageLinks>(pageLinksTemplate, {
    props: ['previous', 'next'],
    context: (head) => resolvePageLinks(head.props, resolveTsSsgContext(head)),
  })
}

export function definePageLinksComponents() {
  const pageLinks = definePageLinksComponent()
  return { pageLinks }
}
