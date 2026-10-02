export type RGBA = {
  r: number
  g: number
  b: number
  a?: number
}

export type HSL = {
  h: number
  s: number
  l: number
}

/**
 * Converts a HEX color string to RGBA.
 * @param hex - The HEX color string.
 * @returns The RGBA representation of the color.
 * @throws Will throw an error if the hex format is invalid.
 */
export function hexToRgba(input: string): RGBA {
  if (input === 'transparent') return { r: 0, g: 0, b: 0, a: 0 }
  if (input === 'currentColor') return { r: 0, g: 0, b: 0, a: 0 }

  // Strip leading '#' if present
  let hex = input.startsWith('#') ? input.slice(1) : input

  // Expand 3/4-digit shorthand (e.g. "abc" → "aabbcc")
  if (hex.length === 3 || hex.length === 4) {
    hex = hex
      .split('')
      .map((c) => c + c)
      .join('')
  }

  // Now must be exactly 6 or 8 characters
  if (hex.length !== 6 && hex.length !== 8) {
    throw new Error(
      'Invalid hex format; expected #RGB, #RGBA, #RRGGBB or #RRGGBBAA',
    )
  }

  // Parse every two-char chunk into a byte, validate on the fly
  const bytes: number[] = []
  for (let i = 0; i < hex.length; i += 2) {
    const byte = Number.parseInt(hex.slice(i, i + 2), 16)
    if (Number.isNaN(byte)) {
      throw new Error('Invalid hex format; non-hex characters detected')
    }
    bytes.push(byte)
  }

  const [r, g, b, aByte] = bytes
  const a = aByte === undefined ? undefined : aByte / 255
  const rgba = { r, g, b, a }
  validateRgb(rgba)
  return rgba
}

/**
 * Converts RGBA values to a HEX color string.
 * @param r - The red component (0-255).
 * @param g - The green component (0-255).
 * @param b - The blue component (0-255).
 * @param a - The optional alpha component (0-1).
 * @returns The HEX color string.
 * @throws Will throw an error if any color component is out of range.
 */
export function rgbaToHex(r: number, g: number, b: number, a?: number): string {
  validateRgb({ r, g, b, a })
  let hex = ((1 << 24) + (r << 16) + (g << 8) + b)
    .toString(16)
    .slice(1)
    .toUpperCase()
  if (a !== undefined) {
    hex += Math.round(a * 255)
      .toString(16)
      .padStart(2, '0')
      .toUpperCase()
  }
  return `#${hex}`
}

/**
 * Converts RGB values to HSL.
 * @param rgb - The RGB representation of the color.
 * @returns The HSL representation of the color.
 * @throws Will throw an error if any color component is out of range.
 */
export function rgbToHsl({ r, g, b }: RGBA): HSL {
  validateRgb({ r, g, b })
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h = 0,
    s: number
  const l: number = (max + min) / 2

  if (max === min) {
    s = 0
  } else {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h, s, l }
}

/**
 * Converts HSL values to a HEX color string.
 * @param hsl - The HSL representation of the color.
 * @returns The HEX color string.
 * @throws Will throw an error if any HSL component is out of range.
 */
export function hslToHex({ h, s, l }: HSL): string {
  validateHsl({ h, s, l })
  const { r, g, b } = hslToRgb({ h, s, l })
  return rgbaToHex(r, g, b)
}

/**
 * Converts HSL values to RGB.
 * @param hsl - The HSL representation of the color.
 * @returns The RGB representation of the color.
 * @throws Will throw an error if any HSL component is out of range.
 */
export function hslToRgb({ h, s, l }: HSL): RGBA {
  validateHsl({ h, s, l })
  let r: number, g: number, b: number

  const hueToRgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
    return p
  }

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hueToRgb(p, q, h + 1 / 3)
    g = hueToRgb(p, q, h)
    b = hueToRgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

export type OKLCH = {
  /** Perceptual lightness, 0–1. */
  l: number
  /** Chroma, 0 for gray; vivid sRGB colors peak near 0.3. */
  c: number
  /** Hue angle in degrees. */
  h: number
  /** Optional alpha, 0–1. */
  alpha?: number
}

/**
 * Converts an OKLCH color to a HEX color string.
 *
 * Lightness is perceptual, so colors sharing `l` read equally bright whatever
 * their hue. That makes OKLCH the natural space for a palette: pick a hue per
 * role and reuse one set of lightness steps. Chroma beyond the sRGB gamut is
 * reduced until the color fits, keeping its lightness and hue.
 * @param oklch - The OKLCH representation of the color.
 * @returns The HEX color string.
 */
export function oklchToHex({ l, c, h, alpha }: OKLCH): string {
  let rgb = oklchToLinearRgb(l, c, h)
  if (!isInGamut(rgb)) {
    let low = 0
    let high = c
    for (let i = 0; i < 20; i++) {
      const mid = (low + high) / 2
      if (isInGamut(oklchToLinearRgb(l, mid, h))) low = mid
      else high = mid
    }
    rgb = oklchToLinearRgb(l, low, h)
  }
  const [r, g, b] = rgb.map(toSrgbByte)
  return rgbaToHex(r, g, b, alpha)
}

