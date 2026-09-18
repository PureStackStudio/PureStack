import {
  defineButtonComponents,
  defineFlexComponents,
  defineTabsComponents,
} from '@purestack/ts-components'
import { createApp, html } from 'regor'
import { defineTabsExampleComponents } from '../../../../docs/tabs'

const components = {
  ...defineTabsExampleComponents(),
  ...defineTabsComponents(),
  ...defineButtonComponents(),
  ...defineFlexComponents(),
}

createApp(
  { components },
  {
    selector: '[data-doc-demo="tabs-state"]',
    template: html`<DocsTabsState/>`,
  },
)
window.tsSsgTabs?.refresh()
