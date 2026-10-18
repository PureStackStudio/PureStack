import type {
  SiteConfig,
  SiteConfigInput,
  SiteMdxConfig,
} from '@purestack/ts-common'
import type { BuildOptions } from '../build/site'
import { resolvePluginConfigResolvers } from '../plugins/contributions'
import { resolveBuildPlugins } from '../plugins/default-plugins'
import { assertValidPlugins, withPluginSkins } from '../plugins/plugin'
import type { PureStackPlugin } from '../plugins/types'
import { resolveCoreSiteConfig } from './core-config'

export { SITE_CONFIG_FILENAME } from './core-config'

/** Settings guaranteed by the standard plugin set. Custom plugin lists may omit them. */
export type DefaultSiteConfig = SiteConfig &
  Required<
    Pick<
      SiteConfig,
      | 'style'
      | 'docLayout'
      | 'pageToc'
      | 'logo'
      | 'auth'
      | 'consent'
      | 'analytics'
      | 'pagefind'
      | 'preview'
    >
  > & { mdx: SiteMdxConfig & { highlighter: string } }

/** Resolves only the selected plugins' settings; standard plugins are included by default. */
export function resolveSiteConfig(
  input?: SiteConfigInput,
  options?: { plugins?: undefined; defaultPlugins?: true },
): DefaultSiteConfig
export function resolveSiteConfig(
  input: SiteConfigInput | undefined,
  options: Pick<BuildOptions, 'plugins' | 'defaultPlugins'>,
): SiteConfig
export function resolveSiteConfig(
  input: SiteConfigInput = {},
  options: Pick<BuildOptions, 'plugins' | 'defaultPlugins'> = {},
): SiteConfig {
  const plugins = resolveBuildPlugins(options)
  return resolveSelectedSiteConfig(input, plugins)
}

/** Internal build entrypoint: package selection and settings share one file snapshot. */
export function resolveSelectedSiteConfig(
  input: SiteConfigInput,
  plugins: readonly PureStackPlugin[],
  file?: SiteConfigInput,
): SiteConfig {
  assertValidPlugins(plugins)
  return withPluginSkins(plugins, () =>
    resolveCoreSiteConfig(input, resolvePluginConfigResolvers(plugins), file),
  )
}
