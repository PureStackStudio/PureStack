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
  :tone="tone || 'info'"
  :variant="variant || 'surface'"
  :variantMode="variantMode || 'stateless'"
>
  <Flex align="start">
    <IconFrame
      r-if="icon"
      :name="icon"
      :tone="tone || 'info'"
      :variant="variant"/>
    <Flex direction="column" align="start">
      <Flex r-if="title || eyebrow || badge" align="center" wrap="true">
        <span r-if="eyebrow">{{ eyebrow }}</span>
        <strong r-if="title">{{ title }}</strong>
        <Badge :tone="tone || 'info'" r-if="badge">{{ badge }}</Badge>
      </Flex>
      <div><slot></slot></div>
      <Flex align="center" wrap="true">
        <slot name="actions"></slot>
      </Flex>
      <small r-if="meta">{{ meta }}</small>
    </Flex>
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
