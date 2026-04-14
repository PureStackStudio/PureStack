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
  ariaLabel?: RefOrValue<string>
  class?: RefOrValue<string>
  wrap?: RefOrValue<boolean>
  svg?: ComputedRef<string>
  ariaHidden?: ComputedRef<boolean>
  role?: ComputedRef<string>
}

const iconTemplate = html`<span class="icon-wrap" :class="class" r-if="wrap">
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
  :class="class"
  :role="role"
  :aria-label="ariaLabel"
  :aria-hidden="ariaHidden"
  r-if="svg"
  r-html="svg"
></span>`

function defineIconComponent(getSvgIcon: GetSvgIcon) {
  return defineComponent<Icon>(iconTemplate, {
    props: ['name', 'ariaLabel', 'class', 'wrap'],
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

  return {
    ...props,
    svg,
    ariaHidden,
    role,
  }
}
