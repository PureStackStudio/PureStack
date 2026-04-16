import {
  getSemanticToneSurfaceClass,
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
  className?: ComputedRef<string>
}

const panelTemplate = html`<section class="panel" :class="className">
  <div class="panel__body"><slot></slot></div>
</section>`

function definePanelComponent() {
  return defineComponent<Panel>(panelTemplate, {
    props: ['tone', 'class'],
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
    className: computed(() => getSemanticToneSurfaceClass(unref(props.tone))),
  }
}
