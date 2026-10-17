import type {
  PageHeadConfigTemplate,
  PageHeadTemplate,
  SiteConfig,
  SiteConfigResolver,
} from '@purestack/ts-common'
import { isPlainObject } from '@purestack/ts-util'
import { awaitPlugin, callPlugin } from './errors'
import type { PureStackPlugin } from './plugin'

export function resolvePluginConfigResolvers(
  plugins: readonly PureStackPlugin[],
): SiteConfigResolver[] {
  const resolvers: SiteConfigResolver[] = []
  for (const phase of ['resolve', 'normalize', 'finalize'] as const) {
    for (const plugin of plugins) {
      if (!plugin.config?.[phase]) continue
      const contribution = `config.${phase}`
      resolvers.push((source) =>
        callPlugin(plugin.name, contribution, () => {
          // Finalizers see normalized settings only after all normalizers ran.
          const result =
            phase === 'finalize'
              ? plugin.config?.finalize?.({
                  ...source,
                  config: source.config as SiteConfig,
                })
              : plugin.config?.[phase]?.(source)
          if (!isPlainObject(result))
            throw new Error(
              `${contribution} must return a configuration object synchronously.`,
            )
          return result
        }),
      )
    }
  }
  return resolvers
}

export function resolvePluginHeadTemplates(
  plugins: readonly PureStackPlugin[],
): PageHeadTemplate[] {
  const templates: PageHeadTemplate[] = []
  for (const plugin of plugins) {
    const render = plugin.head
    if (!render) continue
    templates.push((input) =>
      awaitPlugin(plugin.name, 'head', async () => {
        const result = await render.call(plugin, input)
        if (!result || typeof result.toHtml !== 'function')
          throw new Error('head must return a head node.')
        return result
      }),
    )
  }
  return templates
}

export function resolvePluginHeadConfigTemplates(
  plugins: readonly PureStackPlugin[],
): PageHeadConfigTemplate[] {
  const templates: PageHeadConfigTemplate[] = []
  for (const plugin of plugins) {
    const render = plugin.headConfig
    if (!render) continue
    templates.push((input) =>
      awaitPlugin(plugin.name, 'headConfig', async () => {
        const result = await render.call(plugin, input)
        if (!isPlainObject(result))
          throw new Error('headConfig must return a metadata object.')
        return result
      }),
    )
  }
  return templates
}
