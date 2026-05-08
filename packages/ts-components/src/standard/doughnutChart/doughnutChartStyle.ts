import {
  styleBuilder,
  type ThemeMode,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

export function registerDoughnutChartStyles() {
  themes.forEach((theme, palette) => {
    registerDoughnutChartBaseStyles(theme)
    registerDoughnutChartPaintStyles(theme, palette)
  })
}

function registerDoughnutChartBaseStyles(theme: ThemeMode) {
  styleBuilder
    .select('.doughnut-chart', theme)
    .display('block')
    .maxWidth('100%')
    .height('auto')
    .overflow('visible')

  styleBuilder
    .select('.doughnut-chart__segment', theme)
    .transition('opacity 180ms ease, filter 180ms ease, transform 180ms ease')
    .transformOrigin('50px 50px')

  styleBuilder
    .select('.doughnut-chart__segments:hover .doughnut-chart__segment', theme)
    .opacity('0.72')

  styleBuilder
    .select(
      '.doughnut-chart__segments:hover .doughnut-chart__segment:hover',
      theme,
    )
    .opacity('1')
    .filter('brightness(1.08)')

  styleBuilder
    .select('.doughnut-chart__center, .doughnut-chart__empty', theme)
    .pointerEvents('none')
}

function registerDoughnutChartPaintStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.doughnut-chart__track', theme)
    .fill(palette.current.surfaceAlt.rest.bgcolor)

  styleBuilder
    .select('.doughnut-chart__center-value', theme)
    .fill(palette.current.text.default)
    .apply(palette.applyFont(palette.font.size.h4, palette.font.weight.w700))
    .set('dominant-baseline', 'middle')

  styleBuilder
    .select('.doughnut-chart__center-label', theme)
    .fill(palette.current.text.subtle)
    .apply(palette.applyFont(palette.font.size.xxxs, palette.font.weight.w700))
    .textTransform('uppercase')
    .set('dominant-baseline', 'middle')

  styleBuilder
    .select('.doughnut-chart__empty', theme)
    .fill(palette.current.text.subtle)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .set('dominant-baseline', 'middle')
}
