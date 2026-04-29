import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
} from 'regor'
import {
  type ComponentVariant,
  type ComponentVariantMode,
  resolveComponentClasses,
} from '../componentVariant'

export interface Panel {
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  classes?: ComputedRef<string>
}

const DEFAULT_PANEL_VARIANT: ComponentVariant = 'surface'
const DEFAULT_PANEL_VARIANT_MODE: ComponentVariantMode = 'stateless'

const panelTemplate = html`<section class="panel tone-text" :class="classes">
  <div class="panel__body"><slot></slot></div>
</section>`

function definePanelComponent() {
  return defineComponent<Panel>(panelTemplate, {
    props: ['tone', 'variant', 'variantMode'],
    context: (head) => resolvePanel(head.props),
  })
}

export function definePanelComponents() {
  return {
    panel: definePanelComponent(),
  }
}

function resolvePanel(props: Panel): Panel {
  return {
    ...props,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: DEFAULT_PANEL_VARIANT,
        defaultVariantMode: DEFAULT_PANEL_VARIANT_MODE,
      }),
    ),
  }
}
