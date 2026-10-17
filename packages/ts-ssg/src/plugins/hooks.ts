import type { BuildHooks } from '../build/site'
import { awaitPlugin } from './errors'
import type { PureStackPlugin } from './types'

export const HOOK_NAMES = [
  'onConfigResolved',
  'onContentDiscovered',
  'onNavigationBuilt',
  'onPageStart',
  'onPageDocument',
  'onPageRendered',
  'onPageWritten',
  'onStylesWritten',
  'onBuildComplete',
] as const satisfies readonly (keyof BuildHooks)[]

/** One set of hooks that runs each plugin's handlers in plugin order. */
export function composePluginHooks(
  plugins: readonly PureStackPlugin[],
): BuildHooks {
  const hooks: BuildHooks = {}
  for (const name of HOOK_NAMES) {
    const handlers = plugins.flatMap((plugin) => {
      const handler = plugin.hooks?.[name]
      return handler ? [{ plugin, handler }] : []
    })
    if (handlers.length === 0) continue
    Object.assign(hooks, {
      [name]: async (...args: unknown[]) => {
        for (const { plugin, handler } of handlers) {
          await awaitPlugin(plugin.name, name, () =>
            (handler as (...hookArgs: unknown[]) => unknown).apply(
              plugin.hooks,
              args,
            ),
          )
        }
      },
    })
  }
  return hooks
}
