import { isString } from '@purestack/ts-util'

/**
 * Normalizes a CSS value by auto-expanding shorthand into `var(...)` when appropriate.
 *
 * Rules:
 * 1. Values starting with `$name` become `var(--name)`. Supports fallback like `$name, blue` → `var(--name, blue)`.
 * 2. Raw custom property names starting with `--` become `var(--name)`. Supports fallback like `--bg, red` → `var(--bg, red)`.
 * 3. Values already using `var(...)` are returned as-is (case-insensitive on the `var(` prefix).
 * 4. Any other value is returned unchanged.
 *
 * @example
 * ```ts
 * autoVar("$primary");           // "var(--primary)"
 * autoVar("$primary, blue");    // "var(--primary, blue)"
 * autoVar("--bg");              // "var(--bg)"
 * autoVar("--bg, lightgray");   // "var(--bg, lightgray)"
 * autoVar("var(--accent)");     // "var(--accent)"
 * autoVar("10px");              // "10px"
 * autoVar("solid");             // "solid"
 * ```
 *
 * @param raw - The raw CSS value to normalize.
 * @returns The potentially transformed CSS value with appropriate `var(...)` wrapping.
 */
export function autoVar(raw: string | number): string | number {
  if (!isString(raw)) return raw
  const v = raw.trim()

  // Already a var(...) function (CSS function names are case-insensitive)
  if (/^var\(/i.test(v)) {
    return v
  }

  // Helper to split into name and optional fallback, only on first comma
  const splitFirstComma = (input: string): [string, string?] => {
    const match = input.match(/^([^,]+)(?:,(.+))?$/)
    if (!match) return [input]
    const name = match[1].trim()
    const fallback = match[2]?.trim()
    return fallback !== undefined ? [name, fallback] : [name]
  }

  if (v.startsWith('$')) {
    // "$name" or "$name, fallback"
    const inner = v.slice(1).trim()
    const [name, fallback] = splitFirstComma(inner)
    return fallback ? `var(--${name}, ${fallback})` : `var(--${name})`
  }

  if (v.startsWith('--')) {
    // "--prop" or "--prop, fallback"
    const [name, fallback] = splitFirstComma(v)
    return fallback ? `var(${name}, ${fallback})` : `var(${name})`
  }

  return v // leave other values untouched
}
