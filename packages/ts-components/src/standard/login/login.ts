import { urlNormalizer } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'

export interface LoginHeader {
  badge?: string
  title?: string
  description?: string
}

export interface LoginProvider {
  label?: string
}

export interface LoginFooter {
  text?: string
  linkLabel?: string
  linkHref?: string
}

const loginPanelTemplate = html`<section class="login-panel">
  <div class="login-panel__shell">
    <slot name="header"></slot>
    <slot name="form"></slot>
    <slot name="divider"></slot>
    <div class="login-panel__providers">
      <slot name="providers"></slot>
    </div>
    <slot name="footer"></slot>
  </div>
</section>`

const loginHeaderTemplate = html`<header class="login-panel__header">
  <p class="login-panel__badge" r-if="badge">{{ badge }}</p>
  <h1 class="login-panel__title">{{ title }}</h1>
  <p class="login-panel__description" r-if="description">{{ description }}</p>
</header>`

const loginProviderTemplate = html`<Btn tone="neutral" type="button">
  {{ label }}
</Btn>`

const loginFooterTemplate = html`<p class="login-panel__footer">
  <span>{{ text }}</span>
  <a :href="linkHref" r-if="linkHref">{{ linkLabel }}</a>
</p>`

function createLoginPanelComponent() {
  return defineComponent<Record<string, never>>(loginPanelTemplate, {})
}

function createLoginHeaderComponent() {
  return defineComponent<LoginHeader>(loginHeaderTemplate, {
    props: ['badge', 'title', 'description'],
    context: (head) => resolveLoginHeader(head.props),
  })
}

function createLoginProviderComponent() {
  return defineComponent<LoginProvider>(loginProviderTemplate, {
    props: ['label'],
    context: (head) => ({
      label: head.props.label,
    }),
  })
}

function createLoginFooterComponent() {
  return defineComponent<LoginFooter>(loginFooterTemplate, {
    props: ['text', 'linkLabel', 'linkHref'],
    context: (head) => resolveLoginFooter(head.props),
  })
}

export function defineLoginComponents() {
  return {
    loginPanel: createLoginPanelComponent(),
    loginHeader: createLoginHeaderComponent(),
    loginProvider: createLoginProviderComponent(),
    loginFooter: createLoginFooterComponent(),
  }
}

function resolveLoginHeader(props: LoginHeader): LoginHeader {
  return {
    badge: props.badge,
    title: props.title,
    description: props.description,
  }
}

function resolveLoginFooter(props: LoginFooter): LoginFooter {
  const linkHref = urlNormalizer.normalizeHref(props.linkHref)
  return {
    text: props.text,
    linkLabel: props.linkLabel,
    linkHref,
  }
}
