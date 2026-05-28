const SIGNED_IN_CLASS = 'signed-in'
const SIGNED_IN_VALUE = '1'

declare const signedInStorageKey: string

if (signedInStorageKey) {
  function syncAuthState() {
    document.documentElement.classList.toggle(
      SIGNED_IN_CLASS,
      getStoredState() === SIGNED_IN_VALUE,
    )
  }

  function getStoredState() {
    try {
      return localStorage.getItem(signedInStorageKey)
    } catch {
      return null
    }
  }

  syncAuthState()
  addEventListener('storage', (event) => {
    if (event.key === signedInStorageKey) syncAuthState()
  })
}

export {}
