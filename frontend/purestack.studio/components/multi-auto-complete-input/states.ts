import {
  defineIconComponents,
  defineMultiAutoCompleteInputComponents,
} from '@purestack/ts-components'
import { lucide_chevron_down, lucide_x } from '@purestack/ts-svg-icons'
import { createApp, defineComponent, html } from 'regor'

export interface MultiAutoCompleteInputStates {}

const multiAutoCompleteInputStatesTemplate = html`<MultiAutoCompleteInput
  id="multi-token-states"
  label="Example recipients"
  :items="[{label:'Required reviewer',value:'reviewer',disabled:true},{label:'Invalid address',value:'invalid',invalid:true,tone:'danger'}]"
  placeholder="Add a recipient"
/>`

function createMultiAutoCompleteInputStates(): MultiAutoCompleteInputStates {
  return {}
}

const component = defineComponent<MultiAutoCompleteInputStates>(
  multiAutoCompleteInputStatesTemplate,
  {
    context: createMultiAutoCompleteInputStates,
  },
)
const icons: Record<string, string> = {
  'lucide:x': lucide_x,
  'lucide:chevron-down': lucide_chevron_down,
}

createApp(
  {
    components: {
      MultiAutoCompleteInputStates: component,

      ...defineMultiAutoCompleteInputComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#multi-auto-complete-input-states-demo',
    template: html`<MultiAutoCompleteInputStates />`,
  },
)
