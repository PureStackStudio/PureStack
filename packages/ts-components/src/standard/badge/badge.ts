import {
  getSemanticToneBorderClass,
  getSemanticToneSurfaceClass,
  getSemanticToneTextClass,
  resolveSemanticTone,
} from '@purestack/ts-style'
import { defineComponent, html } from 'regor'
import { registerBadgeStyles } from './badgeStyle'

export interface Badge {
  tone?: string
  toneClass?: string
}

const badgeTemplate = html`<span class="badge" :class="toneClass">
  <slot></slot>
</span>`

function createBadgeComponent() {
  return defineComponent<Badge>(badgeTemplate, {
    props: ['tone'],
    context: (head) => ({
      tone: head.props.tone,
      toneClass: resolveBadgeToneClass(head.props.tone),
    }),
  })
}

export function createBadgeComponents() {
  registerBadgeStyles()
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
