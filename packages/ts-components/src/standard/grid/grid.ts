import { defineComponent, html } from 'regor'

import { registerGridStyles } from './gridStyle'

interface GridProps {
  columns?: number | string
  columnsSm?: number | string
  columnsMd?: number | string
  columnsLg?: number | string
  columnsXl?: number | string
  gap?: string
  gapSm?: string
  gapMd?: string
  gapLg?: string
  gapXl?: string
  alignItems?: string
  justifyItems?: string
  dense?: boolean | string
}

interface GridContext extends GridProps {
  className: string
  gridStyle: Record<string, string>
}

const gridTemplate = html`<div class="grid" :class="className" :style="gridStyle">
  <slot></slot>
</div>`

function createGridComponent() {
  return defineComponent<GridContext>(gridTemplate, {
    props: [
      'columns',
      'columnsSm',
      'columnsMd',
      'columnsLg',
      'columnsXl',
      'gap',
      'gapSm',
      'gapMd',
      'gapLg',
      'gapXl',
      'alignItems',
      'justifyItems',
      'dense',
    ],
    context: (head) => resolveGridContext(head.props),
  })
}

export function createGridComponents() {
  registerGridStyles()
  return {
    grid: createGridComponent(),
  }
}

function resolveGridContext(props: GridProps): GridContext {
  const classNames = [
    resolveAlignClass(props.alignItems),
    resolveJustifyClass(props.justifyItems),
    resolveDenseClass(props.dense),
  ].filter(Boolean)

  const gridStyle: Record<string, string> = {
    '--grid-cols': String(resolveColumns(props.columns, 1)),
    '--grid-gap': resolveGap(props.gap, '1rem'),
  }

  addCssVarIfPresent(
    gridStyle,
    '--grid-cols-sm',
    resolveColumns(props.columnsSm),
  )
  addCssVarIfPresent(
    gridStyle,
    '--grid-cols-md',
    resolveColumns(props.columnsMd),
  )
  addCssVarIfPresent(
    gridStyle,
    '--grid-cols-lg',
    resolveColumns(props.columnsLg),
  )
  addCssVarIfPresent(
    gridStyle,
    '--grid-cols-xl',
    resolveColumns(props.columnsXl),
  )

  addCssVarIfPresent(gridStyle, '--grid-gap-sm', resolveGap(props.gapSm))
  addCssVarIfPresent(gridStyle, '--grid-gap-md', resolveGap(props.gapMd))
  addCssVarIfPresent(gridStyle, '--grid-gap-lg', resolveGap(props.gapLg))
  addCssVarIfPresent(gridStyle, '--grid-gap-xl', resolveGap(props.gapXl))

  return {
    className: classNames.join(' '),
    gridStyle,
  }
}

function addCssVarIfPresent(
  target: Record<string, string>,
  key: string,
  value: number | string | undefined,
) {
  if (value === undefined || value === '') return
  target[key] = String(value)
}

function resolveColumns(value: unknown, fallback?: number): number | undefined {
  if (typeof value === 'number' && Number.isInteger(value)) {
    return clampColumns(value)
  }
  if (typeof value === 'string') {
    const normalized = value.trim()
    if (/^\d+$/.test(normalized)) {
      return clampColumns(Number.parseInt(normalized, 10))
    }
  }
  return fallback
}

function clampColumns(value: number) {
  if (value < 1) return 1
  if (value > 12) return 12
  return value
}

const gapTokenMap: Record<string, string> = {
  none: '0',
  xxs: '0.25rem',
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.25rem',
  xl: '1.5rem',
  '2xl': '2rem',
}

function resolveGap(value: unknown): string | undefined
function resolveGap(value: unknown, fallback: string): string
function resolveGap(value: unknown, fallback?: string): string | undefined {
  if (typeof value !== 'string') return fallback
  const normalized = value.trim().toLowerCase()
  if (!normalized) return fallback
  if (/[;{}]/.test(normalized)) return fallback
  if (normalized in gapTokenMap) return gapTokenMap[normalized]
  if (/^\d+(\.\d+)?$/.test(normalized)) return `${normalized}px`
  if (/^(0|\d*\.?\d+(px|rem|em|%|vw|vh|vmin|vmax|ch|ex))$/.test(normalized)) {
    return normalized
  }
  return fallback
}

function resolveAlignClass(value: unknown) {
  const normalized = resolveText(value).toLowerCase()
  if (
    normalized === 'start' ||
    normalized === 'center' ||
    normalized === 'end'
  ) {
    return `grid--align-${normalized}`
  }
  return ''
}

function resolveJustifyClass(value: unknown) {
  const normalized = resolveText(value).toLowerCase()
  if (
    normalized === 'start' ||
    normalized === 'center' ||
    normalized === 'end'
  ) {
    return `grid--justify-${normalized}`
  }
  return ''
}

function resolveDenseClass(value: unknown) {
  return resolveBoolean(value) ? 'grid--dense' : ''
}

function resolveText(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}

function resolveBoolean(value: unknown) {
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return normalized === 'true' || normalized === '1' || normalized === 'yes'
  }
  return false
}
