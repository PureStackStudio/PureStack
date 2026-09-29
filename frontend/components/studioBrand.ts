import {
  type LogoConfig,
  type LogoSize,
  resolveTsSsgContext,
} from '@purestack/ts-common'
import { defineComponent, html, type RefOrValue } from 'regor'

export interface StudioBrand {
  config: LogoConfig
  size?: RefOrValue<LogoSize>
}

const studioBrandTemplate = html`<SiteLogo :config="config" :size="size"/>`

export function defineStudioBrandComponent() {
  return defineComponent<StudioBrand>(studioBrandTemplate, {
    props: ['size'],
    context: (head) => ({
      ...head.props,
      config: resolveTsSsgContext(head).site.logo,
    }),
  })
}
