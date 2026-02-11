import type { Style } from '@purestack/ts-css'

import { type BreakPoint, type CssConfig, emptyBreakpoint } from '../cssConfig'

export function formatNumber(number: number, maxDecimalPlaces: number = 8) {
  const fixedString = number.toFixed(maxDecimalPlaces)
  return parseFloat(fixedString).toString()
}

export function toPercentage(number: number) {
  return `${formatNumber(number * 100)}%`
}

export function toPixel(number: number) {
  return `${formatNumber(number)}px`
}

export function toRem(number: number) {
  return `${formatNumber(number)}rem`
}

export function getBreakpoints(config: CssConfig, startFrom: string = 'sm') {
  const breakpoints = config.breakpoints
  const index = startFrom
    ? breakpoints.findIndex((x) => x.key === startFrom)
    : 0
  if (index < 0) throw new Error(`Undefined breakpoint.${startFrom}`)
  const result: BreakPoint[] = []
  if (startFrom === '') result.push(emptyBreakpoint)

  for (let i = index; i < breakpoints.length; ++i) {
    const bp = breakpoints[i]
    result.push(bp)
  }
  return result
}

export function createMediaQueries(
  config: CssConfig,
  style: Style,
  callback: (config: CssConfig, style: Style, breakpoint: BreakPoint) => void,
  startFrom = 'sm',
) {
  const breakpoints = getBreakpoints(config, startFrom)
  for (const bp of breakpoints) {
    callback(
      config,
      bp.media ? style.media(`min-width: ${bp.media}`) : style,
      bp,
    )
  }
}

export function singlePropClassResponsive(
  config: CssConfig,
  style: Style,
  attribute: string,
  values: Record<string | number, string | number>,
  className: string = '',
  postSeletor: string = '',
) {
  if (!className) className = attribute
  createMediaQueries(
    config,
    style,
    (_: CssConfig, style: Style, breakpoint: BreakPoint) => {
      const key = breakpoint.key ? `-${breakpoint.key}` : ''
      for (const [prop, value] of Object.entries(values)) {
        let postfix = prop ? `-${prop}` : ''
        postfix += postSeletor
        style
          .select(`.${className}${key}${postfix}`)
          .set(attribute, `${value} !important`)
      }
    },
    '',
  )
}

export function singlePropClass(
  style: Style,
  attribute: string,
  values: Record<string | number, string | number>,
  className: string = '',
  postSeletor: string = '',
) {
  if (!className) className = attribute
  for (const [prop, value] of Object.entries(values)) {
    let postfix = prop ? `-${prop}` : ''
    postfix += postSeletor
    style
      .select(`.${className}${postfix}`)
      .set(attribute, `${value} !important`)
  }
}
