import { Style } from '@purestack/ts-css'

import { BreakPoint, CssConfig } from '../cssConfig'
import { createMediaQueries, toPercentage } from './utility'

export function grid(config: CssConfig, style: Style) {
  setRow(config, style)
  createMediaQueries(config, style, setCol, '')
  createMediaQueries(config, style, setRowCol, '')
}

function setRow(config: CssConfig, style: Style) {
  style
    .select('.row')
    .set('--gutter-x', config.grid.gutter)
    .set('--gutter-y', '0')
    .display('flex')
    .flexWrap('wrap')
    .marginTop('calc(-1 * var(--gutter-y))')
    .marginRight('calc(-.5 * var(--gutter-x))')
    .marginLeft('calc(-.5 * var(--gutter-x))')
    .select('>*')
    .flexShrink(0)
    .width('100%')
    .maxWidth('100%')
    .paddingRight('calc(var(--gutter-x) * 0.5)')
    .paddingLeft('calc(var(--gutter-x) * 0.5)')
    .marginTop('var(--gutter-y)')
}

function setCol(config: CssConfig, style: Style, breakpoint: BreakPoint) {
  const key = breakpoint.key ? '-' + breakpoint.key : ''
  style.select(`.col${key}`).flex('1 0 0%')
  style.select(`.col${key}-auto`).flex('0 0 auto').width('auto')
  const colCount = config.grid.columns
  for (let i = 1; i <= colCount; ++i) {
    const x = toPercentage(i / colCount)
    style.select(`.col${key}-${i}`).flex('0 0 auto').width(x)
    style.select(`.offset${key}-${i}`).marginLeft(x)
  }
  style.select(`.g${key}-1`).set('--gutter-x', '1rem').set('--gutter-y', '1rem')
  style.select(`.gx${key}-1`).set('--gutter-x', '1rem')
  style.select(`.gy${key}-1`).set('--gutter-y', '1rem')
}

function setRowCol(config: CssConfig, style: Style, breakpoint: BreakPoint) {
  const key = breakpoint.key ? '-' + breakpoint.key : ''
  style.select(`.row-cols${key}-auto > *`).flex('0 0 auto').width('auto')
  const rowColCount = config.grid.columns / 2
  for (let i = 1; i <= rowColCount; ++i) {
    const x = toPercentage(rowColCount / i / rowColCount)
    style.select(`.row-cols${key}-${i} > *`).flex('0 0 auto').width(x)
  }
}
