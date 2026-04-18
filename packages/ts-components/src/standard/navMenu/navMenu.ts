import type { NavItem, TsSsgContext } from '@purestack/ts-common'
import { resolveTsSsgContext } from '@purestack/ts-common'
import {
  getSemanticToneButtonClass,
  getSemanticToneInteractiveClass,
  getSemanticToneSurfaceClass,
  type SemanticTone,
} from '@purestack/ts-style'
import { type ComputedRef, computed, defineComponent, html } from 'regor'

export interface NavMenu {
  items?: NavItem[]
  tone?: SemanticTone
  toneClass?: ComputedRef<string>
  interactiveToneClass?: ComputedRef<string>
  buttonToneClass?: ComputedRef<string>
}

export interface NavList {
  items?: NavItemState[]
  tone?: SemanticTone
}

export interface NavItemState extends NavItem {
  isActive: boolean
  isOpen: boolean
  toneClass?: string
}

const navItemTemplate = html`<li class="nav__item">
  <details
    r-if="item.children && item.children.length > 0"
    class="nav__group"
    :open="item.isOpen"
  >
    <summary
      class="nav__summary"
      :class="{
            [item.toneClass]: true,
            'active': item.isActive,
            'nav__summary--open': item.isOpen,
          }"
    >
      <span class="nav__summary-content">
        <span class="nav__text">{{ item.title }}</span>
        <span r-if="item.group" class="nav__badge">{{ item.group }}</span>
      </span>
      <span class="nav__chevron" aria-hidden="true"></span>
    </summary>
    <NavList :items="item.children" :tone="item.tone"></NavList>
  </details>
  <div r-else class="nav__leaf">
    <a
      r-if="item.url"
      class="nav__link"
      :class="{ 'active': item.isActive, [item.toneClass]: true }"
      :href="item.url"
      :aria-current="item.isActive ? 'page' : null"
    >
      {{ item.title }}
    </a>
    <span r-else class="nav__text">{{ item.title }}</span>
  </div>
</li>`

const navListTemplate = html`<ul class="nav__list">
  <NavItem r-for="item in items"/>
</ul>`

const navMenuTemplate = html`<nav class="nav__menu" :class="toneClass" aria-label="Site navigation">
  <div class="nav__header-row">
    <div class="nav__header">Navigation</div>
    <button
      class="nav__panel-toggle"
      :class="buttonToneClass"
      type="button"
      title="Navigation"
      aria-label="Toggle navigation panel"
      data-nav-menu-toggle
    >
      <span class="nav__panel-toggle-icon" aria-hidden="true">
        <Icon name="iconoir:pin"/>
      </span>
      <span class="nav__panel-toggle-label">navigation</span>
    </button>
    <button
      class="nav__collapse-toggle"
      :class="interactiveToneClass"
      type="button"
      title="Collapse navigation"
      aria-label="Collapse navigation"
      data-nav-menu-collapse
    >
      <span
        class="nav__collapse-toggle-icon nav__collapse-toggle-icon--collapse"
        aria-hidden="true"
      >
        <Icon name="iconoir:pin-slash"/>
      </span>
      <span
        class="nav__collapse-toggle-icon nav__collapse-toggle-icon--open"
        aria-hidden="true"
      >
        <Icon name="iconoir:pin"/>
      </span>
    </button>
  </div>
  <SearchBox class="nav__search"/>
  <NavList :items="items" :tone="tone"></NavList>
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
  parentTone: SemanticTone | undefined,
): NavItemState[] {
  return items.map((item) => {
    const tone = item.tone ?? parentTone
    const childStates = item.children
      ? buildNavState(item.children, currentPath, parentTone)
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
      tone,
      ...(childStates.length > 0 ? { children: childStates } : {}),
      isActive,
      isOpen: isActive || hasActiveChild,
      toneClass: getSemanticToneInteractiveClass(tone),
    }
  })
}

function defineNavItemComponent() {
  return defineComponent<{ item: NavItemState }>(navItemTemplate, {})
}

function defineNavListComponent() {
  return defineComponent<NavList>(navListTemplate, {
    props: ['items', 'tone'],
    context: (head) => ({
      items: head.props.items,
      tone: head.props.tone,
    }),
  })
}

function defineNavMenuComponent() {
  return defineComponent<NavMenu>(navMenuTemplate, {
    props: ['items', 'tone'],
    context: (head) => {
      const context = resolveTsSsgContext(head)
      const tone = head.props.tone
      return {
        tone,
        toneClass: computed(() =>
          getSemanticToneSurfaceClass(head.props.tone, false),
        ),
        interactiveToneClass: computed(() =>
          getSemanticToneInteractiveClass(head.props.tone),
        ),
        buttonToneClass: computed(() =>
          getSemanticToneButtonClass(head.props.tone),
        ),
        items: buildNavState(
          head.props.items ?? resolveNavItems(context),
          resolveCurrentPath(context),
          tone,
        ),
      }
    },
  })
}

export function defineNavigationComponents() {
  const navItem = defineNavItemComponent()
  const navList = defineNavListComponent()
  const navMenu = defineNavMenuComponent()
  return {
    navItem,
    navList,
    navMenu,
  }
}
