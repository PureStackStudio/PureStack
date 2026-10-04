import { tryResolveTsSsgContext } from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'
import { defineFormCheckComponent } from './formCheck'

export interface AppForm {
  action?: RefOrValue<string>
  method?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  classes?: ComputedRef<string>
}

export interface FormMeta {}

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
  variant?: RefOrValue<ComponentVariant>
}

export interface FormDivider {
  label?: RefOrValue<string>
}

export interface FormStatus {
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  hidden?: RefOrValue<boolean>
  classes?: ComputedRef<string>
}

const appFormTemplate = html`<form
  class="form-block"
  :class="classes"
  :action="action"
  :method="method"
  novalidate
>
  <slot></slot>
</form>`

const formMetaTemplate = html`<div class="form-block__meta"><slot></slot></div>`

const formAssistLinkTemplate = html`<a
  class="form-block__assist-link"
  :href="normalizedHref"
  r-if="normalizedHref"
  :target="target"
  :rel="resolvedRel"
>
  {{ label }}
</a>`

const formSubmitTemplate = html`<Btn type="submit" :tone="tone" :variant="variant">{{ label }}</Btn>`

const formDividerTemplate = html`<div class="form-block__divider" :data-label="label"></div>`

const formStatusTemplate = html`<div
  class="form-status"
  :class="classes"
  role="status"
  aria-live="polite"
  :hidden="hidden"
>
  <slot></slot>
</div>`

function defineAppFormComponent() {
  return defineComponent<AppForm>(appFormTemplate, {
    props: ['action', 'method', 'tone', 'variant'],
    context: (head) => resolveAppForm(head),
  })
}

function defineFormMetaComponent() {
  return defineComponent<FormMeta>(formMetaTemplate, {})
}

function defineFormAssistLinkComponent() {
  return defineComponent<FormAssistLink>(formAssistLinkTemplate, {
    props: ['href', 'label', 'target', 'rel'],
    context: (head) => resolveFormAssistLink(head),
  })
}

function defineFormSubmitComponent() {
  return defineComponent<FormSubmit>(formSubmitTemplate, {
    props: ['label', 'tone', 'variant'],
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
    props: ['tone', 'variant', 'hidden'],
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

function resolveAppForm(head: ComponentHead<AppForm>): AppForm {
  const props = head.props
  return {
    ...props,
    action: resolvePublicAction(head),
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'none',
      }),
    ),
  }
}

function resolvePublicAction(head: ComponentHead<AppForm>) {
  const action = unref(head.props.action)
  if (!action) return action
  return tryResolveTsSsgContext(head)?.resolvePublicHref(action) ?? action
}

function resolveFormAssistLink(
  head: ComponentHead<FormAssistLink>,
): FormAssistLink {
  return {
    ...head.props,
    normalizedHref: computed(() =>
      resolvePublicHref(toTrimmedHref(unref(head.props.href)), head),
    ),
    resolvedRel: computed(
      () =>
        unref(head.props.rel) ||
        (unref(head.props.target) === '_blank'
          ? 'noopener noreferrer'
          : undefined),
    ),
  }
}

function toTrimmedHref(value: unknown) {
  return typeof value === 'string' ? value.trim() : undefined
}

function resolvePublicHref(
  href: string | undefined,
  head: ComponentHead<FormAssistLink>,
) {
  if (!href) return undefined
  return tryResolveTsSsgContext(head)?.resolvePublicHref(href) ?? href
}

function resolveFormSubmit(head: ComponentHead<FormSubmit>): FormSubmit {
  return {
    ...head.props,
  }
}

function resolveFormStatus(head: ComponentHead<FormStatus>): FormStatus {
  return {
    ...head.props,
    classes: computed(() =>
      resolveComponentClasses(head.props, {
        defaultVariant: 'surface',
      }),
    ),
  }
}
