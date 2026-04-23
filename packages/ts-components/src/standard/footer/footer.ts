import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
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
  toneClass?: ComputedRef<string>
}

const siteFooterTemplate = html`<footer
  class="site-footer doc-content tone-surface"
  :class="toneClass"
  :aria-label="ariaLabel"
  :r-teleport="teleport"
>
  <div class="site-footer__inner"><slot></slot></div>
  <Flex
    class="site-footer__bottom"
    direction="column-reverse"
    directionMd="row"
    align="center"
    justify="center"
    justifyMd="between"
    wrap="true"
  >
    <Flex justify="center" justifyMd="start" class="site-footer__copyright">
      {{ copyright }}
    </Flex>
    <Flex
      container="nav"
      class="site-footer__legal"
      wrap="true"
      align="center"
      justify="center"
      justifyMd="end"
      :aria-label="legalLabel"
    >
      <slot name="legal"></slot>
      <span class="consent-settings-teleport-area"></span>
      <Flex><slot name="social"></slot></Flex>
    </Flex>
  </Flex>
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
    toneClass: computed(() => getSemanticToneClass(unref(props.tone))),
  }
}
