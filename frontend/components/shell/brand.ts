import {
  type LogoConfig,
  type LogoSize,
  resolvePageContext,
} from '@purestack/ts-common'
import { defineComponent, html, type RefOrValue } from 'regor'

export interface Brand {
  config?: LogoConfig
  size?: RefOrValue<LogoSize>
}

const brandTemplate = html`<SiteLogo :config="config" :size="size"/>`

export function defineBrandComponent() {
  return defineComponent<Brand>(brandTemplate, {
    props: ['size'],
    context: (head) => ({
      ...head.props,
      config: resolvePageContext(head).site.logo,
    }),
  })
}
