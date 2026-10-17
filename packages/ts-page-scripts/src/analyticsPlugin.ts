import type {
  ConsentCategory,
  ConsentService,
  Ga4Config,
  PageTemplateInput,
  SiteConfig,
} from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { buildGa4Script } from './buildGa4Script'

/** Owns direct GA4 scripts and its optional consent-managed service. */
export function analyticsPlugin() {
  return {
    name: 'purestack:analytics',
    hooks: {
      onConfigResolved({ config }: { config: SiteConfig }) {
        if (config.consent.enabled)
          config.consent.services = appendGa4ConsentService(
            config.consent.services,
            config.consent.categories,
            config.analytics.ga4,
          )
      },
    },
    head({ head, site }: PageTemplateInput) {
      const ga4 = site.analytics.ga4
      if (ga4.enabled && ga4.measurementId && !site.consent.enabled) {
        const payload = buildGa4Script(ga4)
        head.push(
          h('script').attr({ async: 'true', src: payload.src }),
          h('script').raw(payload.init),
        )
      }
      return head
    },
  }
}

function appendGa4ConsentService(
  services: ConsentService[],
  categories: ConsentCategory[],
  ga4?: Ga4Config,
) {
  if (!ga4?.enabled || !ga4.measurementId) return services
  const hasService = services.some((entry) => entry.id === ga4.serviceId)
  if (hasService) return services
  const hasCategory = categories.some(
    (entry) => entry.id === ga4.consentCategory,
  )
  if (!hasCategory) {
    throw new Error(
      `analytics.ga4.consentCategory "${ga4.consentCategory}" does not exist in consent.categories.`,
    )
  }
  return [
    ...services,
    {
      id: ga4.serviceId,
      category: ga4.consentCategory,
      label: 'Google Analytics 4',
      ga4MeasurementId: ga4.measurementId,
      scripts: buildGa4ConsentScripts(ga4),
    },
  ]
}

function buildGa4ConsentScripts(config: Ga4Config) {
  const payload = buildGa4Script(config)
  return [{ src: payload.src, async: true }, { content: payload.init }]
}
