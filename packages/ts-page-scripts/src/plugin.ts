import { isTocEnabled, type PageTemplateInput } from '@purestack/ts-common'
import { h } from '@purestack/ts-html'
import { buildAuthStateHintScript } from './buildAuthStateHintScript'
import { buildConsentScript } from './buildConsentScript'
import { buildGa4Script } from './buildGa4Script'
import { buildCodeCopyScript } from './embed/codeCopy.embed'
import { buildMenuRuntimeScript } from './embed/menuRuntime.embed'
import { buildNavMenuScript } from './embed/navMenu.embed'
import { buildPagefindSearchScript } from './embed/pagefindSearch.embed'
import { buildPageTocScript } from './embed/pageToc.embed'

/** The browser behaviors that accompany the default PureStack components. */
export function pageScriptsPlugin() {
  return { name: 'purestack:page-scripts', head: renderScriptsHead }
}

function renderScriptsHead({
  head,
  site: config,
  pageInfo,
  outline,
}: PageTemplateInput) {
  if (config.auth.enabled && config.auth.signedInStorageKey) {
    const hint = buildAuthStateHintScript(config.auth.signedInStorageKey)
    if (hint) {
      const auth = h('script').raw(hint)
      // The hint must run before stylesheet loading can delay other scripts.
      if (
        !head.insertBefore('link', auth, { rel: 'stylesheet' }) &&
        !head.insertBefore('script', auth)
      )
        head.push(auth)
    }
  }
  if (config.consent.enabled)
    head.push(h('script').raw(buildConsentScript(config.consent)))
  const ga4 = config.analytics.ga4
  if (ga4.enabled && ga4.measurementId && !config.consent.enabled) {
    const payload = buildGa4Script(ga4)
    head.push(
      h('script').attr({ async: 'true', src: payload.src }),
      h('script').raw(payload.init),
    )
  }
  head.push(h('script').raw(buildMenuRuntimeScript()))
  if (pageInfo.frontmatter.layout.showNav !== false)
    head.push(h('script').raw(buildNavMenuScript()))
  head.push(h('script').raw(buildCodeCopyScript()))
  if (config.pagefind.enabled) {
    if (config.basePath)
      head.push(
        h('script').raw(
          `window.tsSsgPagefindBasePath=${JSON.stringify(config.basePath)};`,
        ),
      )
    head.push(
      h('script').attr({ type: 'module' }).raw(buildPagefindSearchScript()),
    )
  }
  if (isTocEnabled(pageInfo.frontmatter, outline))
    head.push(h('script').raw(buildPageTocScript()))
  return head
}
