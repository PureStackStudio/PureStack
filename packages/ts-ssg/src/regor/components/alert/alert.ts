import { defineComponent, html } from 'regor'

import { getSvgIcon } from '../../../style/icons'
import { registerAlertStyles } from './alertStyle'

interface AlertBoxProps {
  title?: string
  eyebrow?: string
  badge?: string
  meta?: string
  tone?: string
  variant?: string
  icon?: string
  compact?: unknown
  inline?: unknown
  role?: string
  live?: string
}

interface AlertBoxContext extends AlertBoxProps {
  rootClass: string
  role: string
  live: string
  iconSvg: string
  hasTitle: boolean
  hasEyebrow: boolean
  hasBadge: boolean
  hasMeta: boolean
  hasIcon: boolean
  hasHeader: boolean
  hasLive: boolean
}

const alertBoxTemplate = html`<aside
  class="alert"
  :class="rootClass"
  :role="role"
  :aria-live="hasLive ? live : null"
>
  <div class="alert__icon" r-if="hasIcon" r-html="iconSvg"></div>
  <div class="alert__content">
    <div class="alert__header" r-if="hasHeader">
      <p class="alert__eyebrow" r-if="hasEyebrow">{{ eyebrow }}</p>
      <h3 class="alert__title" r-if="hasTitle">{{ title }}</h3>
      <span class="alert__badge" r-if="hasBadge">{{ badge }}</span>
    </div>
    <div class="alert__body"><slot></slot></div>
    <div class="alert__actions"><slot name="actions"></slot></div>
    <p class="alert__meta" r-if="hasMeta">{{ meta }}</p>
  </div>
</aside>`

function createAlertBoxComponent() {
  return defineComponent<AlertBoxContext>(alertBoxTemplate, {
    props: [
      'title',
      'eyebrow',
      'badge',
      'meta',
      'tone',
      'variant',
      'icon',
      'compact',
      'inline',
      'role',
      'live',
    ],
    context: (head) => resolveAlertBoxContext(head.props),
  })
}

export function createAlertComponents() {
  registerAlertStyles()
  return {
    alertBox: createAlertBoxComponent(),
  }
}

function resolveAlertBoxContext(props: AlertBoxProps): AlertBoxContext {
  const tone = resolveTone(props.tone)
  const variant = resolveVariant(props.variant)
  const iconName = resolveIconName(props.icon, tone)
  const role = resolveRole(props.role, tone)
  const live = resolveLive(props.live)
  const hasLive = live.length > 0
  const hasIcon = iconName.length > 0

  return {
    ...props,
    role,
    live,
    hasLive,
    iconSvg: hasIcon ? getSvgIcon(iconName, 'support') : '',
    hasTitle: Boolean(props.title),
    hasEyebrow: Boolean(props.eyebrow),
    hasBadge: Boolean(props.badge),
    hasMeta: Boolean(props.meta),
    hasIcon,
    hasHeader: Boolean(props.title || props.eyebrow || props.badge),
    rootClass: [
      `alert--tone-${tone}`,
      `alert--${variant}`,
      props.compact ? 'alert--compact' : '',
      props.inline ? 'alert--inline' : '',
    ]
      .filter(Boolean)
      .join(' '),
  }
}

function resolveTone(value?: string) {
  const normalized = value?.toLowerCase() || ''
  if (
    normalized === 'info' ||
    normalized === 'success' ||
    normalized === 'warning' ||
    normalized === 'danger' ||
    normalized === 'accent' ||
    normalized === 'neutral'
  ) {
    return normalized
  }
  return 'info'
}

function resolveVariant(value?: string) {
  const normalized = value?.toLowerCase() || ''
  if (
    normalized === 'soft' ||
    normalized === 'outline' ||
    normalized === 'feature'
  ) {
    return normalized
  }
  return 'soft'
}

function resolveRole(value?: string, tone?: string) {
  const normalized = value?.toLowerCase() || ''
  if (
    normalized === 'alert' ||
    normalized === 'status' ||
    normalized === 'note'
  ) {
    return normalized
  }
  if (tone === 'danger' || tone === 'warning') return 'alert'
  return 'status'
}

function resolveLive(value?: string) {
  const normalized = value?.toLowerCase() || ''
  if (
    normalized === 'off' ||
    normalized === 'polite' ||
    normalized === 'assertive'
  ) {
    return normalized
  }
  return ''
}

function resolveIconName(value?: string, tone?: string) {
  const normalized = value?.toLowerCase() ?? ''
  if (normalized === 'none' || normalized === 'off' || normalized === 'false') {
    return ''
  }
  if (normalized) return normalized
  if (tone === 'success') return 'check'
  if (tone === 'warning') return 'clock'
  if (tone === 'danger') return 'shield'
  if (tone === 'accent') return 'rocket'
  if (tone === 'neutral') return 'stack'
  return 'support'
}
