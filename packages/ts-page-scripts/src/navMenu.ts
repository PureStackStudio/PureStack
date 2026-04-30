import { BREAKPOINTS, matchMediaMin } from '../../ts-style/src/breakpoints'
import {
  docLayoutDefaults,
  docLayoutVars,
} from '../../ts-style/src/docLayoutVars'
import {
  applyStoredDocLayoutPreferences,
  DOC_LAYOUT_NAV_WIDTH_STORAGE_KEY,
  readDocLayoutPxVar,
} from './docLayoutCssVars'

const NAV_COLLAPSED_CLASS = 'template-doc--nav-collapsed'
const NAV_COLLAPSED_STORAGE_KEY = 'ts-ssg:nav-collapsed'
const NAV_OPEN_CLASS = 'doc-sidebar--open'
const NAV_RESIZE_HOVER_CLASS = 'col-resize'
const NAV_RESIZING_CLASS = 'resizing'
const NAV_RESIZE_EDGE_TOLERANCE_PX = 20
const EDGE_OPEN_THRESHOLD_FALLBACK_PX = Number.parseFloat(
  docLayoutDefaults.defaultRailWidth,
)

function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }
  fn()
}

function init() {
  applyStoredDocLayoutPreferences()

  const menu = document.querySelector<HTMLElement>('.nav__menu')
  if (!menu) return
  const sidebar = menu.closest<HTMLElement>('.doc-sidebar')

  const collapseToggle = menu.querySelector<HTMLElement>(
    '[data-nav-menu-collapse]',
  )
  const panelToggles = Array.from(
    menu.querySelectorAll<HTMLElement>('[data-nav-menu-toggle]'),
  )
  const media = window.matchMedia(matchMediaMin(BREAKPOINTS.lg))

  const supportsDesktopCollapse = () => {
    const body = document.body
    return (
      body.classList.contains('template-doc--has-nav') &&
      !body.classList.contains('template-doc--nav-drawer') &&
      media.matches
    )
  }
  const supportsDesktopResize = () => supportsDesktopCollapse()

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

  const isOnResizeEdge = (event: MouseEvent) => {
    if (!supportsDesktopResize()) return false
    const rect = menu.getBoundingClientRect()
    return Math.abs(event.clientX - rect.right) <= NAV_RESIZE_EDGE_TOLERANCE_PX
  }

  const setResizeHover = (hover: boolean) => {
    document.body.classList.toggle(NAV_RESIZE_HOVER_CLASS, hover)
  }

  const resolveNavWidth = (clientX: number) => {
    const min = readDocLayoutPxVar(
      docLayoutVars.minNavWidth,
      Number.parseFloat(docLayoutDefaults.minNavWidth),
    )
    const max = readDocLayoutPxVar(
      docLayoutVars.maxNavWidth,
      Number.parseFloat(docLayoutDefaults.maxNavWidth),
    )
    const left = sidebar?.getBoundingClientRect().left ?? 0
    const marginInlineEnd = readPxValue(
      getComputedStyle(menu).marginInlineEnd,
      0,
    )
    return clamp(clientX - left + marginInlineEnd, min, max)
  }

  const applyNavWidth = (width: number) => {
    document.body.style.setProperty(docLayoutVars.userNavWidth, `${width}px`)
  }

  const persistNavWidth = (width: number) => {
    try {
      localStorage.setItem(DOC_LAYOUT_NAV_WIDTH_STORAGE_KEY, String(width))
    } catch {}
  }

  applyStoredPreference()

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', () => {
      applyStoredPreference()
      setResizeHover(false)
    })
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

  menu.addEventListener('mousemove', (event) => {
    if (document.body.classList.contains(NAV_RESIZING_CLASS)) return
    setResizeHover(isOnResizeEdge(event))
  })

  menu.addEventListener('mouseleave', () => {
    if (document.body.classList.contains(NAV_RESIZING_CLASS)) return
    setResizeHover(false)
  })

  menu.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return
    if (!isOnResizeEdge(event)) return

    event.preventDefault()
    const body = document.body
    body.classList.add(NAV_RESIZING_CLASS)
    setResizeHover(false)

    const onMouseMove = (moveEvent: MouseEvent) => {
      applyNavWidth(resolveNavWidth(moveEvent.clientX))
    }

    const onMouseUp = (upEvent: MouseEvent) => {
      const width = resolveNavWidth(upEvent.clientX)
      applyNavWidth(width)
      persistNavWidth(width)
      body.classList.remove(NAV_RESIZING_CLASS)
      setResizeHover(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  })

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
    const edgeOpenThreshold = readDocLayoutPxVar(
      docLayoutVars.activeRailWidth,
      EDGE_OPEN_THRESHOLD_FALLBACK_PX,
    )
    if (event.clientX > edgeOpenThreshold) return
    setPanelOpen(true)
  })
}

function clamp(value: number, min: number, max: number) {
  if (min > max) return value
  return Math.min(Math.max(value, min), max)
}

function readPxValue(value: string, fallback: number) {
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

ready(init)
