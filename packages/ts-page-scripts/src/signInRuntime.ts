const SIGN_IN_SELECTOR = '.sign-in'

function ready(run: () => void) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
    return
  }
  run()
}

function initSignInRuntime() {
  document.addEventListener('click', closeOpenSignInsOutsideTarget)
  document.addEventListener('keydown', closeOpenSignInsOnEscape)
}

function closeOpenSignInsOutsideTarget(event: MouseEvent) {
  const target = event.target
  if (!(target instanceof Node)) return

  const targetElement =
    target instanceof Element
      ? target
      : target.parentElement instanceof Element
        ? target.parentElement
        : null
  const activeSignIn =
    targetElement?.closest<HTMLDetailsElement>(SIGN_IN_SELECTOR) ?? null

  for (const signIn of getOpenSignIns()) {
    if (signIn === activeSignIn) continue
    signIn.removeAttribute('open')
  }
}

function closeOpenSignInsOnEscape(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  for (const signIn of getOpenSignIns()) {
    signIn.removeAttribute('open')
  }
}

function getOpenSignIns() {
  return Array.from(
    document.querySelectorAll<HTMLDetailsElement>(`${SIGN_IN_SELECTOR}[open]`),
  )
}

ready(initSignInRuntime)

export {}
