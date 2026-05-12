import { styleBuilder, themes } from '@purestack/ts-style'

export function registerPanelStyles() {
  themes.forEach((theme, palette) => {
    styleBuilder
      .select('.panel', theme)
      .display('grid')
      .padding('1em')
      .boxShadow(palette.effect.panelShadow)
      .overflow('hidden')
      .transition(
        'border-color 180ms ease, box-shadow 180ms ease, background 180ms ease',
      )
  })
}
