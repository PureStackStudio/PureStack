import { urlNormalizer } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'
import { registerFormStyles } from './formStyle'

export interface AppForm {
  action?: string
  method?: string
  resolvedMethod?: 'post' | 'get'
}

export interface FormField {
  label?: string
  type?: string
  name?: string
  placeholder?: string
  autocomplete?: string
  required?: unknown
  min?: string
  max?: string
  step?: string
  value?: string
  resolvedType?: string
}

export interface FormMeta {}

export interface FormCheck {
  label?: string
  name?: string
  value?: string
  checked?: unknown
}

export interface FormAssistLink {
  href?: string
  label?: string
  target?: string
  rel?: string
}

export interface FormSubmit {
  label?: string
}

export interface FormDivider {
  label?: string
}

export interface FormStatus {
  variant?: string
  hidden?: unknown
  toneClass?: string
}

const appFormTemplate = html`<form
  class="form-block"
  :action="action"
  :method="resolvedMethod"
  novalidate
>
  <slot></slot>
</form>`

const formFieldTemplate = html`<label class="form-block__field">
  <span class="form-block__label">{{ label }}</span>
  <input
    class="form-block__input"
    :type="resolvedType"
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
  :href="href"
  r-if="href"
  :target="target"
  :rel="rel"
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
    context: (head) => ({
      label: head.props.label,
      name: head.props.name,
      value: head.props.value,
      checked: head.props.checked,
    }),
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
    context: (head) => ({
      label: head.props.label,
    }),
  })
}

function createFormDividerComponent() {
  return defineComponent<FormDivider>(formDividerTemplate, {
    props: ['label'],
    context: (head) => ({
      label: head.props.label,
    }),
  })
}

function createFormStatusComponent() {
  return defineComponent<FormStatus>(formStatusTemplate, {
    props: ['variant', 'hidden'],
    context: (head) => ({
      variant: head.props.variant,
      hidden: head.props.hidden,
      toneClass: resolveStatusToneClass(head.props.variant),
    }),
  })
}

export function createFormComponents() {
  registerFormStyles()
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
  const normalizedMethod = props.method?.trim().toLowerCase() || ''
  return {
    action: props.action,
    method: props.method,
    resolvedMethod:
      normalizedMethod === 'get'
        ? 'get'
        : normalizedMethod === 'post'
          ? 'post'
          : undefined,
  }
}

function resolveFormField(props: FormField): FormField {
  const resolvedType = resolveInputType(props.type)
  return {
    ...props,
    label: props.label,
    name: props.name,
    placeholder: props.placeholder,
    autocomplete: props.autocomplete,
    required: props.required,
    min: props.min,
    max: props.max,
    step: props.step,
    value: props.value,
    resolvedType,
  }
}

function resolveFormAssistLink(props: FormAssistLink): FormAssistLink {
  const href = urlNormalizer.normalizeHref(props.href)
  const rel =
    props.rel || (props.target === '_blank' ? 'noopener noreferrer' : '')
  return {
    href,
    label: props.label,
    target: props.target,
    rel,
  }
}

function resolveInputType(value: string | undefined) {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) return undefined
  if (
    normalized === 'email' ||
    normalized === 'number' ||
    normalized === 'password' ||
    normalized === 'text'
  ) {
    return normalized
  }
  return undefined
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
