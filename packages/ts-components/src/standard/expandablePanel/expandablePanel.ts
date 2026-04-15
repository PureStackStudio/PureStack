import {
  getSemanticToneIconClass,
  getSemanticToneSurfaceClass,
  type SemanticTone,
} from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export interface ExpandablePanel {
  title?: RefOrValue<string>
  description?: RefOrValue<string>
  meta?: RefOrValue<string>
  badge?: RefOrValue<string>
  icon?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  open?: RefOrValue<boolean>
  rootClass?: ComputedRef<string>
  summaryClass?: ComputedRef<string>
  iconToneClass?: ComputedRef<string>
}

const expandablePanelTemplate = html`
<details class="expandable-panel" :class="rootClass" :open="open">
  <summary class="expandable-panel__summary" :class="summaryClass">
    <slot name="summary">
      <Icon
        class="expandable-panel__icon"
        :name="icon"
        :class="iconToneClass"
        r-if="icon"
        :wrap="true"/>
      <span class="expandable-panel__header">
        <span class="expandable-panel__title" r-if="title">{{ title }}</span>
        <span class="expandable-panel__badge" r-if="badge">{{ badge }}</span>
        <span class="expandable-panel__description" r-if="description">
          {{ description }}
        </span>
      </span>
      <span class="expandable-panel__header-side">
        <span class="expandable-panel__header-meta" r-if="meta">
          {{ meta }}
        </span>
        <span
          class="expandable-panel__chevron"
          :class="iconToneClass"
          aria-hidden="true"
        >
          <Icon
            class="expandable-panel__chevron-icon"
            name="iconoir:nav-arrow-down"/>
        </span>
      </span>
    </slot>
  </summary>
  <div class="expandable-panel__body"><slot></slot></div>
</details>
`

function defineExpandablePanelComponent() {
  return defineComponent<ExpandablePanel>(expandablePanelTemplate, {
    props: ['title', 'description', 'meta', 'badge', 'icon', 'tone', 'open'],
    context: (head) => resolveExpandablePanel(head.props),
  })
}

export function defineExpandablePanelComponents() {
  return {
    expandablePanel: defineExpandablePanelComponent(),
  }
}

function resolveExpandablePanel(props: ExpandablePanel): ExpandablePanel {
  return {
    ...props,
    rootClass: computed(() => getSemanticToneSurfaceClass(unref(props.tone))),
    summaryClass: computed(() =>
      getSemanticToneSurfaceClass(unref(props.tone), 'interactive'),
    ),
    iconToneClass: computed(() => getSemanticToneIconClass(unref(props.tone))),
  }
}
