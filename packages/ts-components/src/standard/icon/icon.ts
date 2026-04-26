import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  type ComponentVariantMode,
  resolveComponentClasses,
} from '../componentVariant'

export type GetSvgIcon = (name: string) => string

export interface Icon {
  name?: RefOrValue<string>
  svg?: ComputedRef<string>
}

export interface IconFrame {
  name?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  classes?: ComputedRef<string>
  hasIcon?: ComputedRef<boolean>
}

const DEFAULT_ICON_FRAME_VARIANT: ComponentVariant = 'solid'
const DEFAULT_ICON_FRAME_VARIANT_MODE: ComponentVariantMode = 'stateless'

const iconTemplate = html`<span class="icon" r-if="svg" r-html="svg"></span>`

const iconFrameTemplate = html`<span class="icon-frame" :class="classes" r-if="hasIcon">
  <Icon :name="name"/>
</span>`

function defineIconComponent(getSvgIcon: GetSvgIcon) {
  return defineComponent<Icon>(iconTemplate, {
    props: ['name'],
    context: (head) => resolveIcon(head.props, getSvgIcon),
  })
}

function defineIconFrameComponent() {
  return defineComponent<IconFrame>(iconFrameTemplate, {
    props: ['name', 'tone', 'variant', 'variantMode'],
    context: (head) => resolveIconFrame(head.props),
  })
}

export function defineIconComponents(getSvgIcon: GetSvgIcon) {
  return {
    icon: defineIconComponent(getSvgIcon),
    iconFrame: defineIconFrameComponent(),
  }
}

function resolveIcon(props: Icon, getSvgIcon: GetSvgIcon): Icon {
  const svg = computed(() => {
    const name = unref(props.name)
    return name ? getSvgIcon(name) : ''
  })

  return {
    ...props,
    svg,
  }
}

function resolveIconFrame(props: IconFrame): IconFrame {
  return {
    ...props,
    hasIcon: computed(() => Boolean(unref(props.name))),
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: DEFAULT_ICON_FRAME_VARIANT,
        defaultVariantMode: DEFAULT_ICON_FRAME_VARIANT_MODE,
      }),
    ),
  }
}
