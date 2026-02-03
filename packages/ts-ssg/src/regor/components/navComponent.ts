import { createComponent, html } from 'regor'

import type { NavItem } from '../../navigation/navigation'
import type { TsSsgContext } from '../../ts-ssg-context'

const NAV_CLASS = 'nav-menu'

function resolveContext(): TsSsgContext | undefined {
  return globalThis.tsSsgContext
}

interface NavMenuProps {
  items?: NavItem[]
}

interface NavListProps {
  items: NavItem[]
}

const navItemTemplate = html`<li class="${NAV_CLASS}__item">
  <slot name="content"></slot>
  <slot name="children"></slot>
</li>`

const navListTemplate = html`<ul class="${NAV_CLASS}__list">
  <nav-item r-for="item in items">
    abc
    <template #content>
      <a r-if="item.url" :href="item.url">{{ item.title }}</a>
      <span r-else>{{ item.title }}</span>
    </template>
    <template #children>
      <nav-list
        r-if="item.children && item.children.length > 0"
        :items="item.children"
      ></nav-list>
    </template>
  </nav-item>
</ul>`

const navMenuTemplate = html`<nav
  class="${NAV_CLASS}"
  aria-label="Site navigation"
>
  <nav-list :items="items"></nav-list>
</nav>`

function resolveNavItems(): NavItem[] {
  const context = resolveContext()
  const items = context?.navigation?.items ?? []
  if (items.length > 0)
    return [...items, ...(context?.navigation?.global ?? [])]
  return context?.navigation?.global ?? []
}

function createNavItemComponent() {
  return createComponent<Record<string, never>>(navItemTemplate, [])
}

function createNavListComponent() {
  return createComponent<NavListProps>(navListTemplate, {
    context: () => {
      return {
        items: resolveContext()?.navigation?.items ?? [],
      }
    },
  })
}

function createNavMenuComponent() {
  return createComponent<NavMenuProps>(navMenuTemplate, {
    props: ['items'],
    context: (head) => ({
      items: head.props.items ?? resolveNavItems(),
    }),
  })
}

export function createNavigationComponents() {
  const navItem = createNavItemComponent()
  const navList = createNavListComponent()
  const navMenu = createNavMenuComponent()
  return {
    navItem,
    navList,
    navMenu,
    navigation: navMenu,
  }
}
