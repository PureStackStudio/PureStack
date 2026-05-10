import {
  BREAKPOINTS,
  mediaMax,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerSignInStyles() {
  themes.forEach((theme, _palette, options) => {
    registerSignInDisclosureStyles(theme)
    registerSignInAuthStateStyles(theme)
    registerSignInPanelPlacementStyles(theme)
    registerSignInAvatarStyles(theme, options)
  })
}

function registerSignInDisclosureStyles(theme: ThemeMode) {
  styleBuilder.select('.sign-in', theme).display('inline-block').lineHeight('0')
}

function registerSignInAuthStateStyles(theme: ThemeMode) {
  styleBuilder
    .select('.sign-in__signed-out-view, .sign-in__signed-in-view', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .width('100%')
    .height('100%')

  styleBuilder
    .select(
      '.sign-in__signed-in-view, .signed-in .sign-in__signed-out-view',
      theme,
    )
    .display('none')

  styleBuilder
    .select('.signed-in .sign-in__signed-in-view', theme)
    .display('inline-flex')

  styleBuilder
    .select(
      '.sign-in__signed-in-action, .signed-in .sign-in__signed-out-action',
      theme,
    )
    .display('none')

  styleBuilder
    .select('.signed-in .sign-in__signed-in-action', theme)
    .display('inline-flex')
}

function registerSignInPanelPlacementStyles(theme: ThemeMode) {
  styleBuilder
    .select('.sign-in__panel', theme)
    .position('absolute')
    .top('100%')
    .right('0')
    .zIndex(60)
    .minWidth('220px')

  styleBuilder
    .select('.sign-in__panel', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .right('-58px')
    .minWidth('min(76vw, 240px)')
}

function registerSignInAvatarStyles(theme: ThemeMode, options: ThemeOptions) {
  styleBuilder
    .select('.sign-in__avatar', theme)
    .display('block')
    .objectFit('cover')
    .borderRadius(options.radii.pill)
}
