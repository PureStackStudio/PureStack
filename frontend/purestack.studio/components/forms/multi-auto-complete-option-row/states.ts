import {
  defineIconComponents,
  defineMultiAutoCompleteInputComponents,
} from '@purestack/ts-components'
import { lucide_chevron_down, lucide_x } from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html } from 'regor'

export interface MultiAutoCompleteOptionRowStates {}

const multiAutoCompleteOptionRowStatesTemplate = html`<MultiAutoCompleteInput
  id="multi-row-owner"
  label="Topics"
  rowComponent="MultiAutoCompleteOptionRow"
  :allowCustomValues="false"
  :options="[{label:'Accessibility',value:'a11y'},{label:'Performance',value:'perf'}]"
/>`

function createMultiAutoCompleteOptionRowStates(): MultiAutoCompleteOptionRowStates {
  return {}
}

const component = defineComponent<MultiAutoCompleteOptionRowStates>(
  multiAutoCompleteOptionRowStatesTemplate,
  {
    context: createMultiAutoCompleteOptionRowStates,
  },
)
const icons: Record<string, string> = {
  'lucide:x': lucide_x,
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      MultiAutoCompleteOptionRowStates: component,

      ...defineMultiAutoCompleteInputComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#multi-auto-complete-option-row-states-demo',
    template: html`<MultiAutoCompleteOptionRowStates />`,
  },
)
