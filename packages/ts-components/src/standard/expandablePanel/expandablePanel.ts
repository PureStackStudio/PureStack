import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
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
  toneClass?: ComputedRef<string>
}

const expandablePanelTemplate = html`<details class="expandable-panel tone-surface" :class="toneClass" :open="open">
  <summary class="expandable-panel__summary tone-surface-interactive">
    <slot name="summary">
      <Icon
        class="expandable-panel__icon tone-icon"
        :name="icon"
        r-if="icon"
        :wrap="true"/>
      <span class="expandable-panel__header">
        <span class="expandable-panel__title" r-if="title">{{ title }}</span>
        <Badge :tone="tone" r-if="badge">{{ badge }}</Badge>
        <span class="expandable-panel__description" r-if="description">
          {{ description }}
        </span>
      </span>
      <span class="expandable-panel__header-side">
        <span class="expandable-panel__header-meta" r-if="meta">
          {{ meta }}
        </span>
        <span class="expandable-panel__chevron tone-icon" aria-hidden="true">
          <Icon
            class="expandable-panel__chevron-icon"
            name="iconoir:nav-arrow-down"/>
        </span>
      </span>
    </slot>
  </summary>
  <div class="expandable-panel__body"><slot></slot></div>
</details>`

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
    toneClass: computed(() => getSemanticToneClass(unref(props.tone))),
  }
}
