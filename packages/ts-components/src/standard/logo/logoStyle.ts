import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerLogoStyles() {
  themes.forEach((theme, palette, options) => {
    registerLogoShellStyles(theme, palette, options)
    registerLogoTextStyles(theme, palette, options)
    registerLogoInteractiveStyles(theme, palette)
  })
}

export function registerLogoShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-logo', theme)
    .display('inline-block')
    .width('fit-content')

  styleBuilder
    .select('.site-logo__link', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('0.5rem')
    .padding('8px 12px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.current.border.subtle}`)
    .textDecoration('none')
    .maxWidth('100%')
    .background(palette.semanticTone.neutral.surface.rest.background)

  styleBuilder
    .select('.site-logo__link:hover', theme)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.site-logo__glyph', theme)
    .width('2rem')
    .height('2rem')
    .minWidth('2rem')
    .minHeight('2rem')
    .borderRadius(options.radii.md)
    .display('grid')
    .placeItems('center')
    .position('relative')
    .background(palette.semanticTone.accent.icon.background)
    .border(`1px solid ${palette.semanticTone.accent.icon.border}`)

  styleBuilder
    .select('.site-logo__icon', theme)
    .width('70%')
    .height('70%')
    .color(palette.semanticTone.accent.icon.color)

  styleBuilder
    .select('.site-logo__glyph-mark', theme)
    .position('absolute')
    .inset('30%')
    .borderRadius('4px')
    .background(palette.semanticTone.accent.icon.color)
}

export function registerLogoTextStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.site-logo__stack', theme)
    .display('inline-grid')
    .gridTemplateColumns('max-content')
    .justifyItems('stretch')
    .alignItems('start')
    .gap('0.125rem')
    .minWidth('0')

  styleBuilder
    .select('.site-logo__brand', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .width('100%')

  styleBuilder
    .select('.site-logo__brand-letter', theme)
    .display('block')
    .flexShrink('0')
    .fontFamily(options.typography.baseFamily)
    .fontSize('1.25rem')
    .lineHeight('0.95')
    .fontWeight('800')
    .letterSpacing('0.03em')
    .textTransform('uppercase')
    .whiteSpace('nowrap')
    .backgroundClip('text')
    .webkitBackgroundClip('text')
    .color('transparent')
    .webkitTextFillColor('transparent')

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .width('100%')
    .fontSize('0.5rem')
    .lineHeight('1')
    .fontWeight('700')
    .textTransform('uppercase')
    .color(palette.current.text.subtle)
    .whiteSpace('nowrap')

  styleBuilder
    .select('.site-logo__subtitle-letter', theme)
    .display('block')
    .flexShrink('0')
    .backgroundClip('text')
    .webkitBackgroundClip('text')
    .color('transparent')
    .webkitTextFillColor('transparent')
}

export function registerLogoInteractiveStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-logo__link[href]', theme)
    .cursor('pointer')
    .transition('border-color 180ms ease')

  styleBuilder
    .select('.site-logo__link[href]:hover', theme)
    .borderColor(palette.semanticTone.accent.border.default)

  styleBuilder
    .select('.site-logo__link[href]:focus-visible', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
    .outlineOffset('0')
}
