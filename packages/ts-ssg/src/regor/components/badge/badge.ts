import { createComponent, html } from 'regor'
import { registerBadgeStyles } from './badgeStyle'

interface BadgeProps {
  variant?: string
}

interface BadgeContext extends BadgeProps {
  toneClass?: string
}

const badgeTemplate = html`<span class="badge" :class="toneClass">
  <slot></slot>
</span>`

function createBadgeComponent() {
  return createComponent<BadgeContext>(badgeTemplate, {
    props: ['variant'],
    context: (head) => ({
      variant: head.props.variant,
      toneClass: resolveBadgeToneClass(head.props.variant),
    }),
  })
}

export function createBadgeComponents() {
  registerBadgeStyles()
  return {
    badge: createBadgeComponent(),
  }
}

function resolveBadgeToneClass(value: string | undefined) {
  const normalized = value?.trim().toLowerCase()
  if (
    normalized === 'info' ||
    normalized === 'success' ||
    normalized === 'error' ||
    normalized === 'warning'
  ) {
    return `badge--${normalized}`
  }
  return undefined
}
