import {
  styleBuilder,
  type ThemeMode,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

const LINE_CHART_VALUE_FONT_SIZE = '2.4px'
const LINE_CHART_LABEL_FONT_SIZE = '2.2px'
const LINE_CHART_AXIS_FONT_SIZE = '1.9px'
const LINE_CHART_EMPTY_FONT_SIZE = '2.6px'

export function registerLineChartStyles() {
  themes.forEach((theme, palette) => {
    registerLineChartBaseStyles(theme)
    registerLineChartPaintStyles(theme, palette)
  })
}

function registerLineChartBaseStyles(theme: ThemeMode) {
  styleBuilder
    .select('.line-chart__line', theme)
    .fill('none')
    .strokeWidth('0.72')
    .strokeLinecap('round')
    .strokeLinejoin('round')
    .transition('opacity 180ms ease, filter 180ms ease')

  styleBuilder
    .select('.line-chart__area', theme)
    .opacity('0.14')
    .transition('opacity 180ms ease')

  styleBuilder.select('.line-chart__point', theme).strokeWidth('0')

  styleBuilder
    .select('.line-chart__series:hover .line-chart__line', theme)
    .opacity('0.54')

  styleBuilder
    .select('.line-chart__series:hover .line-chart__line:hover', theme)
    .opacity('1')
    .filter('brightness(1.12)')

  styleBuilder
    .select(
      '.line-chart__label, .line-chart__value, .line-chart__empty, .line-chart__grid-line text',
      theme,
    )
    .pointerEvents('none')
}

function registerLineChartPaintStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.line-chart__grid-line line', theme)
    .stroke(palette.current.surfaceAlt.rest.border)
    .strokeWidth('0.22')

  styleBuilder
    .select('.line-chart__zero-line', theme)
    .stroke(palette.current.border.subtle)
    .strokeWidth('0.36')

  styleBuilder
    .select('.line-chart__value', theme)
    .fill(palette.current.text.default)
    .fontSize(LINE_CHART_VALUE_FONT_SIZE)
    .fontWeight(palette.font.weight.w700)

  styleBuilder
    .select('.line-chart__label', theme)
    .fill(palette.current.text.subtle)
    .fontSize(LINE_CHART_LABEL_FONT_SIZE)
    .fontWeight(palette.font.weight.w700)

  styleBuilder
    .select('.line-chart__grid-line text', theme)
    .fill(palette.current.text.subtle)
    .fontSize(LINE_CHART_AXIS_FONT_SIZE)
    .fontWeight(palette.font.weight.w500)
    .set('dominant-baseline', 'middle')
    .set('text-anchor', 'end')

  styleBuilder
    .select('.line-chart__empty', theme)
    .fill(palette.current.text.subtle)
    .fontSize(LINE_CHART_EMPTY_FONT_SIZE)
    .fontWeight(palette.font.weight.w700)
    .set('dominant-baseline', 'middle')
}
