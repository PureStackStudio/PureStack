import type { ConsentConfig } from '@purestack/ts-common'
import { buildEmbeddedConsentScript } from './embed/consent.embed'

export function buildConsentScript(config: ConsentConfig) {
  const serialized = JSON.stringify(config)
  const payload = `globalThis.__CONSENT_CONFIG__ =${serialized};`
  return `(function(){${payload}})();${buildEmbeddedConsentScript()}`
}
