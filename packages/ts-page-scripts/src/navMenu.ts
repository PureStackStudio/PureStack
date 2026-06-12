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
import type { TsSsgNavMenuApi } from './runtimeGlobals'

const NAV_COLLAPSED_CLASS = 'template-doc--nav-collapsed'
const NAV_COLLAPSED_STORAGE_KEY = 'ts-ssg:nav-collapsed'
const NAV_OPEN_GROUPS_STORAGE_KEY = 'ts-ssg:nav-open-groups'
const NAV_SCROLL_TOP_STORAGE_KEY = 'ts-ssg:nav-scroll-top'
const NAV_OPEN_CLASS = 'doc-sidebar--open'
const NAV_RESIZE_HOVER_CLASS = 'col-resize'
const NAV_RESIZING_CLASS = 'resizing'
const NAV_RESIZE_EDGE_TOLERANCE_PX = 20
const EDGE_OPEN_THRESHOLD_FALLBACK_PX = Number.parseFloat(
  docLayoutDefaults.defaultRailWidth,
)

const initializedMenus = new WeakSet<HTMLElement>()

applyStoredDocLayoutPreferences()

const navMenuApi: TsSsgNavMenuApi = {
  hydrate(root?: Element | null) {
    hydrateNavMenu(root)
  },
}

globalThis.window.tsSsgNavMenu = navMenuApi

function hydrateNavMenu(root?: Element | null) {
  const menu = resolveNavMenu(root)
  if (!menu) return
  if (initializedMenus.has(menu)) return
  initializedMenus.add(menu)
  init(menu)
}

function init(menu: HTMLElement) {
  resetNavToggle()
  const sidebar = menu.closest<HTMLElement>('.doc-sidebar')

  const collapseToggle = menu.querySelector<HTMLElement>(
    '[data-nav-menu-collapse]',
  )
  const panelToggles = Array.from(
    menu.querySelectorAll<HTMLElement>('[data-nav-menu-toggle]'),
  )
  const navGroups = Array.from(
    menu.querySelectorAll<HTMLDetailsElement>('details[data-nav-group-key]'),
  )
  const media = window.matchMedia(matchMediaMin(BREAKPOINTS.lg))
  const navStorageScope = resolveNavStorageScope(menu)
  const navCollapsedStorageKey = resolveNavStorageKey(
    NAV_COLLAPSED_STORAGE_KEY,
    navStorageScope,
  )
  const navOpenGroupsStorageKey = resolveNavStorageKey(
    NAV_OPEN_GROUPS_STORAGE_KEY,
    navStorageScope,
  )
  const navScrollTopStorageKey = resolveNavStorageKey(
    NAV_SCROLL_TOP_STORAGE_KEY,
    navStorageScope,
  )

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
      const value = localStorage.getItem(navCollapsedStorageKey)
      if (value === '1') return true
      if (value === '0') return false
      return null
    } catch {
      return null
    }
  }

  const writeStored = (collapsed: boolean) => {
    try {
      localStorage.setItem(navCollapsedStorageKey, collapsed ? '1' : '0')
    } catch {}
  }

  const readStoredOpenGroups = () => {
    try {
      const raw = localStorage.getItem(navOpenGroupsStorageKey)
      if (!raw) return null
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) return null
      return new Set(
        parsed.filter((value): value is string => typeof value === 'string'),
      )
    } catch {
      return null
    }
  }

  const writeStoredOpenGroups = () => {
    try {
      localStorage.setItem(
        navOpenGroupsStorageKey,
        JSON.stringify(resolveOpenGroupKeys()),
      )
    } catch {}
  }

  const readStoredScrollTop = () => {
    try {
      const raw = localStorage.getItem(navScrollTopStorageKey)
      if (!raw) return null
      const value = Number.parseFloat(raw)
      return Number.isFinite(value) && value >= 0 ? value : null
    } catch {
      return null
    }
  }

  const writeStoredScrollTop = (scrollTop: number) => {
    try {
      localStorage.setItem(navScrollTopStorageKey, String(scrollTop))
    } catch {}
  }

  const resolveOpenGroupKeys = () => {
    const keys: string[] = []
    for (const group of navGroups) {
      if (!group.open) continue
      const key = group.getAttribute('data-nav-group-key')
      if (key) keys.push(key)
    }
    return keys
  }

  const applyStoredOpenGroups = () => {
    const stored = readStoredOpenGroups()
    if (!stored) return
    for (const group of navGroups) {
      const key = group.getAttribute('data-nav-group-key')
      const isDefaultOpen =
        group.getAttribute('data-nav-default-open') === 'true'
      group.open = Boolean(key && stored.has(key)) || isDefaultOpen
    }
  }

  const applyStoredScrollTop = () => {
    const scrollTop = readStoredScrollTop()
    if (scrollTop !== null) {
      menu.scrollTop = scrollTop
    }
    revealActiveNavItem()
  }

  const revealActiveNavItem = () => {
    const active = menu.querySelector<HTMLElement>('[aria-current="page"]')
    if (!active) return
    if (active.offsetParent === null) return

    const menuRect = menu.getBoundingClientRect()
    const activeRect = active.getBoundingClientRect()
    if (
      activeRect.top >= menuRect.top &&
      activeRect.bottom <= menuRect.bottom
    ) {
      return
    }

    menu.scrollTop = 0
    const resetMenuRect = menu.getBoundingClientRect()
    const resetActiveRect = active.getBoundingClientRect()
    if (resetActiveRect.top < resetMenuRect.top) {
      menu.scrollTop += resetActiveRect.top - resetMenuRect.top
      return
    }
    if (resetActiveRect.bottom > resetMenuRect.bottom) {
      menu.scrollTop += resetActiveRect.bottom - resetMenuRect.bottom
    }
  }

  let scrollWriteQueued = false
  const queueStoredScrollTop = () => {
    if (scrollWriteQueued) return
    scrollWriteQueued = true
    globalThis.requestAnimationFrame(() => {
      scrollWriteQueued = false
      writeStoredScrollTop(menu.scrollTop)
    })
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
    if (!supportsDesktopCollapse()) return false
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
  applyStoredOpenGroups()
  applyStoredScrollTop()

  for (const group of navGroups) {
    group.addEventListener('toggle', writeStoredOpenGroups)
  }
  menu.addEventListener('scroll', queueStoredScrollTop, { passive: true })

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

  markNavReady()
}

function resetNavToggle() {
  const navToggle = document.getElementById('doc-nav-toggle')
  if (navToggle && 'checked' in navToggle) {
    ;(navToggle as HTMLInputElement).checked = false
  }
}

function markNavReady() {
  globalThis.requestAnimationFrame(() => {
    if (document.body) {
      document.body.classList.add('template-doc--nav-ready')
    }
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

function resolveNavMenu(root?: Element | null) {
  root ??= document.querySelector<HTMLElement>('.nav__menu')
  if (!(root instanceof HTMLElement)) return null
  if (root.classList.contains('nav__menu')) return root
  return root.querySelector<HTMLElement>('.nav__menu')
}

function resolveNavStorageScope(menu: HTMLElement) {
  return menu.getAttribute('data-nav-root') || 'root'
}

function resolveNavStorageKey(baseKey: string, scope: string) {
  return `${baseKey}:${scope}`
}
