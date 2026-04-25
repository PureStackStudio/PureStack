import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
import { urlNormalizer } from '@purestack/ts-util'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export type BtnSize = 'sm' | 'md' | 'lg'
export type BtnType = 'button' | 'submit' | 'reset'
export type BtnIconPosition = 'start' | 'end'
export type BtnVariant =
  | 'none'
  | 'solid'
  | 'surface'
  | 'surfaceAlt'
  | 'outlineFill'
  | 'outline'
  | 'subtle'
  | 'link'
  | 'sheen'
  | 'underline'
  | 'rail'
  | 'bracket'

export interface BtnBase {
  tone?: RefOrValue<SemanticTone>
  size?: RefOrValue<BtnSize>
  variant?: RefOrValue<BtnVariant>
  icon?: RefOrValue<string>
  iconPosition?: RefOrValue<BtnIconPosition>
  iconOnly?: RefOrValue<boolean>
  ariaLabel?: RefOrValue<string>
  class?: RefOrValue<string>
  className?: ComputedRef<string>
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

const DEFAULT_BUTTON_VARIANT: BtnVariant = 'solid'
const BUTTON_VARIANT_CLASSES: Record<BtnVariant, string> = {
  none: '',
  solid:
    'b-1 rounded-md tone-fill-button-all tone-border-button-all tone-text-button-all',
  surface:
    'b-1 rounded-md tone-fill-surface-all tone-border-surface-all tone-text',
  surfaceAlt:
    'b-1 rounded-md tone-fill-surface-alt-all tone-border-surface-alt-all tone-text',
  outlineFill:
    'b-2 rounded-md tone-border-button-all tone-text tone-fill-button-hover tone-text-button-hover tone-fill-button-active tone-text-button-active',
  outline:
    'b-2 b-2-hover rounded-md tone-border-button-hover tone-fill-button-active tone-text tone-text-button-hover tone-fill-button-active tone-text-button-active',
  subtle:
    'b-0 rounded-md tone-text tone-fill-surface-hover tone-fill-surface-active',
  link: 'underline-hover tone-text',
  sheen: 'tone-text-bg-button-all fs-h1 pad-1 fw-900 uppercase',
  underline: 'tone-inset-b-hover tone-inset-b-active tone-text',
  rail: 'bl-1 inset-size-4 padl-4 padr-3 tone-inset-l-hover tone-border-button-all tone-text tone-fill-active tone-text-button-active',
  bracket:
    'tone-inset-y-hover tone-inset-y-active tone-text tone-fill-active tone-text-button-active',
}

const buttonTemplate = html`<button
  class="btn"
  :class="className"
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
  :class="className"
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
      'class',
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
      'class',
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
    className: computed(() => resolveButtonClassName(props)),
    buttonType: computed(() => unref(props.type) || 'button'),
    showStartIcon: computed(() => resolveShowStartIcon(props)),
    showEndIcon: computed(() => resolveShowEndIcon(props)),
  }
}

function resolveBtnLink(props: BtnLink): BtnLink {
  return {
    ...props,
    className: computed(() => resolveButtonClassName(props)),
    resolvedHref: computed(() => resolveButtonHref(props)),
    resolvedRel: computed(() => resolveButtonRel(props)),
    showStartIcon: computed(() => resolveShowStartIcon(props)),
    showEndIcon: computed(() => resolveShowEndIcon(props)),
  }
}

function resolveButtonClassName(props: BtnBase) {
  const size = unref(props.size)
  const hasIcon = !!unref(props.icon)
  const iconPosition = unref(props.iconPosition)
  const iconOnly = unref(props.iconOnly)
  const classTokens = [
    resolveButtonVariantClassName(props),
    size ? `btn--${size}` : '',
    getSemanticToneClass(unref(props.tone)),
    unref(props.class) || '',
  ].filter(Boolean)
  if (!hasIcon) return classTokens.join(' ')
  classTokens.push(
    iconOnly
      ? 'btn--icon-only'
      : iconPosition === 'end'
        ? 'btn--icon-end'
        : 'btn--icon-start',
  )
  return classTokens.join(' ')
}

function resolveButtonVariantClassName(props: BtnBase) {
  const variant = unref(props.variant) || DEFAULT_BUTTON_VARIANT
  return BUTTON_VARIANT_CLASSES[variant]
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
  return unref(props.target) === '_blank' ? 'noopener noreferrer' : ''
}
