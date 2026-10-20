import type { PageHeadTemplate } from '@purestack/ts-common'
import { Style } from '@purestack/ts-css'
import { h } from '@purestack/ts-html'
import { createStudioLandingPalette } from './studioLandingColors'
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

const criticalStyles = new Map<boolean, string>()

function buildSiteColorCriticalStyle(landing: boolean) {
  const cached = criticalStyles.get(landing)
  if (cached) return cached
  const root = new Style()
  if (landing) registerLandingInitialColors(root)
  for (const preset of studioColorPresets) {
    const light = landing
      ? createStudioLandingPalette('light', preset)
      : createStudioLightPalette(preset, preset.layers.light)
    const dark = landing
      ? createStudioLandingPalette('dark', preset)
      : createStudioDarkPalette(preset, preset.layers.dark)
    const lightCanvas = light.semanticTone.neutral.canvas
    const darkCanvas = dark.semanticTone.neutral.canvas
    const selector = `html:root[data-site-color="${preset.id}"]`
    root.select(selector).background(lightCanvas)
    root
      .media('prefers-color-scheme: dark')
      .select(selector)
      .background(darkCanvas)
    root.select(`${selector}[data-theme="light"]`).background(lightCanvas)
    root.select(`${selector}[data-theme="dark"]`).background(darkCanvas)
  }
  const criticalStyle = root.toCSS()
  criticalStyles.set(landing, criticalStyle)
  return criticalStyle
}

function registerLandingInitialColors(root: Style) {
  const light = createStudioLandingPalette('light').semanticTone.neutral
  const dark = createStudioLandingPalette('dark').semanticTone.neutral
  root.select('html, body').background(light.canvas).color(light.text.default)
  root
    .media('prefers-color-scheme: dark')
    .select('html, body')
    .background(dark.canvas)
    .color(dark.text.default)
}

export const renderStudioColorHead: PageHeadTemplate = ({
  head,
  templateName,
}) => {
  const startup = h('script')
    .attr({ 'data-site-color-init': '' })
    .raw(buildSiteColorInitScript())
  if (!head.insertBefore('link', startup, { rel: 'stylesheet' }))
    head.push(startup)
  const critical = h('style')
    .attr({ 'data-site-color-critical': '' })
    .raw(buildSiteColorCriticalStyle(templateName === 'studio'))
  if (!head.insertBefore('link', critical, { rel: 'stylesheet' }))
    head.push(critical)
  return head
}
