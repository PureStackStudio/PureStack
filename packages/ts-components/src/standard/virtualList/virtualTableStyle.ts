import { styleBuilder, themes } from '@purestack/ts-style'

export function registerVirtualTableStyles() {
  themes.forEach((theme) => {
    styleBuilder
      .select('.virtual-table__table th, .virtual-table__table td', theme)
      .verticalAlign('middle')

    styleBuilder
      .select('.virtual-table__table thead th', theme)
      .position('sticky')
      .top('0')
      .zIndex(2)

    styleBuilder
      .select(
        '.virtual-table__table tfoot th, .virtual-table__table tfoot td',
        theme,
      )
      .position('sticky')
      .bottom('0')
      .zIndex(1)
  })
}
