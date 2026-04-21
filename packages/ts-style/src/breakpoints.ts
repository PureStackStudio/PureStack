export const BREAKPOINTS = {
  phone: '600px',
  sm: '640px',
  compact: '720px',
  tabs: '760px',
  md: '768px',
  content: '900px',
  hero: '980px',
  lg: '1024px',
  xl: '1280px',
  toc: '1320px',
  wide: '1400px',
} as const

export type ThemeBreakpointName = keyof typeof BREAKPOINTS

export function getBreakpoint(name: ThemeBreakpointName): string {
  return BREAKPOINTS[name]
}

export function mediaMin(name: ThemeBreakpointName): string {
  return `min-width: ${getBreakpoint(name)}`
}

export function mediaMax(name: ThemeBreakpointName): string {
  return `max-width: ${getBreakpoint(name)}`
}

export function mediaAbove(name: ThemeBreakpointName): string {
  return `min-width: ${shiftBreakpoint(getBreakpoint(name), 1)}`
}

export function mediaBelow(name: ThemeBreakpointName): string {
  return `max-width: ${shiftBreakpoint(getBreakpoint(name), -1)}`
}

export function matchMediaMin(name: ThemeBreakpointName): string {
  return `(${mediaMin(name)})`
}

export function matchMediaMax(name: ThemeBreakpointName): string {
  return `(${mediaMax(name)})`
}

export function matchMediaAbove(name: ThemeBreakpointName): string {
  return `(${mediaAbove(name)})`
}

export function matchMediaBelow(name: ThemeBreakpointName): string {
  return `(${mediaBelow(name)})`
}

function shiftBreakpoint(value: string, delta: number): string {
  const match = value.trim().match(/^(-?\d+(?:\.\d+)?)px$/)
  if (!match) {
    throw new Error(
      `Breakpoint "${value}" must use px units to derive adjacent media queries.`,
    )
  }

  const nextValue = Number.parseFloat(match[1]) + delta
  if (!Number.isFinite(nextValue)) {
    throw new Error(`Could not shift breakpoint "${value}".`)
  }

  return `${nextValue}px`
}
