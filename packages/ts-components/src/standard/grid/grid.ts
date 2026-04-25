import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export type GridAlignItems = 'start' | 'center' | 'end'
export type GridJustifyItems = 'start' | 'center' | 'end'

export interface Grid {
  container?: RefOrValue<string>
  columns?: RefOrValue<number | string>
  columnsSm?: RefOrValue<number | string>
  columnsMd?: RefOrValue<number | string>
  columnsLg?: RefOrValue<number | string>
  columnsXl?: RefOrValue<number | string>
  alignItems?: RefOrValue<GridAlignItems>
  justifyItems?: RefOrValue<GridJustifyItems>
  dense?: RefOrValue<boolean | string>
  classes?: ComputedRef<string>
  gridStyle?: ComputedRef<Record<string, string>>
}

const gridTemplate = html`<div :is="container ?? 'div'" class="grid" :class="classes" :style="gridStyle">
  <slot></slot>
</div>`

function defineGridComponent() {
  return defineComponent<Grid>(gridTemplate, {
    props: [
      'container',
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

export function defineGridComponents() {
  return {
    grid: defineGridComponent(),
  }
}

function resolveGrid(props: Grid): Grid {
  const classes = computed(() => {
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
    classes,
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
  const base =
    resolveGridTemplateColumnsValue(props.columns) ?? toRepeatTemplate(1)
  const sm = resolveGridTemplateColumnsValue(props.columnsSm) ?? base
  const md = resolveGridTemplateColumnsValue(props.columnsMd) ?? sm
  const lg = resolveGridTemplateColumnsValue(props.columnsLg) ?? md
  const xl = resolveGridTemplateColumnsValue(props.columnsXl) ?? lg

  return { base, sm, md, lg, xl }
}

function resolveGridTemplateColumnsValue(
  value?: RefOrValue<number | string>,
): string | undefined {
  const resolvedValue = unref(value)

  if (typeof resolvedValue === 'number' && Number.isInteger(resolvedValue)) {
    return toRepeatTemplate(clampColumns(resolvedValue))
  }

  if (typeof resolvedValue !== 'string') return undefined

  const normalized = resolvedValue.trim()
  if (!normalized) return undefined

  const columnCount = tryParseColumnCount(normalized)
  if (columnCount !== undefined) return toRepeatTemplate(columnCount)

  return normalized
}

function tryParseColumnCount(value: string): number | undefined {
  if (!/^\d+$/.test(value)) return undefined

  const parsed = Number.parseInt(value, 10)
  if (!Number.isInteger(parsed)) return undefined

  return clampColumns(parsed)
}

function toRepeatTemplate(columns: number) {
  return `repeat(${columns}, minmax(0, 1fr))`
}

function clampColumns(value: number) {
  if (value < 1) return 1
  if (value > 12) return 12
  return value
}

function resolveAlignClass(value?: RefOrValue<GridAlignItems>) {
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

function resolveJustifyClass(value?: RefOrValue<GridJustifyItems>) {
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
  const normalized = unref(value)
  if (normalized === true || normalized === 'true') return 'grid--dense'

  return ''
}
