import { Style } from '@purestack/ts-css'

import { CssConfig } from '../cssConfig'
import { singlePropClass } from './utility'

export function text(config: CssConfig, style: Style) {
  singlePropClass(
    style,
    'text-align',
    {
      start: 'left',
      end: 'right',
      center: 'center',
    },
    'text',
  )

  singlePropClass(
    style,
    'text-decoration',
    {
      none: 'none',
      underline: 'underline',
      'line-through': 'line-through',
    },
    'decoration',
  )

  singlePropClass(
    style,
    'text-transform',
    {
      lowercase: 'lowercase',
      uppercase: 'uppercase',
      capitalize: 'capitalize',
    },
    'text',
  )

  singlePropClass(
    style,
    'white-space',
    {
      wrap: 'normal',
      nowrap: 'nowrap',
    },
    'text',
  )

  singlePropClass(
    style,
    'word-wrap',
    {
      break: 'break-word',
    },
    'text',
  )

  singlePropClass(
    style,
    'word-break',
    {
      break: 'break-word',
    },
    'text',
  )

  style
    .select('.text-truncate')
    .overflow('hidden')
    .textOverflow('ellipsis')
    .whiteSpace('nowrap')

  singlePropClass(
    style,
    'font-size',
    {
      1: '1rem',
      2: '1.2rem',
      3: '1.4rem',
      4: '2rem',
      5: '3rem',
      6: '4rem',
    },
    'fs',
  )
}
