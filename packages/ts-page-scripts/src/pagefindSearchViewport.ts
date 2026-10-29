import { BREAKPOINTS, matchMediaMax } from '../../ts-style/src/breakpoints'

const VIEWPORT_GAP = 8

export function createSearchViewport(root: HTMLElement, output: HTMLElement) {
  const narrow = window.matchMedia(matchMediaMax(BREAKPOINTS.sm))
  const touch = window.matchMedia('(pointer: coarse)')
  const viewport = window.visualViewport

  function hide() {
    if (root.matches(':popover-open')) root.hidePopover()
    root.removeAttribute('popover')
    root.removeAttribute('data-search-compact')
  }

  function update() {
    const height = viewport?.height ?? window.innerHeight
    const compact = narrow.matches || touch.matches
    if (!compact) {
      hide()
      return
    }
    root.setAttribute('data-search-compact', '')

    const viewportTop = viewport?.offsetTop ?? 0

    root.style.setProperty(
      '--ps-search-results-top',
      `${viewportTop + VIEWPORT_GAP}px`,
    )
    root.style.setProperty(
      '--ps-search-results-height',
      `${Math.max(0, height - 2 * VIEWPORT_GAP)}px`,
    )
    root.style.setProperty(
      '--ps-search-results-left',
      `${(viewport?.offsetLeft ?? 0) + VIEWPORT_GAP}px`,
    )
    root.style.setProperty(
      '--ps-search-results-width',
      `${Math.max(0, (viewport?.width ?? window.innerWidth) - 2 * VIEWPORT_GAP)}px`,
    )

    // Keep the field and results together, independent of navigation height.
    root.setAttribute('popover', 'manual')
    if (!root.matches(':popover-open')) root.showPopover()
  }

  function onViewportChange(event: Event) {
    if (output.hidden && !root.matches(':popover-open')) return
    if (event.target instanceof Node && output.contains(event.target)) return
    update()
  }

  viewport?.addEventListener('resize', onViewportChange)
  viewport?.addEventListener('scroll', onViewportChange)
  window.addEventListener('resize', onViewportChange)
  window.addEventListener('scroll', onViewportChange, {
    capture: true,
    passive: true,
  })

  return { update, hide }
}
