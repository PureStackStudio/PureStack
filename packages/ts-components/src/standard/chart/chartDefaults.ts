import { getThemePaletteVar } from '@purestack/ts-style'

export const DEFAULT_CHART_SIZE = '100%'
export const DEFAULT_CARTESIAN_CHART_WIDTH = '100%'
export const DEFAULT_CARTESIAN_CHART_HEIGHT = undefined
export const DEFAULT_CHART_EMPTY_LABEL = 'No data'
export const DEFAULT_CARTESIAN_GRID_LINE_COUNT = 5

export const CARTESIAN_CHART_VIEWBOX_HEIGHT = 58
export const CARTESIAN_CHART_PLOT_X = 8
export const CARTESIAN_CHART_PLOT_Y = 6
export const CARTESIAN_CHART_PLOT_WIDTH = 86
export const CARTESIAN_CHART_PLOT_HEIGHT = 43
export const CARTESIAN_CHART_LABEL_Y = 53.5

export const DEFAULT_CHART_COLORS = [
  getThemePaletteVar('semanticTone.accent.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.feature.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.success.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.info.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.warning.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.secondary.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.danger.button.hover.bgcolor'),
  getThemePaletteVar('semanticTone.custom.button.hover.bgcolor'),
]
