import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type Ref,
  type RefOrValue,
  ref,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'

let nextAutoSelectId = 1

export type FormSelectValue = string | number

export interface FormSelectOption {
  label: RefOrValue<string>
  value?: RefOrValue<FormSelectValue>
  disabled?: RefOrValue<boolean>
}

export interface ResolvedFormSelectOption {
  label: string
  value: FormSelectValue
  disabled?: boolean
}

export class FormSelectField {
  readonly id: string
  readonly label?: RefOrValue<string>
  readonly tone?: RefOrValue<SemanticTone>
  readonly variant?: RefOrValue<ComponentVariant>
  declare readonly model: Ref<FormSelectValue>
  readonly name?: RefOrValue<string>
  readonly required?: RefOrValue<boolean>
  readonly autocomplete?: RefOrValue<string>
  readonly placeholder?: RefOrValue<string>
  readonly disabled?: RefOrValue<boolean>
  readonly icon?: RefOrValue<string>
  readonly iconEnd?: RefOrValue<string>
  readonly options?: RefOrValue<FormSelectOption[]>
  classes?: ComputedRef<string>
  resolvedOptions?: ComputedRef<ResolvedFormSelectOption[]>
  resolvedIconEnd?: ComputedRef<string>
  hasPlaceholder?: ComputedRef<boolean>

  constructor(props: FormSelectField) {
    Object.assign(this, {
      ...props,
    })
    this.id = resolveSelectId(unref(props.id))
    if (!this.model) this.model = ref<FormSelectValue>('')
  }
}

const formSelectFieldTemplate = html`<label class="form-block__field" :for="id">
  <span class="form-block__label" r-if="label">{{ label }}</span>
  <div class="form-block__input-shell form-block__select-shell" :class="classes">
    <Icon class="form-block__input-icon" :name="icon" r-if="icon"/>
    <select
      :id="id"
      class="form-block__input form-block__select"
      :name="name"
      :required="required"
      :autocomplete="autocomplete || 'off'"
      :disabled="disabled"
      r-model="model"
      r-inherit>
      <option value="" disabled r-if="hasPlaceholder">{{ placeholder }}</option>
      <option
        r-for="option in resolvedOptions"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <Icon class="form-block__input-icon form-block__select-icon" :name="resolvedIconEnd"/>
  </div>
</label>`

export function defineFormSelectField() {
  return {
    formSelectField: defineComponent<FormSelectField>(formSelectFieldTemplate, {
      props: [
        'id',
        'label',
        'tone',
        'variant',
        'model',
        'name',
        'required',
        'autocomplete',
        'placeholder',
        'disabled',
        'icon',
        'iconEnd',
        'options',
      ],
      context: (head) => resolveFormSelectField(head),
    }),
  }
}

function resolveFormSelectField(head: ComponentHead<FormSelectField>) {
  const field = new FormSelectField(head.props)
  field.classes = computed(() =>
    resolveComponentClasses(head.props, {
      defaultVariant: 'surfaceAlt',
    }),
  )
  field.resolvedOptions = computed(() => {
    const options = (unref(head.props.options) || []) as Array<
      RefOrValue<FormSelectOption>
    >
    return options.map((option) => resolveSelectOption(option))
  })
  field.resolvedIconEnd = computed(
    () => unref(head.props.iconEnd) || 'lucide:chevron-down',
  )
  field.hasPlaceholder = computed(() => Boolean(unref(head.props.placeholder)))
  return field
}

function resolveSelectOption(
  optionInput: RefOrValue<FormSelectOption>,
): ResolvedFormSelectOption {
  const option = unref(optionInput)
  const label = unref(option.label)
  return {
    label,
    value: unref(option.value) ?? label,
    disabled: unref(option.disabled),
  }
}

function resolveSelectId(id?: string) {
  if (id) return id
  const nextId = `form-select-${nextAutoSelectId}`
  nextAutoSelectId += 1
  return nextId
}
