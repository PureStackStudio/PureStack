import type { PageOutlineItem, TsSsgContext } from '@purestack/ts-common'
import { resolveTsSsgContext } from '@purestack/ts-common'
import {
  getSemanticToneButtonClass,
  getSemanticToneInteractiveClass,
  getSemanticToneSurfaceClass,
  type SemanticTone,
} from '@purestack/ts-style'
import { type ComputedRef, computed, defineComponent, html } from 'regor'

export interface PageToc {
  items?: PageOutlineItem[]
  title?: string
  tone?: SemanticTone
  toneClass?: ComputedRef<string>
  interactiveToneClass?: ComputedRef<string>
  buttonToneClass?: ComputedRef<string>
}

export interface PageTocItem extends PageOutlineItem {
  href: string
  toneClass?: string
  children?: PageTocItem[]
}

const pageTocTemplate = html`<nav class="page-toc" :class="toneClass" aria-label="On this page">
  <button
    class="page-toc__panel-toggle"
    :class="buttonToneClass"
    type="button"
    aria-controls="doc-toc"
    aria-expanded="false"
  >
    <span class="page-toc__panel-toggle-label">on this page</span>
  </button>
  <div class="page-toc__header-row">
    <div class="page-toc__header">{{ title }}</div>
    <button
      class="page-toc__restore-toggle"
      :class="interactiveToneClass"
      type="button"
      title="Collapse table of contents"
      aria-label="Collapse table of contents"
      data-page-toc-restore
    >
      <span class="page-toc__header-toggle-icon page-toc__header-toggle-icon--collapse">
        <Icon name="iconoir:pin-slash" />
      </span>
      <span class="page-toc__header-toggle-icon page-toc__header-toggle-icon--restore">
        <Icon name="iconoir:pin" />
      </span>
    </button>
  </div>
  <ul class="page-toc__list" r-if="items.length > 0">
    <li r-for="item in items" class="page-toc__item page-toc__item--h2">
      <a class="page-toc__link" :class="item.toneClass" :href="item.href">{{ item.title }}</a>
      <ul
        r-if="item.children && item.children.length > 0"
        class="page-toc__list page-toc__list--nested"
      >
        <li
          r-for="child in item.children"
          class="page-toc__item page-toc__item--h3"
        >
          <a
            class="page-toc__link page-toc__link--sub"
            :class="child.toneClass"
            :href="child.href"
          >{{ child.title }}</a>
        </li>
      </ul>
    </li>
  </ul>
  <div class="page-toc__empty" r-else>No sections yet.</div>
</nav>`

function toPageTocItems(
  items: PageOutlineItem[],
  tone: SemanticTone | undefined,
): PageTocItem[] {
  return items.map((item) => {
    const { children, ...rest } = item
    const mappedChildren = children ? toPageTocItems(children, tone) : undefined
    return {
      ...rest,
      href: `#${item.id}`,
      toneClass: getSemanticToneInteractiveClass(tone),
      ...(mappedChildren ? { children: mappedChildren } : {}),
    }
  })
}

function resolveItems(
  props: PageToc,
  context: TsSsgContext | undefined,
  tone: SemanticTone | undefined,
) {
  const items = props.items ?? context?.outline ?? []
  return toPageTocItems(items, tone)
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
        toneClass: computed(() => getSemanticToneSurfaceClass(tone, false)),
        interactiveToneClass: computed(() =>
          getSemanticToneInteractiveClass(tone),
        ),
        buttonToneClass: computed(() => getSemanticToneButtonClass(tone)),
        items: resolveItems(head.props, context, tone),
      }
    },
  })
}

export function definePageTocComponents() {
  const pageToc = definePageTocComponent()
  return { pageToc }
}
