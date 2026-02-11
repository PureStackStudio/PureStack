import type { Style } from '@purestack/ts-css'

import type { CssConfig } from '../cssConfig'

export function modal(config: CssConfig, style: Style) {
  style
    .select('.modal')
    .position('fixed')
    .top('0')
    .left('0')
    .zIndex(config.modal.zIndex)
    .display('none')
    .width('100%')
    .height('100%')
    .overflowX('hidden')
    .overflowY('hidden')
    .outline('0')

  style
    .select('.modal-dialog')
    .position('relative')
    .width('auto')
    .margin(config.modal.margin)
    .pointerEvents('none')

  style
    .select('.modal.fade .modal-dialog')
    .transition('transform 0.3s ease-out ease-in')
    .transform('translate(0, -50px)')

  style
    .select('.modal-content')
    .position('relative')
    .display('flex')
    .flexDirection('column')
    .width('100%')
    .pointerEvents('auto')
    .border('solid 1px black')
    .borderRadius('1rem')
    .outline('0')
    .background(config.colors.black[2])

  style.select('.modal.show').transform('none').display('block')

  style.select('.modal.show .modal-dialog').transform('none')
}
