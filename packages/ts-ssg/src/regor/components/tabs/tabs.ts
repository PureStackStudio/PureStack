import { type ComponentHead, defineComponent, html } from 'regor'

import { registerTabsStyles } from './tabsStyle'

class TabsScope {
  groupName = 'tabs-default'
}

interface TabsProps {
  id?: string
  title?: string
  ariaLabel?: string
  variant?: string
}

interface TabsContext extends TabsScope {
  title?: string
  hasTitle: boolean
  ariaLabel: string
  variantClass: string
}

interface TabPaneProps {
  id?: string
  label?: string
  active?: boolean
  disabled?: boolean
  group?: string
}

interface TabPaneContext {
  inputId: string
  tabId: string
  panelId: string
  label: string
  groupName: string
  isActive: boolean
  isDisabled: boolean
}

const tabsTemplate = html`<section class="tabs" :class="variantClass">
  <header class="tabs__header" r-if="hasTitle">
    <h2 class="tabs__title">{{ title }}</h2>
  </header>
  <div class="tabs__list" role="tablist" :aria-label="ariaLabel">
    <slot></slot>
  </div>
</section>`

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
    >{{ label }}</label
  >
  <section class="tabs__panel" role="tabpanel" :id="panelId" :aria-labelledby="tabId">
    <div class="tabs__panel-body">
      <slot></slot>
    </div>
  </section>
</div>`

function createTabsComponent() {
  return defineComponent<TabsContext>(tabsTemplate, {
    props: ['id', 'title', 'ariaLabel', 'variant'],
    context: (head) => resolveTabsContext(head.props),
  })
}

function createTabPaneComponent() {
  return defineComponent<TabPaneContext>(tabPaneTemplate, {
    props: ['id', 'label', 'active', 'disabled', 'group'],
    context: (head) => resolveTabPaneContext(head),
  })
}

export function createTabsComponents() {
  registerTabsStyles()
  return {
    tabs: createTabsComponent(),
    tabPane: createTabPaneComponent(),
  }
}

function resolveTabsContext(props: TabsProps): TabsContext {
  const title = resolveText(props.title)
  const groupName = resolveTabsId(props.id, title)
  return Object.assign(new TabsScope(), {
    groupName,
    title,
    hasTitle: Boolean(title),
    ariaLabel: resolveAriaLabel(props.ariaLabel, title),
    variantClass: resolveVariantClass(props.variant),
  })
}

function resolveTabPaneContext(
  head: ComponentHead<TabPaneProps>,
): TabPaneContext {
  const label = resolveText(head.props.label) || 'Tab'
  const fromParent = head.findContext(TabsScope)
  const groupName =
    resolveText(head.props.group) || fromParent?.groupName || 'tabs-default'
  const localId = resolveTabLocalId(head.props.id, label)
  return {
    label,
    inputId: `${groupName}__control-${localId}`,
    tabId: `${groupName}__tab-${localId}`,
    panelId: `${groupName}__panel-${localId}`,
    groupName,
    isActive: resolveBoolean(head.props.active),
    isDisabled: resolveBoolean(head.props.disabled),
  }
}

function resolveAriaLabel(value: unknown, title: string) {
  const ariaLabel = resolveText(value)
  if (ariaLabel) return ariaLabel
  if (title) return title
  return 'Tabs'
}

function resolveVariantClass(value: unknown) {
  const normalized = resolveText(value).toLowerCase()
  if (normalized === 'underline') return 'tabs--underline'
  return 'tabs--pills'
}

function resolveTabsId(value: unknown, title: string) {
  const fromId = toSlug(resolveText(value))
  if (fromId) return `tabs-${fromId}`
  const fromTitle = toSlug(title)
  if (fromTitle) return `tabs-${fromTitle}`
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
