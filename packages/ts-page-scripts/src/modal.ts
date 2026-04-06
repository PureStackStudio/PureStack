const OPENING_STATE = 'opening'
const OPEN_STATE = 'open'
const CLOSING_STATE = 'closing'
const MODAL_CLOSE_DELAY_MS = 700

type ModalRuntimeState = {
  trigger: HTMLElement | null
  restoreFocus: HTMLElement | null
  closeTimer: number | null
  isClosing: boolean
  openFrameOne: number | null
  openFrameTwo: number | null
}

const modalStateMap = new WeakMap<HTMLDialogElement, ModalRuntimeState>()

function ready(run: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
    return
  }
  run()
}

function initModalRuntime() {
  refreshModalRuntime()
}

function refreshModalRuntime(target?: string) {
  bindTriggers(target)
  bindModalContainers(target)
}

function bindTriggers(target?: string) {
  const triggers = queryScoped<HTMLElement>(target, '[data-modal-trigger]')
  triggers.forEach((trigger) => {
    bindTrigger(trigger)
  })
}

function bindTrigger(trigger: HTMLElement) {
  if (trigger.getAttribute('data-modal-bound') === 'true') return
  trigger.setAttribute('data-modal-bound', 'true')
  trigger.addEventListener('click', (event) => {
    event.preventDefault()
    const targetId = trigger.getAttribute('data-modal-target')?.trim()
    if (!targetId) return
    openModalById(targetId, trigger)
  })
}

function bindModalContainers(target?: string) {
  const dialogs = queryScoped<HTMLDialogElement>(target, '[data-modal-root]')
  dialogs.forEach((dialog) => {
    bindModalContainer(dialog)
  })
}

function bindModalContainer(dialog: HTMLDialogElement) {
  if (dialog.getAttribute('data-modal-runtime') === 'true') return
  dialog.setAttribute('data-modal-runtime', 'true')

  dialog.addEventListener('cancel', (event) => {
    event.preventDefault()
    closeModal(dialog)
  })

  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return
    closeModal(dialog)
  })

  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return
    trapFocus(event, dialog)
  })

  const closeButtons =
    dialog.querySelectorAll<HTMLElement>('[data-modal-close]')
  closeButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
      event.preventDefault()
      closeModal(dialog)
    })
  })
}

function openModalById(id: string, trigger: HTMLElement | null) {
  const dialog = document.getElementById(id)
  if (!(dialog instanceof HTMLDialogElement)) return
  bindModalContainer(dialog)
  openModal(dialog, trigger)
}

function closeModalById(id: string) {
  const dialog = document.getElementById(id)
  if (!(dialog instanceof HTMLDialogElement)) return
  bindModalContainer(dialog)
  closeModal(dialog)
}

function openModal(dialog: HTMLDialogElement, trigger: HTMLElement | null) {
  const previousActive =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
  const state = getModalState(dialog)
  state.trigger = trigger
  state.restoreFocus = previousActive

  clearCloseTimer(dialog)
  clearOpenFrames(dialog)
  state.isClosing = false

  if (!dialog.open) {
    if (typeof dialog.showModal === 'function') {
      dialog.showModal()
    } else {
      dialog.setAttribute('open', '')
    }
  }

  const panel = dialog.querySelector<HTMLElement>('.modal__panel')
  suppressPanelTransition(panel)
  dialog.setAttribute('data-modal-state', OPENING_STATE)
  forceModalAnimationStart(dialog)
  state.openFrameOne = window.requestAnimationFrame(() => {
    state.openFrameOne = null
    restorePanelTransition(panel)
    forceModalAnimationStart(dialog)
    state.openFrameTwo = window.requestAnimationFrame(() => {
      state.openFrameTwo = null
      if (!dialog.open || state.isClosing) return
      dialog.setAttribute('data-modal-state', OPEN_STATE)
    })
  })

  focusFirstFocusable(dialog)
}

function closeModal(dialog: HTMLDialogElement) {
  if (!dialog.open) return
  const state = getModalState(dialog)
  if (state.isClosing) return
  state.isClosing = true
  clearOpenFrames(dialog)

  dialog.setAttribute('data-modal-state', CLOSING_STATE)
  state.closeTimer = window.setTimeout(() => {
    finalizeClose(dialog)
  }, MODAL_CLOSE_DELAY_MS)
}

