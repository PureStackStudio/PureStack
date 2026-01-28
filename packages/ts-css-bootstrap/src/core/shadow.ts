import { Style } from '@purestack/ts-css'

import { hexToRgb } from '../colorMaster'
import { CssConfig } from '../cssConfig'

/**
 * https://html-css-js.com/css/generator/box-shadow/
 * https://dev.to/5t3ph/use-currentcolor-to-keep-css-dry-and-component-colors-flexible-26p
 */
export function shadow(config: CssConfig, style: Style) {
  const theme = [...Object.entries(config.colors)]
  for (const [key, colors] of theme) {
    for (let i = 0; i < colors.length; ++i) {
      const c = hexToRgb(colors[i])
      const value = `1px 1px 1px 1px rgba(${c.r},${c.g},${c.b},${
        c.a ?? 0.5
      }) !important`
      style.select(`.shadow-${key}${i + 1}`).boxShadow(value)
      style.select(`.shadow-hover-${key}${i + 1}:hover`).boxShadow(value)
    }
  }

  style.select('.shadow-1').boxShadow('1px 1px 1px 1px currentColor')
  style
    .select('.shadow-hover-1:hover')
    .boxShadow('1px 1px 1px 1px currentColor')
}
