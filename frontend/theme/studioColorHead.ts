import type { PageHeadTemplate } from '@purestack/ts-common'
import { Style } from '@purestack/ts-css'
import { h } from '@purestack/ts-html'
import { createStudioDarkPalette } from './studioSkinDark'
import { createStudioLightPalette } from './studioSkinLight'
import {
  DEFAULT_SITE_COLOR,
  SITE_COLOR_STORAGE_KEY,
  studioColorPresets,
} from './studioColorPresets'

/** Runs before the stylesheet links and body, independently of the picker module. */
export function buildSiteColorInitScript() {
  const ids = JSON.stringify(studioColorPresets.map((preset) => preset.id))
  return `(()=>{let c=${JSON.stringify(DEFAULT_SITE_COLOR)};try{let s=localStorage.getItem(${JSON.stringify(SITE_COLOR_STORAGE_KEY)});if(${ids}.includes(s))c=s}catch{}document.documentElement.setAttribute("data-site-color",c)})();`
}

let criticalStyle: string | undefined

function buildSiteColorCriticalStyle() {
  if (criticalStyle) return criticalStyle
  const root = new Style()
  for (const preset of studioColorPresets) {
    const light = createStudioLightPalette(preset, preset.layers.light)
    const dark = createStudioDarkPalette(preset, preset.layers.dark)
    const lightCanvas = light.semanticTone.neutral.canvas
    const darkCanvas = dark.semanticTone.neutral.canvas
    const selector = `html[data-site-color="${preset.id}"]`
    root.select(selector).background(lightCanvas)
    root
      .media('prefers-color-scheme: dark')
      .select(selector)
      .background(darkCanvas)
    root.select(`${selector}[data-theme="light"]`).background(lightCanvas)
    root.select(`${selector}[data-theme="dark"]`).background(darkCanvas)
  }
  criticalStyle = root.toCSS()
  return criticalStyle
}

export const renderStudioColorHead: PageHeadTemplate = ({ head }) => {
  const startup = h('script')
    .attr({ 'data-site-color-init': '' })
    .raw(buildSiteColorInitScript())
  if (!head.insertBefore('link', startup, { rel: 'stylesheet' }))
    head.push(startup)
  const critical = h('style')
    .attr({ 'data-site-color-critical': '' })
    .raw(buildSiteColorCriticalStyle())
  if (!head.insertBefore('link', critical, { rel: 'stylesheet' }))
    head.push(critical)
  return head
}
