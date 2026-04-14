import {
  getSemanticToneSurfaceClass,
  resolveSemanticTone,
  type SemanticTone,
} from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export interface Panel {
  tone?: RefOrValue<SemanticTone>
  rootClass?: ComputedRef<string>
}

const panelTemplate = html`
<section class="panel" :class="rootClass">
  <div class="panel__body"><slot></slot></div>
</section>
`

function definePanelComponent() {
  return defineComponent<Panel>(panelTemplate, {
    props: ['tone'],
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
    rootClass: computed(() =>
      getSemanticToneSurfaceClass(resolveSemanticTone(unref(props.tone))),
    ),
  }
}
