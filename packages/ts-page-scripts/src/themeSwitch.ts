type ThemeApi = {
  get: () => string
  list: () => string[]
  set: (theme: string) => void
}

declare global {
  interface Window {
    tsSsgTheme: ThemeApi
  }
}

declare const themeSwitchThemes: string[] | undefined

const themes = Array.isArray(themeSwitchThemes)
  ? themeSwitchThemes.filter((x): x is string => typeof x === 'string')
  : []

if (themes.length > 0) {
  const storageKey = 'ts-ssg-theme'
  const toggleSelector = '[data-theme-toggle]'
  const root = document.documentElement
  let themeReady = false

  function isValid(theme: string) {
    return themes.indexOf(theme) !== -1
  }
  function getStored() {
    try {
      return localStorage.getItem(storageKey) || ''
    } catch {
      return ''
    }
  }
  function setStored(theme: string) {
    try {
      localStorage.setItem(storageKey, theme)
    } catch {}
  }
  function prefersDark() {
    return (
      typeof globalThis.matchMedia === 'function' &&
      globalThis.matchMedia('(prefers-color-scheme: dark)').matches
    )
  }
  function resolvePreferred() {
    const stored = getStored()
    if (isValid(stored)) return stored
    if (prefersDark() && isValid('dark')) return 'dark'
    return themes[0]
  }
  function markReady() {
    if (themeReady) return
    themeReady = true
    root.setAttribute('data-theme-ready', 'true')
  }
  function afterNextFrame(run: () => void) {
    globalThis.requestAnimationFrame(run)
  }
  function getThemeLinks() {
    return Array.from(
      document.querySelectorAll<HTMLLinkElement>(
        'link[rel="stylesheet"][data-theme]',
      ),
    )
  }
  function waitForThemeStyles() {
    const links = getThemeLinks()
    let pending = links.length
    if (pending === 0) {
      afterNextFrame(markReady)
      return
    }

    function finishLink() {
      pending -= 1
      if (pending === 0) afterNextFrame(markReady)
    }

    for (const link of links) {
      if (link.sheet != null) {
        finishLink()
        continue
      }
      link.addEventListener('load', finishLink, { once: true })
      link.addEventListener('error', finishLink, { once: true })
    }
  }
  function syncToggles(theme: string) {
    const toggles = document.querySelectorAll(toggleSelector)
    for (let i = 0; i < toggles.length; i += 1) {
      toggles[i].setAttribute(
        'aria-pressed',
        theme === 'dark' ? 'true' : 'false',
      )
    }
  }
  function applyTheme(theme: string) {
    if (!isValid(theme)) return
    root.setAttribute('data-theme', theme)
    syncToggles(theme)
  }

  let current = resolvePreferred()
  root.setAttribute('data-theme', current)
  waitForThemeStyles()

  function bindToggles() {
    const toggles = document.querySelectorAll(toggleSelector)
    for (let i = 0; i < toggles.length; i += 1) {
      const el = toggles[i]
      if (el.getAttribute('data-ts-ssg-theme-bound') === 'true') continue
      el.setAttribute('data-ts-ssg-theme-bound', 'true')
      el.addEventListener('click', () => {
        const idx = themes.indexOf(current)
        const next = themes[(idx + 1) % themes.length]
        globalThis.window.tsSsgTheme.set(next)
      })
    }
  }
  function initToggles() {
    bindToggles()
    applyTheme(current)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initToggles)
  } else {
    initToggles()
  }

  globalThis.window.tsSsgTheme = {
    get() {
      return current
    },
    list() {
      return themes.slice()
    },
    set(theme: string) {
      if (!isValid(theme)) return
      current = theme
      setStored(current)
      applyTheme(current)
    },
  }
}

export {}
