import { type AnyRef, defineComponent, html, isRef } from 'regor'

export class FormInputField {
  label: string
  model: unknown
  type?: string
  name?: string
  autocomplete?: string
  min?: number | string
  step?: number | string
  placeholder?: string

  constructor(props: {
    label: string
    model: unknown
    type?: string
    name?: string
    autocomplete?: string
    min?: number | string
    step?: number | string
    placeholder?: string
  }) {
    this.label = props.label
    this.model = props.model
    this.type = props.type
    this.name = props.name
    this.autocomplete = props.autocomplete
    this.min = props.min
    this.step = props.step
    this.placeholder = props.placeholder
  }

  get isNumberField() {
    return this.type === 'number'
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
    const modelRef = this.getModelRef()
    if (modelRef) modelRef(next)
  }

  private readCurrentNumber() {
    const modelRef = this.getModelRef()
    if (!modelRef) return 0
    const raw = modelRef()
    const numeric =
      typeof raw === 'number' ? raw : Number.parseFloat(String(raw ?? '0'))
    return Number.isFinite(numeric) ? numeric : 0
  }

  private getModelRef(): AnyRef | null {
    return isRef(this.model) ? this.model : null
  }

  private readMin() {
    if (this.min === undefined) return undefined
    const value =
      typeof this.min === 'number' ? this.min : Number.parseFloat(this.min)
    return Number.isFinite(value) ? value : undefined
  }

  private readStep() {
    if (this.step === undefined) return 1
    const value =
      typeof this.step === 'number' ? this.step : Number.parseFloat(this.step)
    return Number.isFinite(value) && value > 0 ? value : 1
  }
}

const formInputFieldTemplate = html`<label class="form-block__field">
  <span class="form-block__label" r-if="label">{{ label }}</span>
  <div class="form-block__number" r-if="isNumberField">
    <input
      class="form-block__input form-block__input--number"
      type="number"
      :name="name"
      :autocomplete="autocomplete || 'off'"
      :min="min"
      :step="step"
      :placeholder="placeholder"
      r-model="model"
    />
    <div class="form-block__number-controls">
      <button
        class="form-block__number-btn form-block__number-btn--up"
        type="button"
        aria-label="Increase value"
        @click="increment"
      >
        +
      </button>
      <button
        class="form-block__number-btn form-block__number-btn--down"
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
    class="form-block__input"
    :type="type || 'text'"
    :name="name"
    :autocomplete="autocomplete || 'off'"
    :min="min"
    :step="step"
    :placeholder="placeholder"
    r-model="model"
  />
</label>`

export function defineFormInputField() {
  return {
    formInputField: defineComponent<FormInputField>(formInputFieldTemplate, {
      props: [
        'label',
        'model',
        'type',
        'name',
        'autocomplete',
        'min',
        'step',
        'placeholder',
      ],
      context: (head) => new FormInputField(head.props),
    }),
  }
}
