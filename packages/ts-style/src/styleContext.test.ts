import { describe, expect, it } from 'vitest'
import { createStyleContext, runWithStyleContext } from './styleContext'
import { styleBuilder } from './styles'
import { themes } from './themeOptions'

describe('style contexts', () => {
  it('owns default palette objects instead of sharing mutable defaults', () => {
    const first = createStyleContext()
    const second = createStyleContext()
    runWithStyleContext(first, () => {
      themes.getOptions().palette.light.accent = '#112233'
    })
    expect(
      runWithStyleContext(
        second,
        () => themes.getOptions().palette.light.accent,
      ),
    ).not.toBe('#112233')
    expect(themes.defaults.palette.light.accent).not.toBe('#112233')
    const input = themes.resolve()
    runWithStyleContext(first, () => themes.setOptions(input))
    runWithStyleContext(second, () => themes.setOptions(input))
    runWithStyleContext(first, () => {
      themes.getOptions().palette.light.accent = '#112233'
    })
    expect(
      runWithStyleContext(
        second,
        () => themes.getOptions().palette.light.accent,
      ),
    ).not.toBe('#112233')
  })
  it('isolates styles, palette changes, and revisions, including retained child references', async () => {
    const first = createStyleContext()
    const second = createStyleContext()
    const child = runWithStyleContext(first, () => {
      themes.setOptions(
        themes.resolve({ palette: { light: { accent: '#112233' } } }),
      )
      return styleBuilder.select('.first', 'light').color('red')
    })
    const before = runWithStyleContext(first, () => styleBuilder.revision)
    runWithStyleContext(second, () => {
      themes.setOptions(
        themes.resolve({ palette: { light: { accent: '#aabbcc' } } }),
      )
      styleBuilder.select('.second', 'light').color('blue')
    })
    expect(runWithStyleContext(first, () => styleBuilder.revision)).toBe(before)
    child.color('green')
    expect(
      runWithStyleContext(first, () => styleBuilder.revision),
    ).toBeGreaterThan(before)
    const css = await runWithStyleContext(first, () =>
      styleBuilder.render('light', false),
    )
    expect(css).toContain('.first')
    expect(css).toContain('green')
    expect(css).toContain('#112233')
    expect(css).not.toContain('.second')
    expect(css).not.toContain('#aabbcc')
    runWithStyleContext(first, () => {
      const beforeReset = styleBuilder.revision
      styleBuilder.reset()
      expect(styleBuilder.revision).toBeGreaterThan(beforeReset)
    })
    expect(runWithStyleContext(second, () => styleBuilder.has('light'))).toBe(
      true,
    )
  })

  it('restores nested contexts after async success and failure', async () => {
    const outer = createStyleContext()
    const inner = createStyleContext()
    await runWithStyleContext(outer, async () => {
      styleBuilder.select('.outer', 'light').color('red')
      await expect(
        runWithStyleContext(inner, async () => {
          await Promise.resolve()
          styleBuilder.select('.inner', 'dark').color('blue')
          throw new Error('failed render')
        }),
      ).rejects.toThrow('failed render')
      expect(styleBuilder.list()).toEqual(['light'])
      expect(() =>
        runWithStyleContext(inner, () => {
          throw new Error('sync render')
        }),
      ).toThrow('sync render')
      expect(styleBuilder.list()).toEqual(['light'])
    })
  })
})
