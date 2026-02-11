import type { Style } from '@purestack/ts-css'

import type { CssConfig } from '../cssConfig'
import { singlePropClass } from './utility'

export function align(_config: CssConfig, style: Style) {
  singlePropClass(
    style,
    'vertical-align',
    {
      baseline: 'baseline',
      top: 'top',
      middle: 'middle',
      bottom: 'bottom',
      'text-bottom': 'text-bottom',
      'text-top': 'text-top',
    },
    'valign',
  )

  singlePropClass(style, 'float', {
    start: 'left',
    end: 'right',
    none: 'none',
  })

  singlePropClass(style, 'justify-content', {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  })

  singlePropClass(style, 'align-items', {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    baseline: 'baseline',
    stretch: 'stretch',
  })

  singlePropClass(style, 'align-content', {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
    stretch: 'stretch',
  })

  singlePropClass(style, 'align-self', {
    auto: 'auto',
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    baseline: 'baseline',
    stretch: 'stretch',
  })

  singlePropClass(style, 'z-index', {
    n10: -10,
    n20: -20,
    n30: -30,
    n40: -40,
    n50: -50,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
  })
}
