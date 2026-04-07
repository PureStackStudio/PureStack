import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

import { registerGridStyles } from './gridStyle'

export interface Grid {
  columns?: RefOrValue<number | string>
  columnsSm?: RefOrValue<number | string>
  columnsMd?: RefOrValue<number | string>
  columnsLg?: RefOrValue<number | string>
  columnsXl?: RefOrValue<number | string>
  alignItems?: RefOrValue<string>
  justifyItems?: RefOrValue<string>
  dense?: RefOrValue<boolean | string>
  className?: ComputedRef<string>
  gridStyle?: ComputedRef<Record<string, string>>
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
  const className = computed(() => {
    return [
      resolveAlignClass(props.alignItems),
      resolveJustifyClass(props.justifyItems),
      resolveDenseClass(props.dense),
    ]
      .filter(Boolean)
      .join(' ')
  })
  const gridStyle = computed(() => {
    const resolvedColumns = resolveResponsiveGridTemplateColumns(props)

    return {
      '--grid-template-columns': resolvedColumns.base,
      '--grid-template-columns-sm': resolvedColumns.sm,
      '--grid-template-columns-md': resolvedColumns.md,
      '--grid-template-columns-lg': resolvedColumns.lg,
      '--grid-template-columns-xl': resolvedColumns.xl,
    } as Record<string, string>
  })

  return {
    ...props,
    className,
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
function resolveGridTemplateColumnsValue(
  value: unknown,
  fallback: number,
): string
function resolveGridTemplateColumnsValue(
  value: unknown,
  fallback?: number,
): string | undefined {
  value = unref(value)
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

function resolveAlignClass(value?: RefOrValue<string>) {
  if (!value) return ''
  const normalized = unref(value).toLowerCase()
  if (
    normalized === 'start' ||
    normalized === 'center' ||
    normalized === 'end'
  ) {
    return `grid--align-${normalized}`
  }
  return ''
}

function resolveJustifyClass(value?: RefOrValue<string>) {
  if (!value) return ''
  const normalized = unref(value).toLowerCase()
  if (
    normalized === 'start' ||
    normalized === 'center' ||
    normalized === 'end'
  ) {
    return `grid--justify-${normalized}`
  }
  return ''
}

function resolveDenseClass(value?: RefOrValue<boolean | string>) {
  if (!value) return ''
  return unref(value) ? 'grid--dense' : ''
}
