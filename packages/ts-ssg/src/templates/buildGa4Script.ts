import type { Ga4Config } from '@purestack/ts-common'

export type Ga4ScriptPayload = {
  src: string
  init: string
}

export function buildGa4Script(config: Ga4Config): Ga4ScriptPayload {
  if (!config.measurementId) {
    throw new Error('analytics.ga4.measurementId is required.')
  }
  const measurementId = JSON.stringify(config.measurementId)
  return {
    src: `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(config.measurementId)}`,
    init: [
      'window.dataLayer = window.dataLayer || [];',
      'function gtag(){dataLayer.push(arguments);}',
      "gtag('js', new Date());",
      `gtag('config', ${measurementId});`,
    ].join(' '),
  }
}
