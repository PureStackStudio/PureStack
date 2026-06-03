import {
  styleBuilder,
  type ThemeMode,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

const BAR_CHART_VALUE_FONT_SIZE = '0.15625rem'
const BAR_CHART_LABEL_FONT_SIZE = '0.1375rem'
const BAR_CHART_AXIS_FONT_SIZE = '0.11875rem'
const BAR_CHART_EMPTY_FONT_SIZE = '0.1625rem'

export function registerBarChartStyles() {
  themes.forEach((theme, palette) => {
    registerBarChartBaseStyles(theme)
    registerBarChartPaintStyles(theme, palette)
  })
}

function registerBarChartBaseStyles(theme: ThemeMode) {
  styleBuilder
    .select('.bar-chart__bar', theme)
    .transition('opacity 180ms ease, filter 180ms ease, transform 180ms ease')
    .transformOrigin('center bottom')

  styleBuilder
    .select('.bar-chart__plot:hover .bar-chart__bar', theme)
    .opacity('0.72')

  styleBuilder
    .select('.bar-chart__plot:hover .bar-chart__bar:hover', theme)
    .opacity('1')
    .filter('brightness(1.08)')

  styleBuilder
    .select(
      '.bar-chart__label, .bar-chart__value, .bar-chart__empty, .bar-chart__grid-line text',
      theme,
    )
    .pointerEvents('none')
}

function registerBarChartPaintStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.bar-chart__grid-line line', theme)
    .stroke(palette.current.surfaceAlt.rest.border)
    .strokeWidth('0.22')

  styleBuilder
    .select('.bar-chart__zero-line', theme)
    .stroke(palette.current.border.subtle)
    .strokeWidth('0.36')

  styleBuilder
    .select('.bar-chart__value', theme)
    .fill(palette.current.text.default)
    .fontSize(BAR_CHART_VALUE_FONT_SIZE)
    .fontWeight(palette.font.weight.w700)

  styleBuilder
    .select('.bar-chart__label', theme)
    .fill(palette.current.text.subtle)
    .fontSize(BAR_CHART_LABEL_FONT_SIZE)
    .fontWeight(palette.font.weight.w700)

  styleBuilder
    .select('.bar-chart__grid-line text', theme)
    .fill(palette.current.text.subtle)
    .fontSize(BAR_CHART_AXIS_FONT_SIZE)
    .fontWeight(palette.font.weight.w500)
    .set('dominant-baseline', 'middle')
    .set('text-anchor', 'end')

  styleBuilder
    .select('.bar-chart__empty', theme)
    .fill(palette.current.text.subtle)
    .fontSize(BAR_CHART_EMPTY_FONT_SIZE)
    .fontWeight(palette.font.weight.w700)
    .set('dominant-baseline', 'middle')
}
