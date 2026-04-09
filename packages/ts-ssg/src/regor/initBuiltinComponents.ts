import { defineComponents, registerStyles } from '@purestack/ts-components'
import { ensureDomGlobals } from '@purestack/ts-minidom'
import { componentRegistry } from '@purestack/ts-render'
import {
  registerNormalizeStyles,
  registerSemanticToneUtilityStyles,
  styleBuilder,
} from '@purestack/ts-style'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { registerDocLayoutStyles } from '../templates/docLayoutStyles'
import { registerMarkdownStyles } from '../templates/markdownStyles'

export interface BuiltinComponentInitOptions {
  includeShikiStyles?: boolean
}

export function initBuiltinComponents(
  options: BuiltinComponentInitOptions = {},
) {
  ensureDomGlobals()
  styleBuilder.reset()
  componentRegistry.clear()
  registerNormalizeStyles()
  registerDocLayoutStyles()
  registerMarkdownStyles({ includeShikiStyles: options.includeShikiStyles })
  registerStyles()
  componentRegistry.registerMany(defineComponents(getSvgIcon))
  registerSemanticToneUtilityStyles()
}
