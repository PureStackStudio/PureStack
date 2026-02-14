import type { ConsentConfig } from '../config/config'
import { buildEmbeddedConsentScript } from '../pageScripts/embed/consent.embed'

type RuntimeConsentConfig = Pick<
  ConsentConfig,
  | 'storageKey'
  | 'policyVersion'
  | 'bannerTitle'
  | 'bannerDescription'
  | 'privacyPolicyUrl'
  | 'privacyPolicyLabel'
  | 'acceptAllLabel'
  | 'rejectAllLabel'
  | 'manageLabel'
  | 'saveLabel'
  | 'settingsLabel'
  | 'categories'
  | 'services'
>

export function buildConsentScript(config: ConsentConfig) {
  const runtimeConfig: RuntimeConsentConfig = {
    storageKey: config.storageKey,
    policyVersion: config.policyVersion,
    bannerTitle: config.bannerTitle,
    bannerDescription: config.bannerDescription,
    privacyPolicyUrl: config.privacyPolicyUrl,
    privacyPolicyLabel: config.privacyPolicyLabel,
    acceptAllLabel: config.acceptAllLabel,
    rejectAllLabel: config.rejectAllLabel,
    manageLabel: config.manageLabel,
    saveLabel: config.saveLabel,
    settingsLabel: config.settingsLabel,
    categories: config.categories,
    services: config.services,
  }
  const serialized = JSON.stringify(runtimeConfig)
  const payload = `globalThis.__CONSENT_CONFIG__ =${serialized};`
  return `(function(){${payload}})();${buildEmbeddedConsentScript()}`
}
