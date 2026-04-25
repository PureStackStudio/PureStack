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

export interface Badge {
  class?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  classes?: ComputedRef<string>
}

const badgeTemplate = html`<span class="badge" :class="classes">
  <slot></slot>
</span>`

function defineBadgeComponent() {
  return defineComponent<Badge>(badgeTemplate, {
    props: ['tone', 'variant', 'class'],
    context: (head) => ({
      ...head.props,
      classes: computed(() =>
        resolveComponentClasses(head.props, {
          defaultVariant: 'surface',
          defaultVariantMode: 'stateless',
        }),
      ),
    }),
  })
}

export function defineBadgeComponents() {
  return {
    badge: defineBadgeComponent(),
  }
}
