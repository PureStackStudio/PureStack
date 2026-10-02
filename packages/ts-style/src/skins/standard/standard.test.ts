import { describe, expect, it } from 'vitest'

import { themeSkins } from '..'
import type { StandardColorPreset } from './dark'

describe('standard skin color presets', () => {
  it('accepts a color object for both light and dark palettes', () => {
    const preset = {
      accent: '#4b64c8',
      feature: '#b04783',
      info: '#168a75',
    } satisfies StandardColorPreset
    const standard = themeSkins.standard.create()
    const custom = themeSkins.standard.create(preset)

    for (const mode of ['light', 'dark'] as const) {
      expect(custom[mode].accent).toBe(preset.accent)
      expect(custom[mode].semanticTone.feature.tone).not.toBe(
        standard[mode].semanticTone.feature.tone,
      )
      expect(custom[mode].semanticTone.info.tone).not.toBe(
        standard[mode].semanticTone.info.tone,
      )
      expect(custom[mode].semanticTone.success).toEqual(
        standard[mode].semanticTone.success,
      )
    }
  })

  it('uses the extra color roles from named presets', () => {
    const standard = themeSkins.standard.create()
    const mint = themeSkins.standard.create(['mint'])

    expect(mint.light.semanticTone.feature.tone).not.toBe(
      standard.light.semanticTone.feature.tone,
    )
    expect(mint.dark.semanticTone.success.tone).not.toBe(
      standard.dark.semanticTone.success.tone,
    )
  })
})
