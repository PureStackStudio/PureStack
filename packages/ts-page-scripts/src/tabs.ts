import { BREAKPOINTS, matchMediaMax } from '../../ts-style/src/breakpoints'

const OVERFLOW_BUTTON_WIDTH = 42
let nextAutoTabsSelectId = 1

type TabsEntry = {
  item: HTMLElement
  control: HTMLInputElement
  label: HTMLLabelElement
  text: string
  iconMarkup: string
  tabClassName: string
}

type InteractionSource = 'button' | 'select' | 'overflow' | 'external'

const cleanupByRoot = new WeakMap<HTMLElement, () => void>()

function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => fn(), { once: true })
    return
  }
  fn()
}

function resolveTabsRoots(target?: string) {
  return [...document.querySelectorAll<HTMLElement>(target ?? '.tabs')]
}

function initTabs(target?: string) {
  for (const root of resolveTabsRoots(target)) refreshTabs(root)
}

function refreshTabs(root: HTMLElement) {
  cleanupByRoot.get(root)?.()
  enhanceTabs(root)
}

function enhanceTabs(root: HTMLElement) {
  const list = root.querySelector(':scope > .tabs__list')
  if (!(list instanceof HTMLElement)) return
  const surfaceClassName = resolveTabsSurfaceClassName(root)

  const items = Array.from(
    list.querySelectorAll<HTMLElement>(':scope > .tabs__item'),
  )
  const tabs: TabsEntry[] = []
  for (const item of items) {
    const control = item.querySelector(':scope > .tabs__control')
    const label = item.querySelector(':scope > .tabs__tab')
    if (!(control instanceof HTMLInputElement)) continue
    if (!(label instanceof HTMLLabelElement)) continue
    tabs.push({
      item,
      control,
      label,
      text: (label.textContent || '').trim() || 'Tab',
      iconMarkup: resolveTabIconMarkup(label),
      tabClassName: resolveTabButtonClassName(label),
    })
  }
  if (tabs.length === 0) return
  const defaultTabClassName = tabs[0]?.tabClassName || ''

  const row = document.createElement('div')
  row.className = 'tabs__tabs-row'

  const overflow = document.createElement('div')
  overflow.className = 'tabs__overflow'
  const overflowToggle = document.createElement('button')
  overflowToggle.type = 'button'
  overflowToggle.className = 'btn tabs__overflow-toggle'
  addClassNames(overflowToggle, defaultTabClassName)
  overflowToggle.setAttribute('aria-label', 'More tabs')
  overflowToggle.setAttribute('title', 'More tabs')
  overflowToggle.setAttribute('aria-haspopup', 'true')
  overflowToggle.setAttribute('aria-expanded', 'false')
  overflowToggle.innerHTML = '<span aria-hidden="true">&#8942;</span>'
  const overflowMenu = document.createElement('div')
  overflowMenu.className = 'tabs__overflow-menu'
  addClassNames(overflowMenu, surfaceClassName)
  overflow.appendChild(overflowToggle)
  overflow.appendChild(overflowMenu)

  const buttonWrap = document.createElement('div')
  buttonWrap.className = 'tabs__tab-buttons'

  const buttonMap = new Map<number, HTMLButtonElement>()
  for (let i = 0; i < tabs.length; i += 1) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'btn'
    addClassNames(btn, tabs[i].tabClassName)
    setButtonContent(btn, tabs[i].text, tabs[i].iconMarkup)
    btn.disabled = tabs[i].control.disabled
    btn.setAttribute('aria-label', tabs[i].text)
    btn.addEventListener('click', () => selectTab(i, 'button'))
    buttonWrap.appendChild(btn)
    buttonMap.set(i, btn)
  }

  row.appendChild(buttonWrap)
  row.appendChild(overflow)

  let selectWrap = root.querySelector<HTMLElement>(
    ':scope > .tabs__select-wrap',
  )
  let select = selectWrap?.querySelector<HTMLSelectElement>(
    ':scope > .tabs__select',
  )
  if (
    !(selectWrap instanceof HTMLElement) ||
    !(select instanceof HTMLSelectElement)
  ) {
    selectWrap = document.createElement('div')
    selectWrap.className = 'tabs__select-wrap'
    select = document.createElement('select')
    select.className = 'tabs__select'
    addClassNames(select, surfaceClassName)
    selectWrap.appendChild(select)
  }
  if (!select) return
  const tabSelect = select
  addClassNames(tabSelect, surfaceClassName)
  if (!tabSelect.id) {
    tabSelect.id = resolveTabsSelectId(root)
  }
  tabSelect.setAttribute(
    'aria-label',
    list.getAttribute('aria-label') || 'Tabs',
  )

  let header = root.querySelector(':scope > .tabs__header')
  if (!(header instanceof HTMLElement)) {
    const nestedHeader = root.querySelector('.tabs__header')
    if (nestedHeader instanceof HTMLElement) {
      header = nestedHeader
      if (header.parentNode !== root) {
        root.insertBefore(header, list)
      }
    }
  }
  if (header instanceof HTMLElement && header.parentNode === root) {
    root.insertBefore(row, header.nextSibling)
    root.insertBefore(selectWrap, row.nextSibling)
  } else {
    root.insertBefore(row, list)
    root.insertBefore(selectWrap, row.nextSibling)
  }

  root.classList.add('tabs--enhanced')

  const media = window.matchMedia(matchMediaMax(BREAKPOINTS.sm))
  let hiddenIndexes: number[] = []
  let raf = 0
  let resizeObserver: ResizeObserver | null = null
  let windowStart = 0
  let lastInteraction: { source: InteractionSource; index: number } | null =
    null
  const controlChangeHandlers = new Map<HTMLInputElement, () => void>()

  function getActiveIndex() {
    for (let i = 0; i < tabs.length; i += 1) {
      if (tabs[i].control.checked) return i
    }
    return -1
  }

  function ensureActive() {
    const active = getActiveIndex()
    if (active !== -1 && !tabs[active].control.disabled) return active
    for (let i = 0; i < tabs.length; i += 1) {
      if (tabs[i].control.disabled) continue
      tabs[i].control.checked = true
      return i
    }
    return -1
  }

  function selectTab(index: number, source: InteractionSource) {
    const entry = tabs[index]
    if (!entry || entry.control.disabled) return
    lastInteraction = { source, index }
    entry.control.checked = true
    entry.control.dispatchEvent(new Event('change', { bubbles: true }))
    syncState()
    applyLayout()
  }

  function syncSelect() {
    tabSelect.innerHTML = ''
    for (let i = 0; i < tabs.length; i += 1) {
      const option = document.createElement('option')
      option.value = String(i)
      option.textContent = tabs[i].text
      option.disabled = tabs[i].control.disabled
      tabSelect.appendChild(option)
    }
    const active = ensureActive()
    if (active !== -1) tabSelect.value = String(active)
  }

  function updateOverflowMenu() {
    overflowMenu.innerHTML = ''
    const active = ensureActive()
    for (const index of hiddenIndexes) {
      const option = document.createElement('button')
      option.type = 'button'
      option.className = 'btn tabs__overflow-option'
      addClassNames(option, tabs[index].tabClassName)
      setButtonContent(option, tabs[index].text, tabs[index].iconMarkup)
      option.disabled = tabs[index].control.disabled
      option.setAttribute('aria-pressed', index === active ? 'true' : 'false')
      option.addEventListener('click', () => {
        selectTab(index, 'overflow')
        closeOverflow()
      })
      overflowMenu.appendChild(option)
    }
    overflow.classList.toggle(
      'tabs__overflow--visible',
      hiddenIndexes.length > 0,
    )
  }

  function closeOverflow() {
    overflow.classList.remove('tabs__overflow--open')
    overflowToggle.setAttribute('aria-expanded', 'false')
  }

  function openOverflow() {
    overflow.classList.add('tabs__overflow--open')
    overflowToggle.setAttribute('aria-expanded', 'true')
  }

  function shouldUseCompact() {
    return media.matches
  }

  function computeHiddenIndexes() {
    hiddenIndexes = []
    for (const [index, btn] of buttonMap) {
      btn.hidden = false
      btn.style.order = String(index)
    }

    const active = ensureActive()
    const available = row.clientWidth
    if (!available) return

    const widths: number[] = []
    let total = 0
    for (let i = 0; i < tabs.length; i += 1) {
      const btn = buttonMap.get(i)
      if (!btn) continue
      const width = Math.ceil(btn.getBoundingClientRect().width)
      widths[i] = width
      total += width
    }
    const gap = 8
    total += Math.max(0, tabs.length - 1) * gap
    if (total <= available) return

    let budget = available - OVERFLOW_BUTTON_WIDTH - gap
    if (budget < 0) budget = 0
    const getRangeFrom = (start: number) => {
      let used = 0
      let end = start - 1
      for (let i = start; i < tabs.length; i += 1) {
        const width = widths[i] || 0
        const next = width + (used > 0 ? gap : 0)
        if (used > 0 && used + next > budget) break
        if (used === 0 && width > budget) {
          end = i
          used = width
          break
        }
        used += next
        end = i
      }
      if (end < start) end = start
      return { start, end }
    }
    const shiftRightToReveal = (range: { start: number; end: number }) => {
      const previousEnd = range.end
      let candidateStart = range.start
      let candidateRange = range
      while (candidateStart < tabs.length - 1) {
        candidateStart += 1
        const nextRange = getRangeFrom(candidateStart)
        candidateRange = nextRange
        if (nextRange.end > previousEnd || nextRange.end === tabs.length - 1) {
          windowStart = candidateStart
          return nextRange
        }
      }
      windowStart = candidateStart
      return candidateRange
    }
    const shiftLeftToReveal = (range: { start: number; end: number }) => {
      const previousStart = range.start
      let candidateStart = range.start
      let candidateRange = range
      while (candidateStart > 0) {
        candidateStart -= 1
        const nextRange = getRangeFrom(candidateStart)
        candidateRange = nextRange
        if (nextRange.start < previousStart || nextRange.start === 0) {
          windowStart = candidateStart
          return nextRange
        }
      }
      windowStart = candidateStart
      return candidateRange
    }

    const activeIndex = active !== -1 ? active : tabs.length - 1
    windowStart = Math.max(0, Math.min(windowStart, tabs.length - 1))

    let visibleRange = getRangeFrom(windowStart)
    if (activeIndex < visibleRange.start) {
      windowStart = activeIndex
      visibleRange = getRangeFrom(windowStart)
    } else if (activeIndex > visibleRange.end) {
      while (activeIndex > visibleRange.end && windowStart < tabs.length - 1) {
        windowStart += 1
        visibleRange = getRangeFrom(windowStart)
      }
    }

    if (
      lastInteraction?.source === 'button' &&
      lastInteraction.index === visibleRange.end &&
      visibleRange.end < tabs.length - 1
    ) {
      const nextRange = shiftRightToReveal(visibleRange)
      if (activeIndex >= nextRange.start && activeIndex <= nextRange.end) {
        visibleRange = nextRange
      }
    }

    if (
      lastInteraction?.source === 'button' &&
      lastInteraction.index === visibleRange.start &&
      visibleRange.start > 0
    ) {
      visibleRange = shiftLeftToReveal(visibleRange)
    }

    if (
      lastInteraction?.source === 'select' ||
      lastInteraction?.source === 'overflow'
    ) {
      if (
        activeIndex === visibleRange.end &&
        visibleRange.end < tabs.length - 1
      ) {
        const nextRange = shiftRightToReveal(visibleRange)
        if (activeIndex >= nextRange.start && activeIndex <= nextRange.end) {
          visibleRange = nextRange
        }
      } else if (activeIndex === visibleRange.start && visibleRange.start > 0) {
        visibleRange = shiftLeftToReveal(visibleRange)
      }
    }

    for (let i = 0; i < tabs.length; i += 1) {
      if (i >= visibleRange.start && i <= visibleRange.end) continue
      hiddenIndexes.push(i)
    }

    for (const index of hiddenIndexes) {
      const btn = buttonMap.get(index)
      if (!btn) continue
      btn.hidden = true
      btn.style.order = String(index + tabs.length)
    }

    lastInteraction = null
  }

  function syncState() {
    const active = ensureActive()
    for (const [index, btn] of buttonMap) {
      btn.classList.toggle('active', index === active)
      btn.setAttribute('aria-selected', index === active ? 'true' : 'false')
    }
    if (active !== -1) tabSelect.value = String(active)
    updateOverflowMenu()
  }

  function applyLayout() {
    root.classList.toggle('tabs--compact', shouldUseCompact())
    if (root.classList.contains('tabs--compact')) {
      closeOverflow()
      syncState()
      return
    }
    computeHiddenIndexes()
    syncState()
  }

  tabSelect.addEventListener('change', () => {
    const index = Number.parseInt(tabSelect.value, 10)
    if (!Number.isFinite(index)) return
    selectTab(index, 'select')
  })

  overflowToggle.addEventListener('click', () => {
    if (overflow.classList.contains('tabs__overflow--open')) {
      closeOverflow()
      return
    }
    openOverflow()
  })

  const onDocumentClick = (event: Event) => {
    const target = event.target
    if (!(target instanceof Node)) return
    if (overflow.contains(target)) return
    closeOverflow()
  }
  document.addEventListener('click', onDocumentClick)

  for (let i = 0; i < tabs.length; i += 1) {
    const onControlChange = () => {
      const active = getActiveIndex()
      if (!lastInteraction && active !== -1) {
        lastInteraction = { source: 'external', index: active }
      }
      syncState()
      if (!root.classList.contains('tabs--compact')) {
        computeHiddenIndexes()
      }
    }
    tabs[i].control.addEventListener('change', onControlChange)
    controlChangeHandlers.set(tabs[i].control, onControlChange)
  }

  const onResize = () => {
    if (raf) return
    raf = window.requestAnimationFrame(() => {
      raf = 0
      applyLayout()
    })
  }

  window.addEventListener('resize', onResize, { passive: true })
  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', applyLayout)
  }
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      onResize()
    })
    resizeObserver.observe(root)
    resizeObserver.observe(row)
    resizeObserver.observe(buttonWrap)
  }

  syncSelect()
  applyLayout()

  cleanupByRoot.set(root, () => {
    if (raf) {
      window.cancelAnimationFrame(raf)
      raf = 0
    }
    window.removeEventListener('resize', onResize)
    if (typeof media.removeEventListener === 'function') {
      media.removeEventListener('change', applyLayout)
    }
    resizeObserver?.disconnect()
    document.removeEventListener('click', onDocumentClick)
    for (const [control, onControlChange] of controlChangeHandlers) {
      control.removeEventListener('change', onControlChange)
    }
    row.remove()
    if (selectWrap.parentNode === root) selectWrap.remove()
    root.classList.remove('tabs--enhanced', 'tabs--compact')
    cleanupByRoot.delete(root)
  })
}

