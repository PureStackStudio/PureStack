import type { ComponentHead } from 'regor'
import { createComponent, html } from 'regor'

import type { NavItem } from '../../navigation/navigation'
import { styleBuilder } from '../../style/styles'
import type { TsSsgContext } from '../../ts-ssg-context'
import { resolveTsSsgContext } from './resolveTsSsgContext'

function resolveContext(head?: ComponentHead): TsSsgContext | undefined {
  return resolveTsSsgContext(head)
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

function resolveNavItems(context?: TsSsgContext): NavItem[] {
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

function resolveCurrentPath(context?: TsSsgContext): string | undefined {
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
  const baseMenu = (theme: string) =>
    styleBuilder
      .select('.nav__menu', theme)
      .set('display', 'block')
      .set('padding', '16px')
      .set('border-radius', '16px')
      .set('border', '1px solid transparent')
      .set('font-size', '15px')
      .set('line-height', '1.4')
      .set('max-height', '100%')

  baseMenu('light')
    .set('background', '#f6f7fb')
    .set('border-color', '#e1e4ef')
    .set('color', '#1f2937')
  baseMenu('dark')
    .set('background', '#1b1f27')
    .set('border-color', '#2a2f38')
    .set('color', '#e7eaf3')

  const baseList = (theme: string) =>
    styleBuilder
      .select('.nav__list', theme)
      .set('list-style', 'none')
      .set('margin', '0')
      .set('padding', '0')
      .set('display', 'grid')
      .set('gap', '4px')

  baseList('light')
  baseList('dark')

  const nestedList = (theme: string) =>
    styleBuilder
      .select('.nav__list .nav__list', theme)
      .set('margin-top', '6px')
      .set('padding-left', '12px')
      .set('border-left', '1px solid transparent')

  nestedList('light').set('border-left-color', '#d9deee')
  nestedList('dark').set('border-left-color', '#2b313c')

  const baseItem = (theme: string) =>
    styleBuilder
      .select('.nav__item', theme)
      .set('display', 'grid')
      .set('gap', '4px')

  baseItem('light')
  baseItem('dark')

  const baseLink = (theme: string) =>
    styleBuilder
      .select('.nav__link', theme)
      .set('display', 'block')
      .set('padding', '8px 12px')
      .set('border-radius', '10px')
      .set('text-decoration', 'none')
      .set('font-weight', 600)
      .set('transition', 'background 160ms ease, color 160ms ease')

  baseLink('light').set('color', '#1f2937')
  baseLink('dark').set('color', '#e6e9f2')

  styleBuilder.select('.nav__link:hover', 'light').set('background', '#e9edf7')
  styleBuilder.select('.nav__link:hover', 'dark').set('background', '#262b35')

  styleBuilder
    .select('.nav__link--active', 'light')
    .set('background', '#d7e2ff')
    .set('color', '#0b1a3d')
  styleBuilder
    .select('.nav__link--active', 'dark')
    .set('background', '#b7c6ff')
    .set('color', '#101a32')

  styleBuilder
    .select('.nav__link:focus-visible', 'light')
    .set('outline', '2px solid #9ab3ff')
    .set('outline-offset', '2px')
  styleBuilder
    .select('.nav__link:focus-visible', 'dark')
    .set('outline', '2px solid #91a7ff')
    .set('outline-offset', '2px')

  const baseText = (theme: string) =>
    styleBuilder
      .select('.nav__text', theme)
      .set('display', 'block')
      .set('padding', '8px 12px')
      .set('border-radius', '10px')
      .set('font-weight', 600)

  baseText('light').set('color', '#4b5563')
  baseText('dark').set('color', '#b0b6c6')

  const baseLeaf = (theme: string) =>
    styleBuilder.select('.nav__leaf', theme).set('display', 'block')
  baseLeaf('light')
  baseLeaf('dark')

  const baseGroup = (theme: string) =>
    styleBuilder.select('.nav__group', theme).set('display', 'grid')
  baseGroup('light')
  baseGroup('dark')

  const baseSummary = (theme: string) =>
    styleBuilder
      .select('.nav__summary', theme)
      .set('display', 'flex')
      .set('align-items', 'center')
      .set('justify-content', 'space-between')
      .set('gap', '8px')
      .set('cursor', 'pointer')
      .set('padding', '4px')
      .set('border-radius', '12px')

  baseSummary('light')
  baseSummary('dark')

  styleBuilder
    .select('.nav__summary:hover', 'light')
    .set('background', '#eef1f8')
  styleBuilder
    .select('.nav__summary:hover', 'dark')
    .set('background', '#252a34')

  styleBuilder
    .select('.nav__summary:focus-visible', 'light')
    .set('outline', '2px solid #9ab3ff')
    .set('outline-offset', '2px')
  styleBuilder
    .select('.nav__summary:focus-visible', 'dark')
    .set('outline', '2px solid #91a7ff')
    .set('outline-offset', '2px')

  styleBuilder
    .select('.nav__summary--active', 'light')
    .set('background', '#d7e2ff')
  styleBuilder
    .select('.nav__summary--active', 'dark')
    .set('background', '#b7c6ff')

  styleBuilder
    .select('.nav__summary--active .nav__text', 'light')
    .set('color', '#0b1a3d')
  styleBuilder
    .select('.nav__summary--active .nav__text', 'dark')
    .set('color', '#101a32')

  styleBuilder
    .select('.nav__summary-content', 'light')
    .set('display', 'flex')
    .set('align-items', 'center')
    .set('gap', '8px')
    .set('flex', '1')
  styleBuilder
    .select('.nav__summary-content', 'dark')
    .set('display', 'flex')
    .set('align-items', 'center')
    .set('gap', '8px')
    .set('flex', '1')

  const baseChevron = (theme: string) =>
    styleBuilder
      .select('.nav__chevron', theme)
      .set('width', '8px')
      .set('height', '8px')
      .set('border-right', '2px solid currentColor')
      .set('border-bottom', '2px solid currentColor')
      .set('transform', 'rotate(-45deg)')
      .set('transition', 'transform 160ms ease')

  baseChevron('light').set('color', '#7b8597')
  baseChevron('dark').set('color', '#9aa4b2')

  styleBuilder
    .select('.nav__group[open] > .nav__summary .nav__chevron', 'light')
    .set('transform', 'rotate(45deg)')
  styleBuilder
    .select('.nav__group[open] > .nav__summary .nav__chevron', 'dark')
    .set('transform', 'rotate(45deg)')

  styleBuilder
    .select('.nav__summary::-webkit-details-marker', 'light')
    .set('display', 'none')
  styleBuilder
    .select('.nav__summary::-webkit-details-marker', 'dark')
    .set('display', 'none')
  styleBuilder.select('.nav__summary::marker', 'light').set('content', '""')
  styleBuilder.select('.nav__summary::marker', 'dark').set('content', '""')

  const baseBadge = (theme: string) =>
    styleBuilder
      .select('.nav__badge', theme)
      .set('padding', '2px 8px')
      .set('border-radius', '999px')
      .set('font-size', '11px')
      .set('font-weight', 700)
      .set('letter-spacing', '0.02em')
      .set('text-transform', 'uppercase')

  baseBadge('light').set('background', '#e6ecfb').set('color', '#3a4a7d')
  baseBadge('dark').set('background', '#2a3244').set('color', '#b9c6ff')
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
      const context = resolveContext(head)
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
