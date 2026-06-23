import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  isRef,
  type Ref,
  type RefOrValue,
  ref,
} from 'regor'
import { createAutoId } from '../autoId'
import { resolveComponentClasses } from '../componentVariant'

const resolveCheckId = createAutoId('form-check')

export class FormCheck {
  readonly id: string
  label?: RefOrValue<string>
  name?: RefOrValue<string>
  value?: RefOrValue<string>
  checked?: Ref<boolean>
  disabled?: RefOrValue<boolean>
  tone?: RefOrValue<SemanticTone>
  classes?: ComputedRef<string>

  constructor(props: FormCheck) {
    Object.assign(this, props)
    this.id = resolveCheckId(props.id)
    if (!isRef(this.checked)) {
      this.checked = ref<boolean>(resolveInitialChecked(this.checked))
    }
  }
}

const formCheckTemplate = html`<label class="form-block__check" :class="classes" :for="id">
  <input
    :id="id"
    class="form-block__check-input"
    type="checkbox"
    :name="name"
    :value="value"
    :disabled="disabled"
    r-model="checked"
    r-inherit/>
  <span class="form-block__check-control" aria-hidden="true"></span>
  <span class="form-block__check-label">{{ label }}</span>
</label>`

export function defineFormCheckComponent() {
  return defineComponent<FormCheck>(formCheckTemplate, {
    props: ['id', 'label', 'name', 'value', 'checked', 'disabled', 'tone'],
    context: (head) => resolveFormCheck(head),
  })
}

function resolveFormCheck(head: ComponentHead<FormCheck>): FormCheck {
  const check = new FormCheck(head.props)
  check.classes = computed(() =>
    resolveComponentClasses(head.props, {
      defaultVariant: 'none',
    }),
  )
  return check
}

function resolveInitialChecked(value: unknown) {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized !== '' && normalized !== 'false'
  }
  return !!value
}
