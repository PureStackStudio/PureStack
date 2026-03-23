import { defineComponent, html } from 'regor'
import { resolveTsSsgContext } from '../../render/resolveTsSsgContext'
import type { PageOutlineItem, TsSsgContext } from '../../render/ts-ssg-context'
import { registerPageTocStyles } from './pageTocStyle'

export interface PageToc {
  items?: PageOutlineItem[]
  title?: string
}

interface PageTocItem extends PageOutlineItem {
  href: string
  children?: PageTocItem[]
}

const pageTocTemplate = html`<nav class="page-toc" aria-label="On this page">
  <button
    class="page-toc__panel-toggle"
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
      <a class="page-toc__link" :href="item.href">{{ item.title }}</a>
      <ul
        r-if="item.children && item.children.length > 0"
        class="page-toc__list page-toc__list--nested"
      >
        <li
          r-for="child in item.children"
          class="page-toc__item page-toc__item--h3"
        >
          <a class="page-toc__link page-toc__link--sub" :href="child.href"
            >{{ child.title }}</a
          >
        </li>
      </ul>
    </li>
  </ul>
  <div class="page-toc__empty" r-else>No sections yet.</div>
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

function resolveItems(props: PageToc, context: TsSsgContext | undefined) {
  const items = props.items ?? context?.outline ?? []
  return toPageTocItems(items)
}

function resolveTitle(props: PageToc) {
  return typeof props.title === 'string' && props.title.trim().length > 0
    ? props.title.trim()
    : 'On this page'
}

function createPageTocComponent() {
  return defineComponent<PageToc>(pageTocTemplate, {
    props: ['items', 'title'],
    context: (head) => {
      const context = resolveTsSsgContext(head)
      return {
        title: resolveTitle(head.props),
        items: resolveItems(head.props, context),
      }
    },
  })
}

export function createPageTocComponents() {
  registerPageTocStyles()
  const pageToc = createPageTocComponent()
  return { pageToc }
}
