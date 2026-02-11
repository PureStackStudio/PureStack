import type { Style } from '@purestack/ts-css'

import type { CssConfig } from '../cssConfig'
import { singlePropClass } from './utility'

export function font(_config: CssConfig, style: Style) {
  singlePropClass(style, 'font-style', {
    italic: 'italic',
    normal: 'normal',
  })

  singlePropClass(
    style,
    'font-weight',
    {
      lighter: 'lighter',
      light: '300',
      normal: '400',
      bold: '700',
      bolder: 'bolder',
    },
    'fw',
  )
}
