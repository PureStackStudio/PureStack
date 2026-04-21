import type { ThemePalette } from '@purestack/ts-style'
import {
  mediaBelow,
  mediaMax,
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerPageTocStyles() {
  themes.forEach((theme, palette, options) => {
    registerPageTocShellStyles(theme, palette, options)
    registerPageTocLinkStyles(theme, options)
    registerPageTocTargetStyles(theme, palette)
    registerPageTocLayoutStyles(theme, palette, options)
  })
}

export function registerPageTocShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.page-toc', theme)
    .display('grid')
    .alignContent('start')
    .gap('0.6em')
    .padding('1em')
    .borderRadius(options.radii.lg)
    .border('1px solid transparent')
    .apply(palette.applyFont(palette.font.size.body))
  styleBuilder
    .select('.page-toc__header-row', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('0.5em')
    .marginBottom('0.5em')
  styleBuilder
    .select('.page-toc__header', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .textTransform('uppercase')
    .color(palette.current.text.subtle)
    .opacity('0.5')
  styleBuilder
    .select('.page-toc__restore-toggle', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .padding('0.25em')
    .background('transparent')
    .border('transparent')
    .borderRadius(options.radii.md)
    .cursor('pointer')
    .transition('background 160ms ease, color 160ms ease')
    .apply(palette.applyFont(palette.font.size.xxxs))
  styleBuilder
    .select('.page-toc__header-toggle-icon', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
  styleBuilder
    .select('.page-toc__header-toggle-icon--restore', theme)
    .display('none')
  styleBuilder
    .select(
      '.template-doc--toc-collapsed .page-toc__header-toggle-icon--collapse',
      theme,
    )
    .display('none')
  styleBuilder
    .select(
      '.template-doc--toc-collapsed .page-toc__header-toggle-icon--restore',
      theme,
    )
    .display('inline-flex')
  styleBuilder
    .select('.page-toc__header-toggle-icon svg', theme)
    .display('block')
    .fill('none')
    .stroke('currentColor')
    .strokeWidth('1.9')
    .strokeLinecap('round')
    .strokeLinejoin('round')
  styleBuilder
    .select('.page-toc__list', theme)
    .listStyle('none')
    .margin('0')
    .padding('0')
    .display('grid')
    .gap('6px')
    .overflow('hidden')
  styleBuilder
    .select('.page-toc__list--nested', theme)
    .paddingLeft('12px')
    .borderLeft(`1px solid ${palette.current.border.default}`)
  styleBuilder.select('.page-toc__item', theme).display('grid')
  styleBuilder
    .select('.page-toc__empty', theme)
    .apply(palette.applyFont(palette.font.size.xs, palette.font.weight.w600))
    .color(palette.current.text.subtle)

  styleBuilder.select('.page-toc__panel-toggle', theme).display('none')
  styleBuilder
    .select('.page-toc__restore-toggle', theme)
    .media(mediaMax('toc'))
    .display('none')
}

export function registerPageTocLinkStyles(
  theme: ThemeMode,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.page-toc__link', theme)
    .display('block')
    .padding('8px 12px')
    .borderRadius(options.radii.md)
    .textDecoration('none')
    .fontWeight('600')
    .transition('background 160ms ease, color 160ms ease')

  styleBuilder.select('.page-toc__link--sub', theme).fontWeight('500')
}

export function registerPageTocTargetStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.doc-content .page-toc__target', theme)
    .scrollMarginTop('96px')
    .padding('0')
    .borderRadius('0')
    .transition('background 200ms ease, color 200ms ease')
  styleBuilder
    .select('.doc-content .page-toc__target', theme)
    .boxShadow(`0 2px 0 0 ${palette.current.tone}`)
}

export function registerPageTocLayoutStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-shell--toc', theme)
    .gridTemplateColumns('260px minmax(0, 1fr) 240px')
  styleBuilder
    .select('.doc-shell--toc-only', theme)
    .gridTemplateColumns('minmax(0, 1fr) 240px')
  styleBuilder
    .select('.doc-shell--nav-drawer.doc-shell--toc', theme)
    .gridTemplateColumns('minmax(0, 1fr) 240px')
  styleBuilder
    .select('.doc-shell--toc', theme)
    .media(mediaMax('toc'))
    .gridTemplateColumns('260px minmax(0, 1fr)')
  styleBuilder
    .select(
      '.doc-shell--toc, .template-doc--toc-collapsed .doc-shell--toc',
      theme,
    )
    .media(mediaBelow('lg'))
    .gridTemplateColumns('1fr !important')

  styleBuilder
    .select('.doc-shell--toc-only', theme)
    .media(mediaMax('toc'))
    .gridTemplateColumns('1fr')
  styleBuilder
    .select('.doc-shell--nav-drawer.doc-shell--toc', theme)
    .media(mediaMax('toc'))
    .gridTemplateColumns('1fr')
  styleBuilder
    .select('.doc-toc', theme)
    .position('sticky')
    .top('88px')
    .width('100%')
    .zIndex(30)
    .alignSelf('start')
    .height('calc(100vh - 112px)')
    .overflow('auto')
  // Responsive TOC contract: collapse at the shared `toc` breakpoint,
  // then switch to full-screen overlay at the shared `phone` breakpoint.
  styleBuilder
    .select('.template-doc:not(.template-doc--toc-collapsed) .doc-toc', theme)
    .media(mediaMax('toc'))
    .position('fixed')
    .top('72px')
    .right('0')
    .left('auto')
    .width('auto')
    .maxWidth('100vw')
    .height('calc(100dvh - 72px)')
    .zIndex(140)
    .overflow('hidden')
    .transform('translateX(calc(100% - 26px))')
    .background('transparent')
    .boxShadow('none')

  styleBuilder
    .select(
      '.template-doc.template-doc--nav-ready:not(.template-doc--toc-collapsed) .doc-toc',
      theme,
    )
    .media(mediaMax('toc'))
    .transition('transform 260ms ease')

  styleBuilder
    .select('.template-doc:not(.template-doc--toc-collapsed) .doc-toc', theme)
    .media(mediaMax('phone'))
    .top('72px')
    .left('0')
    .right('0')
    .width('auto')
    .maxWidth('none')
    .height('calc(100dvh - 72px)')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc.doc-toc--open',
      theme,
    )
    .media(mediaMax('toc'))
    .transform('translateX(0)')
    .overflowY('auto')
    .overflowX('hidden')
    .webkitOverflowScrolling('touch')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc:not(.doc-toc--open)',
      theme,
    )
    .media(mediaMax('toc'))
    .width('26px')
    .background('transparent')
    .boxShadow('none')
    .pointerEvents('none')
  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc:not(.doc-toc--open)',
      theme,
    )
    .media(mediaMax('phone'))
    .left('auto')
    .right('0')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed).doc-toc-open',
      theme,
    )
    .media(mediaMax('phone'))
    .overflow('hidden')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .page-toc__panel-toggle',
      theme,
    )
    .media(mediaMax('toc'))
    .position('absolute')
    .left('0')
    .right('auto')
    .top('85%')
    .transform('translateY(-50%) rotate(180deg)')
    .writingMode('vertical-rl')
    .textOrientation('mixed')
    .width('26px')
    .height('120px')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .apply(palette.applyFont(palette.font.size.xxxs, palette.font.weight.w600))
    .textTransform('uppercase')
    .color(palette.current.text.subtle)
    .border('1px solid transparent')
    .borderLeft('none')
    .borderRadius(`0 ${options.radii.md} ${options.radii.md} 0`)
    .boxShadow('none')
    .userSelect('none')
    .cursor('pointer')
    .pointerEvents('auto')
    .zIndex(2)

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc:not(.doc-toc--open) .page-toc > :not(.page-toc__panel-toggle)',
      theme,
    )
    .media(mediaMax('toc'))
    .display('none')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc:not(.doc-toc--open) .page-toc',
      theme,
    )
    .media(mediaMax('toc'))
    .background('transparent')
    .border('none')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .page-toc__panel-toggle:focus-visible',
      theme,
    )
    .media(mediaMax('toc'))

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc.doc-toc--open .page-toc__panel-toggle',
      theme,
    )
    .media(mediaMax('toc'))
    .display('none')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc .page-toc',
      theme,
    )
    .media(mediaMax('toc'))
    .height('100%')
    .overflow('visible')
    .padding('0')
    .borderRadius('0')
    .webkitOverflowScrolling('touch')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc.doc-toc--open .page-toc',
      theme,
    )
    .media(mediaMax('toc'))
    .height('auto')
    .maxHeight('none')
    .padding('30px 16px 14px')
    .borderRadius(options.radii.lg)
    .gap('2px')
    .overflow('visible')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc .page-toc__header',
      theme,
    )
    .media(mediaMax('toc'))
    .paddingRight('104px')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc .page-toc > .page-toc__list, .template-doc:not(.template-doc--toc-collapsed) .doc-toc .page-toc__empty',
      theme,
    )
    .media(mediaMax('toc'))
    .paddingBottom('8px')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-shell--toc', theme)
    .gridTemplateColumns('260px minmax(0, 1fr)')
  styleBuilder
    .select('.template-doc--toc-collapsed .doc-shell--toc-only', theme)
    .gridTemplateColumns('1fr')
  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-shell--nav-drawer.doc-shell--toc',
      theme,
    )
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc', theme)
    .position('fixed')
    .top('72px')
    .right('0')
    .left('auto')
    .width('auto')
    .maxWidth('100vw')
    .height('calc(100dvh - 72px)')
    .zIndex(140)
    .overflow('hidden')
    .transform('translateX(calc(100% - 26px))')
    .background('transparent')
    .boxShadow('none')

  styleBuilder
    .select(
      '.template-doc.template-doc--nav-ready.template-doc--toc-collapsed .doc-toc',
      theme,
    )
    .transition('transform 260ms ease')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc', theme)
    .media(mediaMax('phone'))
    .top('72px')
    .left('0')
    .right('0')
    .width('auto')
    .maxWidth('none')
    .height('calc(100dvh - 72px)')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc.doc-toc--open', theme)
    .transform('translateX(0)')
    .overflowY('auto')
    .overflowX('hidden')
    .webkitOverflowScrolling('touch')

  styleBuilder
    .select('.template-doc--toc-collapsed.doc-toc-open', theme)
    .media(mediaMax('phone'))
    .overflow('hidden')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc:not(.doc-toc--open)', theme)
    .width('26px')
    .background('transparent')
    .boxShadow('none')
    .pointerEvents('none')
  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc:not(.doc-toc--open)', theme)
    .media(mediaMax('phone'))
    .left('auto')
    .right('0')

  styleBuilder
    .select('.template-doc--toc-collapsed .page-toc__panel-toggle', theme)
    .position('absolute')
    .left('0')
    .right('auto')
    .top('50%')
    .transform('translateY(-50%) rotate(180deg)')
    .writingMode('vertical-rl')
    .textOrientation('mixed')
    .width('26px')
    .height('120px')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .apply(palette.applyFont(palette.font.size.xxxs, palette.font.weight.w700))
    .textTransform('uppercase')
    .border('1px solid var(--ps-current-border-default)')
    .borderLeft('none')
    .borderRadius(`0 ${options.radii.md} ${options.radii.md} 0`)
    .userSelect('none')
    .cursor('pointer')
    .pointerEvents('auto')
    .zIndex(2)

  styleBuilder
    .select('.template-doc--toc-collapsed .page-toc__panel-toggle', theme)
    .media(mediaMax('toc'))
    .top('85%')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc:not(.doc-toc--open) .page-toc > :not(.page-toc__panel-toggle)',
      theme,
    )
    .display('none')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc:not(.doc-toc--open) .page-toc',
      theme,
    )
    .background('transparent')
    .border('none')

  styleBuilder.select(
    '.template-doc--toc-collapsed .page-toc__panel-toggle:focus-visible',
    theme,
  )

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc.doc-toc--open .page-toc__panel-toggle',
      theme,
    )
    .display('none')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc .page-toc', theme)
    .height('100%')
    .overflow('visible')
    .padding('0')
    .borderRadius('0')
    .webkitOverflowScrolling('touch')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc.doc-toc--open .page-toc',
      theme,
    )
    .height('auto')
    .maxHeight('none')
    .padding('30px 16px 14px')
    .borderRadius(options.radii.lg)
    .gap('2px')
    .overflow('visible')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc .page-toc__header', theme)
    .paddingRight('104px')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc .page-toc > .page-toc__list, .template-doc--toc-collapsed .doc-toc .page-toc__empty',
      theme,
    )
    .paddingBottom('8px')
}
