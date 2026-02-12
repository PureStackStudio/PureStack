import { createComponent, html } from 'regor'

import type { PageOutlineItem } from '../../mdx/mdx'
import { styleBuilder } from '../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'
import { resolveTsSsgContext } from '../resolveTsSsgContext'
import type { TsSsgContext } from '../ts-ssg-context'

interface PageTocContext {
  items?: PageOutlineItem[]
  title?: string
}

interface PageTocItemContext extends PageOutlineItem {
  href: string
  children?: PageTocItemContext[]
}

const pageTocTemplate = html`<nav class="page-toc" aria-label="On this page">
  <button
    class="page-toc__mobile-toggle"
    type="button"
    aria-controls="doc-toc"
    aria-expanded="false"
  >
    <span class="page-toc__mobile-toggle-icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d="M7 7l10 10"></path>
        <path d="M17 7L7 17"></path>
      </svg>
    </span>
    <span class="page-toc__mobile-toggle-label">on this page</span>
  </button>
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

function toPageTocItems(items: PageOutlineItem[]): PageTocItemContext[] {
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

function resolveItems(
  props: PageTocContext,
  context: TsSsgContext | undefined,
) {
  const items = props.items ?? context?.outline ?? []
  return toPageTocItems(items)
}

function resolveTitle(props: PageTocContext) {
  return typeof props.title === 'string' && props.title.trim().length > 0
    ? props.title.trim()
    : 'On this page'
}

function registerPageTocStyles() {
  themes.forEach((theme, palette, options) => {
    registerPageTocShellStyles(theme, palette, options)
    registerPageTocLinkStyles(theme, palette, options)
    registerPageTocTargetStyles(theme, palette)
    registerPageTocLayoutStyles(theme, palette, options)
  })
}

function registerPageTocShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.page-toc', theme)
    .display('grid')
    .alignContent('start')
    .position('relative')
    .gap('12px')
    .padding('16px')
    .borderRadius(options.radii.lg)
    .border('1px solid transparent')
    .fontSize('0.95rem')
    .lineHeight('1.5')
    .background(palette.background.surface)
    .borderColor(palette.border.subtle)
    .color(palette.text.default)
  styleBuilder
    .select('.page-toc__header', theme)
    .fontWeight('700')
    .fontSize('0.95rem')
    .letterSpacing('0.02em')
    .textTransform('uppercase')
    .color(palette.text.subtle)
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
    .borderLeft(`1px solid ${palette.border.default}`)
  styleBuilder.select('.page-toc__item', theme).display('grid')
  styleBuilder
    .select('.page-toc__empty', theme)
    .fontSize('0.9rem')
    .fontWeight('600')
    .color(palette.text.subtle)

  styleBuilder.select('.page-toc__mobile-toggle', theme).display('none')
}

function registerPageTocLinkStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.page-toc__link', theme)
    .display('block')
    .padding('6px 10px')
    .borderRadius(options.radii.md)
    .textDecoration('none')
    .fontWeight('600')
    .transition('background 160ms ease, color 160ms ease')
    .color(palette.text.default)
  styleBuilder
    .select('.page-toc__link:hover', theme)
    .background(palette.background.accentMuted)
  styleBuilder
    .select('.page-toc__link:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.page-toc__link--active', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
  styleBuilder
    .select('.page-toc__link--active:hover', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
  styleBuilder
    .select('.page-toc__link--sub.page-toc__link--active:hover', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)

  styleBuilder
    .select('.page-toc__link--sub', theme)
    .fontWeight('500')
    .color(palette.text.subtle)
  styleBuilder
    .select('.page-toc__link--sub:not(.page-toc__link--active):hover', theme)
    .color(palette.text.subtle)
  styleBuilder
    .select('.page-toc__link--sub.page-toc__link--active', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
}

function registerPageTocTargetStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content .page-toc__target', theme)
    .scrollMarginTop('96px')
    .padding('0')
    .borderRadius('0')
    .transition('background 200ms ease, color 200ms ease')
    .background(palette.background.feature)
    .color(palette.text.accent)
}

function registerPageTocLayoutStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
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
    .select('.doc-shell--toc', theme)
    .media('max-width: 1320px')
    .gridTemplateColumns('260px minmax(0, 1fr)')
  styleBuilder
    .select('.doc-shell--toc', theme)
    .media('max-width: 1023px')
    .gridTemplateColumns('1fr')
  styleBuilder
    .select('.doc-shell--toc-only', theme)
    .media('max-width: 1320px')
    .gridTemplateColumns('1fr')
  styleBuilder
    .select('.doc-shell--nav-drawer.doc-shell--toc', theme)
    .media('max-width: 1320px')
    .gridTemplateColumns('1fr')
  styleBuilder
    .select('.doc-toc', theme)
    .position('fixed')
    .top('88px')
    .right('calc((100vw - min(1400px, 100vw)) / 2 + 32px)')
    .width('240px')
    .alignSelf('start')
    .height('calc(100vh - 112px)')
    .overflow('auto')
  styleBuilder.select('.template-doc--full-main .doc-toc', theme).right('32px')
  styleBuilder
    .select('.template-doc--full-main .doc-toc', theme)
    .media('max-width: 1320px')
    .right('0')
  styleBuilder
    .select('.doc-toc', theme)
    .media('max-width: 1320px')
    .position('fixed')
    .top('0')
    .left('0')
    .right('0')
    .width('auto')
    .maxWidth('none')
    .height('100dvh')
    .zIndex(140)
    .overflow('hidden')
    .transform('translateX(calc(100% - 26px))')
    .transition('transform 260ms ease')
    .background(palette.background.canvas)
    .boxShadow(options.shadows.strong)

  styleBuilder
    .select('.doc-toc.doc-toc--open', theme)
    .media('max-width: 1320px')
    .transform('translateX(0)')

  styleBuilder
    .select('.doc-toc:not(.doc-toc--open)', theme)
    .media('max-width: 1320px')
    .background('transparent')
    .boxShadow('none')
    .set('pointer-events', 'none')

  styleBuilder
    .select('.template-doc.doc-toc-open', theme)
    .media('max-width: 1320px')
    .overflow('hidden')

  styleBuilder
    .select('.page-toc__mobile-toggle', theme)
    .media('max-width: 1320px')
    .position('absolute')
    .left('0')
    .right('auto')
    .top('85%')
    .transform('translateY(-50%) rotate(180deg)')
    .set('writing-mode', 'vertical-rl')
    .set('text-orientation', 'mixed')
    .width('26px')
    .height('120px')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .fontSize('0.70rem')
    .fontWeight('700')
    .set('letter-spacing', '0.12em')
    .set('text-transform', 'uppercase')
    .color(palette.text.subtle)
    .background(palette.background.raised)
    .border(`1px solid ${palette.border.default}`)
    .set('border-left', 'none')
    .set('border-radius', `0 ${options.radii.md} ${options.radii.md} 0`)
    .boxShadow('none')
    .set('user-select', 'none')
    .cursor('pointer')
    .set('pointer-events', 'auto')
    .zIndex(2)

  styleBuilder
    .select('.page-toc__mobile-toggle-icon', theme)
    .media('max-width: 1320px')
    .display('none')

  styleBuilder
    .select('.page-toc__mobile-toggle-icon svg', theme)
    .media('max-width: 1320px')
    .width('14px')
    .height('14px')
    .display('block')
    .fill('none')
    .stroke('currentColor')
    .set('stroke-width', '2.1')
    .set('stroke-linecap', 'round')

  styleBuilder
    .select(
      '.doc-toc:not(.doc-toc--open) .page-toc > :not(.page-toc__mobile-toggle)',
      theme,
    )
    .media('max-width: 1320px')
    .display('none')

  styleBuilder
    .select('.doc-toc:not(.doc-toc--open) .page-toc', theme)
    .media('max-width: 1320px')
    .background('transparent')
    .border('none')

  styleBuilder
    .select('.page-toc__mobile-toggle:focus-visible', theme)
    .media('max-width: 1320px')
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.doc-toc.doc-toc--open .page-toc__mobile-toggle', theme)
    .media('max-width: 1320px')
    .left('auto')
    .right('16px')
    .top('16px')
    .transform('none')
    .set('writing-mode', 'horizontal-tb')
    .width('auto')
    .height('auto')
    .padding('6px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('3px')
    .set('letter-spacing', '0.08em')
    .border(`1px solid ${palette.border.default}`)
    .set('border-radius', options.radii.md)

  styleBuilder
    .select('.doc-toc.doc-toc--open .page-toc__mobile-toggle-icon', theme)
    .media('max-width: 1320px')
    .display('inline-flex')

  styleBuilder
    .select('.doc-toc.doc-toc--open .page-toc__mobile-toggle:hover', theme)
    .media('max-width: 1320px')
    .color(palette.text.accent)
    .background(palette.background.accentMuted)

  styleBuilder
    .select('.doc-toc .page-toc', theme)
    .media('max-width: 1320px')
    .height('100%')
    .overflow('visible')
    .padding('0')
    .borderRadius('0')
    .set('-webkit-overflow-scrolling', 'touch')

  styleBuilder
    .select('.doc-toc.doc-toc--open .page-toc', theme)
    .media('max-width: 1320px')
    .padding('30px 16px 14px')
    .gap('2px')
    .overflow('auto')

  styleBuilder
    .select('.doc-toc .page-toc__header', theme)
    .media('max-width: 1320px')
    .paddingRight('104px')

  styleBuilder
    .select('.doc-toc .page-toc > .page-toc__list', theme)
    .media('max-width: 1320px')
    .paddingBottom('8px')

  styleBuilder
    .select('.doc-toc .page-toc__empty', theme)
    .media('max-width: 1320px')
    .paddingBottom('8px')
}

function createPageTocComponent() {
  return createComponent<PageTocContext>(pageTocTemplate, {
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

