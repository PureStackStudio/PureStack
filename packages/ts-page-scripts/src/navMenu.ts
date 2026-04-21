import { matchMediaMin } from '../../ts-style/src/breakpoints'

const NAV_COLLAPSED_CLASS = 'template-doc--nav-collapsed'
const NAV_COLLAPSED_STORAGE_KEY = 'ts-ssg:nav-collapsed'
const NAV_OPEN_CLASS = 'doc-sidebar--open'
const EDGE_OPEN_THRESHOLD_PX = 26

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
  const sidebar = menu.closest<HTMLElement>('.doc-sidebar')

  const collapseToggle = menu.querySelector<HTMLElement>(
    '[data-nav-menu-collapse]',
  )
  const panelToggles = Array.from(
    menu.querySelectorAll<HTMLElement>('[data-nav-menu-toggle]'),
  )
  const media = window.matchMedia(matchMediaMin('lg'))

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
      sidebar?.classList.remove(NAV_OPEN_CLASS)
      return
    }
    document.body.classList.toggle(NAV_COLLAPSED_CLASS, collapsed)
    if (!collapsed) sidebar?.classList.remove(NAV_OPEN_CLASS)
  }
  const setPanelOpen = (open: boolean) => {
    sidebar?.classList.toggle(NAV_OPEN_CLASS, open)
  }
  const syncCollapseButton = () => {
    if (!collapseToggle) return
    if (document.body.classList.contains(NAV_COLLAPSED_CLASS)) {
      collapseToggle.setAttribute('title', 'Restore navigation')
      collapseToggle.setAttribute('aria-label', 'Restore navigation')
      return
    }
    collapseToggle.setAttribute('title', 'Collapse navigation')
    collapseToggle.setAttribute('aria-label', 'Collapse navigation')
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
      setPanelOpen(false)
      syncCollapseButton()
      return
    }
    setCollapsed(stored)
    if (stored) setPanelOpen(false)
    syncCollapseButton()
  }

  applyStoredPreference()

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', applyStoredPreference)
  }

  if (collapseToggle) {
    collapseToggle.addEventListener('click', (event) => {
      event.preventDefault()
      if (document.body.classList.contains(NAV_COLLAPSED_CLASS)) {
        writeStored(false)
        setCollapsed(false)
        setPanelOpen(false)
        syncCollapseButton()
        return
      }
      writeStored(true)
      setCollapsed(true)
      setPanelOpen(false)
      syncCollapseButton()
    })
  }

  for (const panelToggle of panelToggles) {
    panelToggle.addEventListener('click', (event) => {
      event.preventDefault()
      if (!supportsDesktopCollapse()) return
      if (!document.body.classList.contains(NAV_COLLAPSED_CLASS)) return
      setPanelOpen(!sidebar?.classList.contains(NAV_OPEN_CLASS))
    })
  }

  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    if (!sidebar?.classList.contains(NAV_OPEN_CLASS)) return
    setPanelOpen(false)
  })

  document.addEventListener('click', (event) => {
    if (!supportsDesktopCollapse()) return
    if (!document.body.classList.contains(NAV_COLLAPSED_CLASS)) return
    if (!sidebar?.classList.contains(NAV_OPEN_CLASS)) return
    const target = event.target
    if (!(target instanceof Node)) return
    if (menu.contains(target)) return
    setPanelOpen(false)
  })

  document.addEventListener('mousemove', (event) => {
    if (!supportsDesktopCollapse()) return
    if (!document.body.classList.contains(NAV_COLLAPSED_CLASS)) return
    if (sidebar?.classList.contains(NAV_OPEN_CLASS)) return
    if (event.clientX > EDGE_OPEN_THRESHOLD_PX) return
    setPanelOpen(true)
  })
}

ready(init)
