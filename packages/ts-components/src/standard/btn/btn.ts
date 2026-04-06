import { defineComponent, html } from 'regor'

import { registerButtonStyles } from './btnStyle'

export type BtnVariant =
  | 'primary'
  | 'secondary'
  | 'ghost'
  | 'danger'
  | 'warning'
export type BtnSize = 'sm' | 'md' | 'lg'
export type BtnType = 'button' | 'submit' | 'reset'
export type BtnIconPosition = 'start' | 'end'

export interface Btn {
  variant?: string
  size?: string
  type?: string
  icon?: string
  iconPosition?: string
  iconOnly?: boolean | string
  ariaLabel?: string
  disabled?: boolean | string
  class?: string
  className?: string
  buttonType?: BtnType
  showStartIcon?: boolean
  showEndIcon?: boolean
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
      'variant',
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
  const icon = resolveText(props.icon)
  const variant = resolveVariant(props.variant)
  const size = resolveSize(props.size)
  const buttonType = resolveButtonType(props.type)
  const customClass = resolveText(props.class)
  const iconPosition = resolveIconPosition(props.iconPosition)
  const hasIcon = icon.length > 0
  const disabled = props.disabled
  const iconOnly = resolveBoolean(props.iconOnly) && hasIcon
  const explicitAriaLabel = resolveText(props.ariaLabel)
  const classTokens = [`btn--${variant}`, `btn--${size}`]
  if (iconOnly) classTokens.push('btn--icon-only')
  if (customClass) classTokens.push(customClass)

  return {
    className: classTokens.join(' '),
    buttonType,
    icon,
    iconOnly,
    disabled,
    showStartIcon: hasIcon && iconPosition === 'start',
    showEndIcon: hasIcon && iconPosition === 'end',
    ariaLabel: iconOnly ? explicitAriaLabel || 'Button' : explicitAriaLabel,
  }
}

function resolveVariant(value: unknown): BtnVariant {
  const normalized = resolveText(value).toLowerCase()
  if (
    normalized === 'secondary' ||
    normalized === 'ghost' ||
    normalized === 'danger' ||
    normalized === 'warning'
  ) {
    return normalized
  }
  return 'primary'
}

function resolveSize(value: unknown): BtnSize {
  const normalized = resolveText(value).toLowerCase()
  if (normalized === 'sm' || normalized === 'lg') return normalized
  return 'md'
}

function resolveButtonType(value: unknown): BtnType {
  const normalized = resolveText(value).toLowerCase()
  if (normalized === 'submit' || normalized === 'reset') return normalized
  return 'button'
}

function resolveIconPosition(value: unknown): BtnIconPosition {
  const normalized = resolveText(value).toLowerCase()
  if (normalized === 'end') return 'end'
  return 'start'
}

function resolveBoolean(value: unknown) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.trim().toLowerCase() === 'true'
  return false
}

function resolveText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}
