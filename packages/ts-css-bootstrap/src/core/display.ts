import { Style } from '@purestack/ts-css'
import { CssConfig } from '../cssConfig'
import { singlePropClass } from './utility'

export function display(config: CssConfig, style: Style) {
  singlePropClass(
    style,
    'display',
    {
      inline: 'inline',
      'inline-block': 'inline-block',
      block: 'block',
      grid: 'grid',
      'inline-grid': 'inline-grid',
      table: 'table',
      'table-row': 'table-row',
      'table-cell': 'table-cell',
      flex: 'flex',
      'inline-flex': ' inline-flex',
      none: 'none',
    },
    'd',
  )

  singlePropClass(style, 'position', {
    static: 'static',
    relative: 'relative',
    absolute: 'absolute',
    fixed: 'fixed',
    sticky: 'sticky',
  })

  style.select('.visible').visibility('visible !important')
  style.select('.hidden').visibility('hidden !important')
  style.select('.collapse').visibility('collapse !important')
}
