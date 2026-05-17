import { styleBuilder, themes } from '@purestack/ts-style'

export function registerVirtualListStyles() {
  themes.forEach((theme, palette) => {
    styleBuilder
      .select('.virtual-list', theme)
      .overflowY('auto')
      .overflowX('hidden')
      .minWidth('0')

    styleBuilder
      .select('.virtual-list__spacer', theme)
      .position('relative')
      .minWidth('0')

    styleBuilder
      .select('.virtual-list__window', theme)
      .position('absolute')
      .top('0')
      .right('0')
      .left('0')
      .willChange('transform')

    styleBuilder
      .select('.virtual-list__item', theme)
      .overflow('hidden')
      .minWidth('0')

    styleBuilder
      .select('.variable-virtual-list .virtual-list__item', theme)
      .overflow('visible')
      .minWidth('0')

    styleBuilder
      .select('.virtual-list__row', theme)
      .display('grid')
      .gridTemplateColumns('10rem 7rem minmax(10rem, 16rem) minmax(0, 1fr)')
      .alignItems('center')
      .gap('0.5rem')
      .width('100%')
      .height('100%')
      .padding('0 0.75rem')
      .border('0')
      .borderBottom(`1px solid ${palette.current.border.subtle}`)
      .background('transparent')
      .color('inherit')
      .textAlign('left')
      .cursor('pointer')

    styleBuilder
      .select('.virtual-list__cell', theme)
      .overflow('hidden')
      .whiteSpace('nowrap')
      .textOverflow('ellipsis')
      .minWidth('0')
  })
}
