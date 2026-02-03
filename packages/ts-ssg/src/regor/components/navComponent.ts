import { createComponent, html } from 'regor'

import type { NavItem } from '../../navigation/navigation'
import { styleBuilder } from '../../style/styles'
import { getThemeOptions, getThemePalette } from '../../style/themeOptions'
import type { TsSsgContext } from '../../ts-ssg-context'
import { resolveTsSsgContext } from './resolveTsSsgContext'

interface NavMenuProps {
  items?: NavItem[]
}

interface NavListProps {
  items?: NavItemState[]
}

const navItemTemplate = html`<li class="nav__item">
  <slot name="content"></slot>
  <slot name="children"></slot>
</li>`

const navListTemplate = html`<ul class="nav__list">
  <nav-item r-for="item in items">
    <template #content>
      <details
        r-if="item.children && item.children.length > 0"
        class="nav__group"
        :open="item.isOpen"
      >
        <summary
          class="nav__summary"
          :class="{
            'nav__summary--active': item.isActive,
            'nav__summary--open': item.isOpen,
          }"
        >
          <span class="nav__summary-content">
            <a
              r-if="item.url"
              class="nav__link"
              :class="{ 'nav__link--active': item.isActive }"
              :href="item.url"
              :aria-current="item.isActive ? 'page' : null"
              >{{ item.title }}</a
            >
            <span r-else class="nav__text">{{ item.title }}</span>
            <span r-if="item.group" class="nav__badge">{{ item.group }}</span>
          </span>
          <span class="nav__chevron" aria-hidden="true"></span>
        </summary>
        <nav-list :items="item.children"></nav-list>
      </details>
      <div r-else class="nav__leaf">
        <a
          r-if="item.url"
          class="nav__link"
          :class="{ 'nav__link--active': item.isActive }"
          :href="item.url"
          :aria-current="item.isActive ? 'page' : null"
          >{{ item.title }}</a
        >
        <span r-else class="nav__text">{{ item.title }}</span>
      </div>
    </template>
  </nav-item>
</ul>`

const navMenuTemplate = html`<nav
  class="nav__menu"
  aria-label="Site navigation"
>
  <nav-list :items="items"></nav-list>
</nav>`

function resolveNavItems(context: TsSsgContext): NavItem[] {
  const items = context?.navigation?.items ?? []
  if (items.length > 0) return items
  return context?.navigation?.global ?? []
}

interface NavItemState extends NavItem {
  isActive: boolean
  isOpen: boolean
}

function normalizePath(url: string | undefined): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (!trimmed) return undefined
  if (trimmed.startsWith('#') || trimmed.startsWith('//')) return undefined
  if (/^[a-zA-Z][a-zA-Z+.-]*:/.test(trimmed)) return undefined
  const hashIndex = trimmed.indexOf('#')
  const queryIndex = trimmed.indexOf('?')
  const index =
    hashIndex === -1
      ? queryIndex
      : queryIndex === -1
        ? hashIndex
        : Math.min(hashIndex, queryIndex)
  const base = index === -1 ? trimmed : trimmed.slice(0, index)
  if (!base) return undefined
  const withSlash = base.startsWith('/') ? base : `/${base}`
  if (withSlash === '/') return '/'
  return withSlash.endsWith('/') ? withSlash : `${withSlash}/`
}

function resolveCurrentPath(context: TsSsgContext): string | undefined {
  const fromContext = normalizePath(context?.page?.urlPath)
  if (fromContext) return fromContext
  if (typeof window !== 'undefined' && window.location?.pathname) {
    return normalizePath(window.location.pathname)
  }
  return undefined
}

function buildNavState(
  items: NavItem[],
  currentPath: string | undefined,
): NavItemState[] {
  return items.map((item) => {
    const childStates = item.children
      ? buildNavState(item.children, currentPath)
      : []
    const itemPath = normalizePath(item.url)
    const isActive = Boolean(
      itemPath && currentPath && itemPath === currentPath,
    )
    const hasActiveChild = childStates.some(
      (child) => child.isActive || child.isOpen,
    )
    return {
      ...item,
      ...(childStates.length > 0 ? { children: childStates } : {}),
      isActive,
      isOpen: isActive || hasActiveChild,
    }
  })
}

