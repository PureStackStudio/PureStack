import { createApp, html, ref } from 'regor'

/** Add keyboard navigation to the buttons created by PureStack's Tabs runtime.
 * Native Tabs owns selection, radios, responsive layout, and panel visibility. */
function initializeWorkbench() {
  const workbench = document.querySelector<HTMLElement>('.studio-tabs')
  if (!workbench) return true
  const list = workbench.querySelector<HTMLElement>('.tabs__tab-buttons')
  const tabs = [
    ...workbench.querySelectorAll<HTMLButtonElement>(
      '.tabs__tab-buttons > .btn',
    ),
  ]
  const controls = [
    ...workbench.querySelectorAll<HTMLInputElement>('.tabs__control'),
  ]
  if (!list || tabs.length !== controls.length) return false
  const panels = workbench.querySelector<HTMLElement>('.tabs__list')
  list.setAttribute('role', 'tablist')
  list.setAttribute(
    'aria-label',
    panels?.getAttribute('aria-label') ?? 'Explore PureStack examples',
  )
  panels?.removeAttribute('role')
  panels?.removeAttribute('aria-label')
  const updateFocus = () => {
    tabs.forEach((tab, index) => {
      tab.tabIndex = controls[index].checked ? 0 : -1
      tab.setAttribute('aria-selected', String(controls[index].checked))
    })
  }
  tabs.forEach((tab, index) => {
    const control = controls[index]
    tab.id = `tab-${control.id}`
    tab.setAttribute('role', 'tab')
    tab.setAttribute('aria-controls', `${control.id}-panel`)
    document
      .getElementById(`${control.id}-panel`)
      ?.setAttribute('aria-labelledby', tab.id)
    control.addEventListener('change', updateFocus)
    tab.addEventListener('keydown', (event) => {
      let next: number
      switch (event.key) {
        case 'ArrowRight':
          next = (index + 1) % tabs.length
          break
        case 'ArrowLeft':
          next = (index - 1 + tabs.length) % tabs.length
          break
        case 'Home':
          next = 0
          break
        case 'End':
          next = tabs.length - 1
          break
        default:
          return
      }
      event.preventDefault()
      tabs[next].click()
      tabs[next].focus()
    })
  })
  updateFocus()
  return true
}

function initializeCopyButtons() {
  const status = document.getElementById('copy-status')
  let statusTimer: ReturnType<typeof setTimeout>

  for (const button of document.querySelectorAll<HTMLButtonElement>(
    '[data-copy]',
  )) {
    const label = button.querySelector('.btn__label')
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

if (!initializeWorkbench()) {
  const workbench = document.querySelector('.tabs.studio-tabs')
  if (workbench) {
    const observer = new MutationObserver(() => {
      if (initializeWorkbench()) observer.disconnect()
    })
    observer.observe(workbench, { childList: true, subtree: true })
  }
}
initializeCopyButtons()
initializeMobileMenu()
initializeCounter()
