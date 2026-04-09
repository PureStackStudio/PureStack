import { urlNormalizer } from '@purestack/ts-util'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export type FormStatusVariant = 'info' | 'success' | 'error' | 'warning'

export interface AppForm {
  action?: RefOrValue<string>
  method?: RefOrValue<string>
}

export interface FormField {
  label?: RefOrValue<string>
  type?: RefOrValue<string>
  name?: RefOrValue<string>
  placeholder?: RefOrValue<string>
  autocomplete?: RefOrValue<string>
  required?: RefOrValue<boolean>
  min?: RefOrValue<string>
  max?: RefOrValue<string>
  step?: RefOrValue<string>
  value?: RefOrValue<string>
}

export interface FormMeta {}

export interface FormCheck {
  label?: RefOrValue<string>
  name?: RefOrValue<string>
  value?: RefOrValue<string>
  checked?: RefOrValue<boolean>
}

export interface FormAssistLink {
  href?: RefOrValue<string>
  label?: RefOrValue<string>
  target?: RefOrValue<string>
  rel?: RefOrValue<string>
  normalizedHref?: ComputedRef<string | undefined>
  resolvedRel?: ComputedRef<string | undefined>
}

export interface FormSubmit {
  label?: RefOrValue<string>
}

export interface FormDivider {
  label?: RefOrValue<string>
}

export interface FormStatus {
  variant?: RefOrValue<FormStatusVariant>
  hidden?: RefOrValue<boolean>
  toneClass?: ComputedRef<string | undefined>
}

const appFormTemplate = html`<form
  class="form-block"
  :action="action"
  :method="method"
  novalidate
>
  <slot></slot>
</form>`

const formFieldTemplate = html`<label class="form-block__field">
  <span class="form-block__label">{{ label }}</span>
  <input
    class="form-block__input"
    :type="type"
    :name="name"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :required="required"
    :min="min"
    :max="max"
    :step="step"
    :value="value"
  />
</label>`

const formMetaTemplate = html`<div class="form-block__meta"><slot></slot></div>`

const formCheckTemplate = html`<label class="form-block__check">
  <input type="checkbox" :name="name" :value="value" :checked="checked" />
  <span>{{ label }}</span>
</label>`

const formAssistLinkTemplate = html`<a
  class="form-block__assist-link"
  :href="normalizedHref"
  r-if="normalizedHref"
  :target="target"
  :rel="resolvedRel"
>
  {{ label }}
</a>`

const formSubmitTemplate = html`<Btn type="submit">
  {{ label }}
</Btn>`

const formDividerTemplate = html`<div
  class="form-block__divider"
  :data-label="label"
></div>`

const formStatusTemplate = html`<div
  class="form-status"
  :class="toneClass"
  role="status"
  aria-live="polite"
  :hidden="hidden"
>
  <slot></slot>
</div>`

function createAppFormComponent() {
  return defineComponent<AppForm>(appFormTemplate, {
    props: ['action', 'method'],
    context: (head) => resolveAppForm(head.props),
  })
}

function createFormFieldComponent() {
  return defineComponent<FormField>(formFieldTemplate, {
    props: [
      'label',
      'type',
      'name',
      'placeholder',
      'autocomplete',
      'required',
      'min',
      'max',
      'step',
      'value',
    ],
    context: (head) => resolveFormField(head.props),
  })
}

function createFormMetaComponent() {
  return defineComponent<FormMeta>(formMetaTemplate, {})
}

function createFormCheckComponent() {
  return defineComponent<FormCheck>(formCheckTemplate, {
    props: ['label', 'name', 'value', 'checked'],
    context: (head) => head.props,
  })
}

function createFormAssistLinkComponent() {
  return defineComponent<FormAssistLink>(formAssistLinkTemplate, {
    props: ['href', 'label', 'target', 'rel'],
    context: (head) => resolveFormAssistLink(head.props),
  })
}

function createFormSubmitComponent() {
  return defineComponent<FormSubmit>(formSubmitTemplate, {
    props: ['label'],
    context: (head) => head.props,
  })
}

function createFormDividerComponent() {
  return defineComponent<FormDivider>(formDividerTemplate, {
    props: ['label'],
    context: (head) => head.props,
  })
}

function createFormStatusComponent() {
  return defineComponent<FormStatus>(formStatusTemplate, {
    props: ['variant', 'hidden'],
    context: (head) => resolveFormStatus(head.props),
  })
}

export function createFormComponents() {
  return {
    appForm: createAppFormComponent(),
    formField: createFormFieldComponent(),
    formMeta: createFormMetaComponent(),
    formCheck: createFormCheckComponent(),
    formAssistLink: createFormAssistLinkComponent(),
    formSubmit: createFormSubmitComponent(),
    formDivider: createFormDividerComponent(),
    formStatus: createFormStatusComponent(),
  }
}

function resolveAppForm(props: AppForm): AppForm {
  return props
}

function resolveFormField(props: FormField): FormField {
  return props
}

function resolveFormAssistLink(props: FormAssistLink): FormAssistLink {
  return {
    ...props,
    normalizedHref: computed(() =>
      urlNormalizer.normalizeHref(unref(props.href)),
    ),
    resolvedRel: computed(
      () =>
        unref(props.rel) ||
        (unref(props.target) === '_blank' ? 'noopener noreferrer' : ''),
    ),
  }
}

function resolveFormStatus(props: FormStatus): FormStatus {
  return {
    ...props,
    toneClass: computed(() => resolveStatusToneClass(unref(props.variant))),
  }
}

function resolveStatusToneClass(value: string | undefined) {
  const normalized = value?.trim().toLowerCase()
  if (
    normalized === 'info' ||
    normalized === 'success' ||
    normalized === 'error' ||
    normalized === 'warning'
  ) {
    return `form-status--${normalized}`
  }
  return undefined
}
