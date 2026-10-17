import type {
  PageTemplateInput,
  SiteConfigResolution,
} from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { merge } from '@purestack/ts-util'
import { resolveAuthConfig } from './authConfig'
import { buildAuthStateHintScript } from './buildAuthStateHintScript'

export function authStateHintPlugin() {
  return {
    name: 'purestack:auth-state-hint',
    config: {
      resolve({ config, input, file }: SiteConfigResolution) {
        return {
          auth: merge(resolveAuthConfig(input.auth, file.auth), config.auth),
        }
      },
      normalize({ config }: SiteConfigResolution) {
        return { auth: resolveAuthConfig(config.auth) }
      },
    },
    head({ head, site }: PageTemplateInput) {
      if (site.auth?.enabled && site.auth.signedInStorageKey) {
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
