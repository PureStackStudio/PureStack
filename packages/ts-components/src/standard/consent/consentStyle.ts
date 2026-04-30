import {
  BREAKPOINTS,
  getBreakpoint,
  styleBuilder,
  type ThemeMode,
  themes,
} from '@purestack/ts-style'

export function registerConsentStyles() {
  themes.forEach((theme) => {
    registerConsentPlacementStyles(theme)
  })
}

function registerConsentPlacementStyles(theme: ThemeMode) {
  styleBuilder
    .select('.consent', theme)
    .position('fixed')
    .left('0')
    .right('0')
    .bottom('0')
    .zIndex(1200)
    .pointerEvents('none')

  styleBuilder
    .select('.consent__banner', theme)
    .pointerEvents('auto')
    .margin('0 auto 1em')
    .width(`min(${getBreakpoint(BREAKPOINTS.lg)}, calc(100vw - 2em))`)

  styleBuilder
    .select('.consent__panel', theme)
    .pointerEvents('auto')
    .position('fixed')
    .right('0.75em')
    .bottom('4rem')
    .left('0.75em')
    .width(`min(${getBreakpoint(BREAKPOINTS.sm)}, calc(100vw - 2em))`)
    .marginLeft('auto')

  styleBuilder
    .select('.consent__banner[hidden], .consent__panel[hidden]', theme)
    .display('none')
}
