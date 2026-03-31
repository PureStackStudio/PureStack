import {
  getSemanticToneIconClass,
  getSemanticToneSurfaceClass,
  resolveSemanticTone,
} from '@purestack/ts-style'
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
  isOpen?: boolean
  iconName?: string
  iconToneClass?: string
  chevronToneClass?: string
}

const expandablePanelTemplate = html`<details
  class="expandable-panel"
  :class="rootClass"
  :open="isOpen ? true : null"
>
  <summary class="expandable-panel__summary">
    <span class="expandable-panel__icon-wrap" :class="iconToneClass" r-if="iconName">
      <Icon class="expandable-panel__icon" :name="iconName" />
    </span>
    <span class="expandable-panel__header">
      <span class="expandable-panel__title" r-if="title">{{ title }}</span>
      <span class="expandable-panel__badge" r-if="badge">{{ badge }}</span>
      <span class="expandable-panel__description" r-if="description">{{ description }}</span>
    </span>
    <span class="expandable-panel__header-side">
      <span class="expandable-panel__header-meta" r-if="meta">{{ meta }}</span>
      <slot name="summary"></slot>
      <span
        class="expandable-panel__chevron"
        :class="chevronToneClass"
        aria-hidden="true"
      >
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
    props: ['title', 'description', 'meta', 'badge', 'icon', 'tone', 'open'],
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
  const tone = resolveSemanticTone(props.tone)
  const isOpen = resolveBoolean(props.open)

  return {
    ...props,
    title,
    description,
    meta,
    badge,
    iconName,
    isOpen,
    rootClass: getSemanticToneSurfaceClass(tone),
    iconToneClass: getSemanticToneIconClass(tone),
    chevronToneClass: getSemanticToneIconClass(tone),
  }
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
