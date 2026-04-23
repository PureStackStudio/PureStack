import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export interface Badge {
  class?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  toneClass?: ComputedRef<string>
}

const badgeTemplate = html`<span class="badge tone-button" :class="[class, toneClass]">
  <slot></slot>
</span>`

function defineBadgeComponent() {
  return defineComponent<Badge>(badgeTemplate, {
    props: ['tone', 'class'],
    context: (head) => ({
      ...head.props,
      tone: head.props.tone,
      toneClass: computed(() => getSemanticToneClass(unref(head.props.tone))),
    }),
  })
}

export function defineBadgeComponents() {
  return {
    badge: defineBadgeComponent(),
  }
}
