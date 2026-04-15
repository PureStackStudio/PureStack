import {
  getSemanticToneButtonClass,
  type SemanticTone,
} from '@purestack/ts-style'
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

export interface BtnBase {
  tone?: RefOrValue<SemanticTone>
  size?: RefOrValue<BtnSize>
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
  const classTokens = [
    size ? `btn--${size}` : '',
    getSemanticToneButtonClass(unref(props.tone), 'interactive', 'accent'),
    unref(props.class) || '',
  ]
  if (hasIcon && unref(props.iconOnly)) classTokens.push('btn--icon-only')
  return classTokens.filter(Boolean).join(' ')
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
