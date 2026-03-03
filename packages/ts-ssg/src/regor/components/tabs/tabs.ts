import { type ComponentHead, defineComponent, html } from 'regor'

import { resolveTsSsgContext } from '../../resolveTsSsgContext'
import { registerTabsStyles } from './tabsStyle'

class TabsScope {
  groupName = 'tabs-default'
}

interface TabsProps {
  id?: string
  ariaLabel?: string
}

interface TabsContext extends TabsScope {
  ariaLabel: string
}

interface TabsHeaderContext {}

interface TabPaneProps {
  id?: string
  label?: string
  icon?: string
  active?: boolean
  disabled?: boolean
  group?: string
}

interface TabPaneContext {
  inputId: string
  tabId: string
  panelId: string
  label: string
  icon: string
  groupName: string
  isActive: boolean
  isDisabled: boolean
}

const tabsTemplate = html`<section class="tabs">
  <slot name="header"></slot>
  <div class="tabs__list" role="tablist" :aria-label="ariaLabel">
    <slot></slot>
  </div>
</section>`

const tabsHeaderTemplate = html`<template name="header">
  <header class="tabs__header"><slot></slot></header>
</template>`

const tabPaneTemplate = html`<div class="tabs__item">
  <input
    class="tabs__control"
    type="radio"
    :name="groupName"
    :id="inputId"
    :checked="isActive"
    :disabled="isDisabled"
  />
  <label
    class="tabs__tab"
    :class="{ 'tabs__tab--disabled': isDisabled }"
    role="tab"
    :id="tabId"
    :for="inputId"
    :aria-controls="panelId"
    :aria-selected="isActive ? 'true' : null"
    :aria-disabled="isDisabled ? 'true' : null"
    ><Icon class="tabs__tab-icon" :name="icon" />
    <span class="tabs__tab-label">{{ label }}</span></label
  >
  <section class="tabs__panel" role="tabpanel" :id="panelId" :aria-labelledby="tabId">
    <div class="tabs__panel-body">
      <slot></slot>
    </div>
  </section>
</div>`

function createTabsComponent() {
  return defineComponent<TabsContext>(tabsTemplate, {
    props: ['id', 'ariaLabel'],
    context: (head) => {
      markTabsRuntimeEmbed(head)
      return resolveTabsContext(head.props)
    },
  })
}

function createTabsHeaderComponent() {
  return defineComponent<TabsHeaderContext>(tabsHeaderTemplate, {})
}

function createTabPaneComponent() {
  return defineComponent<TabPaneContext>(tabPaneTemplate, {
    props: ['id', 'label', 'icon', 'active', 'disabled', 'group'],
    context: (head) => resolveTabPaneContext(head),
  })
}

export function createTabsComponents() {
  registerTabsStyles()
  return {
    tabs: createTabsComponent(),
    tabsHeader: createTabsHeaderComponent(),
    tabPane: createTabPaneComponent(),
  }
}

function resolveTabsContext(props: TabsProps): TabsContext {
  const groupName = resolveTabsId(props.id)
  return Object.assign(new TabsScope(), {
    groupName,
    ariaLabel: resolveAriaLabel(props.ariaLabel),
  })
}

function resolveTabPaneContext(
  head: ComponentHead<TabPaneProps>,
): TabPaneContext {
  const label = resolveText(head.props.label) || 'Tab'
  const icon = resolveText(head.props.icon)
  const fromParent = head.findContext(TabsScope)
  const groupName =
    resolveText(head.props.group) || fromParent?.groupName || 'tabs-default'
  const localId = resolveTabLocalId(head.props.id, label)
  return {
    label,
    icon,
    inputId: `${groupName}__control-${localId}`,
    tabId: `${groupName}__tab-${localId}`,
    panelId: `${groupName}__panel-${localId}`,
    groupName,
    isActive: resolveBoolean(head.props.active),
    isDisabled: resolveBoolean(head.props.disabled),
  }
}

function resolveAriaLabel(value: unknown) {
  const ariaLabel = resolveText(value)
  if (ariaLabel) return ariaLabel
  return 'Tabs'
}

function resolveTabsId(value: unknown) {
  const fromId = toSlug(resolveText(value))
  if (fromId) return `tabs-${fromId}`
  return 'tabs-default'
}

function resolveTabLocalId(value: unknown, label: string) {
  const fromValue = toSlug(resolveText(value))
  if (fromValue) return fromValue
  const fromLabel = toSlug(label)
  if (fromLabel) return fromLabel
  return 'item'
}

function resolveText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}

function resolveBoolean(value: unknown) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase().trim() === 'true'
  return false
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function markTabsRuntimeEmbed(head: ComponentHead<TabsProps>) {
  resolveTsSsgContext(head).recordRuntimeEmbed('tabs', 'head')
}
