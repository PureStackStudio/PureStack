import {
  getSemanticToneButtonClass,
  getSemanticToneSurfaceClass,
  getSemanticToneTextClass,
  type SemanticTone,
} from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type Ref,
  type RefOrValue,
  unref,
} from 'regor'
import { FormToneContext } from './form'

let nextAutoInputId = 1

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
  declare readonly model: Ref<string | number>
  readonly type?: RefOrValue<FormInputFieldType>
  readonly name?: RefOrValue<string>
  readonly autocomplete?: RefOrValue<string>
  readonly min?: RefOrValue<number | string>
  readonly step?: RefOrValue<number | string>
  readonly placeholder?: RefOrValue<string>
  labelToneClass?: ComputedRef<string>
  inputToneClass?: ComputedRef<string>
  buttonToneClass?: ComputedRef<string>

  constructor(props: FormInputField) {
    Object.assign(this, {
      ...props,
    })
    this.id = resolveInputId(unref(props.id))
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
  <span class="form-block__label" :class="labelToneClass" r-if="label">
    {{ label }}
  </span>
  <div class="form-block__number" :class="inputToneClass" r-if="isNumberField">
    <input
      :id="id"
      class="form-block__input form-block__input--number"
      type="number"
      :name="name"
      :autocomplete="autocomplete || 'off'"
      :min="min"
      :step="step"
      :placeholder="placeholder"
      r-model="model"/>
    <div class="form-block__number-controls">
      <button
        class="form-block__number-btn form-block__number-btn--up"
        :class="buttonToneClass"
        type="button"
        aria-label="Increase value"
        @click="increment"
      >
        +
      </button>
      <button
        class="form-block__number-btn form-block__number-btn--down"
        :class="buttonToneClass"
        type="button"
        aria-label="Decrease value"
        @click="decrement"
      >
        -
      </button>
    </div>
  </div>
  <input
    r-else
    :id="id"
    class="form-block__input"
    :class="inputToneClass"
    :type="type || 'text'"
    :name="name"
    :autocomplete="autocomplete || 'off'"
    :min="min"
    :step="step"
    :placeholder="placeholder"
    r-model="model"/>
</label>`

export function defineFormInputField() {
  return {
    formInputField: defineComponent<FormInputField>(formInputFieldTemplate, {
      props: [
        'id',
        'label',
        'tone',
        'model',
        'type',
        'name',
        'autocomplete',
        'min',
        'step',
        'placeholder',
      ],
      context: (head) => resolveFormInputField(head),
    }),
  }
}

function resolveFormInputField(head: ComponentHead<FormInputField>) {
  const inheritedTone = head.findContext(FormToneContext)?.tone
  const resolvedTone = () => unref(head.props.tone) || unref(inheritedTone)
  const field = new FormInputField(head.props)
  field.labelToneClass = computed(() =>
    getSemanticToneTextClass(resolvedTone()),
  )
  field.inputToneClass = computed(() =>
    getSemanticToneSurfaceClass(resolvedTone(), false),
  )
  field.buttonToneClass = computed(() =>
    getSemanticToneButtonClass(resolvedTone(), true),
  )
  return field
}

function resolveInputId(id?: string) {
  if (id) return id
  const nextId = `form-input-${nextAutoInputId}`
  nextAutoInputId += 1
  return nextId
}
