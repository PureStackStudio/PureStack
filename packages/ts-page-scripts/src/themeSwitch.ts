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
  const root = document.documentElement
  let themeReady = false
  let themeSwitchersReady = false

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
  function waitForReady(link: HTMLLinkElement | null) {
    if (!link || link.sheet != null) {
      markReady()
      return
    }
    link.addEventListener('load', () => markReady(), { once: true })
  }
  function applyTheme(theme: string, deferDisable: boolean) {
    if (!isValid(theme))
      return {
        active: null as HTMLLinkElement | null,
        others: [] as HTMLLinkElement[],
      }
    const links = document.querySelectorAll<HTMLLinkElement>('link[data-theme]')
    let active: HTMLLinkElement | null = null
    const others: HTMLLinkElement[] = []
    for (let i = 0; i < links.length; i += 1) {
      const link = links[i]
      const linkTheme = link.getAttribute('data-theme')
      if (linkTheme === theme) {
        link.disabled = false
        active = link
      } else {
        others.push(link)
        if (!deferDisable) link.disabled = true
      }
    }
    root.setAttribute('data-theme', theme)
    return { active, others }
  }
  function disableLinks(links: HTMLLinkElement[]) {
    for (let i = 0; i < links.length; i += 1) links[i].disabled = true
  }
  function markSwitchersReady() {
    if (themeSwitchersReady) return
    themeSwitchersReady = true
    globalThis.requestAnimationFrame(() => {
      globalThis.requestAnimationFrame(() => {
        const switches = document.querySelectorAll('.theme-switcher')
        for (let i = 0; i < switches.length; i += 1) {
          switches[i].setAttribute('data-theme-switcher-ready', 'true')
        }
      })
    })
  }
  function syncSwitchers(theme: string) {
    const switches = document.querySelectorAll('.theme-switcher')
    for (let i = 0; i < switches.length; i += 1) {
      const el = switches[i]
      el.setAttribute('data-theme', theme)
      el.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')
    }
  }
  function scheduleSync(
    theme: string,
    link: HTMLLinkElement | null,
    disableAfter?: HTMLLinkElement[],
  ) {
    syncSwitchers(theme)
    if (!link) {
      markSwitchersReady()
      return
    }
    if (link.sheet != null) {
      if (disableAfter) disableLinks(disableAfter)
      markSwitchersReady()
      return
    }
    link.addEventListener(
      'load',
      () => {
        syncSwitchers(theme)
        if (disableAfter) disableLinks(disableAfter)
        markSwitchersReady()
      },
      { once: true },
    )
  }

  let current = resolvePreferred()
  const applied = applyTheme(current, false)
  const active = applied.active
  root.setAttribute('data-theme', current)
  root.setAttribute('data-theme-mode', 'auto')
  waitForReady(active)

  function bindSwitchers() {
    const switches = document.querySelectorAll('.theme-switcher')
    for (let i = 0; i < switches.length; i += 1) {
      const el = switches[i]
      if (el.getAttribute('data-ts-ssg-theme-bound') === 'true') continue
      el.setAttribute('data-ts-ssg-theme-bound', 'true')
      el.addEventListener('click', () => {
        const idx = themes.indexOf(current)
        const next = themes[(idx + 1) % themes.length]
        globalThis.window.tsSsgTheme.set(next)
      })
    }
  }
  function initSwitchers() {
    bindSwitchers()
    scheduleSync(current, active)
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwitchers)
  } else {
    initSwitchers()
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
      const appliedNext = applyTheme(current, true)
      setStored(current)
      scheduleSync(current, appliedNext.active, appliedNext.others)
    },
  }
}

export {}
