import type { PageTemplateInput } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { buildAuthStateHintScript } from './buildAuthStateHintScript'

export function authStateHintPlugin() {
  return {
    name: 'purestack:auth-state-hint',
    head({ head, site }: PageTemplateInput) {
      if (site.auth.enabled && site.auth.signedInStorageKey) {
        const hint = buildAuthStateHintScript(site.auth.signedInStorageKey)
        if (hint) {
          const script = h('script').raw(hint)
          if (
            !head.insertBefore('link', script, { rel: 'stylesheet' }) &&
            !head.insertBefore('script', script)
          )
            head.push(script)
        }
      }
      return head
    },
  }
}
