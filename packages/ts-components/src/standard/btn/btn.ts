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
  type RefOrValue,
  unref,
} from 'regor'

import { registerButtonStyles } from './btnStyle'

export type BtnSize = 'sm' | 'md' | 'lg'
export type BtnType = 'button' | 'submit' | 'reset'
export type BtnIconPosition = 'start' | 'end'

export interface Btn {
  tone?: RefOrValue<string>
  size?: RefOrValue<BtnSize>
  type?: RefOrValue<BtnType>
  icon?: RefOrValue<string>
  iconPosition?: RefOrValue<BtnIconPosition>
  iconOnly?: RefOrValue<boolean>
  ariaLabel?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  class?: RefOrValue<string>
  className?: ComputedRef<string>
  buttonType?: RefOrValue<BtnType>
  showStartIcon?: ComputedRef<boolean>
  showEndIcon?: ComputedRef<boolean>
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

function createButtonComponent() {
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

export function createButtonComponents() {
  registerButtonStyles()
  return {
    btn: createButtonComponent(),
  }
}

function resolveBtn(props: Btn): Btn {
  return {
    ...props,
    className: computed(() => resolveButtonClassName(props)),
    buttonType: computed(() => unref(props.type) || 'button'),
    showStartIcon: computed(() => {
      const hasIcon = !!unref(props.icon)
      return hasIcon && unref(props.iconPosition) !== 'end'
    }),
    showEndIcon: computed(() => {
      const hasIcon = !!unref(props.icon)
      return hasIcon && unref(props.iconPosition) === 'end'
    }),
  }
}

function resolveButtonClassName(props: Btn) {
  const tone = resolveSemanticTone(unref(props.tone), 'accent')
  const size = unref(props.size)
  const hasIcon = !!unref(props.icon)
  const classTokens = [
    size ? `btn--${size}` : '',
    getSemanticToneSurfaceClass(tone),
    getSemanticToneBorderClass(tone),
    getSemanticToneTextClass(tone),
    unref(props.class) || '',
  ]
  if (hasIcon && unref(props.iconOnly)) classTokens.push('btn--icon-only')
  return classTokens.filter((x) => !!x).join(' ')
}
