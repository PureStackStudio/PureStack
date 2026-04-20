import type { Style } from '@purestack/ts-css'
import { styleBuilder, themes } from '@purestack/ts-style'

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
    styleBuilder.select('.flex--row-reverse', theme).flexDirection('row-reverse')

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
    'min-width: 640px',
    (style) => style.flexDirection('row'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-sm-column',
    'min-width: 640px',
    (style) => style.flexDirection('column'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-sm-column-reverse',
    'min-width: 640px',
    (style) => style.flexDirection('column-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-sm-row-reverse',
    'min-width: 640px',
    (style) => style.flexDirection('row-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-md-row',
    'min-width: 768px',
    (style) => style.flexDirection('row'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-md-column',
    'min-width: 768px',
    (style) => style.flexDirection('column'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-md-column-reverse',
    'min-width: 768px',
    (style) => style.flexDirection('column-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-md-row-reverse',
    'min-width: 768px',
    (style) => style.flexDirection('row-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-lg-row',
    'min-width: 1024px',
    (style) => style.flexDirection('row'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-lg-column',
    'min-width: 1024px',
    (style) => style.flexDirection('column'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-lg-column-reverse',
    'min-width: 1024px',
    (style) => style.flexDirection('column-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-lg-row-reverse',
    'min-width: 1024px',
    (style) => style.flexDirection('row-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-xl-row',
    'min-width: 1280px',
    (style) => style.flexDirection('row'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-xl-column',
    'min-width: 1280px',
    (style) => style.flexDirection('column'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-xl-column-reverse',
    'min-width: 1280px',
    (style) => style.flexDirection('column-reverse'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--direction-xl-row-reverse',
    'min-width: 1280px',
    (style) => style.flexDirection('row-reverse'),
  )
}

function applyResponsiveFlexAlignStyles(theme: string) {
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-stretch',
    'min-width: 640px',
    (style) => style.alignItems('stretch'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-start',
    'min-width: 640px',
    (style) => style.alignItems('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-center',
    'min-width: 640px',
    (style) => style.alignItems('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-end',
    'min-width: 640px',
    (style) => style.alignItems('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-sm-baseline',
    'min-width: 640px',
    (style) => style.alignItems('baseline'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-stretch',
    'min-width: 768px',
    (style) => style.alignItems('stretch'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-start',
    'min-width: 768px',
    (style) => style.alignItems('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-center',
    'min-width: 768px',
    (style) => style.alignItems('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-end',
    'min-width: 768px',
    (style) => style.alignItems('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-md-baseline',
    'min-width: 768px',
    (style) => style.alignItems('baseline'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-stretch',
    'min-width: 1024px',
    (style) => style.alignItems('stretch'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-start',
    'min-width: 1024px',
    (style) => style.alignItems('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-center',
    'min-width: 1024px',
    (style) => style.alignItems('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-end',
    'min-width: 1024px',
    (style) => style.alignItems('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-lg-baseline',
    'min-width: 1024px',
    (style) => style.alignItems('baseline'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-stretch',
    'min-width: 1280px',
    (style) => style.alignItems('stretch'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-start',
    'min-width: 1280px',
    (style) => style.alignItems('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-center',
    'min-width: 1280px',
    (style) => style.alignItems('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-end',
    'min-width: 1280px',
    (style) => style.alignItems('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--align-xl-baseline',
    'min-width: 1280px',
    (style) => style.alignItems('baseline'),
  )
}

function applyResponsiveFlexJustifyStyles(theme: string) {
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-start',
    'min-width: 640px',
    (style) => style.justifyContent('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-center',
    'min-width: 640px',
    (style) => style.justifyContent('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-end',
    'min-width: 640px',
    (style) => style.justifyContent('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-between',
    'min-width: 640px',
    (style) => style.justifyContent('space-between'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-around',
    'min-width: 640px',
    (style) => style.justifyContent('space-around'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-sm-evenly',
    'min-width: 640px',
    (style) => style.justifyContent('space-evenly'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-start',
    'min-width: 768px',
    (style) => style.justifyContent('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-center',
    'min-width: 768px',
    (style) => style.justifyContent('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-end',
    'min-width: 768px',
    (style) => style.justifyContent('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-between',
    'min-width: 768px',
    (style) => style.justifyContent('space-between'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-around',
    'min-width: 768px',
    (style) => style.justifyContent('space-around'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-md-evenly',
    'min-width: 768px',
    (style) => style.justifyContent('space-evenly'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-start',
    'min-width: 1024px',
    (style) => style.justifyContent('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-center',
    'min-width: 1024px',
    (style) => style.justifyContent('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-end',
    'min-width: 1024px',
    (style) => style.justifyContent('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-between',
    'min-width: 1024px',
    (style) => style.justifyContent('space-between'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-around',
    'min-width: 1024px',
    (style) => style.justifyContent('space-around'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-lg-evenly',
    'min-width: 1024px',
    (style) => style.justifyContent('space-evenly'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-start',
    'min-width: 1280px',
    (style) => style.justifyContent('flex-start'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-center',
    'min-width: 1280px',
    (style) => style.justifyContent('center'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-end',
    'min-width: 1280px',
    (style) => style.justifyContent('flex-end'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-between',
    'min-width: 1280px',
    (style) => style.justifyContent('space-between'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-around',
    'min-width: 1280px',
    (style) => style.justifyContent('space-around'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--justify-xl-evenly',
    'min-width: 1280px',
    (style) => style.justifyContent('space-evenly'),
  )
}

function applyResponsiveFlexWrapStyles(theme: string) {
  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-sm',
    'min-width: 640px',
    (style) => style.flexWrap('wrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--nowrap-sm',
    'min-width: 640px',
    (style) => style.flexWrap('nowrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-sm-reverse',
    'min-width: 640px',
    (style) => style.flexWrap('wrap-reverse'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-md',
    'min-width: 768px',
    (style) => style.flexWrap('wrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--nowrap-md',
    'min-width: 768px',
    (style) => style.flexWrap('nowrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-md-reverse',
    'min-width: 768px',
    (style) => style.flexWrap('wrap-reverse'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-lg',
    'min-width: 1024px',
    (style) => style.flexWrap('wrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--nowrap-lg',
    'min-width: 1024px',
    (style) => style.flexWrap('nowrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-lg-reverse',
    'min-width: 1024px',
    (style) => style.flexWrap('wrap-reverse'),
  )

  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-xl',
    'min-width: 1280px',
    (style) => style.flexWrap('wrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--nowrap-xl',
    'min-width: 1280px',
    (style) => style.flexWrap('nowrap'),
  )
  applyResponsiveFlexStyle(
    theme,
    '.flex--wrap-xl-reverse',
    'min-width: 1280px',
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
