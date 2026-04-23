import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
import { urlNormalizer } from '@purestack/ts-util'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export interface AppForm {
  action?: RefOrValue<string>
  method?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  toneClass?: ComputedRef<string>
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
  tone?: RefOrValue<SemanticTone>
}

export interface FormDivider {
  label?: RefOrValue<string>
}

export interface FormStatus {
  tone?: RefOrValue<SemanticTone>
  hidden?: RefOrValue<boolean>
  toneClass?: ComputedRef<string>
}

const appFormTemplate = html`<form
  class="form-block"
  :class="toneClass"
  :action="action"
  :method="method"
  novalidate
>
  <slot></slot>
</form>`

const formMetaTemplate = html`<div class="form-block__meta"><slot></slot></div>`

const formCheckTemplate = html`<label class="form-block__check">
  <input type="checkbox" :name="name" :value="value" :checked="checked"/>
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

const formSubmitTemplate = html`<Btn type="submit" :tone="tone">{{ label }}</Btn>`

const formDividerTemplate = html`<div class="form-block__divider" :data-label="label"></div>`

const formStatusTemplate = html`<div
  class="form-status tone-surface"
  :class="toneClass"
  role="status"
  aria-live="polite"
  :hidden="hidden"
>
  <slot></slot>
</div>`

function defineAppFormComponent() {
  return defineComponent<AppForm>(appFormTemplate, {
    props: ['action', 'method', 'tone'],
    context: (head) => resolveAppForm(head.props),
  })
}

function defineFormMetaComponent() {
  return defineComponent<FormMeta>(formMetaTemplate, {})
}

function defineFormCheckComponent() {
  return defineComponent<FormCheck>(formCheckTemplate, {
    props: ['label', 'name', 'value', 'checked'],
    context: (head) => head.props,
  })
}

function defineFormAssistLinkComponent() {
  return defineComponent<FormAssistLink>(formAssistLinkTemplate, {
    props: ['href', 'label', 'target', 'rel'],
    context: (head) => resolveFormAssistLink(head),
  })
}

function defineFormSubmitComponent() {
  return defineComponent<FormSubmit>(formSubmitTemplate, {
    props: ['label', 'tone'],
    context: (head) => resolveFormSubmit(head),
  })
}

function defineFormDividerComponent() {
  return defineComponent<FormDivider>(formDividerTemplate, {
    props: ['label'],
    context: (head) => head.props,
  })
}

function defineFormStatusComponent() {
  return defineComponent<FormStatus>(formStatusTemplate, {
    props: ['tone', 'hidden'],
    context: (head) => resolveFormStatus(head),
  })
}

export function defineFormComponents() {
  return {
    appForm: defineAppFormComponent(),
    formMeta: defineFormMetaComponent(),
    formCheck: defineFormCheckComponent(),
    formAssistLink: defineFormAssistLinkComponent(),
    formSubmit: defineFormSubmitComponent(),
    formDivider: defineFormDividerComponent(),
    formStatus: defineFormStatusComponent(),
  }
}

function resolveAppForm(props: AppForm): AppForm {
  return {
    ...props,
    toneClass: computed(() => getSemanticToneClass(unref(props.tone))),
  }
}

function resolveFormAssistLink(
  head: ComponentHead<FormAssistLink>,
): FormAssistLink {
  return {
    ...head.props,
    normalizedHref: computed(() =>
      urlNormalizer.normalizeHref(unref(head.props.href)),
    ),
    resolvedRel: computed(
      () =>
        unref(head.props.rel) ||
        (unref(head.props.target) === '_blank' ? 'noopener noreferrer' : ''),
    ),
  }
}

function resolveFormSubmit(head: ComponentHead<FormSubmit>): FormSubmit {
  return {
    ...head.props,
  }
}

function resolveFormStatus(head: ComponentHead<FormStatus>): FormStatus {
  return {
    ...head.props,
    toneClass: computed(() => getSemanticToneClass(unref(head.props.tone))),
  }
}
