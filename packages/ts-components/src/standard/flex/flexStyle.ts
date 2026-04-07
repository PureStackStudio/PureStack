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

    styleBuilder.select('.flex--align-stretch', theme).alignItems('stretch')
    styleBuilder.select('.flex--align-start', theme).alignItems('flex-start')
    styleBuilder.select('.flex--align-center', theme).alignItems('center')
    styleBuilder.select('.flex--align-end', theme).alignItems('flex-end')
    styleBuilder.select('.flex--align-baseline', theme).alignItems('baseline')

    styleBuilder.select('.flex--justify-start', theme).justifyContent('flex-start')
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
  })
}
