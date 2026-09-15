import { createApp, html, ref } from 'regor'

function initializeWorkbench() {
  for (const workbench of document.querySelectorAll<HTMLElement>(
    '[data-tabs]',
  )) {
    const tabList = workbench.querySelector<HTMLElement>('[data-tab-list]')
    const tabs = [
      ...workbench.querySelectorAll<HTMLButtonElement>('[data-tab]'),
    ]
    const panels = [
      ...workbench.querySelectorAll<HTMLElement>('[data-tab-panel]'),
    ]
    tabList?.setAttribute('role', 'tablist')

    const selectTab = (tab: HTMLButtonElement, focus: boolean) => {
      for (const candidate of tabs) {
        const selected = candidate === tab
        candidate.setAttribute('aria-selected', String(selected))
        candidate.tabIndex = selected ? 0 : -1
        candidate.classList.toggle('is-active', selected)
      }
      for (const panel of panels) {
        panel.hidden = panel.dataset.tabPanel !== tab.dataset.tab
      }
      if (focus) tab.focus()
    }

    for (const [index, tab] of tabs.entries()) {
      tab.setAttribute('role', 'tab')
      tab.addEventListener('click', () => selectTab(tab, false))
      tab.addEventListener('keydown', (event) => {
        let nextIndex: number
        switch (event.key) {
          case 'ArrowRight':
            nextIndex = (index + 1) % tabs.length
            break
          case 'ArrowLeft':
            nextIndex = (index - 1 + tabs.length) % tabs.length
            break
          case 'Home':
            nextIndex = 0
            break
          case 'End':
            nextIndex = tabs.length - 1
            break
          default:
            return
        }
        event.preventDefault()
        selectTab(tabs[nextIndex], true)
      })
    }
    for (const panel of panels) {
      panel.setAttribute('role', 'tabpanel')
      panel.setAttribute('aria-labelledby', `tab-${panel.dataset.tabPanel}`)
    }
    if (tabs[0]) selectTab(tabs[0], false)
  }
}

function initializeCopyButtons() {
  const status = document.getElementById('copy-status')
  let statusTimer: ReturnType<typeof setTimeout>

  for (const button of document.querySelectorAll<HTMLButtonElement>(
    '[data-copy]',
  )) {
    const label = button.querySelector('span:not(.icon)')
    const originalLabel = label?.textContent ?? ''
    const originalAriaLabel = button.getAttribute('aria-label') ?? 'Copy'
    let buttonTimer: ReturnType<typeof setTimeout>

    button.addEventListener('click', async () => {
      const source = document.getElementById(button.dataset.copy ?? '')
      if (!source) return
      let message: string
      try {
        await navigator.clipboard.writeText(source.textContent?.trim() ?? '')
        message = 'Copied to clipboard.'
        button.classList.add('is-copied')
        button.classList.remove('is-failed')
        if (label) label.textContent = 'Copied'
      } catch {
        const selection = window.getSelection()
        const range = document.createRange()
        range.selectNodeContents(source)
        selection?.removeAllRanges()
        selection?.addRange(range)
        message =
          'Clipboard unavailable. The code is selected; use your browser’s Copy action.'
        button.classList.add('is-failed')
        button.classList.remove('is-copied')
        if (label) label.textContent = 'Selected'
      }
      button.setAttribute('aria-label', message)
      if (status) {
        status.textContent = message
        status.classList.add('is-visible')
        clearTimeout(statusTimer)
        statusTimer = setTimeout(
          () => status.classList.remove('is-visible'),
          4000,
        )
      }
      clearTimeout(buttonTimer)
      buttonTimer = setTimeout(() => {
        button.classList.remove('is-copied', 'is-failed')
        button.setAttribute('aria-label', originalAriaLabel)
        if (label) label.textContent = originalLabel
      }, 2400)
    })
  }
}

function initializeMobileMenu() {
  const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu')
  if (!menu) return
  for (const link of menu.querySelectorAll('a')) {
    link.addEventListener('click', () => {
      menu.open = false
    })
  }
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !menu.open) return
    menu.open = false
    menu.querySelector('summary')?.focus()
  })
  document.addEventListener('click', (event) => {
    if (event.target instanceof Node && !menu.contains(event.target))
      menu.open = false
  })
}

function initializeCounter() {
  if (!document.getElementById('counter')) return
  const count = ref(0)
  const increment = () => count(count() + 1)
  createApp(
    { count, increment },
    {
      selector: '#counter',
      template: html`<button type="button" @click="increment">
      Clicked <span r-text="count"></span> times
    </button>`,
    },
  )
}

initializeWorkbench()
initializeCopyButtons()
initializeMobileMenu()
initializeCounter()