function oklchToLinearRgb(l: number, c: number, h: number) {
  const radians = (h * Math.PI) / 180
  const a = c * Math.cos(radians)
  const b = c * Math.sin(radians)
  const long = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const medium = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const short = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  ]
}

function isInGamut(rgb: number[]) {
  return rgb.every((channel) => channel >= -1e-4 && channel <= 1 + 1e-4)
}

function toSrgbByte(linear: number) {
  const value = Math.min(Math.max(linear, 0), 1)
  const encoded =
    value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055
  return Math.round(encoded * 255)
}

/**
 * Validates RGBA values to ensure they are within the correct range.
 * @param rgba - The RGBA representation of the color.
 * @throws Will throw an error if any color component is out of range.
 */
function validateRgb({ r, g, b, a }: RGBA): void {
  if (r > 255 || r < 0) throw new Error(`r is not in range: ${r}`)
  if (g > 255 || g < 0) throw new Error(`g is not in range: ${g}`)
  if (b > 255 || b < 0) throw new Error(`b is not in range: ${b}`)
  if (a !== undefined && (a > 1 || a < 0))
    throw new Error(`a is not in range: ${a}`)
}

/**
 * Validates HSL values to ensure they are within the correct range.
 * @param hsl - The HSL representation of the color.
 * @throws Will throw an error if any HSL component is out of range.
 */
function validateHsl({ h, s, l }: HSL): void {
  if (h > 1 || h < 0) throw new Error(`h is not in range: ${h}`)
  if (s > 1 || s < 0) throw new Error(`s is not in range: ${s}`)
  if (l > 1 || l < 0) throw new Error(`l is not in range: ${l}`)
}

/**
 * Generates an array of HEX color strings based on variations in lightness.
 * @param hex - The base HEX color string.
 * @param deltaLeft - The decrease in lightness as a percentage.
 * @param deltaRight - The increase in lightness as a percentage.
 * @param count - The number of color variations to generate.
 * @returns An array of HEX color strings.
 */
export function getColors(
  hex: string,
  deltaLeft: number,
  deltaRight: number,
  count: number,
  reverse?: boolean,
): string[] {
  if (count < 2) {
    return [hex]
  }
  deltaLeft /= 100
  deltaRight /= 100
  const result: string[] = []
  const { h, s, l } = rgbToHsl(hexToRgba(hex))

  let minLight = l - deltaLeft
  let maxLight = l + deltaRight

  if (minLight < 0) {
    minLight = 0
  }
  if (maxLight > 1) {
    maxLight = 1
  }

  minLight = Math.max(0, minLight)
  maxLight = Math.min(1, maxLight)
  const step = (maxLight - minLight) / (count - 1)

  for (let i = 0; i < count; ++i) {
    result.push(hslToHex({ h, s, l: minLight + i * step }))
  }

  if (reverse) return result.reverse()
  return result
}

export interface GradientStop {
  /** position along the gradient (0–100%) */
  offset: number
  /** hex color at this stop */
  color: string
}

/**
 * Generates N gradient stops between two hex colors.
 * @param startHex - e.g. "#21a8c3"
 * @param endHex   - e.g. "#a50d60"
 * @param count    - number of stops (must be ≥ 2)
 * @param method   - 'hsl' | 'rgb' interpolation (defaults to 'hsl')
 * @returns array of `{ offset: 0–100, color: hex }`
 * @throws if `count < 2` or hex inputs invalid
 */
export function getGradient(
  startHex: string,
  endHex: string,
  count: number,
  method: 'hsl' | 'rgb' = 'hsl',
): GradientStop[] {
  if (count < 2) {
    throw new Error(`gradientStops: count must be ≥ 2 (got ${count})`)
  }
  if (method === 'rgb') return getRGBGradient(startHex, endHex, count)

  // convert to HSL
  const hslA = rgbToHsl(hexToRgba(startHex))
  const hslB = rgbToHsl(hexToRgba(endHex))

  // shortest-path hue delta
  let dh = hslB.h - hslA.h
  if (dh > 0.5) dh -= 1
  else if (dh < -0.5) dh += 1

  const ds = hslB.s - hslA.s
  const dl = hslB.l - hslA.l

  const stops: GradientStop[] = []
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    // interpolate and wrap hue back into [0,1]
    let h = hslA.h + dh * t
    if (h < 0) h += 1
    else if (h > 1) h -= 1

    const s = hslA.s + ds * t
    const l = hslA.l + dl * t

    stops.push({
      offset: t * 100,
      color: hslToHex({ h, s, l }),
    })
  }

  return stops
}

function getRGBGradient(
  startHex: string,
  endHex: string,
  count: number,
): GradientStop[] {
  const start = hexToRgba(startHex)
  const end = hexToRgba(endHex)
  const stops: GradientStop[] = []

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1)
    // linearly blend each channel
    const r = Math.round(start.r + (end.r - start.r) * t)
    const g = Math.round(start.g + (end.g - start.g) * t)
    const b = Math.round(start.b + (end.b - start.b) * t)
    const a =
      end.a != null && start.a != null
        ? start.a + (end.a - start.a) * t
        : undefined

    stops.push({
      offset: t * 100,
      color: rgbaToHex(r, g, b, a),
    })
  }

  return stops
}
