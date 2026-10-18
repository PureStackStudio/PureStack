import type { SiteConfigResolution } from '@purestack/ts-common'
import { registerSemanticToneUtilityStyles } from '@purestack/ts-style'
import { getSvgIcon } from '@purestack/ts-svg-icons'
import { merge } from '@purestack/ts-util'
import { defineComponents } from './defineComponents'
import { resolveSiteLogoConfig } from './logoConfig'
import { registerStyles } from './registerStyles'

/** The standard server-rendered components and their shared CSS. */
export function componentsPlugin() {
  return {
    name: 'purestack:components',
    defaults: true,
    config: {
      resolve({ config, input, file }: SiteConfigResolution) {
        return {
          logo: merge(
            resolveSiteLogoConfig(input.logo, file.logo),
            config.logo,
          ),
        }
      },
      normalize({ config }: SiteConfigResolution) {
        return { logo: resolveSiteLogoConfig(config.logo) }
      },
    },
    components(): Record<string, object> {
      registerStyles()
      registerSemanticToneUtilityStyles()
      return defineComponents(getSvgIcon)
    },
  }
}
