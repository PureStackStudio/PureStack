import { createColors } from './colorMaster'

export interface BreakPoint {
  key: string
  media: string
  width: string
}
export const emptyBreakpoint: BreakPoint = {
  key: '',
  media: '',
  width: '',
}
interface ColorVariations {
  count: number
  left: number
  right: number
  reverse?: boolean
}

export class CssConfig {
  modal = {
    zIndex: 1055,
    margin: '0.5rem'
  }

  breakpoints: BreakPoint[] = [
    { key: 'sm', media: '576px', width: '540px' },
    { key: 'md', media: '768px', width: '720px' },
    { key: 'lg', media: '992px', width: '960px' },
    { key: 'xl', media: '1200px', width: '1140px' },
    { key: 'xxl', media: '1400px', width: '1320px' },
  ]

  opacities = {
    0: 0,
    25: 0.25,
    50: 0.5,
    75: 0.75,
    100: 1,
  }

  spacers = {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '1rem',
    4: '1.5rem',
    5: '3rem',
  }

  rounded = {
    0: '0',
    1: '0.2rem',
    2: '0.25rem',
    3: '0.5rem',
    4: '1rem',
    5: '3rem',
    6: '6rem',
    circle: '50%',
  }

  grid = {
    columns: 12,
    gutterWidth: '1rem',
    rowColumns: 6,
    gutter: '0',
  }

  presetDefaultTagColors = (): Record<string, string> => {
    return {
      h1: this.colors.purple[5],
    }
  }

  presetDefaultForeground = () => {
    return this.colors.gray[1]
  }

  presetDefaultBackground = () => {
    return '#FFFFFF'
  }

  colorVariations: Record<string, ColorVariations> = {
    default: { count: 10, left: 15, right: 15 },
    gray: {
      count: 10,
      left: 0,
      right: 80,
      reverse: true /** for dark mode */,
    },
  }

  colors: Record<string, string[]> = {
    black: ['#262a36'],
    white: ['#999999'],
    purple: ['#e10cd6'],
    teal: ['#338077'],
    orange: ['#FFBF00'],
    gray: ['#222222'],
  }

  fontFamilies = {
    bodyFontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    headingFontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    codeFont:
      'SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  }

  fontStyles = {
    headingFontStyle: '',
  }

  fontSizes = {
    bodyFontSize: '1rem',
    codeFontSize: '0.875rem',
    headings: [0, 2.5, 2, 1.75, 1.5, 1.25, 1],
    subSupSize: '0.75em',
  }

  fontWeights = {
    bold: '700',
    bolder: '700',
    bodyFontWeight: '400',
    headingFontWeight: 'bolder',
  }

  lineHeights = {
    bodyLineHeight: '1.5',
    headingLineHeight: '1.2',
  }

  margins = {
    margin1: '0.5rem',
    headingMarginBottom: '0.5rem',
    paragraphMarginBottom: '0.5rem',
  }

  borderWidths = {
    borderWidth1: '1px',
  }

  paddings = {
    tableCellPaddingY: '.5rem',
    containerPaddingx: '.5rem',
  }

  prepare() {
    this.prepareColorVariations()
  }

  prepareColorVariations() {
    const log = false
    const variations = this.colorVariations
    const colors = [...Object.entries(this.colors)]
    for (const [key, value] of colors) {
      const color = value[0]
      const opt = variations[key] ?? variations.default
      const generated = createColors(
        color,
        opt.left,
        opt.right,
        opt.count,
        opt.reverse
      )
      if (log) {
        console.log('------------------------------------------------')
        console.log('key:', key)
        console.log('color:', color)
        console.log(opt)
        console.log('------------------------------------------------')
        console.log(generated.map((x) => `color: ${x};`).join('\r\n'))
      }
      this.colors[key] = generated
    }
  }
}
