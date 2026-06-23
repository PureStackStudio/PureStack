import type { TsSsgMenusApi } from './runtimeGlobals'

const MENU_SELECTOR = 'details[data-menu-runtime]'
const MENU_PANEL_SELECTOR = '[data-menu-panel]'
const DEFAULT_MENU_ALIGN = 'end'
const VIEWPORT_PADDING = 16
const MENU_OFFSET = 6

type MenuAlign = 'start' | 'end'

let pendingPlacementFrame = 0

const menuRuntimeApi: TsSsgMenusApi = {
  close(source?: Event | Element) {
    const menu = resolveMenuFromSource(source)
    if (menu) closeMenu(menu)
  },
  closeAll() {
    closeOpenMenus()
  },
  refresh(source?: Event | Element) {
    const menu = resolveMenuFromSource(source)
    if (menu) {
      placeMenu(menu)
      return
    }
    placeOpenMenus()
  },
}

function ready(run: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
    return
  }
  run()
}

function initMenuRuntime() {
  document.addEventListener('click', closeOpenMenusOutsideTarget)
  document.addEventListener('keydown', closeOpenMenusOnEscape)
  document.addEventListener('toggle', handleMenuToggle, true)
  window.addEventListener('resize', scheduleOpenMenuPlacement)
  window.addEventListener('scroll', scheduleOpenMenuPlacement, true)
  placeOpenMenus()
}

function closeOpenMenusOutsideTarget(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Node)) return

  const targetElement =
    target instanceof Element
      ? target
      : target.parentElement instanceof Element
        ? target.parentElement
        : null
  const activeMenu =
    targetElement?.closest<HTMLDetailsElement>(MENU_SELECTOR) ?? null

  for (const menu of getOpenMenus()) {
    if (menu === activeMenu) continue
    closeMenu(menu)
  }
}

function closeOpenMenusOnEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  closeOpenMenus()
}

function handleMenuToggle(event: Event) {
  const target = event.target
  if (!(target instanceof HTMLDetailsElement)) return
  if (!target.matches(MENU_SELECTOR)) return

  if (target.open) {
    closeSiblingMenus(target)
    scheduleMenuPlacement(target)
    return
  }

  clearMenuPlacement(target)
}

function getOpenMenus() {
  return Array.from(
    document.querySelectorAll<HTMLDetailsElement>(`${MENU_SELECTOR}[open]`),
  )
}

function closeMenu(menu: HTMLDetailsElement) {
  menu.removeAttribute('open')
  clearMenuPlacement(menu)
}

function closeOpenMenus() {
  for (const menu of getOpenMenus()) {
    closeMenu(menu)
  }
}

function closeSiblingMenus(activeMenu: HTMLDetailsElement) {
  for (const menu of getOpenMenus()) {
    if (menu === activeMenu) continue
    closeMenu(menu)
  }
}

function scheduleOpenMenuPlacement() {
  if (pendingPlacementFrame) return
  pendingPlacementFrame = window.requestAnimationFrame(() => {
    pendingPlacementFrame = 0
    placeOpenMenus()
  })
}

function scheduleMenuPlacement(menu: HTMLDetailsElement) {
  window.requestAnimationFrame(() => placeMenu(menu))
}

function placeOpenMenus() {
  for (const menu of getOpenMenus()) {
    placeMenu(menu)
  }
}

