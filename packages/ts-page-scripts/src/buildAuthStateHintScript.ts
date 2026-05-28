import { buildEmbeddedAuthStateHintScript } from './embed/authStateHint.embed'

export function buildAuthStateHintScript(storageKey: string) {
  const key = storageKey.trim()
  if (!key) return ''
  const payload = `"use strict";var signedInStorageKey=${JSON.stringify(key)};`
  return `(function(){${payload}${buildEmbeddedAuthStateHintScript()}})();`
}
