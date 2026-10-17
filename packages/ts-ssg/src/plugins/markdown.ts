import { isPlainObject } from '@purestack/ts-util'
import type {
  Pluggable,
  PluggableList,
  Plugin,
  Processor,
  Transformer,
} from 'unified'
import { createContentProcessor } from '../mdx/compile'
import { callPlugin, pluginError } from './errors'
import type { PureStackPlugin } from './plugin'

/** Retains unified's plugin identity, option merging, presets, and callback transforms. */
export function resolvePluginContentProcessor(
  plugins: readonly PureStackPlugin[],
) {
  const attached = new Map<Plugin<unknown[]>, Plugin<unknown[]>>()
  function list(
    plugin: PureStackPlugin,
    field: 'remarkPlugins' | 'rehypePlugins' | 'rehypePostPlugins',
    values: PluggableList,
  ): PluggableList {
    const contribution = `markdown.${field}`
    function attacher(original: Plugin<unknown[]>): Plugin<unknown[]> {
      const existing = attached.get(original)
      if (existing) return existing
      const wrapped = function (this: Processor, ...options: unknown[]) {
        const transform = callPlugin(plugin.name, contribution, () =>
          original.apply(this, options),
        )
        if (typeof transform !== 'function') return transform
        if (transform.length >= 3) {
          return function (this: unknown, tree, file, next) {
            return callPlugin(plugin.name, contribution, () =>
              transform.call(this, tree, file, (error, ...result) =>
                next(
                  error
                    ? pluginError(plugin.name, contribution, error)
                    : undefined,
                  ...result,
                ),
              ),
            )
          } satisfies Transformer
        }
        return function (this: unknown, tree, file) {
          return callPlugin(plugin.name, contribution, () => {
            const result = transform.call(this, tree, file, undefined as never)
            if (result && 'then' in result && typeof result.then === 'function')
              return Promise.resolve(result).catch((error) => {
                throw pluginError(plugin.name, contribution, error)
              })
            return result
          })
        } satisfies Transformer
      } satisfies Plugin<unknown[]>
      attached.set(original, wrapped)
      return wrapped
    }
    return values.map(
      (value): Pluggable =>
        callPlugin(plugin.name, contribution, () => {
          if (typeof value === 'function') return attacher(value)
          if (Array.isArray(value) && typeof value[0] === 'function')
            return [attacher(value[0]), ...value.slice(1)]
          if (!isPlainObject(value))
            throw new Error(
              'Expected a unified plugin, plugin tuple, or preset.',
            )
          return {
            ...value,
            ...(value.plugins
              ? { plugins: list(plugin, field, value.plugins) }
              : {}),
          }
        }),
    )
  }
  const collect = (
    field: 'remarkPlugins' | 'rehypePlugins' | 'rehypePostPlugins',
  ) =>
    plugins.flatMap((plugin) =>
      list(plugin, field, plugin.markdown?.[field] ?? []),
    )
  return createContentProcessor(
    collect('remarkPlugins'),
    collect('rehypePlugins'),
    collect('rehypePostPlugins'),
  )
}
