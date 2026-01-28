import { Style } from '@purestack/ts-css'
import { CssConfig } from '../cssConfig'
import { singlePropClass } from './utility'

export function spacing(config: CssConfig, style: Style) {
  singlePropClass(style, 'padding', config.spacers, 'p')
  singlePropClass(style, 'padding-right', config.spacers, 'px')
  singlePropClass(style, 'padding-left', config.spacers, 'px')
  singlePropClass(style, 'padding-top', config.spacers, 'py')
  singlePropClass(style, 'padding-bottom', config.spacers, 'py')
  singlePropClass(style, 'padding-top', config.spacers, 'pt')
  singlePropClass(style, 'padding-bottom', config.spacers, 'pb')
  singlePropClass(style, 'padding-right', config.spacers, 'pe')
  singlePropClass(style, 'padding-left', config.spacers, 'ps')

  const spacers: Record<string | number, string | number> = {
    ...config.spacers,
    auto: 'auto',
  }

  singlePropClass(style, 'margin', spacers, 'm')
  singlePropClass(style, 'margin-right', spacers, 'mx')
  singlePropClass(style, 'margin-left', spacers, 'mx')
  singlePropClass(style, 'margin-top', spacers, 'my')
  singlePropClass(style, 'margin-bottom', spacers, 'my')
  singlePropClass(style, 'margin-top', spacers, 'mt')
  singlePropClass(style, 'margin-bottom', spacers, 'mb')
  singlePropClass(style, 'margin-right', spacers, 'me')
  singlePropClass(style, 'margin-left', spacers, 'ms')

  singlePropClass(style, 'gap', config.spacers)
  singlePropClass(style, 'row-gap', config.spacers)
  singlePropClass(style, 'column-gap', config.spacers)

  style.select('.top-0').top('0 !important')
  style.select('.left-0').left('0 !important')
  style.select('.bottom-0').bottom('0 !important')
  style.select('.right-0').right('0 !important')
}
