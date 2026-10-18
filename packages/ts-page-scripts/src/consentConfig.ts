import type {
  ConsentCategory,
  ConsentConfig,
  ConsentScript,
  ConsentService,
} from '@purestack/ts-common'
import type { DeepPartial } from '@purestack/ts-util'
import {
  isPlainObject,
  resolveConfigUrl,
  resolveOptionalString,
  resolveString,
} from '@purestack/ts-util'

const DEFAULT_CONSENT_CATEGORIES: ConsentCategory[] = [
  {
    id: 'necessary',
    label: 'Necessary',
    description: 'Required for core site functionality.',
    required: true,
  },
  {
    id: 'preferences',
    label: 'Preferences',
    description: 'Stores optional settings like personalized UX behavior.',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    description: 'Helps improve the site by measuring usage.',
  },
  {
    id: 'marketing',
    label: 'Marketing',
    description: 'Used for advertising and campaign attribution.',
  },
]

export function resolveConsentConfig(
  input?: DeepPartial<ConsentConfig>,
  file?: DeepPartial<ConsentConfig>,
): ConsentConfig {
  const enabled = input?.enabled ?? file?.enabled ?? false
  const categories = resolveConsentCategories(
    input?.categories,
    file?.categories,
  )
  const services = resolveConsentServices(
    input?.services,
    file?.services,
    categories,
  )
  return {
    enabled,
    storageKey: resolveString(
      input?.storageKey,
      file?.storageKey,
      'ts-ssg-consent',
    ),
    policyVersion: resolveString(
      input?.policyVersion,
      file?.policyVersion,
      '1',
    ),
    bannerTitle: resolveString(
      input?.bannerTitle,
      file?.bannerTitle,
      'Your privacy choices',
    ),
    bannerDescription: resolveString(
      input?.bannerDescription,
      file?.bannerDescription,
      'We use cookies and similar technologies to improve your experience. You can accept all, reject non-essential, or manage preferences.',
    ),
    privacyPolicyUrl: resolveConfigUrl(
      resolveOptionalString(input?.privacyPolicyUrl ?? file?.privacyPolicyUrl),
    ),
    privacyPolicyLabel: resolveString(
      input?.privacyPolicyLabel,
      file?.privacyPolicyLabel,
      'Privacy Policy',
    ),
    acceptAllLabel: resolveString(
      input?.acceptAllLabel,
      file?.acceptAllLabel,
      'Accept all',
    ),
    rejectAllLabel: resolveString(
      input?.rejectAllLabel,
      file?.rejectAllLabel,
      'Reject non-essential',
    ),
    manageLabel: resolveString(
      input?.manageLabel,
      file?.manageLabel,
      'Manage preferences',
    ),
    saveLabel: resolveString(input?.saveLabel, file?.saveLabel, 'Save choices'),
    settingsLabel: resolveString(
      input?.settingsLabel,
      file?.settingsLabel,
      'Privacy settings',
    ),
    categories,
    services,
  }
}

function resolveConsentCategories(
  input: Array<DeepPartial<ConsentCategory>> | undefined,
  file: Array<DeepPartial<ConsentCategory>> | undefined,
) {
  const source = Array.isArray(input)
    ? input
    : Array.isArray(file)
      ? file
      : DEFAULT_CONSENT_CATEGORIES
  const categories: ConsentCategory[] = []
  const seen = new Set<string>()
  for (const entry of source) {
    if (!isPlainObject(entry)) continue
    const id = resolveOptionalString(entry.id)
    if (!id) continue
    if (seen.has(id)) {
      throw new Error(`Duplicate consent category id "${id}".`)
    }
    const required = entry.required === true || id === 'necessary'
    const label = resolveString(entry.label, toTitleCase(id))
    categories.push({
      id,
      label,
      description: resolveOptionalString(entry.description),
      required,
    })
    seen.add(id)
  }
  if (!seen.has('necessary')) {
    categories.unshift({
      id: 'necessary',
      label: 'Necessary',
      description: 'Required for core site functionality.',
      required: true,
    })
  }
  return categories
}

function resolveConsentServices(
  input: Array<DeepPartial<ConsentService>> | undefined,
  file: Array<DeepPartial<ConsentService>> | undefined,
  categories: ConsentCategory[],
) {
  const source = Array.isArray(input) ? input : Array.isArray(file) ? file : []
  const categoryIds = new Set(categories.map((entry) => entry.id))
  const services: ConsentService[] = []
  const seenServiceIds = new Set<string>()
  for (const entry of source) {
    if (!isPlainObject(entry)) continue
    const id = resolveOptionalString(entry.id)
    if (!id) continue
    if (seenServiceIds.has(id)) {
      throw new Error(`Duplicate consent service id "${id}".`)
    }
    const category = resolveOptionalString(entry.category)
    if (!category || !categoryIds.has(category)) {
      throw new Error(
        `Consent service "${id}" references unknown category "${entry.category ?? ''}".`,
      )
    }
    const scripts = resolveConsentServiceScripts(entry.scripts, id)
    services.push({
      id,
      category,
      ga4MeasurementId: resolveOptionalString(entry.ga4MeasurementId),
      label: resolveOptionalString(entry.label),
      description: resolveOptionalString(entry.description),
      scripts,
    })
    seenServiceIds.add(id)
  }
  return services
}

function resolveConsentServiceScripts(
  scripts: Array<DeepPartial<ConsentScript>> | undefined,
  serviceId: string,
) {
  if (!Array.isArray(scripts) || scripts.length === 0) {
    throw new Error(
      `Consent service "${serviceId}" must define at least one script.`,
    )
  }
  const resolved: ConsentScript[] = []
  for (const entry of scripts) {
    if (!isPlainObject(entry)) continue
    const src = resolveConfigUrl(resolveOptionalString(entry.src))
    const content = resolveOptionalString(entry.content)
    if (!src && !content) {
      throw new Error(
        `Consent service "${serviceId}" has a script without "src" or "content".`,
      )
    }
    resolved.push({
      src,
      content,
      type: resolveOptionalString(entry.type),
      async: entry.async === true,
      defer: entry.defer === true,
      integrity: resolveOptionalString(entry.integrity),
      nonce: resolveOptionalString(entry.nonce),
      crossOrigin: resolveCrossOrigin(entry.crossOrigin),
      referrerPolicy: resolveOptionalString(entry.referrerPolicy),
    })
  }
  if (resolved.length === 0) {
    throw new Error(`Consent service "${serviceId}" has no valid scripts.`)
  }
  return resolved
}

function resolveCrossOrigin(
  value: unknown,
): 'anonymous' | 'use-credentials' | undefined {
  if (value === 'anonymous' || value === 'use-credentials') return value
  return undefined
}

function toTitleCase(value: string) {
  const normalized = value.replaceAll(/[-_]+/g, ' ').trim()
  if (normalized.length === 0) return 'Consent'
  return normalized.replaceAll(/\b\w/g, (char) => char.toUpperCase())
}
