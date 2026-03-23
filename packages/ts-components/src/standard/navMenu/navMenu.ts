import { defineComponent, html } from 'regor'
import { resolveTsSsgContext } from '../../render/resolveTsSsgContext'
import type { TsSsgContext } from '../../render/ts-ssg-context'
import type { NavItem } from './navMenu-types'
import { registerNavStyles } from './navMenuStyle'

export interface NavMenu {
  items?: NavItem[]
}

export interface NavList {
  items?: NavItemState[]
}

export interface NavItemState extends NavItem {
  isActive: boolean
  isOpen: boolean
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
            <!--<a
              r-if="item.url"
              class="nav__link"
              :class="{ 'nav__link--active': item.isActive }"
              :href="item.url"
              :aria-current="item.isActive ? 'page' : null"
              >{{ item.title }}</a
            >-->
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
  <div class="nav__header-row">
    <div class="nav__header">Navigation</div>
    <button
      class="nav__panel-toggle"
      type="button"
      title="Navigation"
      aria-label="Toggle navigation panel"
      data-nav-menu-toggle
    >
      <span class="nav__panel-toggle-icon" aria-hidden="true">
        <Icon name="iconoir:pin" />
      </span>
      <span class="nav__panel-toggle-label">navigation</span>
    </button>
    <button
      class="nav__collapse-toggle"
      type="button"
      title="Collapse navigation"
      aria-label="Collapse navigation"
      data-nav-menu-collapse
    >
      <span
        class="nav__collapse-toggle-icon nav__collapse-toggle-icon--collapse"
        aria-hidden="true"
      >
        <Icon name="iconoir:pin-slash" />
      </span>
      <span
        class="nav__collapse-toggle-icon nav__collapse-toggle-icon--open"
        aria-hidden="true"
      >
        <Icon name="iconoir:pin" />
      </span>
    </button>
  </div>
  <nav-list :items="items"></nav-list>
</nav>`

function resolveNavItems(context: TsSsgContext): NavItem[] {
  const globalItems = context?.navigation?.global ?? []
  if (globalItems.length > 0) return globalItems
  return context?.navigation?.items ?? []
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

function createNavItemComponent() {
  return defineComponent<Record<string, never>>(navItemTemplate, {})
}

function createNavListComponent() {
  return defineComponent<NavList>(navListTemplate, {
    props: ['items'],
    context: (head) => ({
      items: head.props.items,
    }),
  })
}

function createNavMenuComponent() {
  return defineComponent<NavMenu>(navMenuTemplate, {
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
