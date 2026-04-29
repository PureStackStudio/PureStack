import type {
  ConsentCategory,
  ConsentConfig,
  TsSsgContext,
} from '@purestack/ts-common'
import { resolveTsSsgContext } from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue } from 'regor'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'

export interface ConsentCategoryState extends ConsentCategory {
  inputId?: string
}

export interface Consent extends ConsentConfig {
  settingsTeleport?: string
  categories: ConsentCategoryState[]
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
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
    <Panel
      :tone="tone || 'neutral'"
      :variant="variant || 'surfaceAlt'"
      :variantMode="variantMode"
    >
      <Flex direction="column" align="start">
        <strong>{{ bannerTitle }}</strong>
        <span>{{ bannerDescription }}</span>
        <BtnLink
          r-if="privacyPolicyUrl"
          :href="privacyPolicyUrl"
          tone="neutral"
          variant="link"
        >
          {{ privacyPolicyLabel }}
        </BtnLink>
        <Flex align="center" wrap="true">
          <Btn type="button" tone="success" data-consent-action="accept-all">
            {{ acceptAllLabel }}
          </Btn>
          <Btn tone="neutral" type="button" data-consent-action="reject-all">
            {{ rejectAllLabel }}
          </Btn>
          <Btn tone="neutral" type="button" data-consent-action="open-panel">
            {{ manageLabel }}
          </Btn>
        </Flex>
      </Flex>
    </Panel>
  </aside>

  <section
    class="consent__panel"
    data-consent-panel
    role="dialog"
    aria-modal="false"
    hidden
    aria-hidden="true"
  >
    <Panel
      :tone="tone || 'neutral'"
      :variant="variant || 'surfaceAlt'"
      :variantMode="variantMode"
    >
      <Flex direction="column" align="start">
        <Flex align="center" justify="between" class="w-full">
          <strong>{{ manageLabel }}</strong>
          <Btn
            tone="ghost"
            size="sm"
            type="button"
            data-consent-action="close-panel"
            aria-label="Close privacy settings"
          >
            <span aria-hidden="true">X</span>
          </Btn>
        </Flex>

        <Flex direction="column" align="stretch" class="w-full">
          <Panel
            r-for="category in categories"
            tone="neutral"
            variant="outline"
          >
            <Flex direction="column" align="start">
              <FormCheck
                :id="category.inputId"
                :label="category.label"
                :checked="category.required"
                :disabled="category.required"
                :described-by="category.description ? category.inputId + '-desc' : undefined"
                :data-consent-category-id="category.id"/>
              <small
                r-if="category.description"
                :id="category.inputId + '-desc'"
              >
                {{ category.description }}
              </small>
            </Flex>
          </Panel>
        </Flex>

        <Flex align="center" wrap="true">
          <Btn type="button" tone="success" data-consent-action="save">
            {{ saveLabel }}
          </Btn>
          <Btn tone="success" type="button" data-consent-action="accept-all">
            {{ acceptAllLabel }}
          </Btn>
          <Btn tone="neutral" type="button" data-consent-action="reject-all">
            {{ rejectAllLabel }}
          </Btn>
        </Flex>
      </Flex>
    </Panel>
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
    props: ['tone', 'variant', 'variantMode'],
    context: (head) => resolveConsent(resolveTsSsgContext(head), head.props),
  })
}

function resolveConsent(
  context: TsSsgContext,
  props: Partial<Consent>,
): Consent {
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
    tone: props.tone,
    variant: props.variant,
    variantMode: props.variantMode,
    settingsTeleport: context.pageInfo.frontmatter.layout.showFooter
      ? '.consent-settings-teleport-area'
      : 'body',
    categories,
  }
}

export function defineConsentComponents() {
  return { consent: defineConsentComponent() }
}
