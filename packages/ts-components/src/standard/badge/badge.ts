import {
  getSemanticToneButtonClass,
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

export interface Badge {
  tone?: RefOrValue<SemanticTone>
  toneClass?: ComputedRef<string>
}

const badgeTemplate = html`<span class="badge" :class="toneClass">
  <slot></slot>
</span>`

function defineBadgeComponent() {
  return defineComponent<Badge>(badgeTemplate, {
    props: ['tone'],
    context: (head) => ({
      tone: head.props.tone,
      toneClass: computed(() =>
        getSemanticToneButtonClass(unref(head.props.tone)),
      ),
    }),
  })
}

export function defineBadgeComponents() {
  return {
    badge: defineBadgeComponent(),
  }
}
