import { defineComponent, html } from 'regor'

import { registerGridStyles } from './gridStyle'

export interface Grid {
  columns?: number | string
  columnsSm?: number | string
  columnsMd?: number | string
  columnsLg?: number | string
  columnsXl?: number | string
  alignItems?: string
  justifyItems?: string
  dense?: boolean | string
  className?: string
  gridStyle?: Record<string, string>
}

const gridTemplate = html`<div class="grid" :class="className" :style="gridStyle">
  <slot></slot>
</div>`

function createGridComponent() {
  return defineComponent<Grid>(gridTemplate, {
    props: [
      'columns',
      'columnsSm',
      'columnsMd',
      'columnsLg',
      'columnsXl',
      'alignItems',
      'justifyItems',
      'dense',
    ],
    context: (head) => resolveGrid(head.props),
  })
}

export function createGridComponents() {
  registerGridStyles()
  return {
    grid: createGridComponent(),
  }
}

function resolveGrid(props: Grid): Grid {
  const classNames = [
    resolveAlignClass(props.alignItems),
    resolveJustifyClass(props.justifyItems),
    resolveDenseClass(props.dense),
  ].filter(Boolean)
  const resolvedColumns = resolveResponsiveGridTemplateColumns(props)

  const gridStyle: Record<string, string> = {
    '--grid-template-columns': resolvedColumns.base,
    '--grid-template-columns-sm': resolvedColumns.sm,
    '--grid-template-columns-md': resolvedColumns.md,
    '--grid-template-columns-lg': resolvedColumns.lg,
    '--grid-template-columns-xl': resolvedColumns.xl,
  }

  return {
    ...props,
    className: classNames.join(' '),
    gridStyle,
  }
}

type ResolvedGridTemplateColumns = {
  base: string
  sm: string
  md: string
  lg: string
  xl: string
}

function resolveResponsiveGridTemplateColumns(
  props: Grid,
): ResolvedGridTemplateColumns {
  const base = resolveGridTemplateColumnsValue(props.columns, 1)
  const sm = resolveGridTemplateColumnsValue(props.columnsSm) ?? base
  const md = resolveGridTemplateColumnsValue(props.columnsMd) ?? sm
  const lg = resolveGridTemplateColumnsValue(props.columnsLg) ?? md
  const xl = resolveGridTemplateColumnsValue(props.columnsXl) ?? lg

  return { base, sm, md, lg, xl }
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

function resolveGridTemplateColumnsValue(value: unknown): string | undefined
function resolveGridTemplateColumnsValue(value: unknown, fallback: number): string
function resolveGridTemplateColumnsValue(
  value: unknown,
  fallback?: number,
): string | undefined {
  const template = resolveColumnTemplate(value)
  if (template) return template

  const columns = resolveColumns(value, fallback)
  if (columns === undefined) return undefined
  return `repeat(${columns}, minmax(0, 1fr))`
}

function resolveColumnTemplate(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const normalized = value.trim()
  if (!normalized) return undefined
  if (/^\d+$/.test(normalized)) return undefined
  if (/[;{}]/.test(normalized)) return undefined
  return normalized
}

function clampColumns(value: number) {
  if (value < 1) return 1
  if (value > 12) return 12
  return value
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
