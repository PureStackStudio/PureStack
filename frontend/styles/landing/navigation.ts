import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'

export function registerNavigationStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root
    .select('.landing-page .site-header')
    .position('sticky')
    .zIndex('20')
    .top('0')
    .borderBottom(
      `1px solid color-mix(in srgb, ${tone.neutral.border.subtle} 80%, transparent)`,
    )
    .background(`color-mix(in srgb, ${tone.neutral.canvas} 93%, transparent)`)
    .backdropFilter('blur(16px)')
  root.select('.landing-page .header-inner').height('78px').gap('40px')
  root.select('.landing-page .header-inner > .site-logo').flexShrink('0')
  root
    .select('.landing-page .header-actions')
    .display('flex')
    .alignItems('center')
    .gap('0rem')
    .flexShrink('0')
  root
    .select('.landing-page .desktop-nav')
    .display('flex')
    .alignItems('center')
    .gap('32px')
    .marginInline('auto')
    .paddingLeft('28px')
  root
    .select('.landing-page .desktop-nav a, .landing-page .header-source')
    .fontSize('13px')
    .fontWeight('500')
    .color(tone.neutral.text.subtle)
    .transition('color 160ms')
  root
    .select(
      '.landing-page .desktop-nav a:hover, .landing-page .header-source:hover',
    )
    .color(tone.accent.text.default)
  root
    .select('.landing-page .header-source')
    .display('flex')
    .gap('9px')
    .alignItems('center')
    .color(tone.neutral.text.default)
  root
    .select('.landing-page .header-source > span:last-child')
    .color(tone.neutral.root.text.subtle)
    .marginLeft('3px')
  root.select('.landing-page .header-source .icon').width('17px').height('17px')
  root.select('.landing-page .mobile-menu').display('none')
}
