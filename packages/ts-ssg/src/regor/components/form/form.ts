import { createComponent, html } from 'regor'

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

function createAppFormComponent() {
  return createComponent<AppFormContext>(appFormTemplate, {
    props: ['action', 'method'],
    context: (head) => resolveAppFormContext(head.props),
  })
}

function createFormFieldComponent() {
  return createComponent<FormFieldContext>(formFieldTemplate, {
    props: ['label', 'type', 'name', 'placeholder', 'autocomplete', 'required'],
    context: (head) => resolveFormFieldContext(head.props),
  })
}

function createFormMetaComponent() {
  return createComponent<FormMetaContext>(formMetaTemplate, {})
}

function createFormCheckComponent() {
  return createComponent<FormCheckContext>(formCheckTemplate, {
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
  return createComponent<FormAssistLinkContext>(formAssistLinkTemplate, {
    props: ['href', 'label', 'target', 'rel'],
    context: (head) => resolveFormAssistLinkContext(head.props),
  })
}

function createFormSubmitComponent() {
  return createComponent<FormSubmitContext>(formSubmitTemplate, {
    props: ['label'],
    context: (head) => ({
      label: head.props.label,
    }),
  })
}

function createFormDividerComponent() {
  return createComponent<FormDividerContext>(formDividerTemplate, {
    props: ['label'],
    context: (head) => ({
      label: head.props.label,
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
  const rel = props.rel || (props.target === '_blank' ? 'noopener noreferrer' : '')
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
