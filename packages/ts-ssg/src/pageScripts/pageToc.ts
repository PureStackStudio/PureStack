const MOBILE_BREAKPOINT_QUERY = '(max-width: 1320px)'
const OPEN_LABEL = 'close'
const CLOSED_LABEL = 'on this page'
const ACTIVE_TARGET_CLASS = 'page-toc__target'
const ACTIVE_LINK_CLASS = 'page-toc__link--active'
const TOC_OPEN_CLASS = 'doc-toc--open'
const BODY_TOC_OPEN_CLASS = 'doc-toc-open'
const BODY_FORCE_COLLAPSED_CLASS = 'template-doc--toc-collapsed'
const TOC_COLLAPSED_STORAGE_KEY = 'ts-ssg:toc-collapsed'
const EDGE_OPEN_THRESHOLD_PX = 8
const ACTIVE_SCROLL_OFFSET = 110
const FLASH_DURATION_MS = 1400

function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }
  fn()
}

function init() {
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
  const media = window.matchMedia(MOBILE_BREAKPOINT_QUERY)
  const readStoredCollapsedPreference = () => {
    try {
      const value = localStorage.getItem(TOC_COLLAPSED_STORAGE_KEY)
      if (value === '1') return true
      if (value === '0') return false
      return null
    } catch {
      return null
    }
  }
  const writeStoredCollapsedPreference = (collapsed: boolean) => {
    try {
      localStorage.setItem(TOC_COLLAPSED_STORAGE_KEY, collapsed ? '1' : '0')
    } catch {}
  }
  const isForceCollapsed = () =>
    document.body.classList.contains(BODY_FORCE_COLLAPSED_CLASS)
  const isCollapsible = () => isForceCollapsed() || media.matches
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

  const storedCollapsed = readStoredCollapsedPreference()
  if (storedCollapsed === true) {
    document.body.classList.add(BODY_FORCE_COLLAPSED_CLASS)
  } else if (storedCollapsed === false) {
    document.body.classList.remove(BODY_FORCE_COLLAPSED_CLASS)
  }
  syncHeaderToggle()

  // Ensure body class always reflects current TOC state for consistent styling.
  setTocOpen(Boolean(tocShell?.classList.contains(TOC_OPEN_CLASS)))

  if (restoreToggle) {
    restoreToggle.addEventListener('click', (event) => {
      event.preventDefault()
      if (isForceCollapsed()) {
        document.body.classList.remove(BODY_FORCE_COLLAPSED_CLASS)
        writeStoredCollapsedPreference(false)
        syncHeaderToggle()
        window.requestAnimationFrame(() => {
          setTocOpen(true)
        })
        return
      }
      document.body.classList.add(BODY_FORCE_COLLAPSED_CLASS)
      writeStoredCollapsedPreference(true)
      syncHeaderToggle()
      setTocOpen(false)
    })
  }

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

    document.addEventListener('mousemove', (event) => {
      if (!isCollapsible()) return
      if (tocShell.classList.contains(TOC_OPEN_CLASS)) return
      if (event.clientX < window.innerWidth - EDGE_OPEN_THRESHOLD_PX) return
      setTocOpen(true)
    })

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', () => {
        if (!isCollapsible()) setTocOpen(false)
      })
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
  let activeHeading: HTMLElement | null = null
  let highlightTimer: number | null = null

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

    if (activeHeading) {
      activeHeading.classList.remove(ACTIVE_TARGET_CLASS)
      activeHeading = null
    }

    const heading = document.getElementById(id)
    if (heading) {
      heading.classList.add(ACTIVE_TARGET_CLASS)
      activeHeading = heading
    }
  }

  const flashTarget = (id: string) => {
    const heading = document.getElementById(id)
    if (!heading) return
    heading.classList.add(ACTIVE_TARGET_CLASS)
    if (highlightTimer) window.clearTimeout(highlightTimer)
    highlightTimer = window.setTimeout(() => {
      heading.classList.remove(ACTIVE_TARGET_CLASS)
      highlightTimer = null
    }, FLASH_DURATION_MS)
  }

  const pickByScroll = () => {
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
    flashTarget(id)
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

ready(init)

export {}
