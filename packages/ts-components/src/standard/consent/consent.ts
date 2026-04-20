import type {
  ConsentCategory,
  ConsentConfig,
  TsSsgContext,
} from '@purestack/ts-common'
import { resolveTsSsgContext } from '@purestack/ts-common'
import { defineComponent, html } from 'regor'

export interface ConsentCategoryState extends ConsentCategory {
  inputId?: string
}

export interface Consent extends ConsentConfig {
  settingsTeleport?: string
  categories: ConsentCategoryState[]
}

const consentTemplate = html`<section class="consent" data-consent-root r-if="enabled">
  <aside
    class="consent__banner"
    data-consent-banner
    role="dialog"
    aria-live="polite"
    aria-modal="false"
    hidden
    aria-hidden="true"
  >
    <div class="consent__title">{{ bannerTitle }}</div>
    <p class="consent__description">{{ bannerDescription }}</p>
    <a class="consent__policy" r-if="privacyPolicyUrl" :href="privacyPolicyUrl">
      {{ privacyPolicyLabel }}
    </a>
    <div class="consent__actions">
      <Btn type="button" tone="success" data-consent-action="accept-all">
        {{ acceptAllLabel }}
      </Btn>
      <Btn tone="neutral" type="button" data-consent-action="reject-all">
        {{ rejectAllLabel }}
      </Btn>
      <Btn tone="neutral" type="button" data-consent-action="open-panel">
        {{ manageLabel }}
      </Btn>
    </div>
  </aside>

  <section
    class="consent__panel"
    data-consent-panel
    role="dialog"
    aria-modal="false"
    hidden
    aria-hidden="true"
  >
    <div class="consent__panel-header">
      <h2 class="consent__panel-title">{{ manageLabel }}</h2>
      <Btn
        tone="ghost"
        size="sm"
        type="button"
        data-consent-action="close-panel"
        aria-label="Close privacy settings"
      >
        <span aria-hidden="true">X</span>
      </Btn>
    </div>

    <div class="consent__list">
      <label r-for="category in categories" class="consent__item">
        <span class="consent__item-main">
          <input
            class="consent__checkbox"
            type="checkbox"
            :id="category.inputId"
            :checked="category.required"
            :disabled="category.required"
            :data-consent-category-id="category.id"/>
          <span class="consent__item-label">{{ category.label }}</span>
        </span>
        <span
          class="consent__item-description"
          r-if="category.description"
          :id="category.inputId + '-desc'"
        >
          {{ category.description }}
        </span>
      </label>
    </div>

    <div class="consent__panel-actions">
      <Btn type="button" tone="success" data-consent-action="save">
        {{ saveLabel }}
      </Btn>
      <Btn tone="success" type="button" data-consent-action="accept-all">
        {{ acceptAllLabel }}
      </Btn>
      <Btn tone="neutral" type="button" data-consent-action="reject-all">
        {{ rejectAllLabel }}
      </Btn>
    </div>
  </section>

  <Btn
    tone="ghost"
    size="sm"
    data-consent-settings
    type="button"
    data-consent-action="open-panel"
    :r-teleport="settingsTeleport"
    hidden
  >
    {{ settingsLabel }}
  </Btn>
</section>`

function defineConsentComponent() {
  return defineComponent<Consent>(consentTemplate, {
    context: (head) => resolveConsent(resolveTsSsgContext(head)),
  })
}

function resolveConsent(context: TsSsgContext): Consent {
  const consent = context.site.consent
  const categories = consent.categories.map((category) => ({
    id: category.id,
    label: category.label,
    description: category.description,
    required: category.required === true || category.id === 'necessary',
    inputId: `consent-category-${category.id}`,
  }))
  return {
    ...consent,
    settingsTeleport: context.pageInfo.frontmatter.layout.showFooter
      ? '.consent-settings-teleport-area'
      : 'body',
    categories,
  }
}

export function defineConsentComponents() {
  return { consent: defineConsentComponent() }
}
