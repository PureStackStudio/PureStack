import path from 'node:path'
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
  // Each output is locked separately, so cleaning one must not reach into the other.
  if (
    contains(config.outDir, config.publishDir) ||
    contains(config.publishDir, config.outDir)
  ) {
    throw new Error(
      'outDir and publishDir must be the same directory or separate directories; neither may contain the other.',
    )
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

/** Whether `child` lies strictly inside `parent`. */
function contains(parent: string, child: string) {
  const relative = path.relative(parent, child)
  return (
    relative !== '' &&
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  )
}
