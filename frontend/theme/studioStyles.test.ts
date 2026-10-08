import { BREAKPOINTS, mediaBelow, styleBuilder } from '@purestack/ts-style'
import { beforeEach, describe, expect, it } from 'vitest'
import { registerStudioStyles } from './studioStyles'

describe('Studio responsive styles', () => {
  beforeEach(() => {
    styleBuilder.reset()
  })

  it.each(['light', 'dark'] as const)(
    'keeps mobile overrides after tablet rules in the %s theme',
    (theme) => {
      registerStudioStyles()
      const css = styleBuilder.get(theme).toCSS()
      const mobile = css.indexOf(`@media(${mediaBelow(BREAKPOINTS.sm)})`)
      const tablet = css.indexOf(`@media(${mediaBelow(BREAKPOINTS.md)})`)
      const laptop = css.indexOf(`@media(${mediaBelow(BREAKPOINTS.lg)})`)

      expect(laptop).toBeGreaterThanOrEqual(0)
      expect(tablet).toBeGreaterThan(laptop)
      expect(mobile).toBeGreaterThan(tablet)
    },
  )
})
