import type {
  PageTemplateInput,
  SiteConfigResolution,
} from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { merge } from '@purestack/ts-util'
import { buildConsentScript } from './buildConsentScript'
import { resolveConsentConfig } from './consentConfig'

export function consentPlugin() {
  return {
    name: 'purestack:consent',
    config: {
      resolve({ config, input, file }: SiteConfigResolution) {
        return {
          consent: merge(
            resolveConsentConfig(input.consent, file.consent),
            config.consent,
          ),
        }
      },
      normalize({ config }: SiteConfigResolution) {
        return { consent: resolveConsentConfig(config.consent) }
      },
    },
    head({ head, site }: PageTemplateInput) {
      if (site.consent?.enabled)
        head.push(h('script').raw(buildConsentScript(site.consent)))
      return head
    },
  }
}
