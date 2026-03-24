const INPUT_KEY = '__PURESTACK_THEME_SWITCH_THEMES__'

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

const raw = (globalThis as Record<string, unknown>)[INPUT_KEY]
delete (globalThis as Record<string, unknown>)[INPUT_KEY]
const themes = Array.isArray(raw)
  ? raw.filter((x): x is string => typeof x === 'string')
  : []

if (themes.length > 0) {
  const storageKey = 'ts-ssg-theme'
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
  function updateThumb(el: Element, theme: string, animate: boolean) {
    const thumb = el.querySelector<HTMLElement>('.theme-switcher__thumb')
    if (!thumb) return
    const inset = 10
    const size = 36
    let max = (el as HTMLElement).clientWidth - inset * 2 - size
    if (max < 0) max = 0
    const translate = theme === 'dark' ? max : 0
    thumb.style.transition =
      animate === false
        ? 'none'
        : 'transform 260ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease, box-shadow 200ms ease'
    thumb.style.transform = `translateY(-50%) translateX(${translate}px)`
    if (animate === false) {
      globalThis.requestAnimationFrame(() => {
        thumb.style.transition =
          'transform 260ms cubic-bezier(0.4, 0, 0.2, 1), background 200ms ease, box-shadow 200ms ease'
      })
    }
  }
  function syncSwitchers(theme: string, animate: boolean) {
    const switches = document.querySelectorAll('.theme-switcher')
    for (let i = 0; i < switches.length; i += 1) {
      const el = switches[i]
      el.setAttribute('data-theme', theme)
      el.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false')
      updateThumb(el, theme, animate)
    }
    globalThis.requestAnimationFrame(() => {
      const after = document.querySelectorAll('.theme-switcher')
      for (let i = 0; i < after.length; i += 1) {
        updateThumb(after[i], theme, animate)
      }
    })
  }
  function scheduleSync(
    theme: string,
    link: HTMLLinkElement | null,
    animate: boolean,
    disableAfter?: HTMLLinkElement[],
  ) {
    syncSwitchers(theme, animate)
    if (disableAfter && link && link.sheet != null) disableLinks(disableAfter)
    if (link && link.sheet == null) {
      link.addEventListener(
        'load',
        () => {
          syncSwitchers(theme, animate)
          if (disableAfter) disableLinks(disableAfter)
        },
        { once: true },
      )
    }
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
    scheduleSync(current, active, false)
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
      scheduleSync(current, appliedNext.active, true, appliedNext.others)
    },
  }
}

export {}
