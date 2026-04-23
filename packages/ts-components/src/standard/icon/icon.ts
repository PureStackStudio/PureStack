import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export type GetSvgIcon = (name: string) => string

export interface Icon {
  name?: RefOrValue<string>
  class?: RefOrValue<string>
  ariaLabel?: RefOrValue<string>
  wrap?: RefOrValue<boolean>
  tone?: RefOrValue<SemanticTone>
  svg?: ComputedRef<string>
  ariaHidden?: ComputedRef<boolean>
  role?: ComputedRef<string>
  toneClass?: ComputedRef<string>
}

const iconTemplate = html`<span class="icon-wrap tone-icon" :class="[class, toneClass]" r-if="wrap">
  <span
    class="icon"
    :role="role"
    :aria-label="ariaLabel"
    :aria-hidden="ariaHidden"
    r-if="svg"
    r-html="svg"
  ></span>
</span>
<span
  r-else
  class="icon"
  :class="[class, toneClass]"
  :role="role"
  :aria-label="ariaLabel"
  :aria-hidden="ariaHidden"
  r-if="svg"
  r-html="svg"
></span>`

function defineIconComponent(getSvgIcon: GetSvgIcon) {
  return defineComponent<Icon>(iconTemplate, {
    props: ['name', 'class', 'ariaLabel', 'wrap', 'tone'],
    context: (head) => resolveIcon(head.props, getSvgIcon),
  })
}

export function defineIconComponents(getSvgIcon: GetSvgIcon) {
  return {
    icon: defineIconComponent(getSvgIcon),
  }
}

function resolveIcon(props: Icon, getSvgIcon: GetSvgIcon): Icon {
  const svg = computed(() => {
    const name = unref(props.name)
    return name ? getSvgIcon(name) : ''
  })
  const ariaHidden = computed(() => !unref(props.ariaLabel))
  const role = computed<string>(() => (unref(props.ariaLabel) ? 'img' : ''))
  const toneClass = computed(() => getSemanticToneClass(unref(props.tone)))

  return {
    ...props,
    svg,
    ariaHidden,
    role,
    toneClass,
  }
}
