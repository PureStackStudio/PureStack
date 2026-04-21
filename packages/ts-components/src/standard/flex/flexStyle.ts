import type { Style } from '@purestack/ts-css'
import { mediaMin, styleBuilder, themes } from '@purestack/ts-style'

export function registerFlexStyles() {
  themes.forEach((theme) => {
    styleBuilder
      .select('.flex', theme)
      .display('flex')
      .minWidth('0')
      .gap('0.75rem')
      .flexDirection('row')
      .alignItems('stretch')
      .justifyContent('flex-start')
      .flexWrap('nowrap')

    styleBuilder.select('.flex > *', theme).minWidth('0')

    styleBuilder.select('.flex--inline', theme).display('inline-flex')
    styleBuilder.select('.flex--column', theme).flexDirection('column')
    styleBuilder
      .select('.flex--column-reverse', theme)
      .flexDirection('column-reverse')
    styleBuilder
      .select('.flex--row-reverse', theme)
      .flexDirection('row-reverse')

    styleBuilder.select('.flex--align-stretch', theme).alignItems('stretch')
    styleBuilder.select('.flex--align-start', theme).alignItems('flex-start')
    styleBuilder.select('.flex--align-center', theme).alignItems('center')
    styleBuilder.select('.flex--align-end', theme).alignItems('flex-end')
    styleBuilder.select('.flex--align-baseline', theme).alignItems('baseline')

    styleBuilder
      .select('.flex--justify-start', theme)
      .justifyContent('flex-start')
    styleBuilder.select('.flex--justify-center', theme).justifyContent('center')
    styleBuilder.select('.flex--justify-end', theme).justifyContent('flex-end')
    styleBuilder
      .select('.flex--justify-between', theme)
      .justifyContent('space-between')
    styleBuilder
      .select('.flex--justify-around', theme)
      .justifyContent('space-around')
    styleBuilder
      .select('.flex--justify-evenly', theme)
      .justifyContent('space-evenly')

    styleBuilder.select('.flex--wrap', theme).flexWrap('wrap')
    styleBuilder.select('.flex--wrap-reverse', theme).flexWrap('wrap-reverse')

    applyResponsiveFlexUtilities(theme)

    styleBuilder.select('.flex-auto', theme).flex('1 1 auto').minWidth('0')
    styleBuilder.select('.flex-none', theme).flex('0 0 auto')
    styleBuilder.select('.flex-fill', theme).flex('1 1 0%')
    styleBuilder.select('.flex-1', theme).flex('1 1 0%').minWidth('0')
  })
}

function applyResponsiveFlexUtilities(theme: string) {
  applyResponsiveFlexDirectionStyles(theme)
  applyResponsiveFlexAlignStyles(theme)
  applyResponsiveFlexJustifyStyles(theme)
  applyResponsiveFlexWrapStyles(theme)
}

