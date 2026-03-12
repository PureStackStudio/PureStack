import { urlNormalizer } from '@purestack/ts-util'
import { defineComponent, html } from 'regor'
import { registerLoginStyles } from './loginStyle'

interface LoginHeaderContext {
  badge?: string
  title?: string
  description?: string
  hasBadge?: boolean
  hasDescription?: boolean
}

interface LoginProviderContext {
  label?: string
}

interface LoginFooterContext {
  text?: string
  linkLabel?: string
  linkHref?: string
  hasLink?: boolean
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
  <p class="login-panel__badge" r-if="hasBadge">{{ badge }}</p>
  <h1 class="login-panel__title">{{ title }}</h1>
  <p class="login-panel__description" r-if="hasDescription">{{ description }}</p>
</header>`

const loginProviderTemplate = html`<Btn variant="secondary" type="button">
  {{ label }}
</Btn>`

const loginFooterTemplate = html`<p class="login-panel__footer">
  <span>{{ text }}</span>
  <a :href="linkHref" r-if="hasLink">{{ linkLabel }}</a>
</p>`

function createLoginPanelComponent() {
  return defineComponent<Record<string, never>>(loginPanelTemplate, {})
}

function createLoginHeaderComponent() {
  return defineComponent<LoginHeaderContext>(loginHeaderTemplate, {
    props: ['badge', 'title', 'description'],
    context: (head) => resolveLoginHeaderContext(head.props),
  })
}

function createLoginProviderComponent() {
  return defineComponent<LoginProviderContext>(loginProviderTemplate, {
    props: ['label'],
    context: (head) => ({
      label: head.props.label,
    }),
  })
}

function createLoginFooterComponent() {
  return defineComponent<LoginFooterContext>(loginFooterTemplate, {
    props: ['text', 'linkLabel', 'linkHref'],
    context: (head) => resolveLoginFooterContext(head.props),
  })
}

export function createLoginComponents() {
  registerLoginStyles()
  return {
    loginPanel: createLoginPanelComponent(),
    loginHeader: createLoginHeaderComponent(),
    loginProvider: createLoginProviderComponent(),
    loginFooter: createLoginFooterComponent(),
  }
}

function resolveLoginHeaderContext(
  props: LoginHeaderContext,
): LoginHeaderContext {
  return {
    badge: props.badge,
    title: props.title,
    description: props.description,
    hasBadge: Boolean(props.badge),
    hasDescription: Boolean(props.description),
  }
}

function resolveLoginFooterContext(
  props: LoginFooterContext,
): LoginFooterContext {
  const linkHref = urlNormalizer.normalizeHref(props.linkHref)
  return {
    text: props.text,
    linkLabel: props.linkLabel,
    linkHref,
    hasLink: Boolean(linkHref),
  }
}
