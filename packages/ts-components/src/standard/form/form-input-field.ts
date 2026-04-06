import { defineComponent, html, type Ref, type RefOrValue, unref } from 'regor'

let nextAutoInputId = 1

export class FormInputField {
  declare readonly id: string
  declare readonly label?: RefOrValue<string>
  declare readonly model: Ref<string | number>
  declare readonly type?: RefOrValue<string>
  declare readonly name?: RefOrValue<string>
  declare readonly autocomplete?: RefOrValue<string>
  declare readonly min?: RefOrValue<number | string>
  declare readonly step?: RefOrValue<number | string>
  declare readonly placeholder?: RefOrValue<string>

  constructor(props: {
    id?: string
    label?: RefOrValue<string>
    model: Ref<string | number>
    type?: RefOrValue<string>
    name?: RefOrValue<string>
    autocomplete?: RefOrValue<string>
    min?: RefOrValue<number | string>
    step?: RefOrValue<number | string>
    placeholder?: RefOrValue<string>
  }) {
    Object.assign(this, {
      ...props,
      id: resolveInputId(unref(props.id)),
    })
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
  <div class="form-block__number" r-if="isNumberField">
    <input
      :id="id"
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
    :id="id"
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
        'id',
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

function resolveInputId(id?: string) {
  if (id) return id
  const nextId = `form-input-${nextAutoInputId}`
  nextAutoInputId += 1
  return nextId
}
