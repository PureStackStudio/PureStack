import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type SRef,
  unref,
} from 'regor'
import type { OptionState } from '../model'

export interface OptionField {
  option: OptionState | SRef<OptionState>
  choices?: ComputedRef<{ label: string; value: string }[]>
}

const optionFieldTemplate = html`<div>
  <FormCheck r-if="option.field.type === 'toggle'" :id="'option-' + option.field.id"
    :label="option.field.label" :checked="option.value" tone="accent"/>
  <FormInputField r-if="option.field.type === 'text'" :id="'option-' + option.field.id"
    :label="option.field.label" :model="option.value" maxlength="2000"/>
  <FormSelectField r-if="option.field.type === 'select'" :id="'option-' + option.field.id"
    :label="option.field.label" :model="option.value" :options="choices"/>
  <p class="text-subtle fs-xs mt-2 mb-0">{{ option.field.description }}</p>
</div>`

export function defineOptionFieldComponent() {
  return defineComponent<OptionField>(optionFieldTemplate, {
    props: ['option'],
    context: (head) => ({
      option: head.props.option,
      choices: computed(() =>
        (unref(head.props.option).field.choices ?? []).map((choice) => ({
          label: choice.label,
          value: String(choice.value),
        })),
      ),
    }),
  })
}