function finalizeClose(dialog: HTMLDialogElement) {
  const state = getModalState(dialog)
  clearCloseTimer(dialog)
  state.isClosing = false

  dialog.removeAttribute('data-modal-state')
  if (typeof dialog.close === 'function') {
    dialog.close()
  } else {
    dialog.removeAttribute('open')
  }

  const restoreTarget = state.trigger || state.restoreFocus
  if (restoreTarget && typeof restoreTarget.focus === 'function') {
    restoreTarget.focus({ preventScroll: true })
  }
}

function clearCloseTimer(dialog: HTMLDialogElement) {
  const state = getModalState(dialog)
  if (state.closeTimer !== null) {
    window.clearTimeout(state.closeTimer)
    state.closeTimer = null
  }
}

function clearOpenFrames(dialog: HTMLDialogElement) {
  const state = getModalState(dialog)
  if (state.openFrameOne !== null) {
    window.cancelAnimationFrame(state.openFrameOne)
    state.openFrameOne = null
  }
  if (state.openFrameTwo !== null) {
    window.cancelAnimationFrame(state.openFrameTwo)
    state.openFrameTwo = null
  }
}

function forceModalAnimationStart(dialog: HTMLDialogElement) {
  const panel = dialog.querySelector<HTMLElement>('.modal__panel')
  if (!panel) return
  panel.getBoundingClientRect()
}

function suppressPanelTransition(panel: HTMLElement | null) {
  if (!panel) return
  panel.style.transition = 'none'
}

function restorePanelTransition(panel: HTMLElement | null) {
  if (!panel) return
  panel.style.transition = ''
}

function getModalState(dialog: HTMLDialogElement): ModalRuntimeState {
  const existing = modalStateMap.get(dialog)
  if (existing) return existing
  const created: ModalRuntimeState = {
    trigger: null,
    restoreFocus: null,
    closeTimer: null,
    isClosing: false,
    openFrameOne: null,
    openFrameTwo: null,
  }
  modalStateMap.set(dialog, created)
  return created
}

function focusFirstFocusable(dialog: HTMLDialogElement) {
  const candidates = getFocusable(dialog)
  const target =
    candidates[0] ?? dialog.querySelector<HTMLElement>('.modal__panel')
  if (!target) return
  if (typeof target.focus === 'function') {
    target.focus({ preventScroll: true })
  }
}

function trapFocus(event: KeyboardEvent, dialog: HTMLDialogElement) {
  const focusable = getFocusable(dialog)
  if (focusable.length === 0) {
    event.preventDefault()
    return
  }

  const active =
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  if (event.shiftKey) {
    if (active === first || !active || !dialog.contains(active)) {
      event.preventDefault()
      last.focus()
    }
    return
  }

  if (active === last) {
    event.preventDefault()
    first.focus()
  }
}

function getFocusable(root: ParentNode) {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  return Array.from(root.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => {
      if (el.hasAttribute('hidden')) return false
      const ariaHidden = el.getAttribute('aria-hidden')
      if (ariaHidden === 'true') return false
      if (el.getAttribute('disabled') !== null) return false
      return true
    },
  )
}

function queryScoped<T extends Element>(
  target: string | undefined,
  selector: string,
) {
  if (!target) {
    return Array.from(document.querySelectorAll<T>(selector))
  }

  const roots = Array.from(document.querySelectorAll<HTMLElement>(target))
  if (roots.length === 0) return []

  const matches: T[] = []
  const seen = new Set<Element>()

  for (const root of roots) {
    if (root.matches(selector) && !seen.has(root)) {
      matches.push(root as unknown as T)
      seen.add(root)
    }

    for (const match of root.querySelectorAll<T>(selector)) {
      if (seen.has(match)) continue
      matches.push(match)
      seen.add(match)
    }
  }

  return matches
}

ready(initModalRuntime)

globalThis.window.tsSsgModal = {
  refresh(target?: string) {
    refreshModalRuntime(target)
  },
  open(id: string, trigger?: HTMLElement | null) {
    openModalById(id, trigger ?? null)
  },
  close(id: string) {
    closeModalById(id)
  },
}

export {}