function applyResponsiveFlexDirectionStyles(theme: string) {
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-sm-row',
    mediaMin('sm'),
    (style) => style.flexDirection('row'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-sm-column',
    mediaMin('sm'),
    (style) => style.flexDirection('column'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-sm-column-reverse',
    mediaMin('sm'),
    (style) => style.flexDirection('column-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-sm-row-reverse',
    mediaMin('sm'),
    (style) => style.flexDirection('row-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-md-row',
    mediaMin('md'),
    (style) => style.flexDirection('row'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-md-column',
    mediaMin('md'),
    (style) => style.flexDirection('column'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-md-column-reverse',
    mediaMin('md'),
    (style) => style.flexDirection('column-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-md-row-reverse',
    mediaMin('md'),
    (style) => style.flexDirection('row-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-lg-row',
    mediaMin('lg'),
    (style) => style.flexDirection('row'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-lg-column',
    mediaMin('lg'),
    (style) => style.flexDirection('column'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-lg-column-reverse',
    mediaMin('lg'),
    (style) => style.flexDirection('column-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-lg-row-reverse',
    mediaMin('lg'),
    (style) => style.flexDirection('row-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-xl-row',
    mediaMin('xl'),
    (style) => style.flexDirection('row'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-xl-column',
    mediaMin('xl'),
    (style) => style.flexDirection('column'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-xl-column-reverse',
    mediaMin('xl'),
    (style) => style.flexDirection('column-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-xl-row-reverse',
    mediaMin('xl'),
    (style) => style.flexDirection('row-reverse'),
  )
}

function applyResponsiveFlexAlignStyles(theme: string) {
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-stretch',
    mediaMin('sm'),
    (style) => style.alignItems('stretch'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-start',
    mediaMin('sm'),
    (style) => style.alignItems('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-center',
    mediaMin('sm'),
    (style) => style.alignItems('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-end',
    mediaMin('sm'),
    (style) => style.alignItems('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-baseline',
    mediaMin('sm'),
    (style) => style.alignItems('baseline'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-stretch',
    mediaMin('md'),
    (style) => style.alignItems('stretch'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-start',
    mediaMin('md'),
    (style) => style.alignItems('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-center',
    mediaMin('md'),
    (style) => style.alignItems('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-end',
    mediaMin('md'),
    (style) => style.alignItems('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-baseline',
    mediaMin('md'),
    (style) => style.alignItems('baseline'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-stretch',
    mediaMin('lg'),
    (style) => style.alignItems('stretch'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-start',
    mediaMin('lg'),
    (style) => style.alignItems('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-center',
    mediaMin('lg'),
    (style) => style.alignItems('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-end',
    mediaMin('lg'),
    (style) => style.alignItems('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-baseline',
    mediaMin('lg'),
    (style) => style.alignItems('baseline'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-stretch',
    mediaMin('xl'),
    (style) => style.alignItems('stretch'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-start',
    mediaMin('xl'),
    (style) => style.alignItems('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-center',
    mediaMin('xl'),
    (style) => style.alignItems('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-end',
    mediaMin('xl'),
    (style) => style.alignItems('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-baseline',
    mediaMin('xl'),
    (style) => style.alignItems('baseline'),
  )
}

function applyResponsiveFlexJustifyStyles(theme: string) {
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-start',
    mediaMin('sm'),
    (style) => style.justifyContent('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-center',
    mediaMin('sm'),
    (style) => style.justifyContent('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-end',
    mediaMin('sm'),
    (style) => style.justifyContent('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-between',
    mediaMin('sm'),
    (style) => style.justifyContent('space-between'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-around',
    mediaMin('sm'),
    (style) => style.justifyContent('space-around'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-evenly',
    mediaMin('sm'),
    (style) => style.justifyContent('space-evenly'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-start',
    mediaMin('md'),
    (style) => style.justifyContent('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-center',
    mediaMin('md'),
    (style) => style.justifyContent('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-end',
    mediaMin('md'),
    (style) => style.justifyContent('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-between',
    mediaMin('md'),
    (style) => style.justifyContent('space-between'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-around',
    mediaMin('md'),
    (style) => style.justifyContent('space-around'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-evenly',
    mediaMin('md'),
    (style) => style.justifyContent('space-evenly'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-start',
    mediaMin('lg'),
    (style) => style.justifyContent('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-center',
    mediaMin('lg'),
    (style) => style.justifyContent('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-end',
    mediaMin('lg'),
    (style) => style.justifyContent('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-between',
    mediaMin('lg'),
    (style) => style.justifyContent('space-between'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-around',
    mediaMin('lg'),
    (style) => style.justifyContent('space-around'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-evenly',
    mediaMin('lg'),
    (style) => style.justifyContent('space-evenly'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-start',
    mediaMin('xl'),
    (style) => style.justifyContent('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-center',
    mediaMin('xl'),
    (style) => style.justifyContent('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-end',
    mediaMin('xl'),
    (style) => style.justifyContent('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-between',
    mediaMin('xl'),
    (style) => style.justifyContent('space-between'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-around',
    mediaMin('xl'),
    (style) => style.justifyContent('space-around'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-evenly',
    mediaMin('xl'),
    (style) => style.justifyContent('space-evenly'),
  )
}

function applyResponsiveFlexWrapStyles(theme: string) {
  applyResponsiveFlexStyle(theme, '.flex--wrap-sm', mediaMin('sm'), (style) =>
    style.flexWrap('wrap'),
  )
  applyResponsiveFlexStyle(theme, '.flex--nowrap-sm', mediaMin('sm'), (style) =>
    style.flexWrap('nowrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-sm-reverse',
    mediaMin('sm'),
    (style) => style.flexWrap('wrap-reverse'),
  )

  applyResponsiveFlexStyle(theme, '.flex--wrap-md', mediaMin('md'), (style) =>
    style.flexWrap('wrap'),
  )
  applyResponsiveFlexStyle(theme, '.flex--nowrap-md', mediaMin('md'), (style) =>
    style.flexWrap('nowrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-md-reverse',
    mediaMin('md'),
    (style) => style.flexWrap('wrap-reverse'),
  )

  applyResponsiveFlexStyle(theme, '.flex--wrap-lg', mediaMin('lg'), (style) =>
    style.flexWrap('wrap'),
  )
  applyResponsiveFlexStyle(theme, '.flex--nowrap-lg', mediaMin('lg'), (style) =>
    style.flexWrap('nowrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-lg-reverse',
    mediaMin('lg'),
    (style) => style.flexWrap('wrap-reverse'),
  )

  applyResponsiveFlexStyle(theme, '.flex--wrap-xl', mediaMin('xl'), (style) =>
    style.flexWrap('wrap'),
  )
  applyResponsiveFlexStyle(theme, '.flex--nowrap-xl', mediaMin('xl'), (style) =>
    style.flexWrap('nowrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-xl-reverse',
    mediaMin('xl'),
    (style) => style.flexWrap('wrap-reverse'),
  )
}

function applyResponsiveFlexStyle(
  theme: string,
  selector: string,
  media: string,
  apply: (style: Style) => void,
) {
  apply(styleBuilder.select(selector, theme).media(media))
}
