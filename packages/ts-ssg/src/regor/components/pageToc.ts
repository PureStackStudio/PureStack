import { createComponent, html } from 'regor'

import type { PageOutlineItem } from '../../mdx/mdx'
import { styleBuilder } from '../../style/styles'
import { themes } from '../../style/themeOptions'
import { resolveTsSsgContext } from '../resolveTsSsgContext'
import type { TsSsgContext } from '../ts-ssg-context'

interface PageTocProps {
  items?: PageOutlineItem[]
  title?: string
}

interface PageTocItem extends PageOutlineItem {
  href: string
  children?: PageTocItem[]
}

const pageTocTemplate = html`<nav class="page-toc" aria-label="On this page">
  <div class="page-toc__header">{{ title }}</div>
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

function resolveItems(props: PageTocProps, context: TsSsgContext | undefined) {
  const items = props.items ?? context?.outline ?? []
  return toPageTocItems(items)
}

function resolveTitle(props: PageTocProps) {
  return typeof props.title === 'string' && props.title.trim().length > 0
    ? props.title.trim()
    : 'On this page'
}

function registerPageTocStyles() {
  themes.forEach((theme, palette, options) => {
    styleBuilder
      .select('.page-toc', theme)
      .display('grid')
      .gap('12px')
      .padding('16px')
      .borderRadius(options.radii.lg)
      .border('1px solid transparent')
      .fontSize('0.95rem')
      .lineHeight('1.5')
      .background(palette.nav.background)
      .borderColor(palette.nav.border)
      .color(palette.panel.text)

    styleBuilder
      .select('.page-toc__header', theme)
      .fontWeight('700')
      .fontSize('0.95rem')
      .letterSpacing('0.02em')
      .textTransform('uppercase')
      .color(palette.nav.textMuted)

    styleBuilder
      .select('.page-toc__list', theme)
      .listStyle('none')
      .margin('0')
      .padding('0')
      .display('grid')
      .gap('6px')

    styleBuilder
      .select('.page-toc__list--nested', theme)
      .paddingLeft('12px')
      .borderLeft(`1px solid ${palette.nav.nestedBorder}`)

    styleBuilder.select('.page-toc__item', theme).display('grid')

    styleBuilder
      .select('.page-toc__link', theme)
      .display('block')
      .padding('6px 10px')
      .borderRadius(options.radii.md)
      .textDecoration('none')
      .fontWeight('600')
      .transition('background 160ms ease, color 160ms ease')
      .color(palette.nav.text)

    styleBuilder
      .select('.page-toc__link:hover', theme)
      .background(palette.nav.hoverBackground)

    styleBuilder
      .select('.page-toc__link--active', theme)
      .background(palette.nav.activeBackground)
      .color(palette.nav.activeText)

    styleBuilder
      .select('.page-toc__link--active:hover', theme)
      .background(palette.nav.activeBackground)
      .color(palette.nav.activeText)

    styleBuilder
      .select('.page-toc__link--sub.page-toc__link--active:hover', theme)
      .background(palette.nav.activeBackground)
      .color(palette.nav.activeText)

    styleBuilder
      .select('.page-toc__link:focus-visible', theme)
      .outline(`2px solid ${palette.nav.focusRing}`)
      .outlineOffset('2px')

    styleBuilder
      .select('.page-toc__link--sub', theme)
      .fontWeight('500')
      .color(palette.nav.textMuted)

    styleBuilder
      .select('.page-toc__link--sub:not(.page-toc__link--active):hover', theme)
      .color(palette.nav.textMuted)

    styleBuilder
      .select('.page-toc__link--sub.page-toc__link--active', theme)
      .background(palette.nav.activeBackground)
      .color(palette.nav.activeText)

    styleBuilder
      .select('.page-toc__empty', theme)
      .fontSize('0.9rem')
      .fontWeight('600')
      .color(palette.nav.textMuted)

    styleBuilder
      .select('.doc-content .page-toc__target', theme)
      .scrollMarginTop('96px')
      .padding('0')
      .borderRadius('0')
      .transition('background 200ms ease, color 200ms ease')
      .background(palette.surface.altBackground)
      .color('#bd5454')

    styleBuilder
      .select('.doc-shell--toc', theme)
      .gridTemplateColumns('260px minmax(0, 1fr) 240px')

    styleBuilder
      .select('.doc-shell--toc-only', theme)
      .gridTemplateColumns('minmax(0, 1fr) 240px')

    styleBuilder
      .select('.doc-shell--nav-drawer.doc-shell--toc', theme)
      .gridTemplateColumns('minmax(0, 1fr) 240px')

    styleBuilder
      .select('.doc-toc', theme)
      .position('fixed')
      .top('88px')
      .right('calc((100vw - min(1200px, 100vw)) / 2 + 32px)')
      .width('240px')
      .alignSelf('start')
      .height('calc(100vh - 112px)')
      .overflow('auto')

    styleBuilder.select('.template-doc--full-main .doc-toc', theme).right('32px')

    styleBuilder
      .select('.doc-toc', theme)
      .media('max-width: 1023px')
      .position('static')
      .right('auto')
      .width('auto')
      .top('auto')
      .height('auto')
  })
}

function createPageTocComponent() {
  return createComponent<PageTocProps>(pageTocTemplate, {
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
