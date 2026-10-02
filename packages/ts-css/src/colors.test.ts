import { describe, expect, it } from 'vitest'

import {
  getColors,
  getGradient,
  hexToRgba,
  hslToHex,
  hslToRgb,
  oklchToHex,
  rgbaToHex,
  rgbToHsl,
} from './colors' // adjust the import path as needed

describe('hexToRgba', () => {
  it('parses 3-digit hex without #', () => {
    expect(hexToRgba('abc')).toEqual({ r: 170, g: 187, b: 204, a: undefined })
  })

  it('parses 3-digit hex with #', () => {
    expect(hexToRgba('#abc')).toEqual({ r: 170, g: 187, b: 204, a: undefined })
  })

  it('parses 6-digit hex', () => {
    expect(hexToRgba('#112233')).toEqual({ r: 17, g: 34, b: 51, a: undefined })
  })

  it('parses 8-digit hex with alpha', () => {
    const result = hexToRgba('#11223380')
    expect(result).toEqual({ r: 17, g: 34, b: 51, a: 128 / 255 })
  })

  it('throws on invalid length', () => {
    expect(() => hexToRgba('34')).toThrow(/Invalid hex format/)
  })

  it('throws on non-hex characters', () => {
    expect(() => hexToRgba('#zzzzzz')).toThrow(/Invalid hex format/)
  })
})

describe('rgbaToHex', () => {
  it('converts RGB to hex', () => {
    expect(rgbaToHex(17, 34, 51)).toBe('#112233')
  })

  it('converts RGBA to hex with alpha', () => {
    expect(rgbaToHex(17, 34, 51, 0.5)).toBe('#11223380')
  })

  it('throws on out-of-range values', () => {
    expect(() => rgbaToHex(-1, 0, 0)).toThrow(/r is not in range/)
    expect(() => rgbaToHex(0, 256, 0)).toThrow(/g is not in range/)
    expect(() => rgbaToHex(0, 0, 0, 1.5)).toThrow(/a is not in range/)
  })
})

describe('rgbToHsl', () => {
  it('converts black correctly', () => {
    expect(rgbToHsl({ r: 0, g: 0, b: 0 })).toEqual({ h: 0, s: 0, l: 0 })
  })

  it('converts white correctly', () => {
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 1 })
  })

  it('converts red correctly', () => {
    const { h, s, l } = rgbToHsl({ r: 255, g: 0, b: 0 })
    expect(h).toBeCloseTo(0)
    expect(s).toBeCloseTo(1)
    expect(l).toBeCloseTo(0.5)
  })
})

describe('hslToRgb', () => {
  it('converts achromatic correctly', () => {
    expect(hslToRgb({ h: 0, s: 0, l: 0.5 })).toEqual({ r: 128, g: 128, b: 128 })
  })

  it('converts red correctly', () => {
    expect(hslToRgb({ h: 0, s: 1, l: 0.5 })).toEqual({ r: 255, g: 0, b: 0 })
  })

  it('throws on out-of-range HSL', () => {
    expect(() => hslToRgb({ h: -1, s: 0, l: 0 })).toThrow(/h is not in range/)
  })
})

describe('hslToHex', () => {
  it('converts red correctly', () => {
    expect(hslToHex({ h: 0, s: 1, l: 0.5 })).toBe('#FF0000')
  })

  it('throws on invalid HSL', () => {
    expect(() => hslToHex({ h: 0, s: 2, l: 0 })).toThrow(/s is not in range/)
  })
})

describe('getColors', () => {
  it('returns single color if count < 2', () => {
    expect(getColors('#123456', 10, 10, 1)).toEqual(['#123456'])
  })

  it('generates correct gradient', () => {
    const palette = getColors('#f01f95', 25, 25, 10)
    expect(palette).toEqual([
      '#860950',
      '#A10B60',
      '#BC0D6F',
      '#D60E7F',
      '#EF128F',
      '#F12C9B',
      '#F347A8',
      '#F461B4',
      '#F67CC1',
      '#F896CE',
    ])
  })

  it('reverses when requested', () => {
    const palette = getColors('#2d64d2', 20, 10, 10, true)
    expect(palette).toEqual([
      '#5783DB',
      '#4979D8',
      '#3B6ED5',
      '#2D64D2',
      '#2A5DC4',
      '#2757B6',
      '#2450A8',
      '#21499A',
      '#1E438C',
      '#1B3C7E',
    ])
  })
})

describe('gradientStops', () => {
  it('throws if count < 2', () => {
    expect(() => getGradient('#FF0000', '#0000FF', 1)).toThrow(
      /count must be ≥ 2/,
    )
  })

  it('returns start and end for count=2', () => {
    expect(getGradient('#FF0000', '#0000FF', 2)).toEqual([
      { offset: 0, color: '#FF0000' },
      { offset: 100, color: '#0000FF' },
    ])
  })

  it('generates 5 stops between red and blue', () => {
    const stops = getGradient('#FF0000', '#0000FF', 5)
    expect(stops).toEqual([
      { offset: 0, color: '#FF0000' },
      { offset: 25, color: '#FF0080' },
      { offset: 50, color: '#FF00FF' },
      { offset: 75, color: '#7F00FF' },
      { offset: 100, color: '#0000FF' },
    ])
  })

  it('generates 5 stops between red and blue using rgb interpolation', () => {
    const stops = getGradient('#FF0000', '#0000FF', 5, 'rgb')
    expect(stops).toEqual([
      { offset: 0, color: '#FF0000' },
      { offset: 25, color: '#BF0040' },
      { offset: 50, color: '#800080' },
      { offset: 75, color: '#4000BF' },
      { offset: 100, color: '#0000FF' },
    ])
  })

  it('handles hue wrapping across boundary', () => {
    // From near-red (h≈0) to near-green (h≈0.33), but via shortest path
    const stops = getGradient('#FF0000', '#00FF00', 3)
    // expect stops at red, yellow, green
    expect(stops[0].color).toBe('#FF0000')
    expect(stops[1].color).toBe('#FFFF00')
    expect(stops[2].color).toBe('#00FF00')
  })
})

describe('oklchToHex', () => {
  it('converts the achromatic extremes', () => {
    expect(oklchToHex({ l: 1, c: 0, h: 0 })).toBe('#FFFFFF')
    expect(oklchToHex({ l: 0, c: 0, h: 0 })).toBe('#000000')
  })

  it('converts sRGB primaries', () => {
    expect(oklchToHex({ l: 0.628, c: 0.2577, h: 29.23 })).toBe('#FF0000')
    expect(oklchToHex({ l: 0.452, c: 0.3132, h: 264.05 })).toBe('#0000FF')
  })

  it('appends alpha', () => {
    expect(oklchToHex({ l: 1, c: 0, h: 0, alpha: 0.5 })).toBe('#FFFFFF80')
  })

  it('reduces out-of-gamut chroma, keeping lightness and hue', () => {
    const clipped = oklchToHex({ l: 0.72, c: 0.4, h: 258 })
    const fitted = oklchToHex({ l: 0.72, c: 0.14, h: 258 })
    expect(clipped).toMatch(/^#[0-9A-F]{6}$/)
    const { b, r } = hexToRgba(clipped)
    expect(b).toBeGreaterThan(r)
    expect(rgbToHsl(hexToRgba(clipped)).s).toBeGreaterThanOrEqual(
      rgbToHsl(hexToRgba(fitted)).s,
    )
  })
})
