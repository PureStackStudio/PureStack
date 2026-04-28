import { styleBuilder, themes } from '@purestack/ts-style'

export function registerPanelStyles() {
  themes.forEach((theme, palette) => {
    styleBuilder
      .select('.panel', theme)
      .display('grid')
      .boxShadow(palette.effect.panelShadow)
      .overflow('hidden')
      .transition(
        'border-color 180ms ease, box-shadow 180ms ease, background 180ms ease',
      )

    styleBuilder.select('.panel__body', theme).padding('1em').overflowX('auto')
  })
}
