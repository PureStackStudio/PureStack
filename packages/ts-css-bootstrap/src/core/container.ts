import type { Style } from '@purestack/ts-css'

import type { BreakPoint, CssConfig } from '../cssConfig'
import { createMediaQueries, getBreakpoints } from './utility'

/**
 *
 * ```
 * Default breakpoints:
 * - Extra small: < 576px
 * - Small:      ≥ 576px
 * - Medium:     ≥ 768px
 * - Large:      ≥ 992px
 * - X-Large:    ≥ 1200px
 * - XX-Large:   ≥ 1400px
 *
 * Container widths:
 *
 * | Class            | <576px | ≥576px | ≥768px | ≥992px | ≥1200px | ≥1400px |
 * |------------------|--------|--------|--------|--------|---------|---------|
 * | .container       | 100%   | 540px  | 720px  | 960px  | 1140px  | 1320px  |
 * | .container-sm    | 100%   | 540px  | 720px  | 960px  | 1140px  | 1320px  |
 * | .container-md    | 100%   | 100%   | 720px  | 960px  | 1140px  | 1320px  |
 * | .container-lg    | 100%   | 100%   | 100%   | 960px  | 1140px  | 1320px  |
 * | .container-xl    | 100%   | 100%   | 100%   | 100%   | 1140px  | 1320px  |
 * | .container-xxl   | 100%   | 100%   | 100%   | 100%   | 100%    | 1320px  |
 * | .container-fluid | 100%   | 100%   | 100%   | 100%   | 100%    | 100%    |
 * ```
 */
export function container(config: CssConfig, style: Style) {
  setContainer(config, style)
  createMediaQueries(config, style, setMaxWidths, '')
}

function getContainerClasses(config: CssConfig, startFrom: string) {
  return getBreakpoints(config, startFrom)
    .map((x) => {
      const key = x.key ? `-${x.key}` : ''
      return `.container${key}`
    })
    .join(',')
}

function setContainer(config: CssConfig, style: Style) {
  const px = config.paddings.containerPaddingx
  const containerClasses = getContainerClasses(config, '')
  style
    .select(`${containerClasses}, .container-fluid`)
    .paddingLeft(px)
    .paddingRight(px)
    .width('100%')
    .marginRight('auto')
    .marginLeft('auto')
}

function setMaxWidths(config: CssConfig, style: Style, breakpoint: BreakPoint) {
  if (breakpoint.key === '') return
  const containerClasses = getContainerClasses(config, breakpoint.key)
  style.select(`.container, ${containerClasses}`).maxWidth(breakpoint.width)
}
