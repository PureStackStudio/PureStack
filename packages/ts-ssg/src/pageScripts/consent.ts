import type {
  ConsentConfig,
  ConsentScript,
  ConsentService,
} from '@purestack/ts-common'

type ConsentState = {
  version: string
  categories: Record<string, boolean>
  updatedAt: number
}

declare global {
  interface Window {
    tsSsgConsent: {
      get: () => ConsentState
      openPreferences: () => void
      acceptAll: () => void
      rejectAll: () => void
      setCategories: (categoriesInput: Record<string, boolean>) => void
      reset: () => void
    }
  }
}

const INPUT_KEY = '__CONSENT_CONFIG__'
const config = (globalThis as Record<string, unknown>)[
  INPUT_KEY
] as ConsentConfig
delete (globalThis as Record<string, unknown>)[INPUT_KEY]

if (
  config &&
  Array.isArray(config.categories) &&
  Array.isArray(config.services)
) {
  const root = document.documentElement
  const storageKey = config.storageKey || 'ts-ssg-consent'
  const policyVersion = String(config.policyVersion || '1')
  const categories = config.categories
  const services = config.services
  const loadedServices: Record<string, boolean> = Object.create(null)
  const checkboxById: Record<string, HTMLInputElement> = Object.create(null)

  let uiRoot: HTMLElement | null = null
  let banner: HTMLElement | null = null
  let panel: HTMLElement | null = null
  let settingsButton: HTMLElement | null = null

  function ready(fn: () => void) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true })
      return
    }
    fn()
  }
  function clone<T>(value: T): T {
    return JSON.parse(JSON.stringify(value))
  }
  function safeParse(value: string): unknown {
    try {
      return JSON.parse(value)
    } catch {
      return null
    }
  }
  function readStored(): unknown {
    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return null
      return safeParse(raw)
    } catch {
      return null
    }
  }
  function writeStored(state: ConsentState) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state))
    } catch {}
  }
  function removeStored() {
    try {
      localStorage.removeItem(storageKey)
    } catch {}
  }
  function requiredCategorySet() {
    const required = new Set<string>()
    for (let i = 0; i < categories.length; i += 1) {
      if (categories[i] && categories[i].required === true) {
        required.add(categories[i].id)
      }
    }
    required.add('necessary')
    return required
  }
  const requiredIds = requiredCategorySet()
  function buildDefaultCategoryState() {
    const state: Record<string, boolean> = Object.create(null)
    for (let i = 0; i < categories.length; i += 1) {
      const id = categories[i]?.id
      if (!id) continue
      state[id] = requiredIds.has(id)
    }
    return state
  }
  function normalizeCategoryState(source: unknown) {
    const next = buildDefaultCategoryState()
    if (!source || typeof source !== 'object') return next
    const sourceRecord = source as Record<string, unknown>
    for (let i = 0; i < categories.length; i += 1) {
      const id = categories[i]?.id
      if (!id) continue
      if (requiredIds.has(id)) {
        next[id] = true
        continue
      }
      next[id] = sourceRecord[id] === true
    }
    return next
  }
  function normalizeStoredState(stored: unknown): ConsentState | null {
    if (!stored || typeof stored !== 'object') return null
    const storedRecord = stored as Record<string, unknown>
    if (String(storedRecord.version || '') !== policyVersion) return null
    return {
      version: policyVersion,
      categories: normalizeCategoryState(storedRecord.categories),
      updatedAt:
        typeof storedRecord.updatedAt === 'number'
          ? storedRecord.updatedAt
          : Date.now(),
    }
  }
  function isServiceAllowed(service: ConsentService, state: ConsentState) {
    if (!service || !service.category) return false
    return state.categories[service.category] === true
  }
  function applyConsentAttributes(state: ConsentState) {
    for (let i = 0; i < categories.length; i += 1) {
      const id = categories[i]?.id
      if (!id) continue
      root.setAttribute(
        `data-consent-${id}`,
        state.categories[id] === true ? 'granted' : 'denied',
      )
    }
    root.setAttribute('data-consent-ready', 'true')
  }
  function loadScript(script: ConsentScript, serviceId: string) {
    const node = document.createElement('script')
    if (script.src) node.src = script.src
    if (script.type) node.type = script.type
    if (script.async === true) node.async = true
    if (script.defer === true) node.defer = true
    if (script.integrity) node.integrity = script.integrity
    if (script.nonce) node.nonce = script.nonce
    if (script.crossOrigin) node.crossOrigin = script.crossOrigin
    if (script.referrerPolicy) node.referrerPolicy = script.referrerPolicy
    node.setAttribute('data-consent-service', serviceId)
    if (script.content) node.text = script.content
    ;(document.head || document.documentElement).appendChild(node)
  }
  function loadAllowedServices(state: ConsentState) {
    for (let i = 0; i < services.length; i += 1) {
      const service = services[i]
      if (!service || !service.id || loadedServices[service.id]) continue
      if (!isServiceAllowed(service, state)) continue
      const scripts = Array.isArray(service.scripts) ? service.scripts : []
      for (let j = 0; j < scripts.length; j += 1) {
        loadScript(scripts[j], service.id)
      }
      loadedServices[service.id] = true
    }
  }
  function updateCheckboxes(state: ConsentState) {
    for (let i = 0; i < categories.length; i += 1) {
      const id = categories[i]?.id
      if (!id) continue
      const checkbox = checkboxById[id]
      if (!checkbox) continue
      checkbox.checked = state.categories[id] === true
    }
  }
  function hideBanner() {
    if (!banner) return
    banner.hidden = true
    banner.setAttribute('aria-hidden', 'true')
  }
  function showBanner() {
    if (!banner) return
    banner.hidden = false
    banner.setAttribute('aria-hidden', 'false')
  }
  function closePanel() {
    if (!panel) return
    panel.hidden = true
    panel.setAttribute('aria-hidden', 'true')
    if (uiRoot) uiRoot.removeAttribute('data-consent-panel-open')
  }
  function openPanel() {
    if (!panel) return
    panel.hidden = false
    panel.setAttribute('aria-hidden', 'false')
    if (uiRoot) uiRoot.setAttribute('data-consent-panel-open', 'true')
    const closeButton = panel.querySelector(
      '[data-consent-action="close-panel"]',
    )
    if (closeButton instanceof HTMLElement) closeButton.focus()
  }
  function setSettingsVisible() {
    if (!settingsButton) return
    settingsButton.hidden = false
  }
  function allOptional(enabled: boolean) {
    const next = buildDefaultCategoryState()
    for (let i = 0; i < categories.length; i += 1) {
      const id = categories[i]?.id
      if (!id || requiredIds.has(id)) {
        next[id] = true
        continue
      }
      next[id] = enabled
    }
    return next
  }

  let currentState: ConsentState = {
    version: policyVersion,
    categories: buildDefaultCategoryState(),
    updatedAt: Date.now(),
  }

  function setState(next: Record<string, boolean>, persist: boolean) {
    currentState = {
      version: policyVersion,
      categories: normalizeCategoryState(next),
      updatedAt: Date.now(),
    }
    applyConsentAttributes(currentState)
    loadAllowedServices(currentState)
    updateCheckboxes(currentState)
    if (persist) {
      writeStored(currentState)
      hideBanner()
      closePanel()
      setSettingsVisible()
    }
  }
  function applyFromStored() {
    const stored = normalizeStoredState(readStored())
    if (!stored) {
      setState(buildDefaultCategoryState(), false)
      showBanner()
      setSettingsVisible()
      return
    }
    setState(stored.categories, false)
    hideBanner()
    closePanel()
    setSettingsVisible()
  }
  function collectChoicesFromPanel() {
    const next = buildDefaultCategoryState()
    for (let i = 0; i < categories.length; i += 1) {
      const id = categories[i]?.id
      if (!id) continue
      if (requiredIds.has(id)) {
        next[id] = true
        continue
      }
      const checkbox = checkboxById[id]
      next[id] = checkbox ? checkbox.checked === true : false
    }
    return next
  }
  function bindCheckboxes() {
    const boxes = document.querySelectorAll('[data-consent-category-id]')
    for (let i = 0; i < boxes.length; i += 1) {
      const box = boxes[i]
      if (!(box instanceof HTMLInputElement)) continue
      const id = box.getAttribute('data-consent-category-id') || ''
      if (!id) continue
      checkboxById[id] = box
    }
  }
  function bindActions() {
    const actions = document.querySelectorAll('[data-consent-action]')
    for (let i = 0; i < actions.length; i += 1) {
      const actionNode = actions[i]
      if (!(actionNode instanceof HTMLElement)) continue
      if (actionNode.getAttribute('data-consent-bound') === 'true') continue
      actionNode.setAttribute('data-consent-bound', 'true')
      actionNode.addEventListener('click', (event) => {
        event.preventDefault()
        const target = event.currentTarget as HTMLElement
        const action = target?.getAttribute('data-consent-action') || ''
        if (action === 'accept-all') {
          setState(allOptional(true), true)
          return
        }
        if (action === 'reject-all') {
          setState(allOptional(false), true)
          return
        }
        if (action === 'open-panel') {
          openPanel()
          return
        }
        if (action === 'close-panel') {
          closePanel()
          return
        }
        if (action === 'save') {
          setState(collectChoicesFromPanel(), true)
        }
      })
    }
  }
  function findUi() {
    uiRoot = document.querySelector('[data-consent-root]')
    if (!uiRoot) return false
    banner = uiRoot.querySelector('[data-consent-banner]')
    panel = uiRoot.querySelector('[data-consent-panel]')
    settingsButton = document.querySelector('[data-consent-settings]')
    return true
  }

  globalThis.window.tsSsgConsent = {
    get() {
      return clone(currentState)
    },
    openPreferences() {
      openPanel()
    },
    acceptAll() {
      setState(allOptional(true), true)
    },
    rejectAll() {
      setState(allOptional(false), true)
    },
    setCategories(categoriesInput: Record<string, boolean>) {
      setState(categoriesInput, true)
    },
    reset() {
      removeStored()
      setState(buildDefaultCategoryState(), false)
      showBanner()
      setSettingsVisible()
    },
  }

  ready(() => {
    if (!findUi()) return
    bindCheckboxes()
    bindActions()
    applyFromStored()
  })
}
