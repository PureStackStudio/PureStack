import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
} from '@purestack/ts-components'
import {
  lucide_chevron_down,
  tabler_arrow_right,
  tabler_check,
  tabler_plus,
  tabler_refresh,
} from '@purestack/ts-svg-icons'
import { createApp, html } from 'regor'
import { defineButtonsExampleComponents } from '../../docs/buttons'

const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
  'tabler:arrow-right': tabler_arrow_right,
  'tabler:check': tabler_check,
  'tabler:plus': tabler_plus,
  'tabler:refresh': tabler_refresh,
}

const components = {
  ...defineButtonsExampleComponents(),
  ...defineButtonComponents(),
  ...defineFlexComponents(),
  ...defineFormComponents(),
  ...defineFormInputField(),
  ...defineFormSelectField(),
  ...defineGridComponents(),
  ...defineIconComponents((name) => {
    if (!icons[name])
      throw new Error(`Button example icon is not registered: ${name}`)
    return icons[name]
  }),
}

createApp(
  { components },
  {
    selector: 'app#button-playground',
    template: html`<DocsButtonPlayground/>`,
  },
)
createApp(
  { components },
  {
    selector: 'app#button-events',
    template: html`<DocsButtonEvents/>`,
  },
)
createApp(
  { components },
  {
    selector: 'app#button-form',
    template: html`<DocsButtonForm/>`,
  },
)
