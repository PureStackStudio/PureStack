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
    registerLogoTextStyles(theme, palette)
    registerLogoResponsiveStyles(theme)
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
    .gap('0.25rem')
    .padding('0.25rem 0.5rem')
    .borderRadius(options.radii.sm)
    .border(`1px solid ${palette.current.border.subtle}`)
    .textDecoration('none')
    .maxWidth('100%')
    .background(palette.semanticTone.neutral.surface.rest.background)

  styleBuilder
    .select('.site-logo__link:hover', theme)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.site-logo__glyph', theme)
    .width('var(--ps-logo-icon-size, 2rem)')
    .height('var(--ps-logo-icon-size, 2rem)')
    .minWidth('var(--ps-logo-icon-size, 2rem)')
    .minHeight('var(--ps-logo-icon-size, 2rem)')
    .borderRadius(options.radii.md)
    .display('grid')
    .placeItems('center')
    .position('relative')
    .background(
      `var(--ps-logo-glyph-background, ${palette.semanticTone.accent.icon.background})`,
    )
    .backgroundColor(
      `var(--ps-logo-glyph-background, ${palette.semanticTone.accent.icon.background})`,
    )
    .border(`1px solid ${palette.semanticTone.accent.icon.border}`)
    .color(
      `var(--ps-logo-glyph-foreground, ${palette.semanticTone.accent.icon.color})`,
    )

  styleBuilder
    .select('.site-logo__glyph > .icon', theme)
    .width('80%')
    .height('80%')

  styleBuilder
    .select('.site-logo__glyph-mark', theme)
    .position('absolute')
    .inset('30%')
    .borderRadius('4px')
    .backgroundColor('currentColor')
}

export function registerLogoTextStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.site-logo__stack', theme)
    .display('inline-grid')
    .justifyItems('stretch')
    .gap('0')
    .minWidth('0')
    .textTransform('uppercase')
    .letterSpacing('0')
    .lineHeight('1')
    .whiteSpace('nowrap')

  styleBuilder
    .select('.site-logo__brand', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .fontSize('var(--ps-logo-brand-size, 1.25rem)')
    .fontWeight('800')

  styleBuilder
    .select('.site-logo__brand-letter', theme)
    .whiteSpace('nowrap')
    .backgroundClip('text')
    .webkitBackgroundClip('text')
    .color('transparent')
    .webkitTextFillColor('transparent')

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .display('flex')
    .justifyContent('space-between')
    .fontSize('var(--ps-logo-subtitle-size, 0.5rem)')
    .fontWeight('700')
    .color(palette.current.text.subtle)
    .marginLeft('var(--ps-logo-subtitle-inset, 0.5px)')
    .marginRight('var(--ps-logo-subtitle-inset, 0.5px)')

  styleBuilder
    .select('.site-logo__subtitle-letter', theme)
    .backgroundClip('text')
    .webkitBackgroundClip('text')
    .color('transparent')
    .webkitTextFillColor('transparent')
}

