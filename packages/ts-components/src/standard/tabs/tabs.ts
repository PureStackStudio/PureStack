import { tryResolveTsSsgContext } from 'packages/ts-common/src/resolveTsSsgContext'
import { type ComponentHead, defineComponent, html } from 'regor'
import { registerTabsStyles } from './tabsStyle'

const defaultGroupName = 'tabs-default'

export class Tabs {
  groupName: string = defaultGroupName
  id?: string
  ariaLabel?: string
}

export interface TabPane {
  id?: string
  label?: string
  icon?: string
  active?: boolean
  disabled?: boolean
  group?: string
  inputId?: string
  tabId?: string
  panelId?: string
  groupName?: string
}

const tabsTemplate = html`<section class="tabs">
  <slot name="header"></slot>
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
    :checked="active"
    :disabled="disabled"
  />
  <label
    class="tabs__tab"
    :class="{ 'tabs__tab--disabled': disabled }"
    role="tab"
    :id="tabId"
    :for="inputId"
    :aria-controls="panelId"
    :aria-selected="active ? 'true' : null"
    :aria-disabled="disabled ? 'true' : null"
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
  return defineComponent<Tabs>(tabsTemplate, {
    props: ['id', 'ariaLabel'],
    context: (head) => {
      markTabsRuntimeEmbed(head)
      return resolveTabs(head.props)
    },
  })
}

function createTabPaneComponent() {
  return defineComponent<TabPane>(tabPaneTemplate, {
    props: ['id', 'label', 'icon', 'active', 'disabled', 'group'],
    context: (head) => resolveTabPane(head),
  })
}

export function createTabsComponents() {
  registerTabsStyles()
  return {
    tabs: createTabsComponent(),
    tabPane: createTabPaneComponent(),
  }
}

function resolveTabs(props: Tabs): Tabs {
  const groupName = props.groupName ?? defaultGroupName
  return Object.assign(new Tabs(), {
    groupName,
    ariaLabel: resolveAriaLabel(props.ariaLabel),
  })
}

function resolveTabPane(head: ComponentHead<TabPane>): TabPane {
  const label = resolveText(head.props.label) || 'Tab'
  const icon = resolveText(head.props.icon)
  const fromParent = head.findContext(Tabs)
  const groupName = fromParent?.groupName || defaultGroupName
  const localId = resolveTabLocalId(head.props.id, label)
  return {
    ...head.props,
    label,
    icon,
    inputId: `${groupName}__control-${localId}`,
    tabId: `${groupName}__tab-${localId}`,
    panelId: `${groupName}__panel-${localId}`,
    groupName,
  }
}

function resolveAriaLabel(value: unknown) {
  const ariaLabel = resolveText(value)
  if (ariaLabel) return ariaLabel
  return 'Tabs'
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

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function markTabsRuntimeEmbed(head: ComponentHead<Tabs>) {
  tryResolveTsSsgContext(head)?.recordRuntimeEmbed('tabs', 'head')
}
