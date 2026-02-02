import { createComponent, html } from 'regor'

import type { NavItem } from '../../navigation/navigation'
import type { TsSsgContext } from '../../ts-ssg-context'

const NAV_CLASS = 'nav-menu'

function resolveContext(): TsSsgContext | undefined {
  return globalThis.tsSsgContext
}

function resolveNavItems(): NavItem[] {
  const context = resolveContext()
  const items = context?.navigation?.items ?? []
  if (items.length > 0) return items
  return context?.navigation?.global ?? []
}

function buildNavMarkup(items: NavItem[]): string {
  return `<nav class="${NAV_CLASS}" aria-label="Site navigation">${renderList(
    items,
  )}</nav>`
}

function renderList(items: NavItem[]): string {
  const children = items
    .map((item) => {
      const label = escapeHtml(item.title)
      const link = item.url
        ? `<a href="${escapeHtml(item.url)}">${label}</a>`
        : `<span>${label}</span>`
      const nested =
        item.children && item.children.length > 0
          ? renderList(item.children)
          : ''
      return `<li class="${NAV_CLASS}__item">${link}${nested}</li>`
    })
    .join('')
  return `<ul class="${NAV_CLASS}__list">${children}</ul>`
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function createNavigationComponent() {
  const items = resolveNavItems()
  const markup = buildNavMarkup(items)
  const template = html`${markup}`
  return createComponent<Record<string, never>>(template, [])
}

export function createNavigationComponents() {
  const component = createNavigationComponent()
  return { navigation: component, navMenu: component }
}
