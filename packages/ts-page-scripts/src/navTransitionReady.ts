function ready(fn: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn, { once: true })
    return
  }
  fn()
}

ready(() => {
  const navToggle = document.getElementById('doc-nav-toggle')
  if (navToggle && 'checked' in navToggle) {
    ;(navToggle as HTMLInputElement).checked = false
  }
  globalThis.requestAnimationFrame(() => {
    if (document.body) {
      document.body.classList.add('template-doc--nav-ready')
    }
  })
})

export {}
