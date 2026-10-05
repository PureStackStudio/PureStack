import {
  styleBuilder,
  type ThemeMode,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

export function registerSignInStyles() {
  themes.forEach((theme, palette) => {
    registerSignInDisclosureStyles(theme)
    registerSignInAuthStateStyles(theme)
    registerSignInPanelPlacementStyles(theme)
    registerSignInAvatarStyles(theme, palette)
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
      '.sign-in__signed-in-view, :scope.signed-in .sign-in:not([data-signed-in="false"]) .sign-in__signed-out-view, .sign-in[data-signed-in="true"] .sign-in__signed-out-view',
      theme,
    )
    .display('none')

  styleBuilder
    .select(
      ':scope.signed-in .sign-in:not([data-signed-in="false"]) .sign-in__signed-in-view, .sign-in[data-signed-in="true"] .sign-in__signed-in-view',
      theme,
    )
    .display('inline-flex')

  styleBuilder
    .select(
      '.sign-in__signed-in-action, :scope.signed-in .sign-in:not([data-signed-in="false"]) .sign-in__signed-out-action, .sign-in[data-signed-in="true"] .sign-in__signed-out-action',
      theme,
    )
    .display('none')

  styleBuilder
    .select(
      ':scope.signed-in .sign-in:not([data-signed-in="false"]) .sign-in__signed-in-action, .sign-in[data-signed-in="true"] .sign-in__signed-in-action',
      theme,
    )
    .display('inline-flex')
}

function registerSignInPanelPlacementStyles(theme: ThemeMode) {
  styleBuilder
    .select('.sign-in__panel', theme)
    .position('absolute')
    .display('block')
    .top('100%')
    .right('0')
    .zIndex(60)
    .minWidth('11.25rem')
}

function registerSignInAvatarStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.sign-in__avatar', theme)
    .display('block')
    .objectFit('cover')
    .borderRadius(palette.radii.pill)
}
