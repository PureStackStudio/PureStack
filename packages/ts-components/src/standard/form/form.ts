import {
  getSemanticToneSurfaceClass,
  getSemanticToneTextClass,
  type SemanticTone,
} from '@purestack/ts-style'
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
}

export interface FormMeta {}

export interface FormCheck {
  label?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  name?: RefOrValue<string>
  value?: RefOrValue<string>
  checked?: RefOrValue<boolean>
  toneClass?: ComputedRef<string>
}

export interface FormAssistLink {
  href?: RefOrValue<string>
  label?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  target?: RefOrValue<string>
  rel?: RefOrValue<string>
  normalizedHref?: ComputedRef<string | undefined>
  resolvedRel?: ComputedRef<string | undefined>
  toneClass?: ComputedRef<string>
}

export interface FormSubmit {
  label?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  resolvedTone?: ComputedRef<SemanticTone>
}

export interface FormDivider {
  label?: RefOrValue<string>
}

export interface FormStatus {
  tone?: RefOrValue<SemanticTone>
  hidden?: RefOrValue<boolean>
  rootClass?: ComputedRef<string>
}

export class FormToneContext {
  tone?: RefOrValue<SemanticTone>
}

const appFormTemplate = html`<form class="form-block" :action="action" :method="method" novalidate>
  <slot></slot>
</form>`

const formMetaTemplate = html`<div class="form-block__meta"><slot></slot></div>`

const formCheckTemplate = html`<label class="form-block__check" :class="toneClass">
  <input type="checkbox" :name="name" :value="value" :checked="checked"/>
  <span>{{ label }}</span>
</label>`

const formAssistLinkTemplate = html`<a
  class="form-block__assist-link"
  :class="toneClass"
  :href="normalizedHref"
  r-if="normalizedHref"
  :target="target"
  :rel="resolvedRel"
>
  {{ label }}
</a>`

const formSubmitTemplate = html`<Btn type="submit" :tone="resolvedTone">{{ label }}</Btn>`

const formDividerTemplate = html`<div class="form-block__divider" :data-label="label"></div>`

const formStatusTemplate = html`<div
  class="form-status"
  :class="rootClass"
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
    props: ['label', 'tone', 'name', 'value', 'checked'],
    context: (head) => resolveFormCheck(head),
  })
}

function defineFormAssistLinkComponent() {
  return defineComponent<FormAssistLink>(formAssistLinkTemplate, {
    props: ['href', 'label', 'tone', 'target', 'rel'],
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
  const form = new FormToneContext()
  return Object.assign(form, props)
}

function resolveFormAssistLink(
  head: ComponentHead<FormAssistLink>,
): FormAssistLink {
  const inheritedTone = head.findContext(FormToneContext)?.tone
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
    toneClass: computed(() =>
      getSemanticToneTextClass(unref(head.props.tone) || unref(inheritedTone)),
    ),
  }
}

function resolveFormCheck(head: ComponentHead<FormCheck>): FormCheck {
  const inheritedTone = head.findContext(FormToneContext)?.tone
  return {
    ...head.props,
    toneClass: computed(() =>
      getSemanticToneTextClass(unref(head.props.tone) || unref(inheritedTone)),
    ),
  }
}

function resolveFormSubmit(head: ComponentHead<FormSubmit>): FormSubmit {
  const inheritedTone = head.findContext(FormToneContext)?.tone
  return {
    ...head.props,
    resolvedTone: computed(
      () =>
        (unref(head.props.tone) ||
          unref(inheritedTone) ||
          'accent') as SemanticTone,
    ),
  }
}

function resolveFormStatus(head: ComponentHead<FormStatus>): FormStatus {
  const inheritedTone = head.findContext(FormToneContext)?.tone
  return {
    ...head.props,
    rootClass: computed(() =>
      getSemanticToneSurfaceClass(
        unref(head.props.tone) || unref(inheritedTone),
      ),
    ),
  }
}
