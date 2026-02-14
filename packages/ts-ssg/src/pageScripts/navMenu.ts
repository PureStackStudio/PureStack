const NAV_COLLAPSED_CLASS = 'template-doc--nav-collapsed'
const NAV_COLLAPSED_STORAGE_KEY = 'ts-ssg:nav-collapsed'
const DESKTOP_QUERY = '(min-width: 1024px)'

function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }
  fn()
}

function init() {
  const menu = document.querySelector<HTMLElement>('.nav__menu')
  if (!menu) return

  const collapseToggle = menu.querySelector<HTMLElement>(
    '[data-nav-menu-collapse]',
  )
  const restoreToggle = menu.querySelector<HTMLElement>(
    '[data-nav-menu-restore]',
  )
  const media = window.matchMedia(DESKTOP_QUERY)

  const supportsDesktopCollapse = () => {
    const body = document.body
    return (
      body.classList.contains('template-doc--has-nav') &&
      !body.classList.contains('template-doc--nav-drawer') &&
      media.matches
    )
  }

  const setCollapsed = (collapsed: boolean) => {
    if (!supportsDesktopCollapse()) {
      document.body.classList.remove(NAV_COLLAPSED_CLASS)
      return
    }
    document.body.classList.toggle(NAV_COLLAPSED_CLASS, collapsed)
  }

  const readStored = () => {
    try {
      const value = localStorage.getItem(NAV_COLLAPSED_STORAGE_KEY)
      if (value === '1') return true
      if (value === '0') return false
      return null
    } catch {
      return null
    }
  }

  const writeStored = (collapsed: boolean) => {
    try {
      localStorage.setItem(NAV_COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0')
    } catch {}
  }

  const applyStoredPreference = () => {
    const stored = readStored()
    if (stored === null) {
      setCollapsed(false)
      return
    }
    setCollapsed(stored)
  }

  applyStoredPreference()

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', applyStoredPreference)
  }

  if (collapseToggle) {
    collapseToggle.addEventListener('click', (event) => {
      event.preventDefault()
      writeStored(true)
      setCollapsed(true)
    })
  }

  if (restoreToggle) {
    restoreToggle.addEventListener('click', (event) => {
      event.preventDefault()
      writeStored(false)
      setCollapsed(false)
    })
  }
}

ready(init)

export {}
