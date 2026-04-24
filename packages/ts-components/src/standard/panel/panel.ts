import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
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
  toneClass?: ComputedRef<string>
  class?: RefOrValue<string>
}

const panelTemplate = html`<section class="panel" :class="[class, toneClass]">
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
    toneClass: computed(() => getSemanticToneClass(unref(props.tone))),
  }
}
