import { defineComponent, html } from 'regor'

import { registerExpandablePanelStyles } from './expandablePanelStyle'

export interface ExpandablePanel {
  title?: string
  description?: string
  meta?: string
  badge?: string
  icon?: string
  tone?: string
  open?: boolean | string
  rootClass?: string
  hasTitle?: boolean
  hasDescription?: boolean
  hasMeta?: boolean
  hasBadge?: boolean
  hasIcon?: boolean
  isOpen?: boolean
  iconName?: string
}

const expandablePanelTemplate = html`<details
  class="expandable-panel"
  :class="rootClass"
  :open="isOpen ? true : null"
>
  <summary class="expandable-panel__summary">
    <span class="expandable-panel__icon-wrap" r-if="hasIcon">
      <Icon class="expandable-panel__icon" :name="iconName" />
    </span>
    <span class="expandable-panel__summary-copy">
      <span class="expandable-panel__title" r-if="hasTitle">{{ title }}</span>
      <span class="expandable-panel__badge" r-if="hasBadge">{{ badge }}</span>
      <span class="expandable-panel__description" r-if="hasDescription">{{ description }}</span>
    </span>
    <span class="expandable-panel__summary-side">
      <span class="expandable-panel__summary-meta" r-if="hasMeta">{{ meta }}</span>
      <slot name="summary"></slot>
      <span class="expandable-panel__chevron" aria-hidden="true">
        <Icon
          class="expandable-panel__chevron-icon"
          name="iconoir:nav-arrow-down"
        />
      </span>
    </span>
  </summary>
  <div class="expandable-panel__body"><slot></slot></div>
</details>`

function createExpandablePanelComponent() {
  return defineComponent<ExpandablePanel>(expandablePanelTemplate, {
    props: [
      'title',
      'description',
      'meta',
      'badge',
      'icon',
      'tone',
      'open',
    ],
    context: (head) => resolveExpandablePanel(head.props),
  })
}

export function createExpandablePanelComponents() {
  registerExpandablePanelStyles()
  return {
    expandablePanel: createExpandablePanelComponent(),
  }
}

function resolveExpandablePanel(props: ExpandablePanel): ExpandablePanel {
  const title = resolveText(props.title) || 'Expandable panel'
  const description = resolveText(props.description)
  const meta = resolveText(props.meta)
  const badge = resolveText(props.badge)
  const iconName = resolveText(props.icon)
  const tone = resolveTone(props.tone)
  const isOpen = resolveBoolean(props.open)

  return {
    ...props,
    title,
    description,
    meta,
    badge,
    iconName,
    isOpen,
    hasTitle: Boolean(title),
    hasDescription: Boolean(description),
    hasMeta: Boolean(meta),
    hasBadge: Boolean(badge),
    hasIcon: Boolean(iconName),
    rootClass: `expandable-panel--tone-${tone}`,
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
  return 'neutral'
}

function resolveBoolean(value: unknown) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized === 'true' || normalized === '1' || normalized === 'yes'
  }
  return false
}

function resolveText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}
