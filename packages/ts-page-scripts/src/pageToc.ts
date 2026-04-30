import { BREAKPOINTS, matchMediaMax } from '../../ts-style/src/breakpoints'
import {
  docLayoutDefaults,
  docLayoutVars,
} from '../../ts-style/src/docLayoutVars'
import {
  applyStoredDocLayoutPreferences,
  DOC_LAYOUT_TOC_WIDTH_STORAGE_KEY,
  readDocLayoutPxVar,
} from './docLayoutCssVars'

const OPEN_LABEL = 'close'
const CLOSED_LABEL = 'on this page'
const ACTIVE_TARGET_CLASS = 'page-toc__target'
const ACTIVE_LINK_CLASS = 'active'
const TOC_OPEN_CLASS = 'doc-toc--open'
const BODY_TOC_OPEN_CLASS = 'doc-toc-open'
const BODY_FORCE_COLLAPSED_CLASS = 'template-doc--toc-collapsed'
const TOC_COLLAPSED_STORAGE_KEY = 'ts-ssg:toc-collapsed'
const TOC_RESIZE_HOVER_CLASS = 'col-resize'
const TOC_RESIZING_CLASS = 'resizing'
const TOC_RESIZE_EDGE_TOLERANCE_PX = 20
const EDGE_OPEN_THRESHOLD_FALLBACK_PX = Number.parseFloat(
  docLayoutDefaults.defaultRailWidth,
)
const EDGE_OPEN_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
const ACTIVE_SCROLL_OFFSET = 110
const FLASH_DURATION_MS = 1400
const MANUAL_ACTIVE_LOCK_MS = 900

function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }
  fn()
}

