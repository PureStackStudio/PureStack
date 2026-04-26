import type { SemanticTone } from '@purestack/ts-style'
import { urlNormalizer } from '@purestack/ts-util'
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
  resolveComponentClasses,
} from '../componentVariant'

export type BtnSize = 'sm' | 'md' | 'lg'
export type BtnType = 'button' | 'submit' | 'reset'
export type BtnIconPosition = 'start' | 'end'

export interface BtnBase {
  tone?: RefOrValue<SemanticTone>
  size?: RefOrValue<BtnSize>
  variant?: RefOrValue<ComponentVariant>
  icon?: RefOrValue<string>
  iconPosition?: RefOrValue<BtnIconPosition>
  iconOnly?: RefOrValue<boolean>
  ariaLabel?: RefOrValue<string>
  classes?: ComputedRef<string>
  showStartIcon?: ComputedRef<boolean>
  showEndIcon?: ComputedRef<boolean>
}

export interface Btn extends BtnBase {
  type?: RefOrValue<BtnType>
  disabled?: RefOrValue<boolean>
  buttonType?: RefOrValue<BtnType>
}

export interface BtnLink extends BtnBase {
  href?: RefOrValue<string>
  target?: RefOrValue<string>
  rel?: RefOrValue<string>
  resolvedHref?: ComputedRef<string>
  resolvedRel?: ComputedRef<string>
}

const DEFAULT_BUTTON_VARIANT: ComponentVariant = 'solid'

const buttonTemplate = html`<button
  class="btn"
  :class="classes"
  :type="buttonType"
  :disabled="disabled"
  :aria-label="ariaLabel"
>
  <Icon class="btn__icon" :name="icon" r-if="showStartIcon"/>
  <span class="btn__label" r-if="!iconOnly"><slot></slot></span>
  <Icon class="btn__icon" :name="icon" r-if="showEndIcon"/>
</button>`

const buttonLinkTemplate = html`<a
  class="btn"
  :class="classes"
  :href="resolvedHref"
  :target="target"
  :rel="resolvedRel"
  :aria-label="ariaLabel"
>
  <Icon class="btn__icon" :name="icon" r-if="showStartIcon"/>
  <span class="btn__label" r-if="!iconOnly"><slot></slot></span>
  <Icon class="btn__icon" :name="icon" r-if="showEndIcon"/>
</a>`

function defineButtonComponent() {
  return defineComponent<Btn>(buttonTemplate, {
    props: [
      'tone',
      'size',
      'variant',
      'type',
      'icon',
      'iconPosition',
      'iconOnly',
      'ariaLabel',
      'disabled',
    ],
    context: (head) => resolveBtn(head.props),
  })
}

function defineButtonLinkComponent() {
  return defineComponent<BtnLink>(buttonLinkTemplate, {
    props: [
      'href',
      'target',
      'rel',
      'tone',
      'size',
      'variant',
      'icon',
      'iconPosition',
      'iconOnly',
      'ariaLabel',
    ],
    context: (head) => resolveBtnLink(head.props),
  })
}

export function defineButtonComponents() {
  return {
    btn: defineButtonComponent(),
    btnLink: defineButtonLinkComponent(),
  }
}

function resolveBtn(props: Btn): Btn {
  return {
    ...props,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: DEFAULT_BUTTON_VARIANT,
        classes: resolveButtonStateClasses(props),
      }),
    ),
    buttonType: computed(() => unref(props.type) || 'button'),
    showStartIcon: computed(() => resolveShowStartIcon(props)),
    showEndIcon: computed(() => resolveShowEndIcon(props)),
  }
}

function resolveBtnLink(props: BtnLink): BtnLink {
  return {
    ...props,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: DEFAULT_BUTTON_VARIANT,
        classes: resolveButtonStateClasses(props),
      }),
    ),
    resolvedHref: computed(() => resolveButtonHref(props)),
    resolvedRel: computed(() => resolveButtonRel(props)),
    showStartIcon: computed(() => resolveShowStartIcon(props)),
    showEndIcon: computed(() => resolveShowEndIcon(props)),
  }
}

function resolveButtonStateClasses(props: BtnBase) {
  const size = unref(props.size)
  const hasIcon = !!unref(props.icon)
  const iconPosition = unref(props.iconPosition)
  const iconOnly = unref(props.iconOnly)
  const classes = [size ? `btn--${size}` : '']
  if (!hasIcon) return classes
  classes.push(
    iconOnly
      ? 'btn--icon-only'
      : iconPosition === 'end'
        ? 'btn--icon-end'
        : 'btn--icon-start',
  )
  return classes
}

function resolveShowStartIcon(props: BtnBase) {
  const hasIcon = !!unref(props.icon)
  return hasIcon && unref(props.iconPosition) !== 'end'
}

function resolveShowEndIcon(props: BtnBase) {
  const hasIcon = !!unref(props.icon)
  return hasIcon && unref(props.iconPosition) === 'end'
}

function resolveButtonHref(props: BtnLink) {
  return urlNormalizer.normalizeHref(unref(props.href))
}

function resolveButtonRel(props: BtnLink) {
  const rel = unref(props.rel)
  if (rel) return rel
  return unref(props.target) === '_blank' ? 'noopener noreferrer' : undefined
}
