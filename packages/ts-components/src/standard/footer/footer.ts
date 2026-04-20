import {
  getSemanticToneSurfaceClass,
  type SemanticTone,
} from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export interface SiteFooter {
  teleport?: string
  ariaLabel?: string
  copyright?: string
  legalLabel?: string
  tone?: RefOrValue<SemanticTone>
  className?: ComputedRef<string>
}

const siteFooterTemplate = html`<footer
  class="site-footer doc-content"
  :class="className"
  :aria-label="ariaLabel"
  :r-teleport="teleport"
>
  <div class="site-footer__inner"><slot></slot></div>
  <Grid
    columns="1"
    columnsMd="2"
    class="site-footer__bottom"
    wrap="true"
    align-items="center"
    justify-items="start"
  >
    <Flex class="site-footer__copyright">{{ copyright }}</Flex>
    <Flex
      class="site-footer__legal"
      wrap="true"
      align="center"
      justify="end"
      :aria-label="legalLabel"
    >
      <slot name="legal"></slot>
      <span class="consent-settings-teleport-area"></span>
      <Flex wrap="nowrap"><slot name="social"></slot></Flex>
    </Flex>
  </Grid>
</footer>`

function defineSiteFooterComponent() {
  return defineComponent<SiteFooter>(siteFooterTemplate, {
    props: ['teleport', 'ariaLabel', 'copyright', 'legalLabel', 'tone'],
    context: (head) => resolveSiteFooter(head.props),
  })
}

export function defineFooterComponents() {
  return {
    siteFooter: defineSiteFooterComponent(),
  }
}

function resolveSiteFooter(props: SiteFooter): SiteFooter {
  const year = new Date().getFullYear()
  if (!props.teleport) props.teleport = 'body'
  return {
    ...props,
    ariaLabel: props.ariaLabel || 'Site footer',
    legalLabel: props.legalLabel || 'Legal and policy links',
    copyright: props.copyright || `(c) ${year}. All rights reserved.`,
    className: computed(() => getSemanticToneSurfaceClass(unref(props.tone))),
  }
}
