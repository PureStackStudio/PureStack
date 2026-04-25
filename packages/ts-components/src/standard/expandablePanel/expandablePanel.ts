import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
} from 'regor'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'

export interface ExpandablePanel {
  title?: RefOrValue<string>
  description?: RefOrValue<string>
  meta?: RefOrValue<string>
  badge?: RefOrValue<string>
  icon?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  summaryVariant?: RefOrValue<ComponentVariant>
  class?: RefOrValue<string>
  open?: RefOrValue<boolean>
  classes?: ComputedRef<string>
  summaryClasses?: ComputedRef<string>
}

const expandablePanelTemplate = html`<details class="expandable-panel" :class="classes" :open="open">
  <summary class="expandable-panel__summary" :class="summaryClasses">
    <slot name="summary">
      <Icon
        class="expandable-panel__icon tone-icon"
        :name="icon"
        r-if="icon"
        :framed="true"/>
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
    props: [
      'title',
      'description',
      'meta',
      'badge',
      'icon',
      'tone',
      'variant',
      'summaryVariant',
      'class',
      'open',
    ],
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
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'surface',
        defaultVariantMode: 'stateless',
      }),
    ),
    summaryClasses: computed(() =>
      resolveComponentClasses(
        {
          tone: props.tone,
          variant: props.summaryVariant,
        },
        {
          defaultVariant: 'surface',
          defaultVariantMode: 'stateful',
        },
      ),
    ),
  }
}
