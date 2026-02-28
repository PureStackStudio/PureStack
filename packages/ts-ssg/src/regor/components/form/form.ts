import { defineComponent, html } from 'regor'

import { urlNormalizer } from '../../../util/urlNormalizer'
import { registerFormStyles } from './formStyle'

interface AppFormProps {
  action?: string
  method?: string
}

interface AppFormContext extends AppFormProps {
  resolvedMethod?: 'post' | 'get'
}

interface FormFieldProps {
  label?: string
  type?: string
  name?: string
  placeholder?: string
  autocomplete?: string
  required?: unknown
}

interface FormFieldContext extends FormFieldProps {
  resolvedType?: string
}

interface FormMetaProps {}

interface FormMetaContext extends FormMetaProps {}

interface FormCheckProps {
  label?: string
  name?: string
  value?: string
  checked?: unknown
}

interface FormCheckContext extends FormCheckProps {}

interface FormAssistLinkProps {
  href?: string
  label?: string
  target?: string
  rel?: string
}

interface FormAssistLinkContext extends FormAssistLinkProps {
  hasHref: boolean
  hasRel: boolean
  hasTarget: boolean
}

interface FormSubmitProps {
  label?: string
}

interface FormSubmitContext extends FormSubmitProps {}

interface FormDividerProps {
  label?: string
}

interface FormDividerContext extends FormDividerProps {}

interface FormStatusProps {
  variant?: string
  hidden?: unknown
}

interface FormStatusContext extends FormStatusProps {
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
  r-if="hasHref"
  :target="hasTarget ? target : null"
  :rel="hasRel ? rel : null"
>
  {{ label }}
</a>`

const formSubmitTemplate = html`<button class="form-block__submit" type="submit">
  {{ label }}
</button>`

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
  return defineComponent<AppFormContext>(appFormTemplate, {
    props: ['action', 'method'],
    context: (head) => resolveAppFormContext(head.props),
  })
}

function createFormFieldComponent() {
  return defineComponent<FormFieldContext>(formFieldTemplate, {
    props: ['label', 'type', 'name', 'placeholder', 'autocomplete', 'required'],
    context: (head) => resolveFormFieldContext(head.props),
  })
}

function createFormMetaComponent() {
  return defineComponent<FormMetaContext>(formMetaTemplate, {})
}

function createFormCheckComponent() {
  return defineComponent<FormCheckContext>(formCheckTemplate, {
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
  return defineComponent<FormAssistLinkContext>(formAssistLinkTemplate, {
    props: ['href', 'label', 'target', 'rel'],
    context: (head) => resolveFormAssistLinkContext(head.props),
  })
}

function createFormSubmitComponent() {
  return defineComponent<FormSubmitContext>(formSubmitTemplate, {
    props: ['label'],
    context: (head) => ({
      label: head.props.label,
    }),
  })
}

function createFormDividerComponent() {
  return defineComponent<FormDividerContext>(formDividerTemplate, {
    props: ['label'],
    context: (head) => ({
      label: head.props.label,
    }),
  })
}

function createFormStatusComponent() {
  return defineComponent<FormStatusContext>(formStatusTemplate, {
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

function resolveAppFormContext(props: AppFormProps): AppFormContext {
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

function resolveFormFieldContext(props: FormFieldProps): FormFieldContext {
  return {
    ...props,
    label: props.label,
    name: props.name,
    placeholder: props.placeholder,
    autocomplete: props.autocomplete,
    required: props.required,
    resolvedType: resolveInputType(props.type),
  }
}

function resolveFormAssistLinkContext(
  props: FormAssistLinkProps,
): FormAssistLinkContext {
  const href = urlNormalizer.normalizeHref(props.href)
  const rel =
    props.rel || (props.target === '_blank' ? 'noopener noreferrer' : '')
  return {
    href,
    label: props.label,
    target: props.target,
    rel,
    hasHref: Boolean(href),
    hasRel: Boolean(rel),
    hasTarget: Boolean(props.target),
  }
}

function resolveInputType(value: string | undefined) {
  const normalized = value?.trim().toLowerCase()
  if (!normalized) return undefined
  if (
    normalized === 'email' ||
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