function init() {
  applyStoredDocLayoutPreferences()

  const toc = document.querySelector<HTMLElement>('.page-toc')
  if (!toc) {
    document.body.classList.remove(BODY_TOC_OPEN_CLASS)
    return
  }

  const tocShell = toc.closest<HTMLElement>('.doc-toc')
  const toggle = toc.querySelector<HTMLElement>('.page-toc__panel-toggle')
  const restoreToggle = toc.querySelector<HTMLElement>(
    '[data-page-toc-restore]',
  )
  const toggleLabel = toc.querySelector<HTMLElement>(
    '.page-toc__panel-toggle-label',
  )
  const media = window.matchMedia(matchMediaMax(BREAKPOINTS.toc))
  const edgeOpenMedia = window.matchMedia(EDGE_OPEN_POINTER_QUERY)
  const readStored = () => {
    try {
      const value = localStorage.getItem(TOC_COLLAPSED_STORAGE_KEY)
      if (value === '1') return true
      if (value === '0') return false
      return null
    } catch {
      return null
    }
  }
  const writeStored = (collapsed: boolean) => {
    try {
      localStorage.setItem(TOC_COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0')
    } catch {}
  }
  const isForceCollapsed = () =>
    document.body.classList.contains(BODY_FORCE_COLLAPSED_CLASS)
  const supportsDesktopCollapse = () => {
    const body = document.body
    return body.classList.contains('template-doc--has-toc') && !media.matches
  }
  const mediaMd = window.matchMedia(matchMediaMax(BREAKPOINTS.md))
  const isCollapsible = () => isForceCollapsed() || media.matches
  const supportsDesktopResize = () => !mediaMd.matches
  const syncHeaderToggle = () => {
    if (!restoreToggle) return
    if (isForceCollapsed()) {
      restoreToggle.setAttribute('title', 'Restore table of contents')
      restoreToggle.setAttribute('aria-label', 'Restore table of contents')
      return
    }
    restoreToggle.setAttribute('title', 'Collapse table of contents')
    restoreToggle.setAttribute('aria-label', 'Collapse table of contents')
  }

  const setTocOpen = (open: boolean) => {
    if (tocShell) {
      tocShell.classList.toggle(TOC_OPEN_CLASS, open)
    }
    if (toggle) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false')
    }
    if (toggleLabel) {
      toggleLabel.textContent = open ? OPEN_LABEL : CLOSED_LABEL
    }
    document.body.classList.toggle(
      BODY_TOC_OPEN_CLASS,
      Boolean(open && tocShell && isCollapsible()),
    )
  }

  const shouldHighlightTargets = () =>
    !isCollapsible() || Boolean(tocShell?.classList.contains(TOC_OPEN_CLASS))

  const shouldOpenByDefault = () => !isCollapsible()

  const syncOpenState = () => {
    setTocOpen(shouldOpenByDefault())
  }

  const applyStoredPreference = () => {
    const stored = readStored()
    if (stored === true) {
      document.body.classList.add(BODY_FORCE_COLLAPSED_CLASS)
    } else if (stored === false) {
      document.body.classList.remove(BODY_FORCE_COLLAPSED_CLASS)
    }
    syncHeaderToggle()
  }

  const isOnResizeEdge = (event: MouseEvent) => {
    if (!supportsDesktopResize()) return false
    const rect = toc.getBoundingClientRect()
    return Math.abs(event.clientX - rect.left) <= TOC_RESIZE_EDGE_TOLERANCE_PX
  }

  const setResizeHover = (hover: boolean) => {
    document.body.classList.toggle(TOC_RESIZE_HOVER_CLASS, hover)
  }

  const resolveTocWidth = (clientX: number) => {
    const min = readDocLayoutPxVar(
      docLayoutVars.minTocWidth,
      Number.parseFloat(docLayoutDefaults.minTocWidth),
    )
    const max = readDocLayoutPxVar(
      docLayoutVars.maxTocWidth,
      Number.parseFloat(docLayoutDefaults.maxTocWidth),
    )
    const right = tocShell?.getBoundingClientRect().right ?? window.innerWidth
    const marginInlineStart = readPxValue(
      getComputedStyle(toc).marginInlineStart,
      0,
    )
    return clamp(right - clientX + marginInlineStart, min, max)
  }

  const applyTocWidth = (width: number) => {
    document.body.style.setProperty(docLayoutVars.userTocWidth, `${width}px`)
  }

  const persistTocWidth = (width: number) => {
    try {
      localStorage.setItem(DOC_LAYOUT_TOC_WIDTH_STORAGE_KEY, String(width))
    } catch {}
  }

  applyStoredPreference()

  // Compute the runtime TOC state from the active layout mode instead of
  // inheriting an arbitrary server-rendered class.
  syncOpenState()

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', () => {
      setResizeHover(false)
      syncOpenState()
    })
  }

  if (restoreToggle) {
    restoreToggle.addEventListener('click', (event) => {
      event.preventDefault()
      if (isForceCollapsed()) {
        document.body.classList.remove(BODY_FORCE_COLLAPSED_CLASS)
        writeStored(false)
        syncHeaderToggle()
        window.requestAnimationFrame(() => {
          setTocOpen(true)
        })
        return
      }
      document.body.classList.add(BODY_FORCE_COLLAPSED_CLASS)
      writeStored(true)
      syncHeaderToggle()
      setTocOpen(false)
    })
  }

  toc.addEventListener('mousemove', (event) => {
    if (document.body.classList.contains(TOC_RESIZING_CLASS)) return
    setResizeHover(isOnResizeEdge(event))
  })

  toc.addEventListener('mouseleave', () => {
    if (document.body.classList.contains(TOC_RESIZING_CLASS)) return
    setResizeHover(false)
  })

  toc.addEventListener('mousedown', (event) => {
    if (event.button !== 0) return
    if (!isOnResizeEdge(event)) return

    event.preventDefault()
    const body = document.body
    body.classList.add(TOC_RESIZING_CLASS)
    setResizeHover(false)

    const onMouseMove = (moveEvent: MouseEvent) => {
      applyTocWidth(resolveTocWidth(moveEvent.clientX))
    }

    const onMouseUp = (upEvent: MouseEvent) => {
      const width = resolveTocWidth(upEvent.clientX)
      applyTocWidth(width)
      persistTocWidth(width)
      body.classList.remove(TOC_RESIZING_CLASS)
      setResizeHover(false)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  })

  if (toggle && tocShell) {
    toggle.addEventListener('click', (event) => {
      event.preventDefault()
      setTocOpen(!tocShell.classList.contains(TOC_OPEN_CLASS))
    })

    window.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        tocShell.classList.contains(TOC_OPEN_CLASS)
      ) {
        setTocOpen(false)
      }
    })

    document.addEventListener('click', (event) => {
      if (!isCollapsible()) return
      if (!tocShell.classList.contains(TOC_OPEN_CLASS)) return
      const target = event.target
      if (!(target instanceof Node)) return
      if (toc.contains(target)) return
      setTocOpen(false)
    })

    const maybeOpenFromEdge = (event: MouseEvent | PointerEvent) => {
      if (document.body.classList.contains(TOC_RESIZING_CLASS)) return
      if (!supportsDesktopCollapse() && !media.matches) return
      if (!isCollapsible()) return
      if (!edgeOpenMedia.matches) return
      if (tocShell.classList.contains(TOC_OPEN_CLASS)) return
      if ('pointerType' in event && event.pointerType !== 'mouse') return
      const edgeOpenThreshold = readDocLayoutPxVar(
        docLayoutVars.activeRailWidth,
        EDGE_OPEN_THRESHOLD_FALLBACK_PX,
      )
      if (event.clientX < window.innerWidth - edgeOpenThreshold) return
      setTocOpen(true)
    }

    if ('PointerEvent' in window) {
      document.addEventListener('pointermove', maybeOpenFromEdge)
    } else {
      document.addEventListener('mousemove', maybeOpenFromEdge)
    }
  }

  const links = Array.from(
    toc.querySelectorAll<HTMLAnchorElement>('a.page-toc__link[href^="#"]'),
  )
  if (links.length === 0) {
    if (!isCollapsible()) {
      document.body.classList.remove(BODY_TOC_OPEN_CLASS)
    }
    return
  }

  for (const link of links) {
    link.addEventListener('click', () => {
      const id = (link.getAttribute('href') ?? '').slice(1)
      if (id) {
        setActive(id)
        flashTarget(id)
        lockManualActive()
      }
      if (isCollapsible()) setTocOpen(false)
    })
  }

  const linkById = new Map<string, HTMLAnchorElement>()
  for (const link of links) {
    const href = link.getAttribute('href') ?? ''
    const id = href.slice(1)
    if (id) linkById.set(id, link)
  }

  const content = document.querySelector<HTMLElement>('.doc-main .doc-content')
  if (!content) return

  const headings = Array.from(
    content.querySelectorAll<HTMLElement>('h2[id], h3[id]'),
  )
  if (headings.length === 0) return

  let activeId = ''
  let highlightedHeading: HTMLElement | null = null
  let highlightTimer: number | null = null
  let manualActiveUntil = 0

  const lockManualActive = () => {
    manualActiveUntil = Date.now() + MANUAL_ACTIVE_LOCK_MS
  }

  const shouldHoldManualActive = () => Date.now() < manualActiveUntil

  const setActive = (id: string) => {
    if (!id || id === activeId) return

    const previous = linkById.get(activeId)
    if (previous) {
      previous.classList.remove(ACTIVE_LINK_CLASS)
      previous.removeAttribute('aria-current')
    }

    const next = linkById.get(id)
    if (next) {
      next.classList.add(ACTIVE_LINK_CLASS)
      next.setAttribute('aria-current', 'location')
      activeId = id
    }
  }

  const flashTarget = (id: string) => {
    if (!shouldHighlightTargets()) return
    const heading = document.getElementById(id)
    if (!heading) return
    if (highlightedHeading && highlightedHeading !== heading) {
      highlightedHeading.classList.remove(ACTIVE_TARGET_CLASS)
      highlightedHeading = null
    }
    heading.classList.add(ACTIVE_TARGET_CLASS)
    highlightedHeading = heading
    if (highlightTimer) window.clearTimeout(highlightTimer)
    highlightTimer = window.setTimeout(() => {
      if (highlightedHeading === heading) {
        heading.classList.remove(ACTIVE_TARGET_CLASS)
        highlightedHeading = null
      }
      highlightTimer = null
    }, FLASH_DURATION_MS)
  }

  const pickByScroll = () => {
    if (shouldHoldManualActive()) return
    let current = ''
    for (const heading of headings) {
      const rect = heading.getBoundingClientRect()
      if (rect.top - ACTIVE_SCROLL_OFFSET <= 0) current = heading.id
      else break
    }
    if (!current) current = headings[0].id
    setActive(current)
  }

  const handleHash = () => {
    const id = (window.location.hash ?? '').slice(1)
    if (!id) return
    setActive(id)
  }

  window.addEventListener('hashchange', handleHash)

  if ('IntersectionObserver' in window) {
    const visible = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = (entry.target as HTMLElement).id
          if (!id) continue
          if (entry.isIntersecting) visible.add(id)
          else visible.delete(id)
        }

        if (shouldHoldManualActive()) return

        if (visible.size > 0) {
          for (let i = headings.length - 1; i >= 0; i -= 1) {
            const id = headings[i].id
            if (visible.has(id)) {
              setActive(id)
              break
            }
          }
          return
        }

        pickByScroll()
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 1] },
    )

    for (const heading of headings) observer.observe(heading)
    pickByScroll()
  } else {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        pickByScroll()
        ticking = false
      })
    }
    globalThis.window.addEventListener('scroll', onScroll, { passive: true })
    globalThis.window.addEventListener('resize', onScroll)
    pickByScroll()
  }

  handleHash()
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
