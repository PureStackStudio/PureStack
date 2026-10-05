import { AsyncLocalStorage } from 'node:async_hooks'
import { defineComponents, registerStyles } from '@purestack/ts-components'
import { ensureDomGlobals, useDomScope } from '@purestack/ts-minidom'
import { componentRegistry } from '@purestack/ts-render'
import {
  registerNormalizeStyles,
  registerSemanticToneUtilityStyles,
  styleBuilder,
} from '@purestack/ts-style'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { defineScriptComponents } from '../../../ts-components/src/standard/pageScript/pageScript'
import { registerDocLayoutStyles } from '../templates/docLayoutStyles'
import { registerMarkdownStyles } from '../templates/markdownStyles'

// Each page renders in a DOM of its own, which async hooks keep while they
// await, so renders in `serve` can overlap.
const pageDomScope = new AsyncLocalStorage()

export interface BuiltinComponentInitOptions {
  includeShikiStyles?: boolean
}

export function initBuiltinComponents(
  options: BuiltinComponentInitOptions = {},
) {
  ensureDomGlobals()
  useDomScope(pageDomScope)
  styleBuilder.reset()
  componentRegistry.clear()
  registerNormalizeStyles()
  registerDocLayoutStyles()
  registerMarkdownStyles({ includeShikiStyles: options.includeShikiStyles })
  registerStyles()
  componentRegistry.registerMany(
    defineComponents(getSvgIcon),
    defineScriptComponents(),
  )
  registerSemanticToneUtilityStyles()
}
