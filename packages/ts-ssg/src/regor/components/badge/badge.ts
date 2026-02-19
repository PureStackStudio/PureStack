import { createComponent, html } from 'regor'
import { registerBadgeStyles } from './badgeStyle'

interface StatusBadgeProps {
  variant?: string
}

interface StatusBadgeContext extends StatusBadgeProps {
  toneClass?: string
}

const statusBadgeTemplate = html`<span class="status-badge" :class="toneClass">
  <slot></slot>
</span>`

function createStatusBadgeComponent() {
  return createComponent<StatusBadgeContext>(statusBadgeTemplate, {
    props: ['variant'],
    context: (head) => ({
      variant: head.props.variant,
      toneClass: resolveStatusBadgeToneClass(head.props.variant),
    }),
  })
}

export function createBadgeComponents() {
  registerBadgeStyles()
  return {
    statusBadge: createStatusBadgeComponent(),
  }
}

function resolveStatusBadgeToneClass(value: string | undefined) {
  const normalized = value?.trim().toLowerCase()
  if (
    normalized === 'info' ||
    normalized === 'success' ||
    normalized === 'error' ||
    normalized === 'warning'
  ) {
    return `status-badge--${normalized}`
  }
  return undefined
}
