const MOBILE_QUERY = '(max-width: 760px)'
const OVERFLOW_BUTTON_WIDTH = 42

type TabsEntry = {
  item: HTMLElement
  control: HTMLInputElement
  label: HTMLLabelElement
  text: string
  iconHtml: string
}

type InteractionSource = 'button' | 'select' | 'overflow' | 'external'

function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }
  fn()
}

function initTabs() {
  const roots = Array.from(document.querySelectorAll('.tabs'))
  for (const root of roots) {
    if (!(root instanceof HTMLElement)) continue
    enhanceTabs(root)
  }
}

function enhanceTabs(root: HTMLElement) {
  const list = root.querySelector(':scope > .tabs__list')
  if (!(list instanceof HTMLElement)) return

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
      iconHtml: resolveTabIconHtml(label),
    })
  }
  if (tabs.length === 0) return

  const row = document.createElement('div')
  row.className = 'tabs__tabs-row'

  const overflow = document.createElement('div')
  overflow.className = 'tabs__overflow'
  const overflowToggle = document.createElement('button')
  overflowToggle.type = 'button'
  overflowToggle.className = 'tabs__overflow-toggle'
  overflowToggle.setAttribute('aria-label', 'More tabs')
  overflowToggle.setAttribute('title', 'More tabs')
  overflowToggle.setAttribute('aria-haspopup', 'true')
  overflowToggle.setAttribute('aria-expanded', 'false')
  overflowToggle.innerHTML = '<span aria-hidden="true">&#8942;</span>'
  const overflowMenu = document.createElement('div')
  overflowMenu.className = 'tabs__overflow-menu'
  overflow.appendChild(overflowToggle)
  overflow.appendChild(overflowMenu)

  const buttonWrap = document.createElement('div')
  buttonWrap.className = 'tabs__tab-buttons'

  const buttonMap = new Map<number, HTMLButtonElement>()
  for (let i = 0; i < tabs.length; i += 1) {
    const btn = document.createElement('button')
    btn.type = 'button'
    btn.className = 'tabs__tab-button'
    setButtonContent(btn, tabs[i].text, tabs[i].iconHtml, 'tabs__tab-button')
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
    selectWrap.appendChild(select)
  }
  if (!select) return
  const tabSelect = select
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

  const media = window.matchMedia(MOBILE_QUERY)
  let hiddenIndexes: number[] = []
  let raf = 0
  let resizeObserver: ResizeObserver | null = null
  let windowStart = 0
  let lastInteraction: { source: InteractionSource; index: number } | null =
    null

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
      option.className = 'tabs__overflow-option'
      setButtonContent(
        option,
        tabs[index].text,
        tabs[index].iconHtml,
        'tabs__overflow-option',
      )
      option.disabled = tabs[index].control.disabled
      if (index === active)
        option.classList.add('tabs__overflow-option--active')
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
      btn.classList.remove('tabs__tab-button--hidden')
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
      btn.classList.add('tabs__tab-button--hidden')
      btn.style.order = String(index + tabs.length)
    }

    lastInteraction = null
  }

  function syncState() {
    const active = ensureActive()
    for (const [index, btn] of buttonMap) {
      btn.classList.toggle('tabs__tab-button--active', index === active)
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

  document.addEventListener('click', (event) => {
    const target = event.target
    if (!(target instanceof Node)) return
    if (overflow.contains(target)) return
    closeOverflow()
  })

  for (let i = 0; i < tabs.length; i += 1) {
    tabs[i].control.addEventListener('change', () => {
      const active = getActiveIndex()
      if (!lastInteraction && active !== -1) {
        lastInteraction = { source: 'external', index: active }
      }
      syncState()
      if (!root.classList.contains('tabs--compact')) {
        computeHiddenIndexes()
      }
    })
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
}

function resolveTabIconHtml(label: HTMLLabelElement) {
  const icon = label.querySelector('.tabs__tab-icon')
  if (!(icon instanceof HTMLElement)) return ''
  return icon.innerHTML.trim()
}

function setButtonContent(
  target: HTMLElement,
  text: string,
  iconHtml: string,
  classPrefix: 'tabs__tab-button' | 'tabs__overflow-option',
) {
  if (!iconHtml) {
    target.textContent = text
    return
  }

  target.innerHTML = ''

  const icon = document.createElement('span')
  icon.className = `${classPrefix}-icon`
  icon.setAttribute('aria-hidden', 'true')
  icon.innerHTML = iconHtml

  const label = document.createElement('span')
  label.className = `${classPrefix}-label`
  label.textContent = text

  target.appendChild(icon)
  target.appendChild(label)
}

ready(initTabs)

export {}
