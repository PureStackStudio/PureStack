import type { Style } from '@purestack/ts-css'

import type { CssConfig } from '../cssConfig'
import { singlePropClass } from './utility'

export function size(_config: CssConfig, style: Style) {
  singlePropClass(
    style,
    'width',
    {
      25: '25%',
      50: '50%',
      75: '75%',
      100: '100%',
      auto: 'auto',
    },
    'w',
  )

  singlePropClass(
    style,
    'height',
    {
      25: '25%',
      50: '50%',
      75: '75%',
      100: '100%',
      auto: 'auto',
    },
    'h',
  )

  singlePropClass(
    style,
    'max-width',
    {
      100: '100%',
    },
    'max-w',
  )

  singlePropClass(
    style,
    'max-height',
    {
      100: '100%',
    },
    'max-h',
  )

  singlePropClass(
    style,
    'min-width',
    {
      100: '100%',
    },
    'min-w',
  )

  singlePropClass(
    style,
    'min-height',
    {
      100: '100%',
    },
    'min-h',
  )

  singlePropClass(
    style,
    'width',
    {
      100: '100vw',
    },
    'vw',
  )

  singlePropClass(
    style,
    'height',
    {
      100: '100vh',
    },
    'vh',
  )

  singlePropClass(
    style,
    'min-width',
    {
      100: '100vw',
    },
    'min-vw',
  )

  singlePropClass(
    style,
    'min-height',
    {
      100: '100vh',
    },
    'min-vh',
  )

  singlePropClass(
    style,
    'max-width',
    {
      100: '100vw',
    },
    'max-vw',
  )

  singlePropClass(
    style,
    'max-height',
    {
      100: '100vh',
    },
    'max-vh',
  )
}
