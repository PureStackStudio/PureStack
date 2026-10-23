import type { PageHeadTemplate } from '@purestack/ts-common'
import { Style } from '@purestack/ts-css'
import { h } from '@purestack/ts-html'
import { createDarkPalette } from './palette/dark'
import { createLandingPalette } from './palette/landing'
import { createLightPalette } from './palette/light'
import {
  DEFAULT_SITE_COLOR,
  palettePresets,
  SITE_COLOR_STORAGE_KEY,
} from './presets'

/** Runs before the stylesheet links and body, independently of the picker module. */
export function buildSiteColorInitScript() {
  const ids = serializeInlineScriptValue(
    palettePresets.map((preset) => preset.id),
  )
  const defaultColor = serializeInlineScriptValue(DEFAULT_SITE_COLOR)
  const storageKey = serializeInlineScriptValue(SITE_COLOR_STORAGE_KEY)
  return `(()=>{let c=${defaultColor};try{let s=localStorage.getItem(${storageKey});if(${ids}.includes(s))c=s}catch{}document.documentElement.setAttribute("data-site-color",c)})();`
}

/** JSON string escaping alone does not prevent an HTML </script> terminator. */
function serializeInlineScriptValue(value: string | readonly string[]) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

const criticalStyles = new Map<boolean, string>()

function buildSiteColorCriticalStyle(landing: boolean) {
  const cached = criticalStyles.get(landing)
  if (cached) return cached
  const root = new Style()
  if (landing) registerLandingInitialColors(root)
  for (const preset of palettePresets) {
    const light = landing
      ? createLandingPalette('light', preset)
      : createLightPalette(preset, preset.layers.light)
    const dark = landing
      ? createLandingPalette('dark', preset)
      : createDarkPalette(preset, preset.layers.dark)
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
  const light = createLandingPalette('light').semanticTone.neutral
  const dark = createLandingPalette('dark').semanticTone.neutral
  root.select('html, body').background(light.canvas).color(light.text.default)
  root
    .media('prefers-color-scheme: dark')
    .select('html, body')
    .background(dark.canvas)
    .color(dark.text.default)
}

export const renderColorHead: PageHeadTemplate = ({ head, templateName }) => {
  const startup = h('script')
    .attr({ 'data-site-color-init': '' })
    .raw(buildSiteColorInitScript())
  if (!head.insertBefore('link', startup, { rel: 'stylesheet' }))
    head.push(startup)
  const critical = h('style')
    .attr({ 'data-site-color-critical': '' })
    .raw(buildSiteColorCriticalStyle(templateName === 'landing'))
  if (!head.insertBefore('link', critical, { rel: 'stylesheet' }))
    head.push(critical)
  return head
}
