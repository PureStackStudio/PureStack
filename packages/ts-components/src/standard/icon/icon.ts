import { getSvgIcon } from '@purestack/ts-svg-icons'
import { defineComponent, html, unref } from 'regor'

import { registerIconStyles } from './iconStyle'

export interface Icon {
  name?: string
  size?: string
  label?: string
  class?: string
  svg?: string
  ariaLabel?: string
  ariaHidden?: string
  role?: string
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
  r-if="svg"
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
  const name = resolveText(unref(props.name))
  const label = resolveText(unref(props.label))
  const size = resolveCssSize(unref(props.size))
  const svg = name ? getSvgIcon(name) : ''

  return {
    svg,
    ariaLabel: label,
    ariaHidden: label ? undefined : 'true',
    role: label ? 'img' : '',
    customClass: props.class,
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
