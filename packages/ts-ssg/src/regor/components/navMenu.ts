import { createComponent, html } from 'regor'

import type { NavItem } from '../../navigation/navigation'
import { styleBuilder } from '../../style/styles'
import { themes } from '../../style/themeOptions'
import { resolveTsSsgContext } from '../resolveTsSsgContext'
import type { TsSsgContext } from '../ts-ssg-context'

export interface ThemeNavColors {
  background: string
  border: string
  text: string
  textMuted: string
  hoverBackground: string
  nestedBorder: string
  summaryHoverBackground: string
  activeBackground: string
  activeText: string
  focusRing: string
  chevron: string
  badgeBackground: string
  badgeText: string
}

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
  const globalItems = context?.navigation?.global ?? []
  if (globalItems.length > 0) return globalItems
  return context?.navigation?.items ?? []
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
  const fromContext = normalizePath(context?.pageInfo?.urlPath)
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
  themes.forEach((theme, palette, options) => {
    styleBuilder
      .select('.nav__menu', theme)
      .display('block')
      .padding('16px')
      .borderRadius(options.radii.lg)
      .border('1px solid transparent')
      .fontSize(options.typography.baseSize)
      .lineHeight(options.typography.baseLineHeight)
      .maxHeight('100%')
      .background(palette.nav.background)
      .borderColor(palette.nav.border)
      .color(palette.panel.text)

    styleBuilder
      .select('.nav__list', theme)
      .listStyle('none')
      .margin('0')
      .padding('0')
      .display('grid')
      .gap('4px')

    styleBuilder
      .select('.nav__list .nav__list', theme)
      .marginTop('6px')
      .paddingLeft('12px')
      .borderLeft('1px solid transparent')
      .borderLeftColor(palette.nav.nestedBorder)

    styleBuilder.select('.nav__item', theme).display('grid').gap('4px')

    styleBuilder
      .select('.nav__link', theme)
      .display('block')
      .padding('8px 12px')
      .borderRadius(options.radii.md)
      .textDecoration('none')
      .fontWeight('600')
      .transition('background 160ms ease, color 160ms ease')
      .color(palette.nav.text)

    styleBuilder
      .select('.nav__link:hover', theme)
      .background(palette.nav.hoverBackground)

    styleBuilder
      .select('.nav__link--active', theme)
      .background(palette.nav.activeBackground)
      .color(palette.nav.activeText)

    styleBuilder
      .select('.nav__link:focus-visible', theme)
      .outline(`2px solid ${palette.nav.focusRing}`)
      .outlineOffset('2px')

    styleBuilder
      .select('.nav__text', theme)
      .display('block')
      .padding('8px 12px')
      .borderRadius(options.radii.md)
      .fontWeight('600')
      .color(palette.nav.textMuted)

    styleBuilder.select('.nav__leaf', theme).display('block')
    styleBuilder.select('.nav__group', theme).display('grid')

    styleBuilder
      .select('.nav__summary', theme)
      .display('flex')
      .alignItems('center')
      .justifyContent('space-between')
      .gap('8px')
      .cursor('pointer')
      .padding('4px')
      .borderRadius(options.radii.md)

    styleBuilder
      .select('.nav__summary:hover', theme)
      .background(palette.nav.summaryHoverBackground)

    styleBuilder
      .select('.nav__summary:focus-visible', theme)
      .outline(`2px solid ${palette.nav.focusRing}`)
      .outlineOffset('2px')

    styleBuilder
      .select('.nav__summary--active', theme)
      .background(palette.nav.activeBackground)

    styleBuilder
      .select('.nav__summary--active .nav__text', theme)
      .color(palette.nav.activeText)

    styleBuilder
      .select('.nav__summary-content', theme)
      .display('flex')
      .alignItems('center')
      .gap('8px')
      .flex('1')

    styleBuilder
      .select('.nav__chevron', theme)
      .width('8px')
      .height('8px')
      .borderRight('2px solid currentColor')
      .borderBottom('2px solid currentColor')
      .transform('rotate(-45deg)')
      .transition('transform 160ms ease')
      .color(palette.nav.chevron)

    styleBuilder
      .select('.nav__group[open] > .nav__summary .nav__chevron', theme)
      .transform('rotate(45deg)')

    styleBuilder
      .select('.nav__summary::-webkit-details-marker', theme)
      .display('none')

    styleBuilder.select('.nav__summary::marker', theme).content('""')

    styleBuilder
      .select('.nav__badge', theme)
      .padding('2px 8px')
      .borderRadius(options.radii.pill)
      .fontSize('11px')
      .fontWeight('700')
      .letterSpacing('0.02em')
      .textTransform('uppercase')
      .background(palette.nav.badgeBackground)
      .color(palette.nav.badgeText)
  })
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
