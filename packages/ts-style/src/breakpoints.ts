function defineBreakpoint<Name extends string>(
  name: Name,
  value: `${number}px`,
) {
  return { name, value } as const
}

export const BREAKPOINTS = {
  sm: defineBreakpoint('sm', '640px'),
  md: defineBreakpoint('md', '768px'),
  lg: defineBreakpoint('lg', '1024px'),
  xl: defineBreakpoint('xl', '1280px'),
  toc: defineBreakpoint('toc', '1320px'),
  wide: defineBreakpoint('wide', '1400px'),
} as const
export type BreakpointName = keyof typeof BREAKPOINTS

export type BreakpointToken = (typeof BREAKPOINTS)[keyof typeof BREAKPOINTS]

export function getBreakpointNames(): BreakpointName[] {
  return Object.keys(BREAKPOINTS) as BreakpointName[]
}

export function getBreakpoint(breakpoint: BreakpointToken): string {
  return breakpoint.value
}

export function mediaMin(breakpoint: BreakpointToken): string {
  return `min-width: ${getBreakpoint(breakpoint)}`
}

export function mediaMax(breakpoint: BreakpointToken): string {
  return `max-width: ${getBreakpoint(breakpoint)}`
}

export function mediaAbove(breakpoint: BreakpointToken): string {
  return `min-width: ${shiftBreakpoint(getBreakpoint(breakpoint), 1)}`
}

export function mediaBelow(breakpoint: BreakpointToken): string {
  return `max-width: ${shiftBreakpoint(getBreakpoint(breakpoint), -1)}`
}

export function matchMediaMin(breakpoint: BreakpointToken): string {
  return `(${mediaMin(breakpoint)})`
}

export function matchMediaMax(breakpoint: BreakpointToken): string {
  return `(${mediaMax(breakpoint)})`
}

export function matchMediaAbove(breakpoint: BreakpointToken): string {
  return `(${mediaAbove(breakpoint)})`
}

export function matchMediaBelow(breakpoint: BreakpointToken): string {
  return `(${mediaBelow(breakpoint)})`
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
