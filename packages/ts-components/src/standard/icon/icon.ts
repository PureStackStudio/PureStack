import { getSvgIcon } from '@purestack/ts-svg-icons'
import { defineComponent, html } from 'regor'

import { registerIconStyles } from './iconStyle'

export interface Icon {
  name?: string
  size?: string
  label?: string
  class?: string
  svg?: string
  hasIcon?: boolean
  ariaLabel?: string | null
  ariaHidden?: 'true' | null
  role?: 'img' | null
  customClass?: string
  iconStyle?: Record<string, string>
}

const iconTemplate = html`<span
  class="icon"
  :class="customClass"
  :style="iconStyle"
  :role="role"
  :aria-label="ariaLabel"
  :aria-hidden="ariaHidden"
  r-if="hasIcon"
  r-html="svg"
></span>`

function createIconComponent() {
  return defineComponent<Icon>(iconTemplate, {
    props: ['name', 'size', 'label', 'class'],
    context: (head) => resolveIcon(head.props),
  })
}

export function createIconComponents() {
  registerIconStyles()
  return {
    icon: createIconComponent(),
  }
}

function resolveIcon(props: Icon): Icon {
  const name = resolveText(props.name)
  const label = resolveText(props.label)
  const size = resolveCssSize(props.size)
  const hasIcon = name.length > 0

  return {
    svg: hasIcon ? getSvgIcon(name) : '',
    hasIcon,
    ariaLabel: label || null,
    ariaHidden: label ? null : 'true',
    role: label ? 'img' : null,
    customClass: resolveText(props.class),
    iconStyle: buildIconStyle(size),
  }
}

function buildIconStyle(size: string): Record<string, string> {
  if (!size) return {}
  return {
    width: size,
    height: size,
  }
}

function resolveText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}

function resolveCssSize(value: unknown) {
  const normalized = resolveText(value)
  if (!normalized) return ''
  if (/[;{}]/.test(normalized)) return ''
  return normalized
}
