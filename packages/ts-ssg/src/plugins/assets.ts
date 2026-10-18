import type { SiteAssets, SiteConfig } from '@purestack/ts-common'
import { isPlainObject } from '@purestack/ts-util'
import { awaitPlugin, callPlugin } from './errors'
import type { PureStackPlugin } from './types'

export function resolvePluginAssets(
  plugins: readonly PureStackPlugin[],
  config: SiteConfig,
): SiteAssets[] {
  const processors: SiteAssets[] = []
  const owners = new Map<string, string>()
  for (const plugin of plugins) {
    const processor = callPlugin(plugin.name, 'assets', () =>
      plugin.assets?.(config),
    )
    if (processor === undefined) continue
    callPlugin(plugin.name, 'assets', () => {
      if (
        !isPlainObject(processor) ||
        typeof processor.namespace !== 'string' ||
        !/^[a-z0-9][a-z0-9_-]*$/.test(processor.namespace) ||
        typeof processor.processPage !== 'function'
      ) {
        throw new Error(
          'assets must return a namespace and processPage function.',
        )
      }
      const previous = owners.get(processor.namespace)
      if (previous)
        throw new Error(
          `Asset namespace "${processor.namespace}" is already owned by plugin "${previous}".`,
        )
      owners.set(processor.namespace, plugin.name)
      processors.push({
        namespace: processor.namespace,
        processPage: (input) =>
          awaitPlugin(plugin.name, 'assets.processPage', () =>
            processor.processPage(input),
          ),
      })
    })
  }
  return processors
}
