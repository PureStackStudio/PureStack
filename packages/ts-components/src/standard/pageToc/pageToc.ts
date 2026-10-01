import type { PageOutlineItem, TsSsgContext } from '@purestack/ts-common'
import { resolveTsSsgContext } from '@purestack/ts-common'
import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
import { type ComputedRef, computed, defineComponent, html } from 'regor'

export interface PageToc {
  items?: PageOutlineItem[]
  title?: string
  tone?: SemanticTone
  toneClass?: ComputedRef<string>
}

export interface PageTocItem extends PageOutlineItem {
  href: string
  children?: PageTocItem[]
}

const pageTocTemplate = html`<nav
  class="page-toc tone-fill-flat tone-border-surface tone-text-surface"
  :class="toneClass"
  aria-label="On this page"
>
  <button
    class="page-toc__panel-toggle tone-fill-button-all tone-text-button-all tone-border-button-all"
    type="button"
    aria-controls="doc-toc"
    aria-expanded="false"
  >
    <span class="page-toc__panel-toggle-label">on this page</span>
  </button>
  <div class="page-toc__header-row">
    <div class="page-toc__header">{{ title }}</div>
    <button
      class="page-toc__restore-toggle tone-text-button-all tone-fill-button-hover tone-fill-button-active tone-border-button-hover tone-border-button-active opacity-25 opacity-1-hover"
      type="button"
      title="Collapse table of contents"
      aria-label="Collapse table of contents"
      data-page-toc-restore
    >
      <span
        class="page-toc__header-toggle-icon page-toc__header-toggle-icon--collapse p-1"
      >
        <Icon name="iconoir:pin-slash"/>
      </span>
      <span
        class="page-toc__header-toggle-icon page-toc__header-toggle-icon--restore p-1"
      >
        <Icon name="iconoir:pin"/>
      </span>
    </button>
  </div>
  <ul class="page-toc__list" r-if="items.length > 0">
    <li r-for="item in items" class="page-toc__item page-toc__item--h2">
      <BtnLink
        variant="link"
        :href="item.href"
        class="page-toc__link justify-start w-full ws-normal fw-400 fs-sm tone-fill-button-active tone-text-button-active py-1 pl-2"
      >
        {{ item.title }}
      </BtnLink>
      <ul
        r-if="item.children && item.children.length > 0"
        class="page-toc__list page-toc__list--nested"
      >
        <li
          r-for="child in item.children"
          class="page-toc__item page-toc__item--h3"
        >
          <BtnLink
            variant="link"
            :href="child.href"
            class="page-toc__link page-toc__link--sub justify-start w-full ws-normal fw-200 fs-xs tone-fill-button-active tone-text-button-active py-1 pl-2"
          >
            {{ child.title }}
          </BtnLink>
        </li>
      </ul>
    </li>
  </ul>
  <div class="page-toc__empty" r-else>No sections yet.</div>
  <script>
    window.tsSsgPageToc?.hydrate(document.currentScript?.parentElement)
  </script>
</nav>`

function toPageTocItems(items: PageOutlineItem[]): PageTocItem[] {
  return items.map((item) => {
    const { children, ...rest } = item
    const mappedChildren = children ? toPageTocItems(children) : undefined
    return {
      ...rest,
      href: `#${item.id}`,
      ...(mappedChildren ? { children: mappedChildren } : {}),
    }
  })
}

function omitSingleDocumentHeading(items: PageOutlineItem[]) {
  if (items.length !== 1) return items
  const [item] = items
  if (!item || item.depth !== 1) return items
  return item.children ?? []
}

function resolveItems(props: PageToc, context: TsSsgContext | undefined) {
  const items = props.items ?? context?.outline ?? []
  return toPageTocItems(omitSingleDocumentHeading(items))
}

function resolveTitle(props: PageToc) {
  return typeof props.title === 'string' && props.title.trim().length > 0
    ? props.title.trim()
    : 'On this page'
}

function definePageTocComponent() {
  return defineComponent<PageToc>(pageTocTemplate, {
    props: ['items', 'title', 'tone'],
    context: (head) => {
      const context = resolveTsSsgContext(head)
      const tone = head.props.tone
      return {
        title: resolveTitle(head.props),
        toneClass: computed(() => getSemanticToneClass(tone)),
        items: resolveItems(head.props, context),
      }
    },
  })
}

export function definePageTocComponents() {
  const pageToc = definePageTocComponent()
  return { pageToc }
}
