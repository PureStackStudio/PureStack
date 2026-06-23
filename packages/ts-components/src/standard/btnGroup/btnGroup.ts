import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'
import type { BtnIconPosition, BtnSize } from '../btn/btn'
import {
  type ComponentVariant,
  type ComponentVariantMode,
  resolveComponentClasses,
} from '../componentVariant'

export type BtnGroupAlign = 'start' | 'center' | 'end'
export type BtnGroupDropDownAlign = 'start' | 'end'

export interface BtnGroup {
  align?: RefOrValue<BtnGroupAlign>
  wrap?: RefOrValue<boolean>
  classes?: ComputedRef<string>
}

export interface BtnGroupDropDown {
  label?: RefOrValue<string>
  icon?: RefOrValue<string>
  iconPosition?: RefOrValue<BtnIconPosition>
  iconOnly?: RefOrValue<boolean>
  ariaLabel?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  size?: RefOrValue<BtnSize>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  menuTone?: RefOrValue<SemanticTone>
  menuVariant?: RefOrValue<ComponentVariant>
  menuVariantMode?: RefOrValue<ComponentVariantMode>
  align?: RefOrValue<BtnGroupDropDownAlign>
  classes?: ComputedRef<string>
  triggerClasses?: ComputedRef<string>
  menuClasses?: ComputedRef<string>
  resolvedAlign?: ComputedRef<BtnGroupDropDownAlign>
  resolvedLabel?: ComputedRef<string>
  resolvedIcon?: ComputedRef<string>
  resolvedAriaLabel?: ComputedRef<string | undefined>
  showStartIcon?: ComputedRef<boolean>
  showEndIcon?: ComputedRef<boolean>
}

const DEFAULT_BUTTON_VARIANT: ComponentVariant = 'solid'
const DEFAULT_DROPDOWN_LABEL = 'More'
const DEFAULT_DROPDOWN_ICON = 'lucide:chevron-down'

const btnGroupTemplate = html`<div class="btn-group" :class="classes">
  <slot></slot>
</div>`

const btnGroupDropDownTemplate = html`<details
  class="btn-group__dropdown"
  :class="classes"
  :data-menu-align="resolvedAlign"
  data-menu-runtime
>
  <summary
    class="btn btn-group__toggle"
    :class="triggerClasses"
    :aria-label="resolvedAriaLabel"
  >
    <Icon class="btn__icon" :name="resolvedIcon" r-if="showStartIcon"/>
    <span class="btn__label" r-if="!iconOnly">{{ resolvedLabel }}</span>
    <Icon class="btn__icon" :name="resolvedIcon" r-if="showEndIcon"/>
  </summary>
  <div class="btn-group__menu" :class="menuClasses" data-menu-panel>
    <slot></slot>
  </div>
</details>`

function defineBtnGroupComponent() {
  return defineComponent<BtnGroup>(btnGroupTemplate, {
    props: ['align', 'wrap'],
    context: (head) => resolveBtnGroup(head.props),
  })
}

function defineBtnGroupDropDownComponent() {
  return defineComponent<BtnGroupDropDown>(btnGroupDropDownTemplate, {
    props: [
      'label',
      'icon',
      'iconPosition',
      'iconOnly',
      'ariaLabel',
      'tone',
      'size',
      'variant',
      'variantMode',
      'menuTone',
      'menuVariant',
      'menuVariantMode',
      'align',
    ],
    context: (head) => resolveBtnGroupDropDown(head.props),
  })
}

export function defineBtnGroupComponents() {
  return {
    btnGroup: defineBtnGroupComponent(),
    btnGroupDropDown: defineBtnGroupDropDownComponent(),
  }
}

function resolveBtnGroup(props: BtnGroup): BtnGroup {
  return {
    ...props,
    classes: computed(() =>
      [
        resolveBtnGroupAlignClass(props),
        unref(props.wrap) ? 'btn-group--wrap' : '',
      ]
        .filter(Boolean)
        .join(' '),
    ),
  }
}

function resolveBtnGroupDropDown(props: BtnGroupDropDown): BtnGroupDropDown {
  return {
    ...props,
    classes: computed(() => resolveDropDownClasses(props)),
    triggerClasses: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: DEFAULT_BUTTON_VARIANT,
        classes: resolveButtonStateClasses(props),
      }),
    ),
    menuClasses: computed(() =>
      resolveComponentClasses(
        {
          tone: props.menuTone,
          variant: props.menuVariant,
          variantMode: props.menuVariantMode,
        },
        {
          defaultVariant: 'surfaceAlt',
          defaultVariantMode: 'stateless',
        },
      ),
    ),
    resolvedAlign: computed(() => resolveDropDownAlign(props)),
    resolvedLabel: computed(() => unref(props.label) || DEFAULT_DROPDOWN_LABEL),
    resolvedIcon: computed(() => unref(props.icon) || DEFAULT_DROPDOWN_ICON),
    resolvedAriaLabel: computed(() => resolveDropDownAriaLabel(props)),
    showStartIcon: computed(() => resolveShowStartIcon(props)),
    showEndIcon: computed(() => resolveShowEndIcon(props)),
  }
}

function resolveBtnGroupAlignClass(props: BtnGroup) {
  const align = unref(props.align)
  return align ? `btn-group--${align}` : ''
}

function resolveDropDownClasses(props: BtnGroupDropDown) {
  return `btn-group__dropdown--${resolveDropDownAlign(props)}`
}

function resolveDropDownAlign(props: BtnGroupDropDown): BtnGroupDropDownAlign {
  return unref(props.align) || 'end'
}

function resolveButtonStateClasses(props: BtnGroupDropDown) {
  const size = unref(props.size)
  const hasIcon = !!resolveIconName(props)
  const iconPosition = unref(props.iconPosition)
  const iconOnly = unref(props.iconOnly)
  const classes = [size ? `btn--${size}` : '']
  if (!hasIcon) return classes
  classes.push(
    iconOnly
      ? 'btn--icon-only'
      : iconPosition === 'start'
        ? 'btn--icon-start'
        : 'btn--icon-end',
  )
  return classes
}

function resolveShowStartIcon(props: BtnGroupDropDown) {
  return !!resolveIconName(props) && unref(props.iconPosition) === 'start'
}

function resolveShowEndIcon(props: BtnGroupDropDown) {
  return !!resolveIconName(props) && unref(props.iconPosition) !== 'start'
}

function resolveIconName(props: BtnGroupDropDown) {
  return unref(props.icon) || DEFAULT_DROPDOWN_ICON
}

function resolveDropDownAriaLabel(props: BtnGroupDropDown) {
  const ariaLabel = unref(props.ariaLabel)
  if (ariaLabel) return ariaLabel
  return unref(props.iconOnly)
    ? unref(props.label) || 'More actions'
    : undefined
}
