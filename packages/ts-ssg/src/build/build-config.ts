import type { SiteConfig, SiteConfigInput } from '@purestack/ts-common'
import { resolveSelectedSiteConfig } from '../config/config'
import type { PureStackPlugin } from '../plugins/plugin'
import type { BuildInput } from './site'

export interface PublishOptions {
  enabled?: boolean
}

export function resolveBuildSiteConfig(
  input: BuildInput,
  plugins: readonly PureStackPlugin[],
  file?: SiteConfigInput,
): SiteConfig {
  const config: SiteConfig = {
    ...resolveSelectedSiteConfig(input.siteConfig ?? {}, plugins, file),
    cache: input.options?.cache !== false,
  }
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