function registerNavStyles() {
  const themeOptions = getThemeOptions()
  const palette = (theme: string) => getThemePalette(theme, themeOptions)

  const baseMenu = (theme: string) =>
    styleBuilder
      .select('.nav__menu', theme)
      .display('block')
      .padding('16px')
      .borderRadius(themeOptions.radii.lg)
      .border('1px solid transparent')
      .fontSize(themeOptions.typography.baseSize)
      .lineHeight(themeOptions.typography.baseLineHeight)
      .maxHeight('100%')

  baseMenu('light')
    .background(palette('light').nav.background)
    .borderColor(palette('light').nav.border)
    .color(palette('light').panel.text)
  baseMenu('dark')
    .background(palette('dark').nav.background)
    .borderColor(palette('dark').nav.border)
    .color(palette('dark').panel.text)

  const baseList = (theme: string) =>
    styleBuilder
      .select('.nav__list', theme)
      .listStyle('none')
      .margin('0')
      .padding('0')
      .display('grid')
      .gap('4px')

  baseList('light')
  baseList('dark')

  const nestedList = (theme: string) =>
    styleBuilder
      .select('.nav__list .nav__list', theme)
      .marginTop('6px')
      .paddingLeft('12px')
      .borderLeft('1px solid transparent')

  nestedList('light').borderLeftColor(palette('light').nav.nestedBorder)
  nestedList('dark').borderLeftColor(palette('dark').nav.nestedBorder)

  const baseItem = (theme: string) =>
    styleBuilder
      .select('.nav__item', theme)
      .display('grid')
      .gap('4px')

  baseItem('light')
  baseItem('dark')

  const baseLink = (theme: string) =>
    styleBuilder
      .select('.nav__link', theme)
      .display('block')
      .padding('8px 12px')
      .borderRadius(themeOptions.radii.md)
      .textDecoration('none')
      .fontWeight(600)
      .transition('background 160ms ease, color 160ms ease')

  baseLink('light').color(palette('light').nav.text)
  baseLink('dark').color(palette('dark').nav.text)

  styleBuilder
    .select('.nav__link:hover', 'light')
    .background(palette('light').nav.hoverBackground)
  styleBuilder
    .select('.nav__link:hover', 'dark')
    .background(palette('dark').nav.hoverBackground)

  styleBuilder
    .select('.nav__link--active', 'light')
    .background(palette('light').nav.activeBackground)
    .color(palette('light').nav.activeText)
  styleBuilder
    .select('.nav__link--active', 'dark')
    .background(palette('dark').nav.activeBackground)
    .color(palette('dark').nav.activeText)

  styleBuilder
    .select('.nav__link:focus-visible', 'light')
    .outline(`2px solid ${palette('light').nav.focusRing}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.nav__link:focus-visible', 'dark')
    .outline(`2px solid ${palette('dark').nav.focusRing}`)
    .outlineOffset('2px')

  const baseText = (theme: string) =>
    styleBuilder
      .select('.nav__text', theme)
      .display('block')
      .padding('8px 12px')
      .borderRadius(themeOptions.radii.md)
      .fontWeight(600)

  baseText('light').color(palette('light').nav.textMuted)
  baseText('dark').color(palette('dark').nav.textMuted)

  const baseLeaf = (theme: string) =>
    styleBuilder.select('.nav__leaf', theme).display('block')
  baseLeaf('light')
  baseLeaf('dark')

  const baseGroup = (theme: string) =>
    styleBuilder.select('.nav__group', theme).display('grid')
  baseGroup('light')
  baseGroup('dark')

  const baseSummary = (theme: string) =>
    styleBuilder
      .select('.nav__summary', theme)
      .display('flex')
      .alignItems('center')
      .justifyContent('space-between')
      .gap('8px')
      .cursor('pointer')
      .padding('4px')
      .borderRadius(themeOptions.radii.md)

  baseSummary('light')
  baseSummary('dark')

  styleBuilder
    .select('.nav__summary:hover', 'light')
    .background(palette('light').nav.summaryHoverBackground)
  styleBuilder
    .select('.nav__summary:hover', 'dark')
    .background(palette('dark').nav.summaryHoverBackground)

  styleBuilder
    .select('.nav__summary:focus-visible', 'light')
    .outline(`2px solid ${palette('light').nav.focusRing}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.nav__summary:focus-visible', 'dark')
    .outline(`2px solid ${palette('dark').nav.focusRing}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.nav__summary--active', 'light')
    .background(palette('light').nav.activeBackground)
  styleBuilder
    .select('.nav__summary--active', 'dark')
    .background(palette('dark').nav.activeBackground)

  styleBuilder
    .select('.nav__summary--active .nav__text', 'light')
    .color(palette('light').nav.activeText)
  styleBuilder
    .select('.nav__summary--active .nav__text', 'dark')
    .color(palette('dark').nav.activeText)

  styleBuilder
    .select('.nav__summary-content', 'light')
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .flex('1')
  styleBuilder
    .select('.nav__summary-content', 'dark')
    .display('flex')
    .alignItems('center')
    .gap('8px')
    .flex('1')

  const baseChevron = (theme: string) =>
    styleBuilder
      .select('.nav__chevron', theme)
      .width('8px')
      .height('8px')
      .borderRight('2px solid currentColor')
      .borderBottom('2px solid currentColor')
      .transform('rotate(-45deg)')
      .transition('transform 160ms ease')

  baseChevron('light').color(palette('light').nav.chevron)
  baseChevron('dark').color(palette('dark').nav.chevron)

  styleBuilder
    .select('.nav__group[open] > .nav__summary .nav__chevron', 'light')
    .transform('rotate(45deg)')
  styleBuilder
    .select('.nav__group[open] > .nav__summary .nav__chevron', 'dark')
    .transform('rotate(45deg)')

  styleBuilder
    .select('.nav__summary::-webkit-details-marker', 'light')
    .display('none')
  styleBuilder
    .select('.nav__summary::-webkit-details-marker', 'dark')
    .display('none')
  styleBuilder.select('.nav__summary::marker', 'light').content('""')
  styleBuilder.select('.nav__summary::marker', 'dark').content('""')

  const baseBadge = (theme: string) =>
    styleBuilder
      .select('.nav__badge', theme)
      .padding('2px 8px')
      .borderRadius(themeOptions.radii.pill)
      .fontSize('11px')
      .fontWeight(700)
      .letterSpacing('0.02em')
      .textTransform('uppercase')

  baseBadge('light')
    .background(palette('light').nav.badgeBackground)
    .color(palette('light').nav.badgeText)
  baseBadge('dark')
    .background(palette('dark').nav.badgeBackground)
    .color(palette('dark').nav.badgeText)
}

function createNavItemComponent() {
  return createComponent<Record<string, never>>(navItemTemplate, {})
}

function createNavListComponent() {
  return createComponent<NavListProps>(navListTemplate, {
    props: ['items'],
    context: (head) => ({
      items: head.props.items,
    }),
  })
}

function createNavMenuComponent() {
  return createComponent<NavMenuProps>(navMenuTemplate, {
    props: ['items'],
    context: (head) => {
      const context = resolveTsSsgContext(head)
      return {
        items: buildNavState(
          head.props.items ?? resolveNavItems(context),
          resolveCurrentPath(context),
        ),
      }
    },
  })
}

export function createNavigationComponents() {
  registerNavStyles()
  const navItem = createNavItemComponent()
  const navList = createNavListComponent()
  const navMenu = createNavMenuComponent()
  return {
    navItem,
    navList,
    navMenu,
  }
}
