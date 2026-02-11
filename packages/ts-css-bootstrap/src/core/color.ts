/** 
https://colorhunt.co/palettes/popular
*/
import type { Style } from '@purestack/ts-css'

import { hexToRgb } from '../colorMaster'
import type { CssConfig } from '../cssConfig'

export function color(config: CssConfig, style: Style) {
  const theme = [...Object.entries(config.colors)]
  for (const [key, colors] of theme) {
    for (let i = 0; i < colors.length; ++i) {
      let value = `${colors[i]} !important`
      style
        .select(`.fg-${key}-${i + 1}, .fg-hover-${key}-${i + 1}:hover`)
        .color(value)
      style
        .select(`.bg-${key}-${i + 1}, .bg-hover-${key}-${i + 1}:hover`)
        .backgroundColor(value)
      style
        .select(`.br-${key}-${i + 1}, .br-hover-${key}-${i + 1}:hover`)
        .borderColor(value)

      for (const [opKey, opValue] of Object.entries(config.opacities)) {
        const { r, g, b } = hexToRgb(colors[i])
        value = `rgba(${r},${g},${b},${opValue}) !important`
        style
          .select(
            `.fg-${key}-${i + 1}-op-${opKey}, .fg-hover-${key}-${
              i + 1
            }-op-${opKey}:hover`,
          )
          .color(value)
        style
          .select(
            `.bg-${key}-${i + 1}-op-${opKey}, .bg-hover-${key}-${
              i + 1
            }-op-${opKey}:hover`,
          )
          .backgroundColor(value)
        style
          .select(
            `.br-${key}-${i + 1}-op-${opKey}, .br-hover-${key}-${
              i + 1
            }-op-${opKey}:hover`,
          )
          .borderColor(value)
      }
    }
  }
}
