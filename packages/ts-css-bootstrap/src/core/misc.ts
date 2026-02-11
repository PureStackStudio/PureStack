import type { Style } from '@purestack/ts-css'

import type { CssConfig } from '../cssConfig'
import { singlePropClass } from './utility'

/**
 * TRICKS:
 * https://css-tricks.com/creating-non-rectangular-headers/
 */

export function misc(config: CssConfig, style: Style) {
  singlePropClass(style, 'object-fit', {
    contain: 'contain',
    cover: 'cover',
    fill: 'fill',
    scale: 'scale-down',
    none: 'none',
  })

  singlePropClass(style, 'opacity', config.opacities, 'opacity')

  singlePropClass(style, 'opacity', config.opacities, 'opacity-hover', ':hover')

  singlePropClass(style, 'order', {
    first: -1,
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    last: 6,
  })

  singlePropClass(style, 'user-select', {
    all: 'all',
    auto: 'auto',
    none: 'none',
  })

  singlePropClass(
    style,
    'pointer-events',
    {
      auto: 'auto',
      none: 'none',
    },
    'pe',
  )

  style.select('.cursor-pointer').cursor('pointer !important')
  style.select('.clearfix').display('block').clear('both').content('')
  style
    .select('.vr')
    .display('inline-block')
    .alignSelf('stretch')
    .width('1px')
    .minHeight('1em')
    .backgroundColor('currentColor')
    .opacity(0.25)
}
