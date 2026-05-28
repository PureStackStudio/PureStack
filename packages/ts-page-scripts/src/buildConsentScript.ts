import type { ConsentConfig } from '@purestack/ts-common'
import { buildEmbeddedConsentScript } from './embed/consent.embed'

export function buildConsentScript(config: ConsentConfig) {
  const serialized = JSON.stringify(config)
  const payload = `"use strict";var consentConfig=${serialized};`
  return `(function(){${payload}${buildEmbeddedConsentScript()}})();`
}
