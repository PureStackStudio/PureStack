import {
  getSemanticToneButtonClass,
  resolveSemanticTone,
} from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type Ref,
  unref,
} from 'regor'

export interface Badge {
  tone?: Ref<string> | string
  toneClass?: ComputedRef<string>
}

const badgeTemplate = html`
<span class="badge" :class="toneClass">
  <slot></slot>
</span>
`

function defineBadgeComponent() {
  return defineComponent<Badge>(badgeTemplate, {
    props: ['tone'],
    context: (head) => ({
      tone: head.props.tone,
      toneClass: computed(() =>
        getSemanticToneButtonClass(resolveSemanticTone(unref(head.props.tone))),
      ),
    }),
  })
}

export function defineBadgeComponents() {
  return {
    badge: defineBadgeComponent(),
  }
}