function placeMenu(menu: HTMLDetailsElement) {
  if (!menu.open) return

  const panel = resolveMenuPanel(menu)
  const trigger = menu.querySelector<HTMLElement>('summary')
  if (!panel || !trigger) return

  clearMenuPlacement(menu)

  const menuRect = menu.getBoundingClientRect()
  const triggerRect = trigger.getBoundingClientRect()
  const panelRect = panel.getBoundingClientRect()
  const viewportWidth = resolveViewportWidth()
  const viewportHeight = resolveViewportHeight()
  const maxWidth = Math.max(0, viewportWidth - VIEWPORT_PADDING * 2)
  const panelWidth = Math.min(panelRect.width, maxWidth)
  const left = resolvePanelLeft(menu, triggerRect, panelWidth, viewportWidth)
  const verticalPlacement = resolvePanelVerticalPlacement(
    triggerRect,
    panelRect.height,
    viewportHeight,
  )

  panel.style.left = `${Math.round(left - menuRect.left)}px`
  panel.style.right = 'auto'
  panel.style.top = `${Math.round(verticalPlacement.top - menuRect.top)}px`
  panel.style.bottom = 'auto'
  panel.style.maxWidth = `${Math.floor(maxWidth)}px`
  panel.style.maxHeight = `${Math.floor(verticalPlacement.maxHeight)}px`
  panel.style.overflowY =
    panelRect.height > verticalPlacement.maxHeight ? 'auto' : ''
}

function resolveMenuPanel(menu: HTMLDetailsElement) {
  const explicitPanel = menu.querySelector<HTMLElement>(MENU_PANEL_SELECTOR)
  if (explicitPanel) return explicitPanel

  return Array.from(menu.children).find(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child.tagName !== 'SUMMARY',
  )
}

function resolveMenuFromSource(source: Event | Element | undefined) {
  if (!source) return null
  if (source instanceof HTMLDetailsElement && source.matches(MENU_SELECTOR)) {
    return source
  }

  const target = source instanceof Event ? source.target : source
  if (!(target instanceof Node)) return null

  const targetElement =
    target instanceof Element
      ? target
      : target.parentElement instanceof Element
        ? target.parentElement
        : null

  return targetElement?.closest<HTMLDetailsElement>(MENU_SELECTOR) ?? null
}

function resolvePanelLeft(
  menu: HTMLDetailsElement,
  triggerRect: DOMRect,
  panelWidth: number,
  viewportWidth: number,
) {
  const align = resolveMenuAlign(menu)
  const preferredLeft =
    align === 'start' ? triggerRect.left : triggerRect.right - panelWidth
  return clamp(
    preferredLeft,
    VIEWPORT_PADDING,
    viewportWidth - VIEWPORT_PADDING - panelWidth,
  )
}

function resolvePanelVerticalPlacement(
  triggerRect: DOMRect,
  naturalPanelHeight: number,
  viewportHeight: number,
) {
  const spaceBelow =
    viewportHeight - triggerRect.bottom - VIEWPORT_PADDING - MENU_OFFSET
  const spaceAbove = triggerRect.top - VIEWPORT_PADDING - MENU_OFFSET
  const placeAbove = naturalPanelHeight > spaceBelow && spaceAbove > spaceBelow
  const availableHeight = Math.max(0, placeAbove ? spaceAbove : spaceBelow)
  const panelHeight = Math.min(naturalPanelHeight, availableHeight)
  const preferredTop = placeAbove
    ? triggerRect.top - MENU_OFFSET - panelHeight
    : triggerRect.bottom + MENU_OFFSET

  const top = clamp(
    preferredTop,
    VIEWPORT_PADDING,
    viewportHeight - VIEWPORT_PADDING - panelHeight,
  )

  return { maxHeight: availableHeight, top }
}

function resolveMenuAlign(menu: HTMLDetailsElement): MenuAlign {
  return menu.dataset.menuAlign === 'start' ? 'start' : DEFAULT_MENU_ALIGN
}

function resolveViewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth
}

function resolveViewportHeight() {
  return document.documentElement.clientHeight || window.innerHeight
}

function clamp(value: number, min: number, max: number) {
  if (max < min) return min
  return Math.min(Math.max(value, min), max)
}

function clearMenuPlacement(menu: HTMLDetailsElement) {
  const panel = resolveMenuPanel(menu)
  if (!panel) return

  panel.style.left = ''
  panel.style.right = ''
  panel.style.top = ''
  panel.style.bottom = ''
  panel.style.maxWidth = ''
  panel.style.maxHeight = ''
  panel.style.overflowY = ''
}

ready(initMenuRuntime)

globalThis.window.tsSsgMenus = menuRuntimeApi
