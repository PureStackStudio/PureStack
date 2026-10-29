import type { SemanticTone } from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue } from 'regor'
import type {
  ComponentVariant,
  ComponentVariantMode,
} from '../componentVariant'

export interface AlertBox {
  title?: RefOrValue<string>
  eyebrow?: RefOrValue<string>
  badge?: RefOrValue<string>
  meta?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  icon?: RefOrValue<string>
}

const alertBoxTemplate = html`<Panel
  class="alert-box min-w-0"
  bodyClass="flex align-flex-start gap-3 min-w-0"
  :tone="tone || 'info'"
  :variant="variant || 'surface'"
  :variantMode="variantMode || 'stateless'"
>
  <IconFrame
    r-if="icon"
    class="flex-none self-start p-2"
    :name="icon"
    :tone="tone || 'info'"
    variant="solid"
    aria-hidden="true"/>
  <Flex direction="column" class="flex-1 min-w-0 gap-3">
    <Flex r-if="title || eyebrow || badge" direction="column" class="gap-1">
      <p
        r-if="eyebrow"
        class="fs-xs fw-700 uppercase tracking-wide lh-4 m-0 wrap-anywhere"
      >
        {{ eyebrow }}
      </p>
      <Flex r-if="title || badge" align="start" wrap="true" class="gap-2">
        <strong r-if="title" class="flex-1 fs-h6 fw-600 lh-3 wrap-anywhere">
          {{ title }}
        </strong>
        <Badge class="flex-none fs-xs" :tone="tone || 'info'" r-if="badge"
          >{{ badge }}</Badge>
      </Flex>
    </Flex>
    <div class="fs-body lh-6 wrap-anywhere hidden-empty"><slot></slot></div>
    <span class="flex flex-wrap align-center gap-2 wrap-anywhere hidden-empty"
      ><slot name="actions"></slot></span>
    <p r-if="meta" class="fs-sm lh-5 m-0 wrap-anywhere">
      {{ meta }}
    </p>
  </Flex>
</Panel>`

function defineAlertBoxComponent() {
  return defineComponent<AlertBox>(alertBoxTemplate, {
    props: [
      'title',
      'eyebrow',
      'badge',
      'meta',
      'tone',
      'variant',
      'variantMode',
      'icon',
    ],
  })
}

export function defineAlertComponents() {
  return {
    alertBox: defineAlertBoxComponent(),
  }
}
