import { Style } from '@purestack/ts-css'
import { CssConfig } from '../cssConfig'
import { singlePropClass } from './utility'

export function flex(config: CssConfig, style: Style) {
  style.select('.flex-fill').flex('1 1 auto !important')

  singlePropClass(style, 'flex-direction', {
    row: 'row',
    column: 'column',
    'row-reverse': 'row-reverse',
    'column-reverse': 'column-reverse',
  })

  singlePropClass(style, 'flex-grow', {
    row: 'row',
    column: 'column',
    0: 0,
    1: 1,
  })

  singlePropClass(style, 'flex-shrink', {
    row: 'row',
    column: 'column',
    0: 0,
    1: 1,
  })

  singlePropClass(style, 'flex-shrink', {
    row: 'row',
    column: 'wrap',
    wrap: 'wrap',
    nowrap: 'nowrap',
    'wrap-reverse': 'wrap-reverse',
  })

  style
    .select('.hstack')
    .display('flex')
    .flexDirection('row')
    .alignItems('center')
    .alignSelf('stretch')

  style
    .select('.vstack')
    .display('flex')
    .flex('1 1 auto')
    .flexDirection('column')
    .alignSelf('stretch')
}
