import type { SiteConfig } from '@purestack/ts-common'
import { resolveSiteConfig } from '../config/config'
import { resolveBuildPlugins } from '../plugins/default-plugins'
import type { PureStackPlugin } from '../plugins/plugin'
import type { BuildInput } from './site'

export interface PublishOptions {
  enabled?: boolean
}

export function resolveBuildSiteConfig(
  input: BuildInput = {},
  plugins: readonly PureStackPlugin[] = resolveBuildPlugins(input.options),
): SiteConfig {
  const config = resolveSiteConfig(input.siteConfig, {
    defaultPlugins: false,
    plugins: [...plugins],
  })
  if (input.publish?.enabled !== true) return config
  return {
    ...config,
    outDir: config.publishDir,
    html: {
      ...config.html,
      minify: true,
    },
    ...(config.style
      ? {
          style: {
            ...config.style,
            pretty: false,
          },
        }
      : {}),
  }
}
