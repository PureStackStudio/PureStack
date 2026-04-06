import { tryResolveTsSsgContext } from 'packages/ts-common/src/resolveTsSsgContext'
import {
  type ComponentHead,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'
import { registerTabsStyles } from './tabsStyle'

const defaultGroup = 'tabs-default'
let nextAutoGroupId = 1
let nextAutoTabId = 1

export class Tabs {
  group: string = defaultGroup
  ariaLabel?: RefOrValue<string>
  selectedTab?: RefOrValue<string>
}

export interface TabPane {
  id?: string
  label?: RefOrValue<string>
  icon?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  group?: string
}

const tabsTemplate = html`<section class="tabs">
  <slot name="header"></slot>
  <div class="tabs__list" role="tablist" :aria-label="ariaLabel || 'Tabs'">
    <slot></slot>
  </div>
</section>`

const tabPaneTemplate = html`<div class="tabs__item">
  <input
    class="tabs__control"
    type="radio"
    :name="group"
    :id="id"
    :value="id"
    r-model="selectedTab"
    :disabled="disabled"
  />
  <label
    class="tabs__tab"
    :class="{ 'tabs__tab--disabled': disabled }"
    role="tab"
    :id="id+'-label'"
    :for="id"
    :aria-controls="id+'-panel'"
    :aria-selected="selectedTab === id"
    :aria-disabled="disabled"
    ><Icon class="tabs__tab-icon" :name="icon" />
    <span class="tabs__tab-label">{{ label || id }}</span></label
  >
  <section
    class="tabs__panel"
    role="tabpanel"
    :id="id+'-panel'"
    :aria-labelledby="id+'-label'"
  >
    <div class="tabs__panel-body">
      <slot></slot>
    </div>
  </section>
</div>`

function createTabsComponent() {
  return defineComponent<Tabs>(tabsTemplate, {
    props: ['ariaLabel', 'group', 'selectedTab'],
    context: (head) => {
      markTabsRuntimeEmbed(head)
      return resolveTabs(head.props)
    },
  })
}

function createTabPaneComponent() {
  return defineComponent<TabPane>(tabPaneTemplate, {
    props: ['id', 'label', 'icon', 'disabled', 'group'],
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
  const group = resolveTabGroup(unref(props.group))
  const tabs = new Tabs()
  return Object.assign(tabs, {
    ...props,
    group,
  })
}

function resolveTabGroup(group: string) {
  group = group?.trim?.()
  if (group) return group

  const nextGroup = `${defaultGroup}-${nextAutoGroupId}`
  nextAutoGroupId += 1
  return nextGroup
}

function resolveTabPane(head: ComponentHead<TabPane>): TabPane {
  const fromParent = head.findContext(Tabs)
  const group = head.props.group || fromParent?.group || defaultGroup
  const id = resolveTabId(unref(head.props.id))
  return {
    ...head.props,
    id,
    group,
  }
}

function resolveTabId(id?: string) {
  id = unref(id)?.trim?.()
  if (id) return id.trim()

  const nextId = `tab-${nextAutoTabId}`
  nextAutoTabId += 1
  return nextId
}

function markTabsRuntimeEmbed(head: ComponentHead<Tabs>) {
  tryResolveTsSsgContext(head)?.recordRuntimeEmbed('tabs', 'head')
}
