import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  mediaMax,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerSignInStyles() {
  themes.forEach((theme, palette, options) => {
    registerSignInShellStyles(theme, palette, options)
    registerSignInPanelStyles(theme, palette, options)
    registerSignInResponsiveStyles(theme)
  })
}

function registerSignInShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.sign-in', theme)
    .position('relative')
    .display('inline-block')
    .lineHeight('0')

  styleBuilder.select('.sign-in__trigger::marker', theme).content('""')
  styleBuilder
    .select('.sign-in__trigger::-webkit-details-marker', theme)
    .display('none')

  styleBuilder
    .select('.sign-in__trigger', theme)
    .background(palette.current.surface.rest.background)
    .borderColor(palette.current.border.default)
    .color(palette.current.text.subtle)
    .overflow('hidden')
    .transition(
      'background 160ms ease, color 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
    )

  styleBuilder
    .select('.sign-in__trigger:hover, .sign-in[open] .sign-in__trigger', theme)
    .background(palette.current.surface.hover.background)
    .color(palette.current.text.default)
    .borderColor(palette.current.border.default)

  styleBuilder
    .select('.sign-in__trigger:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.sign-in__avatar', theme)
    .width('100%')
    .height('100%')
    .display('block')
    .objectFit('cover')
    .borderRadius(options.radii.pill)

  styleBuilder
    .select('.sign-in__icon', theme)
    .width('1.25rem')
    .height('1.25rem')

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

  styleBuilder.select('.sign-in__trigger-label', theme).display('none')
}

function registerSignInPanelStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.sign-in__panel', theme)
    .position('absolute')
    .top('calc(100% + 10px)')
    .right('0')
    .zIndex(60)
    .minWidth('220px')
    .padding('0.4em')
    .border(`1px solid ${palette.current.border.default}`)
    .borderRadius(options.radii.md)
    .background(palette.current.surface.rest.background)
    .boxShadow(palette.effect.panelShadow)
    .opacity('0')
    .pointerEvents('none')
    .transform('translate3d(0, -0.35rem, 0)')
    .transformOrigin('top right')
    .transition(
      'opacity 170ms ease, transform 220ms cubic-bezier(0.16, 1, 0.3, 1)',
    )

  styleBuilder
    .select('.sign-in[open] .sign-in__panel', theme)
    .opacity('1')
    .pointerEvents('auto')
    .transform('translate3d(0, 0, 0)')

  styleBuilder
    .select('.sign-in__panel', theme)
    .media('prefers-reduced-motion: reduce')
    .transition('none')

  styleBuilder.select('.sign-in__nav', theme).display('grid').gap('0.15em')

  styleBuilder
    .select(
      '.sign-in__signed-in-action, .signed-in .sign-in__signed-out-action',
      theme,
    )
    .display('none')

  styleBuilder
    .select('.signed-in .sign-in__signed-in-action', theme)
    .display('inline-flex')

  styleBuilder
    .select('.sign-in__item', theme)
    .justifyContent('flex-start')
    .padding('0.55em 0.65em')
    .color(palette.current.text.default)
    .textAlign('left')
}

function registerSignInResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.sign-in__panel', theme)
    .media(mediaMax(BREAKPOINTS.sm))
    .right('-58px')
    .minWidth('min(76vw, 240px)')
}
