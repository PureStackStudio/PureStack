import { registerSemanticToneUtilityStyles } from '@purestack/ts-style'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { defineComponents } from './defineComponents'
import { registerStyles } from './registerStyles'

/** The standard server-rendered components and their shared CSS. */
export function componentsPlugin() {
  return {
    name: 'purestack:components',
    defaults: true,
    components(): Record<string, object> {
      registerStyles()
      registerSemanticToneUtilityStyles()
      return defineComponents(getSvgIcon)
    },
  }
}
