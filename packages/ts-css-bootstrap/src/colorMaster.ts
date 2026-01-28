type RGB = {
  r: number
  g: number
  b: number
  a?: number
}

type HSL = {
  h: number
  s: number
  l: number
}

/**
 * Converts a HEX color string to HSL.
 * @param hex - The HEX color string.
 * @returns The HSL representation of the color.
 */
export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex))
}

/**
 * Converts a HEX color string to RGB.
 * @param hex - The HEX color string.
 * @returns RGB The RGB representation of the color.
 * @throws Will throw an error if the hex format is invalid.
 */
export function hexToRgb(hex: string): RGB {
  hex = hex.replace(/^#/, '')

  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((char) => char + char)
      .join('')
  }

  let bigint: number, r: number, g: number, b: number, a: number | undefined
  if (hex.length === 6) {
    bigint = parseInt(hex, 16)
    r = (bigint >> 16) & 255
    g = (bigint >> 8) & 255
    b = bigint & 255
  } else if (hex.length === 8) {
    bigint = parseInt(hex, 16)
    r = (bigint >> 24) & 255
    g = (bigint >> 16) & 255
    b = (bigint >> 8) & 255
    a = bigint & 255
  } else {
    throw new Error('Invalid hex color format')
  }

  validateRgb({ r, g, b, a })
  return { r, g, b, a: a !== undefined ? a / 255 : undefined }
}

/**
 * Converts RGB values to a HEX color string.
 * @param r - The red component (0-255).
 * @param g - The green component (0-255).
 * @param b - The blue component (0-255).
 * @param a - The optional alpha component (0-1).
 * @returns The HEX color string.
 * @throws Will throw an error if any color component is out of range.
 */
function rgbToHex(r: number, g: number, b: number, a?: number): string {
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
function rgbToHsl({ r, g, b }: RGB): HSL {
  validateRgb({ r, g, b })
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b)
  let h: number = 0,
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
function hslToHex({ h, s, l }: HSL): string {
  validateHsl({ h, s, l })
  const { r, g, b } = hslToRgb({ h, s, l })
  return rgbToHex(r, g, b)
}

/**
 * Converts HSL values to RGB.
 * @param hsl - The HSL representation of the color.
 * @returns The RGB representation of the color.
 * @throws Will throw an error if any HSL component is out of range.
 */
function hslToRgb({ h, s, l }: HSL): RGB {
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

/**
 * Validates RGB values to ensure they are within the correct range.
 * @param rgb - The RGB representation of the color.
 * @throws Will throw an error if any color component is out of range.
 */
function validateRgb({ r, g, b, a }: RGB): void {
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
export function createColors(
  hex: string,
  deltaLeft: number,
  deltaRight: number,
  count: number,
  reverse?: boolean,
): string[] {
  deltaLeft /= 100
  deltaRight /= 100
  const result: string[] = []
  const { h, s, l } = rgbToHsl(hexToRgb(hex))

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

/*const colorVariations = createColors('#AB8E1A', 20, 20, 10)
console.log(colorVariations.map((x) => `color: ${x};`).join('\r\n'))*/
