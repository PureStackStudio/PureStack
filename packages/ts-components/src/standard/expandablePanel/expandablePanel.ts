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

const expandablePanelTemplate = html`<details class="expandable-panel gap-0" :class="classes" :open="open">
  <Flex
    container="summary"
    align="center"
    class="expandable-panel__summary pad-4"
    :class="summaryClasses"
  >
    <slot name="summary">
      <Icon class="tone-icon" :name="icon" r-if="icon" :framed="true"/>
      <Flex align="center" wrap="true" class="flex-1">
        <span class="fw-700 min-w-0" r-if="title">{{ title }}</span>
        <Badge :tone="tone" r-if="badge">{{ badge }}</Badge>
        <span class="fs-sm w-full" r-if="description"> {{ description }} </span>
      </Flex>
      <Flex align="center" justify="center" class="flex-none">
        <span class="fw-600" r-if="meta"> {{ meta }} </span>
        <Icon
          class="expandable-panel__chevron rounded-pill b-1 b-subtle tone-icon"
          name="iconoir:nav-arrow-down"
          :framed="true"/>
      </Flex>
    </slot>
  </Flex>
  <div class="expandable-panel__body pad-4 bt-0"><slot></slot></div>
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
