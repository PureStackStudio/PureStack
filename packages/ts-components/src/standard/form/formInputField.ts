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
import { createAutoId } from '../autoId'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'

const resolveInputId = createAutoId('form-input')

export type FormInputFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local'
  | 'month'
  | 'week'

export class FormInputField {
  readonly id: string
  readonly label?: RefOrValue<string>
  readonly tone?: RefOrValue<SemanticTone>
  readonly variant?: RefOrValue<ComponentVariant>
  declare readonly model: Ref<string | number>
  readonly type?: RefOrValue<FormInputFieldType>
  readonly name?: RefOrValue<string>
  readonly required?: RefOrValue<boolean>
  readonly autocomplete?: RefOrValue<string>
  readonly min?: RefOrValue<number | string>
  readonly step?: RefOrValue<number | string>
  readonly placeholder?: RefOrValue<string>
  readonly disabled?: RefOrValue<boolean>
  readonly icon?: RefOrValue<string>
  readonly iconEnd?: RefOrValue<string>
  classes?: ComputedRef<string>

  constructor(props: FormInputField) {
    Object.assign(this, {
      ...props,
    })
    this.id = resolveInputId(props.id)
    if (!this.model) this.model = ref<string | number>('')
  }

  get isNumberField() {
    return unref(this.type) === 'number'
  }

  increment = () => {
    this.stepBy(1)
  }

  decrement = () => {
    this.stepBy(-1)
  }

  private stepBy(direction: 1 | -1) {
    const current = this.readCurrentNumber()
    const step = this.readStep()
    const min = this.readMin()
    let next = current + direction * step
    if (min !== undefined && next < min) {
      next = min
    }
    const modelRef = this.model
    if (modelRef) modelRef(next)
  }

  private readCurrentNumber() {
    const raw = unref(this.model)
    const numeric =
      typeof raw === 'number' ? raw : Number.parseFloat(String(raw ?? '0'))
    return Number.isFinite(numeric) ? numeric : 0
  }

  private readMin() {
    const min = unref(this.min)
    if (min === undefined) return undefined
    const value = typeof min === 'number' ? min : Number.parseFloat(min)
    return Number.isFinite(value) ? value : undefined
  }

  private readStep() {
    const step = unref(this.step)
    if (step === undefined) return 1
    const value = typeof step === 'number' ? step : Number.parseFloat(step)
    return Number.isFinite(value) && value > 0 ? value : 1
  }
}

const formInputFieldTemplate = html`<label class="form-block__field" :for="id">
  <span class="form-block__label" r-if="label">{{ label }}</span>
  <div class="form-block__input-shell" :class="classes">
    <Icon class="form-block__input-icon" :name="icon" r-if="icon"/>
    <input
      :id="id"
      class="form-block__input"
      :class="{ 'form-block__input--number': isNumberField }"
      :type="isNumberField ? 'number' : type || 'text'"
      :name="name"
      :required="required"
      :autocomplete="autocomplete || 'off'"
      :min="min"
      :step="step"
      :placeholder="placeholder"
      :disabled="disabled"
      r-model="model"
      r-inherit/>
    <div class="form-block__number-controls" r-if="isNumberField">
      <button
        class="form-block__number-btn form-block__number-btn--up tone-fill-button-all"
        type="button"
        aria-label="Increase value"
        @click="increment"
        :disabled="disabled"
        tabindex="-1"
      >
        +
      </button>
      <button
        class="form-block__number-btn form-block__number-btn--down tone-fill-button-all"
        type="button"
        aria-label="Decrease value"
        @click="decrement"
        :disabled="disabled"
        tabindex="-1"
      >
        -
      </button>
    </div>
    <Icon class="form-block__input-icon" :name="iconEnd" r-if="iconEnd"/>
  </div>
</label>`
export function defineFormInputField() {
  return {
    formInputField: defineComponent<FormInputField>(formInputFieldTemplate, {
      props: [
        'id',
        'label',
        'tone',
        'variant',
        'model',
        'type',
        'name',
        'required',
        'autocomplete',
        'min',
        'step',
        'placeholder',
        'disabled',
        'icon',
        'iconEnd',
      ],
      context: (head) => resolveFormInputField(head),
    }),
  }
}

function resolveFormInputField(head: ComponentHead<FormInputField>) {
  const field = new FormInputField(head.props)
  field.classes = computed(() =>
    resolveComponentClasses(head.props, {
      defaultVariant: 'surfaceAlt',
    }),
  )
  return field
}
