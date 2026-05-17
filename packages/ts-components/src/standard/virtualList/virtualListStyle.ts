import { styleBuilder, themes } from '@purestack/ts-style'

export function registerVirtualListStyles() {
  themes.forEach((theme) => {
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
  })
}
