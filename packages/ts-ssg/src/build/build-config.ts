import type { SiteConfig } from '@purestack/ts-common'
import { resolveSiteConfig } from '../config/config'
import { resolveBuildPlugins } from '../plugins/default-plugins'
import type { PureStackPlugin } from '../plugins/plugin'
import { assertValidPlugins, withPluginSkins } from '../plugins/plugin'
import type { BuildInput } from './site'

export interface PublishOptions {
  enabled?: boolean
}

export function resolveBuildSiteConfig(
  input: BuildInput = {},
  plugins: readonly PureStackPlugin[] = resolveBuildPlugins(input.options),
): SiteConfig {
  assertValidPlugins(plugins)
  const config = withPluginSkins(plugins, () =>
    resolveSiteConfig(input.siteConfig),
  )
  if (input.publish?.enabled !== true) return config
  return {
    ...config,
    outDir: config.publishDir,
    html: {
      ...config.html,
      minify: true,
    },
    style: {
      ...config.style,
      pretty: false,
    },
  }
}
