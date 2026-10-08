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
import { createAutoId } from '../autoId'
import {
  type ComponentVariant,
  type ComponentVariantMode,
  resolveComponentClasses,
} from '../componentVariant'

const defaultGroup = 'tabs-default'
const DEFAULT_TABS_VARIANT_MODE: ComponentVariantMode = 'stateless'
const resolveTabGroup = createAutoId(defaultGroup)
const resolveTabId = createAutoId('tab')

export class Tabs {
  group: string = defaultGroup
  ariaLabel?: RefOrValue<string>
  selectedTab?: RefOrValue<string>
  mobileSelect?: RefOrValue<boolean>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  tabVariant?: RefOrValue<ComponentVariant>
  classes?: ComputedRef<string>
}

export interface TabPane {
  id?: string
  label?: RefOrValue<string>
  icon?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  group?: string
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  tabVariant?: RefOrValue<ComponentVariant>
  classes?: ComputedRef<string>
  tabClasses?: ComputedRef<string>
}

const tabsTemplate = html`<section class="tabs" :class="classes" :data-mobile-select="mobileSelect">
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
      'ariaLabel',
      'group',
      'selectedTab',
      'mobileSelect',
      'tone',
      'variant',
      'variantMode',
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
      'label',
      'icon',
      'disabled',
      'group',
      'tone',
      'variant',
      'variantMode',
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
        defaultVariantMode: DEFAULT_TABS_VARIANT_MODE,
      }),
    ),
  })
}

function ensureSelectedTabIsRef(selectedTab?: RefOrValue<string>) {
  return isRef(selectedTab) ? selectedTab : ref(selectedTab)
}

function resolveTabPane(head: ComponentHead<TabPane>): TabPane {
  const fromParent = head.findContext(Tabs)
  const group = head.props.group || fromParent?.group || defaultGroup
  const id = resolveTabId(unref(head.props.id))
  const tone = head.props.tone || fromParent?.tone
  const variantMode = head.props.variantMode || fromParent?.variantMode
  const tabVariant = head.props.tabVariant || fromParent?.tabVariant
  return {
    ...head.props,
    id,
    group,
    tone,
    variantMode,
    tabVariant,
    classes: computed(() =>
      resolveComponentClasses(
        { tone, variant: head.props.variant, variantMode },
        {
          defaultVariant: 'none',
          defaultVariantMode: DEFAULT_TABS_VARIANT_MODE,
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

function markTabsRuntimeEmbed(head: ComponentHead<Tabs>) {
  tryResolveTsSsgContext(head)?.recordRuntimeEmbed('tabs', 'head')
}
