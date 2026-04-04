import { tryResolveTsSsgContext } from 'packages/ts-common/src/resolveTsSsgContext'
import { type ComponentHead, defineComponent, html, type Ref, ref } from 'regor'
import { registerTabsStyles } from './tabsStyle'

const defaultGroup = 'tabs-default'
let nextAutoTabId = 1

export class Tabs {
  group: string = defaultGroup
  ariaLabel?: string
  selectedTab?: Ref<string>
}

export interface TabPane {
  id?: string
  label?: string
  icon?: string
  disabled?: boolean
  group?: string
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
    <span class="tabs__tab-label">{{ label }}</span></label
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
  const group = props.group ?? defaultGroup
  const tabs = new Tabs()
  const selectedTab = ref(props.selectedTab ?? tabs.selectedTab ?? '')
  return Object.assign(tabs, {
    group,
    ariaLabel: resolveAriaLabel(props.ariaLabel),
    selectedTab,
  })
}

function resolveTabPane(head: ComponentHead<TabPane>): TabPane {
  const icon = resolveText(head.props.icon)
  const fromParent = head.findContext(Tabs)
  const group = fromParent?.group || defaultGroup
  const id = resolveTabId(head.props.id)
  const label = resolveText(head.props.label) || id
  return {
    ...head.props,
    id,
    label,
    icon,
    group,
  }
}

function resolveAriaLabel(value: unknown) {
  const ariaLabel = resolveText(value)
  if (ariaLabel) return ariaLabel
  return 'Tabs'
}

function resolveTabId(id?: string) {
  const fromId = resolveText(id)
  if (fromId) return fromId

  const nextId = `tab-${nextAutoTabId}`
  nextAutoTabId += 1
  return nextId
}

function resolveText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}

function markTabsRuntimeEmbed(head: ComponentHead<Tabs>) {
  tryResolveTsSsgContext(head)?.recordRuntimeEmbed('tabs', 'head')
}
