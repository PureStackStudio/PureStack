import { tryResolveTsSsgContext } from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  isRef,
  type RefOrValue,
  ref,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'

const defaultGroup = 'tabs-default'
let nextAutoGroupId = 1
let nextAutoTabId = 1

export class Tabs {
  class?: RefOrValue<string>
  group: string = defaultGroup
  ariaLabel?: RefOrValue<string>
  selectedTab?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  tabVariant?: RefOrValue<ComponentVariant>
  classes?: ComputedRef<string>
}

export interface TabPane {
  id?: string
  label?: RefOrValue<string>
  icon?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  group?: string
  class?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  tabVariant?: RefOrValue<ComponentVariant>
  classes?: ComputedRef<string>
  tabClasses?: ComputedRef<string>
}

const tabsTemplate = html`<section class="tabs" :class="classes">
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
    :disabled="disabled"/>
  <label
    class="tabs__tab"
    :class="tabClasses"
    role="tab"
    :id="id+'-label'"
    :for="id"
    :aria-controls="id+'-panel'"
    :aria-selected="selectedTab === id"
    :aria-disabled="disabled"
  >
    <Icon class="tabs__tab-icon" :name="icon"/>
    <span class="tabs__tab-label">{{ label || id }}</span>
  </label>
  <section
    class="tabs__panel"
    :class="classes"
    role="tabpanel"
    :id="id+'-panel'"
    :aria-labelledby="id+'-label'"
  >
    <div class="tabs__panel-body" :class="class">
      <slot></slot>
    </div>
  </section>
</div>`

function defineTabsComponent() {
  return defineComponent<Tabs>(tabsTemplate, {
    props: [
      'class',
      'ariaLabel',
      'group',
      'selectedTab',
      'tone',
      'variant',
      'tabVariant',
    ],
    context: (head) => {
      markTabsRuntimeEmbed(head)
      return resolveTabs(head.props)
    },
  })
}

function defineTabPaneComponent() {
  return defineComponent<TabPane>(tabPaneTemplate, {
    props: [
      'id',
      'class',
      'label',
      'icon',
      'disabled',
      'group',
      'tone',
      'variant',
      'tabVariant',
    ],
    context: (head) => resolveTabPane(head),
  })
}

export function defineTabsComponents() {
  return {
    tabs: defineTabsComponent(),
    tabPane: defineTabPaneComponent(),
  }
}

function resolveTabs(props: Tabs): Tabs {
  const group = resolveTabGroup(unref(props.group))
  const tabs = new Tabs()
  const selectedTab = ensureSelectedTabIsRef(props.selectedTab)
  return Object.assign(tabs, {
    ...props,
    group,
    selectedTab,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'surface',
      }),
    ),
  })
}

function ensureSelectedTabIsRef(selectedTab?: RefOrValue<string>) {
  return isRef(selectedTab) ? selectedTab : ref(selectedTab)
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
  const tone = head.props.tone || fromParent?.tone
  const tabVariant = head.props.tabVariant || fromParent?.tabVariant
  return {
    ...head.props,
    id,
    group,
    tone,
    tabVariant,
    classes: computed(() =>
      resolveComponentClasses(
        { tone, variant: head.props.variant },
        {
          defaultVariant: 'none',
        },
      ),
    ),
    tabClasses: computed(() =>
      resolveComponentClasses(
        { tone, variant: tabVariant },
        {
          defaultVariant: 'underline',
          classes: [unref(head.props.disabled) ? 'tabs__tab--disabled' : ''],
        },
      ),
    ),
  }
}

function resolveTabId(id?: string) {
  id = id?.trim?.()
  if (id) return id.trim()

  const nextId = `tab-${nextAutoTabId}`
  nextAutoTabId += 1
  return nextId
}

function markTabsRuntimeEmbed(head: ComponentHead<Tabs>) {
  tryResolveTsSsgContext(head)?.recordRuntimeEmbed('tabs', 'head')
}
