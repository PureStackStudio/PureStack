const ICON_COPY =
  '<svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"></rect><rect x="5" y="5" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.8"></rect></svg>'
const ICON_OK =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M5.5 12.5l4.2 4.2L18.5 8" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"></path></svg>'
const ICON_ERROR =
  '<svg viewBox="0 0 24 24" fill="none"><path d="M8 8l8 8M16 8l-8 8" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"></path></svg>'
const COPY_BUTTON_INSET = 12

type CopyTimer = ReturnType<typeof globalThis.setTimeout>
type CopyButton = HTMLButtonElement & { _copyTimer?: CopyTimer | 0 }

function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }
  fn()
}

function copyText(text: string) {
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    return navigator.clipboard.writeText(text)
  }
  return new Promise<void>((resolve, reject) => {
    try {
      const area = document.createElement('textarea')
      area.value = text
      area.setAttribute('readonly', '')
      area.style.position = 'fixed'
      area.style.opacity = '0'
      area.style.pointerEvents = 'none'
      document.body.appendChild(area)
      area.focus()
      area.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(area)
      if (ok) resolve()
      else reject(new Error('copy failed'))
    } catch (error) {
      reject(error)
    }
  })
}

function labelFor(pre: HTMLElement) {
  const lang = (pre.getAttribute('data-language') || '').trim()
  return lang ? `Copy ${lang} code` : 'Copy code'
}

function setIcon(button: CopyButton, state: 'ok' | 'error' | 'idle') {
  if (state === 'ok') {
    button.innerHTML = ICON_OK
    return
  }
  if (state === 'error') {
    button.innerHTML = ICON_ERROR
    return
  }
  button.innerHTML = ICON_COPY
}

function showState(button: CopyButton, ok: boolean) {
  if (button._copyTimer) globalThis.clearTimeout(button._copyTimer)
  button.classList.remove('is-copied', 'is-error')
  button.classList.add(ok ? 'is-copied' : 'is-error')
  setIcon(button, ok ? 'ok' : 'error')
  button.setAttribute('aria-label', ok ? 'Copied to clipboard' : 'Copy failed')
  button.setAttribute('title', ok ? 'Copied to clipboard' : 'Copy failed')
  button._copyTimer = globalThis.setTimeout(() => {
    button.classList.remove('is-copied', 'is-error')
    setIcon(button, 'idle')
    const label = button.getAttribute('data-copy-label') || 'Copy code'
    button.setAttribute('aria-label', label)
    button.setAttribute('title', label)
    button._copyTimer = 0
  }, 1700)
}

function syncButtonPosition(pre: HTMLElement, button: CopyButton) {
  const buttonWidth = button.offsetWidth || 0
  const left =
    pre.scrollLeft + pre.clientWidth - buttonWidth - COPY_BUTTON_INSET
  const top = pre.scrollTop + COPY_BUTTON_INSET
  button.style.left = `${left}px`
  button.style.top = `${top}px`
  button.style.right = 'auto'
}

function schedulePositionSync(pre: HTMLElement, button: CopyButton) {
  const sync = () => syncButtonPosition(pre, button)
  sync()
  globalThis.requestAnimationFrame(() => {
    sync()
    globalThis.requestAnimationFrame(sync)
  })
}

function createButton(pre: HTMLElement, code: HTMLElement) {
  if (pre.querySelector(':scope > .code-copy-button')) return
  const button = document.createElement('button') as CopyButton
  button.type = 'button'
  button.className = 'code-copy-button tone--neutral tone-button-interactive'
  button.setAttribute('aria-live', 'polite')
  const copyLabel = labelFor(pre)
  button.setAttribute('aria-label', copyLabel)
  button.setAttribute('title', copyLabel)
  button.setAttribute('data-copy-label', copyLabel)
  setIcon(button, 'idle')
  button.addEventListener('click', () => {
    const text = code.textContent || ''
    if (!text) {
      showState(button, false)
      return
    }
    copyText(text).then(
      () => showState(button, true),
      () => showState(button, false),
    )
  })
  pre.classList.add('code-copy-ready')
  pre.appendChild(button)
  const sync = () => syncButtonPosition(pre, button)
  schedulePositionSync(pre, button)
  pre.addEventListener('scroll', sync, { passive: true })
  globalThis.addEventListener('resize', sync)
  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(sync)
    observer.observe(pre)
  }
}

function init() {
  const blocks = Array.from(document.querySelectorAll('.doc-content pre'))
  for (const pre of blocks) {
    if (!(pre instanceof HTMLElement)) continue
    const code = pre.querySelector(':scope > code')
    if (!(code instanceof HTMLElement)) continue
    createButton(pre, code)
  }
}

ready(init)

export {}
