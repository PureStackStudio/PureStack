export interface ConsentCategory {
  id: string
  label: string
  description?: string
  required?: boolean
}

export interface ConsentScript {
  src?: string
  content?: string
  type?: string
  async?: boolean
  defer?: boolean
  integrity?: string
  nonce?: string
  crossOrigin?: 'anonymous' | 'use-credentials'
  referrerPolicy?: string
}

export interface ConsentService {
  /** Set by the built-in GA4 integration to stop collection on consent withdrawal. */
  ga4MeasurementId?: string
  id: string
  category: string
  label?: string
  description?: string
  scripts: ConsentScript[]
}

export interface ConsentConfig {
  enabled: boolean
  storageKey: string
  policyVersion: string
  bannerTitle: string
  bannerDescription: string
  privacyPolicyUrl?: string
  privacyPolicyLabel: string
  acceptAllLabel: string
  rejectAllLabel: string
  manageLabel: string
  saveLabel: string
  settingsLabel: string
  categories: ConsentCategory[]
  services: ConsentService[]
}
