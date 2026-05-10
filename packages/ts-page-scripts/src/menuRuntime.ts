const MENU_SELECTOR = 'details[data-menu-runtime]'

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
  for (const menu of getOpenMenus()) {
    closeMenu(menu)
  }
}

function getOpenMenus() {
  return Array.from(
    document.querySelectorAll<HTMLDetailsElement>(`${MENU_SELECTOR}[open]`),
  )
}

function closeMenu(menu: HTMLDetailsElement) {
  menu.removeAttribute('open')
}

ready(initMenuRuntime)