export function registerLogoResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-logo__glyph', theme)
    .media('min-width: 640px')
    .width('var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem))')
    .height('var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem))')
    .minWidth('var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem))')
    .minHeight('var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem))')

  styleBuilder
    .select('.site-logo__glyph', theme)
    .media('min-width: 768px')
    .width(
      'var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem)))',
    )
    .height(
      'var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem)))',
    )
    .minWidth(
      'var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem)))',
    )
    .minHeight(
      'var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem)))',
    )

  styleBuilder
    .select('.site-logo__glyph', theme)
    .media('min-width: 1024px')
    .width(
      'var(--ps-logo-icon-size-lg, var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem))))',
    )
    .height(
      'var(--ps-logo-icon-size-lg, var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem))))',
    )
    .minWidth(
      'var(--ps-logo-icon-size-lg, var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem))))',
    )
    .minHeight(
      'var(--ps-logo-icon-size-lg, var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem))))',
    )

  styleBuilder
    .select('.site-logo__glyph', theme)
    .media('min-width: 1280px')
    .width(
      'var(--ps-logo-icon-size-xl, var(--ps-logo-icon-size-lg, var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem)))))',
    )
    .height(
      'var(--ps-logo-icon-size-xl, var(--ps-logo-icon-size-lg, var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem)))))',
    )
    .minWidth(
      'var(--ps-logo-icon-size-xl, var(--ps-logo-icon-size-lg, var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem)))))',
    )
    .minHeight(
      'var(--ps-logo-icon-size-xl, var(--ps-logo-icon-size-lg, var(--ps-logo-icon-size-md, var(--ps-logo-icon-size-sm, var(--ps-logo-icon-size, 2rem)))))',
    )

  styleBuilder
    .select('.site-logo__brand', theme)
    .media('min-width: 640px')
    .fontSize(
      'var(--ps-logo-brand-size-sm, var(--ps-logo-brand-size, 1.25rem))',
    )

  styleBuilder
    .select('.site-logo__brand', theme)
    .media('min-width: 768px')
    .fontSize(
      'var(--ps-logo-brand-size-md, var(--ps-logo-brand-size-sm, var(--ps-logo-brand-size, 1.25rem)))',
    )

  styleBuilder
    .select('.site-logo__brand', theme)
    .media('min-width: 1024px')
    .fontSize(
      'var(--ps-logo-brand-size-lg, var(--ps-logo-brand-size-md, var(--ps-logo-brand-size-sm, var(--ps-logo-brand-size, 1.25rem))))',
    )

  styleBuilder
    .select('.site-logo__brand', theme)
    .media('min-width: 1280px')
    .fontSize(
      'var(--ps-logo-brand-size-xl, var(--ps-logo-brand-size-lg, var(--ps-logo-brand-size-md, var(--ps-logo-brand-size-sm, var(--ps-logo-brand-size, 1.25rem)))))',
    )

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .media('min-width: 640px')
    .fontSize(
      'var(--ps-logo-subtitle-size-sm, var(--ps-logo-subtitle-size, 0.5rem))',
    )
    .marginLeft(
      'var(--ps-logo-subtitle-inset-sm, var(--ps-logo-subtitle-inset, 0.5px))',
    )
    .marginRight(
      'var(--ps-logo-subtitle-inset-sm, var(--ps-logo-subtitle-inset, 0.5px))',
    )

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .media('min-width: 768px')
    .fontSize(
      'var(--ps-logo-subtitle-size-md, var(--ps-logo-subtitle-size-sm, var(--ps-logo-subtitle-size, 0.5rem)))',
    )
    .marginLeft(
      'var(--ps-logo-subtitle-inset-md, var(--ps-logo-subtitle-inset-sm, var(--ps-logo-subtitle-inset, 0.5px)))',
    )
    .marginRight(
      'var(--ps-logo-subtitle-inset-md, var(--ps-logo-subtitle-inset-sm, var(--ps-logo-subtitle-inset, 0.5px)))',
    )

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .media('min-width: 1024px')
    .fontSize(
      'var(--ps-logo-subtitle-size-lg, var(--ps-logo-subtitle-size-md, var(--ps-logo-subtitle-size-sm, var(--ps-logo-subtitle-size, 0.5rem))))',
    )
    .marginLeft(
      'var(--ps-logo-subtitle-inset-lg, var(--ps-logo-subtitle-inset-md, var(--ps-logo-subtitle-inset-sm, var(--ps-logo-subtitle-inset, 0.5px))))',
    )
    .marginRight(
      'var(--ps-logo-subtitle-inset-lg, var(--ps-logo-subtitle-inset-md, var(--ps-logo-subtitle-inset-sm, var(--ps-logo-subtitle-inset, 0.5px))))',
    )

  styleBuilder
    .select('.site-logo__subtitle', theme)
    .media('min-width: 1280px')
    .fontSize(
      'var(--ps-logo-subtitle-size-xl, var(--ps-logo-subtitle-size-lg, var(--ps-logo-subtitle-size-md, var(--ps-logo-subtitle-size-sm, var(--ps-logo-subtitle-size, 0.5rem)))))',
    )
    .marginLeft(
      'var(--ps-logo-subtitle-inset-xl, var(--ps-logo-subtitle-inset-lg, var(--ps-logo-subtitle-inset-md, var(--ps-logo-subtitle-inset-sm, var(--ps-logo-subtitle-inset, 0.5px)))))',
    )
    .marginRight(
      'var(--ps-logo-subtitle-inset-xl, var(--ps-logo-subtitle-inset-lg, var(--ps-logo-subtitle-inset-md, var(--ps-logo-subtitle-inset-sm, var(--ps-logo-subtitle-inset, 0.5px)))))',
    )
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
