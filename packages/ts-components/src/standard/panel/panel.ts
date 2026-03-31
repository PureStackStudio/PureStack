import {
  getSemanticToneSurfaceClass,
  resolveSemanticTone,
} from '@purestack/ts-style'
import { defineComponent, html } from 'regor'

import { registerPanelStyles } from './panelStyle'

export interface Panel {
  tone?: string
  rootClass?: string
}

const panelTemplate = html`<section class="panel" :class="rootClass">
  <div class="panel__body"><slot></slot></div>
</section>`

function createPanelComponent() {
  return defineComponent<Panel>(panelTemplate, {
    props: ['tone'],
    context: (head) => resolvePanel(head.props),
  })
}

export function createPanelComponents() {
  registerPanelStyles()
  return {
    panel: createPanelComponent(),
  }
}

function resolvePanel(props: Panel): Panel {
  const tone = resolveSemanticTone(props.tone)

  return {
    rootClass: getSemanticToneSurfaceClass(tone),
  }
}
