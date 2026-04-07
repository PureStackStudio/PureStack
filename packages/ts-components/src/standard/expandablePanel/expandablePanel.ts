import {
  getSemanticToneIconClass,
  getSemanticToneSurfaceClass,
  resolveSemanticTone,
} from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

import { registerExpandablePanelStyles } from './expandablePanelStyle'

export interface ExpandablePanel {
  title?: RefOrValue<string>
  description?: RefOrValue<string>
  meta?: RefOrValue<string>
  badge?: RefOrValue<string>
  icon?: RefOrValue<string>
  tone?: RefOrValue<string>
  open?: RefOrValue<boolean>
  rootClass?: ComputedRef<string>
  iconToneClass?: ComputedRef<string>
  chevronToneClass?: ComputedRef<string>
}

const expandablePanelTemplate = html`<details
  class="expandable-panel"
  :class="rootClass"
  :open="open"
>
  <summary class="expandable-panel__summary">
    <slot name="summary">
      <Icon class="expandable-panel__icon" :name="icon" r-if="icon" :wrap="true"/>
      <span class="expandable-panel__header">
        <span class="expandable-panel__title" r-if="title">{{ title }}</span>
        <span class="expandable-panel__badge" r-if="badge">{{ badge }}</span>
        <span class="expandable-panel__description" r-if="description">{{ description }}</span>
      </span>
      <span class="expandable-panel__header-side">
        <span class="expandable-panel__header-meta" r-if="meta">{{ meta }}</span>
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
    </slot>
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
  return {
    ...props,
    rootClass: computed(() =>
      getSemanticToneSurfaceClass(resolveSemanticTone(unref(props.tone))),
    ),
    iconToneClass: computed(() =>
      getSemanticToneIconClass(resolveSemanticTone(unref(props.tone))),
    ),
    chevronToneClass: computed(() =>
      getSemanticToneIconClass(resolveSemanticTone(unref(props.tone))),
    ),
  }
}
