import {
  defineAutoCompleteInputComponents,
  defineFormInputField,
  defineIconComponents,
} from '@purestack/ts-components'
import { lucide_check, lucide_chevron_down } from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html } from 'regor'

export interface AutoCompleteOptionRowStates {}

const autoCompleteOptionRowStatesTemplate = html`<AutoCompleteInput
  id="default-option-owner"
  label="Region"
  :options="[{label:'Europe Central',value:'eu'},{label:'US East',value:'us'}]"
  rowComponent="AutoCompleteOptionRow"
/>`

function createAutoCompleteOptionRowStates(): AutoCompleteOptionRowStates {
  return {}
}

const component = defineComponent<AutoCompleteOptionRowStates>(
  autoCompleteOptionRowStatesTemplate,
  {
    context: createAutoCompleteOptionRowStates,
  },
)
const icons: Record<string, string> = {
  'lucide:check': lucide_check,
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      AutoCompleteOptionRowStates: component,

      ...defineAutoCompleteInputComponents(),
      ...defineFormInputField(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#auto-complete-option-row-states-demo',
    template: html`<AutoCompleteOptionRowStates />`,
  },
)
