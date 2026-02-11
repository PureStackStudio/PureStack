import type { Style } from '@purestack/ts-css'

import type { CssConfig } from '../cssConfig'
import { singlePropClass } from './utility'

export function overflow(_config: CssConfig, style: Style) {
  singlePropClass(style, 'overflow', {
    auto: 'auto',
    hidden: 'hidden',
    visible: 'visible',
    scroll: 'scroll',
  })

  singlePropClass(style, 'overflow-x', {
    auto: 'auto',
    hidden: 'hidden',
    visible: 'visible',
    scroll: 'scroll',
  })

  singlePropClass(style, 'overflow-y', {
    auto: 'auto',
    hidden: 'hidden',
    visible: 'visible',
    scroll: 'scroll',
  })
}
