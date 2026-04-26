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
  open?: RefOrValue<boolean>
  classes?: ComputedRef<string>
  summaryClasses?: ComputedRef<string>
}

const expandablePanelTemplate = html`<details class="expandable-panel gap-0" :class="classes" :open="open">
  <Flex
    container="summary"
    align="center"
    class="expandable-panel__summary cursor-pointer pad-4"
    :class="summaryClasses"
  >
    <slot name="summary">
      <IconFrame
        :name="icon"
        r-if="icon"
        :variant="summaryVariant"
        variantMode="stateless"/>
      <Flex align="center" wrap="true" class="flex-1 gap-2">
        <span class="fw-700 min-w-0 lh-0" r-if="title">{{ title }}</span>
        <Badge :tone="tone" r-if="badge">{{ badge }}</Badge>
        <span class="fs-sm w-full lh-0" r-if="description">
          {{ description }}
        </span>
      </Flex>
      <Flex align="center" justify="center" class="flex-none">
        <span class="fw-600" r-if="meta"> {{ meta }} </span>
        <IconFrame
          class="expandable-panel__chevron rounded-pill"
          name="iconoir:nav-arrow-down"
          :variant="summaryVariant"
          variantMode="stateless"/>
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
