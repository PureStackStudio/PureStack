import { styleBuilder, themes } from '@purestack/ts-style'

export function registerTocPlaygroundStyles() {
  themes.forEach((theme) => {
    styleBuilder.select('.toc-playground__frame', theme).height('42rem')
  })
}
