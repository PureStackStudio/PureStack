import {
  defineButtonComponents,
  defineFlexComponents,
  defineModalComponents,
  definePanelComponents,
} from '@purestack/ts-components'
import { createApp, html } from 'regor'
import { defineModalExampleComponents } from '../../../../docs/modal'

const components = {
  ...defineModalExampleComponents(),
  ...defineModalComponents(),
  ...defineButtonComponents(),
  ...defineFlexComponents(),
  ...definePanelComponents(),
}

createApp(
  { components },
  {
    selector: '[data-doc-demo="modal-api"]',
    template: html`<DocsModalApi/>`,
  },
)
createApp(
  { components },
  {
    selector: '[data-doc-demo="modal-store"]',
    template: html`<DocsModalStore/>`,
  },
)
window.tsSsgModal?.refresh()
