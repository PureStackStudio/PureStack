import type { PageTemplateInput } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { buildConsentScript } from './buildConsentScript'

export function consentPlugin() {
  return {
    name: 'purestack:consent',
    head({ head, site }: PageTemplateInput) {
      if (site.consent.enabled)
        head.push(h('script').raw(buildConsentScript(site.consent)))
      return head
    },
  }
}