function resolveTabIconMarkup(label: HTMLLabelElement) {
  const icon = label.querySelector('.tabs__tab-icon')
  if (!(icon instanceof HTMLElement)) return ''
  return icon.outerHTML.trim()
}

function resolveTabButtonClassName(label: HTMLLabelElement) {
  return getClassNamesExcept(label, ['tabs__tab', 'tabs__tab--disabled'])
}

function setButtonContent(
  target: HTMLElement,
  text: string,
  iconMarkup: string,
) {
  if (!iconMarkup) {
    target.textContent = text
    return
  }

  target.innerHTML = ''
  const template = document.createElement('template')
  template.innerHTML = iconMarkup
  const icon = template.content.firstElementChild
  if (icon instanceof HTMLElement) {
    icon.setAttribute('aria-hidden', 'true')
    icon.classList.add('btn__icon')
    target.appendChild(icon)
  }

  const label = document.createElement('span')
  label.className = 'btn__label tabs__tab-label'
  label.textContent = text

  target.appendChild(label)
}

function resolveTabsSelectId(root: HTMLElement) {
  const rootId = root.id?.trim()
  if (rootId) return `${rootId}-select`

  const nextId = `tabs-select-${nextAutoTabsSelectId}`
  nextAutoTabsSelectId += 1
  return nextId
}

function addClassNames(element: HTMLElement, className: string) {
  const tokens = className.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return
  element.classList.add(...tokens)
}

function resolveTabsSurfaceClassName(root: HTMLElement) {
  return getClassNamesExcept(root, ['tabs', 'tabs--enhanced', 'tabs--compact'])
}

function getClassNamesExcept(element: HTMLElement, excluded: string[]) {
  const excludedSet = new Set(excluded)
  return [...element.classList]
    .filter((className) => !excludedSet.has(className))
    .join(' ')
}

ready(initTabs)

globalThis.window.tsSsgTabs = {
  refresh(target?: string) {
    initTabs(target)
  },
}
