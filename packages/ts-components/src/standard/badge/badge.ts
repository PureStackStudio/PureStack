import {
  getSemanticToneBorderClass,
  getSemanticToneSurfaceClass,
  getSemanticToneTextClass,
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

const badgeTemplate = html`<span class="badge" :class="toneClass">
  <slot></slot>
</span>`

function createBadgeComponent() {
  return defineComponent<Badge>(badgeTemplate, {
    props: ['tone'],
    context: (head) => ({
      tone: head.props.tone,
      toneClass: computed(() => resolveBadgeToneClass(unref(head.props.tone))),
    }),
  })
}

export function createBadgeComponents() {
  return {
    badge: createBadgeComponent(),
  }
}

function resolveBadgeToneClass(value: string | undefined) {
  const tone = resolveSemanticTone(value, 'neutral')
  return [
    getSemanticToneSurfaceClass(tone),
    getSemanticToneBorderClass(tone),
    getSemanticToneTextClass(tone),
  ].join(' ')
}
