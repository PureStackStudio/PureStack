import type { AnalyticsConfig, Ga4Config } from '@purestack/ts-common'
import type { DeepPartial } from '@purestack/ts-util'
import { resolveOptionalString, resolveString } from '@purestack/ts-util'

export function resolveAnalyticsConfig(
  input?: DeepPartial<AnalyticsConfig>,
  file?: DeepPartial<AnalyticsConfig>,
): AnalyticsConfig {
  const ga4 = resolveGa4Config(input?.ga4, file?.ga4)
  return { ga4 }
}

function resolveGa4Config(
  input?: DeepPartial<Ga4Config>,
  file?: DeepPartial<Ga4Config>,
): Ga4Config {
  const measurementId = resolveGa4MeasurementId(
    input?.measurementId,
    file?.measurementId,
  )
  const enabled = input?.enabled ?? file?.enabled ?? Boolean(measurementId)
  if (enabled && !measurementId) {
    throw new Error(
      'analytics.ga4.enabled is true but analytics.ga4.measurementId is missing.',
    )
  }
  return {
    enabled,
    measurementId,
    serviceId: resolveString(input?.serviceId, file?.serviceId, 'ga4'),
    consentCategory: resolveString(
      input?.consentCategory,
      file?.consentCategory,
      'analytics',
    ),
  }
}

function resolveGa4MeasurementId(...values: Array<string | undefined>) {
  for (const value of values) {
    const raw = resolveOptionalString(value)
    if (!raw) continue
    const normalized = raw.toUpperCase()
    if (!/^G-[A-Z0-9]+$/.test(normalized)) {
      throw new Error(
        `analytics.ga4.measurementId must look like "G-XXXXXXXX" but got "${raw}".`,
      )
    }
    return normalized
  }
  return undefined
}
