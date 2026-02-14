import { styleBuilder } from '../../../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../../../style/themeOptions'
import type { ThemePalette } from '../../../style/themePalette'

export function registerPageTocStyles() {
  themes.forEach((theme, palette, options) => {
    registerPageTocShellStyles(theme, palette, options)
    registerPageTocLinkStyles(theme, palette, options)
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
    .position('relative')
    .gap('12px')
    .padding('16px')
    .borderRadius(options.radii.lg)
    .border('1px solid transparent')
    .fontSize('0.95rem')
    .lineHeight('1.5')
    .background(palette.background.surface)
    .borderColor(palette.border.subtle)
    .color(palette.text.default)
  styleBuilder
    .select('.page-toc__header-row', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('8px')
  styleBuilder
    .select('.page-toc__header', theme)
    .flex('1')
    .minWidth('0')
    .fontWeight('700')
    .fontSize('0.95rem')
    .letterSpacing('0.02em')
    .textTransform('uppercase')
    .color(palette.text.subtle)
  styleBuilder
    .select('.page-toc__restore-toggle', theme)
    .display('none')
    .alignItems('center')
    .justifyContent('center')
    .width('30px')
    .height('30px')
    .padding('0')
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.md)
    .background(palette.background.raised)
    .color(palette.text.subtle)
    .cursor('pointer')
    .transition('background 160ms ease, color 160ms ease')
  styleBuilder
    .select('.template-doc--toc-collapsed .page-toc__restore-toggle', theme)
    .display('inline-flex')
  styleBuilder
    .select('.page-toc__restore-toggle:hover', theme)
    .background(palette.background.accentMuted)
    .color(palette.text.accent)
  styleBuilder
    .select('.page-toc__restore-toggle:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.page-toc__restore-toggle svg', theme)
    .width('16px')
    .height('16px')
    .display('block')
    .fill('none')
    .stroke('currentColor')
    .set('stroke-width', '1.9')
    .set('stroke-linecap', 'round')
    .set('stroke-linejoin', 'round')
  styleBuilder
    .select('.page-toc__collapse-toggle', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .width('30px')
    .height('30px')
    .padding('0')
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.md)
    .background(palette.background.raised)
    .color(palette.text.subtle)
    .cursor('pointer')
    .transition('background 160ms ease, color 160ms ease')
    .position('absolute')
    .right('16px')
  styleBuilder
    .select('.page-toc__collapse-toggle:hover', theme)
    .background(palette.background.accentMuted)
    .color(palette.text.accent)
  styleBuilder
    .select('.page-toc__collapse-toggle:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.page-toc__collapse-toggle svg', theme)
    .width('16px')
    .height('16px')
    .display('block')
    .fill('none')
    .stroke('currentColor')
    .set('stroke-width', '1.9')
    .set('stroke-linecap', 'round')
    .set('stroke-linejoin', 'round')
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
    .borderLeft(`1px solid ${palette.border.default}`)
  styleBuilder.select('.page-toc__item', theme).display('grid')
  styleBuilder
    .select('.page-toc__empty', theme)
    .fontSize('0.9rem')
    .fontWeight('600')
    .color(palette.text.subtle)

  styleBuilder.select('.page-toc__mobile-toggle', theme).display('none')
  styleBuilder
    .select('.template-doc--toc-collapsed .page-toc__collapse-toggle', theme)
    .display('none')
  styleBuilder
    .select('.page-toc__restore-toggle', theme)
    .media('max-width: 1320px')
    .display('none')
  styleBuilder
    .select('.page-toc__collapse-toggle', theme)
    .media('max-width: 1320px')
    .display('none')
}

export function registerPageTocLinkStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.page-toc__link', theme)
    .display('block')
    .padding('6px 10px')
    .borderRadius(options.radii.md)
    .textDecoration('none')
    .fontWeight('600')
    .transition('background 160ms ease, color 160ms ease')
    .color(palette.text.default)
  styleBuilder
    .select('.page-toc__link:hover', theme)
    .background(palette.background.accentMuted)
  styleBuilder
    .select('.page-toc__link:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.page-toc__link--active', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
  styleBuilder
    .select('.page-toc__link--active:hover', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
  styleBuilder
    .select('.page-toc__link--sub.page-toc__link--active:hover', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)

  styleBuilder
    .select('.page-toc__link--sub', theme)
    .fontWeight('500')
    .color(palette.text.subtle)
  styleBuilder
    .select('.page-toc__link--sub:not(.page-toc__link--active):hover', theme)
    .color(palette.text.subtle)
  styleBuilder
    .select('.page-toc__link--sub.page-toc__link--active', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
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
    .background(palette.background.feature)
    .color(palette.text.accent)
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
    .media('max-width: 1320px')
    .gridTemplateColumns('260px minmax(0, 1fr)')
  styleBuilder
    .select('.doc-shell--toc', theme)
    .media('max-width: 1023px')
    .gridTemplateColumns('1fr')
  styleBuilder
    .select('.template-doc--toc-collapsed .doc-shell--toc', theme)
    .media('max-width: 1023px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.doc-shell--toc-only', theme)
    .media('max-width: 1320px')
    .gridTemplateColumns('1fr')
  styleBuilder
    .select('.doc-shell--nav-drawer.doc-shell--toc', theme)
    .media('max-width: 1320px')
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
  // Responsive TOC contract: collapse into right-edge drawer at <=1320px,
  // then switch to full-screen overlay at <=600px (same cutoff for tocCollapsed mode).
  styleBuilder
    .select('.template-doc:not(.template-doc--toc-collapsed) .doc-toc', theme)
    .media('max-width: 1320px')
    .position('fixed')
    .top('0')
    .right('0')
    .left('auto')
    .width('max(400px, 34vw)')
    .maxWidth('100vw')
    .height('100dvh')
    .zIndex(140)
    .overflow('hidden')
    .transform('translateX(calc(100% - 26px))')
    .background(palette.background.canvas)
    .boxShadow(options.shadows.strong)

  styleBuilder
    .select(
      '.template-doc.template-doc--nav-ready:not(.template-doc--toc-collapsed) .doc-toc',
      theme,
    )
    .media('max-width: 1320px')
    .transition('transform 260ms ease')

  styleBuilder
    .select('.template-doc:not(.template-doc--toc-collapsed) .doc-toc', theme)
    .media('max-width: 600px')
    .top('0')
    .left('0')
    .right('0')
    .width('auto')
    .maxWidth('none')
    .height('100dvh')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc.doc-toc--open',
      theme,
    )
    .media('max-width: 1320px')
    .transform('translateX(0)')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc:not(.doc-toc--open)',
      theme,
    )
    .media('max-width: 1320px')
    .background('transparent')
    .boxShadow('none')
    .set('pointer-events', 'none')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed).doc-toc-open',
      theme,
    )
    .media('max-width: 600px')
    .overflow('hidden')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .page-toc__mobile-toggle',
      theme,
    )
    .media('max-width: 1320px')
    .position('absolute')
    .left('0')
    .right('auto')
    .top('85%')
    .transform('translateY(-50%) rotate(180deg)')
    .set('writing-mode', 'vertical-rl')
    .set('text-orientation', 'mixed')
    .width('26px')
    .height('120px')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .fontSize('0.70rem')
    .fontWeight('700')
    .set('letter-spacing', '0.12em')
    .set('text-transform', 'uppercase')
    .color(palette.text.subtle)
    .background(palette.background.raised)
    .border(`1px solid ${palette.border.default}`)
    .set('border-left', 'none')
    .set('border-radius', `0 ${options.radii.md} ${options.radii.md} 0`)
    .boxShadow('none')
    .set('user-select', 'none')
    .cursor('pointer')
    .set('pointer-events', 'auto')
    .zIndex(2)

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .page-toc__mobile-toggle-icon',
      theme,
    )
    .media('max-width: 1320px')
    .display('none')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .page-toc__mobile-toggle-icon svg',
      theme,
    )
    .media('max-width: 1320px')
    .width('14px')
    .height('14px')
    .display('block')
    .fill('none')
    .stroke('currentColor')
    .set('stroke-width', '2.1')
    .set('stroke-linecap', 'round')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc:not(.doc-toc--open) .page-toc > :not(.page-toc__mobile-toggle)',
      theme,
    )
    .media('max-width: 1320px')
    .display('none')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc:not(.doc-toc--open) .page-toc',
      theme,
    )
    .media('max-width: 1320px')
    .background('transparent')
    .border('none')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .page-toc__mobile-toggle:focus-visible',
      theme,
    )
    .media('max-width: 1320px')
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc.doc-toc--open .page-toc__mobile-toggle',
      theme,
    )
    .media('max-width: 1320px')
    .left('auto')
    .right('16px')
    .top('16px')
    .transform('none')
    .set('writing-mode', 'horizontal-tb')
    .width('auto')
    .height('auto')
    .padding('6px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('3px')
    .set('letter-spacing', '0.08em')
    .border(`1px solid ${palette.border.default}`)
    .set('border-radius', options.radii.md)

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc.doc-toc--open .page-toc__mobile-toggle-icon',
      theme,
    )
    .media('max-width: 1320px')
    .display('inline-flex')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc.doc-toc--open .page-toc__mobile-toggle:hover',
      theme,
    )
    .media('max-width: 1320px')
    .color(palette.text.accent)
    .background(palette.background.accentMuted)
  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc.doc-toc--open .page-toc__mobile-toggle',
      theme,
    )
    .media('max-width: 1320px')
    .display('none')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc .page-toc',
      theme,
    )
    .media('max-width: 1320px')
    .height('100%')
    .overflow('visible')
    .padding('0')
    .borderRadius('0')
    .set('-webkit-overflow-scrolling', 'touch')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc.doc-toc--open .page-toc',
      theme,
    )
    .media('max-width: 1320px')
    .padding('30px 16px 14px')
    .gap('2px')
    .overflow('auto')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc .page-toc__header',
      theme,
    )
    .media('max-width: 1320px')
    .paddingRight('104px')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc .page-toc > .page-toc__list',
      theme,
    )
    .media('max-width: 1320px')
    .paddingBottom('8px')

  styleBuilder
    .select(
      '.template-doc:not(.template-doc--toc-collapsed) .doc-toc .page-toc__empty',
      theme,
    )
    .media('max-width: 1320px')
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
    .top('0')
    .right('0')
    .left('auto')
    .width('max(400px, 34vw)')
    .maxWidth('100vw')
    .height('100dvh')
    .zIndex(140)
    .overflow('hidden')
    .transform('translateX(calc(100% - 26px))')
    .background(palette.background.canvas)
    .boxShadow(options.shadows.strong)

  styleBuilder
    .select(
      '.template-doc.template-doc--nav-ready.template-doc--toc-collapsed .doc-toc',
      theme,
    )
    .transition('transform 260ms ease')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc', theme)
    .media('max-width: 600px')
    .top('0')
    .left('0')
    .right('0')
    .width('auto')
    .maxWidth('none')
    .height('100dvh')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc.doc-toc--open', theme)
    .transform('translateX(0)')

  styleBuilder
    .select('.template-doc--toc-collapsed.doc-toc-open', theme)
    .media('max-width: 600px')
    .overflow('hidden')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc:not(.doc-toc--open)', theme)
    .background('transparent')
    .boxShadow('none')
    .set('pointer-events', 'none')

  styleBuilder
    .select('.template-doc--toc-collapsed .page-toc__mobile-toggle', theme)
    .position('absolute')
    .left('0')
    .right('auto')
    .top('85%')
    .transform('translateY(-50%) rotate(180deg)')
    .set('writing-mode', 'vertical-rl')
    .set('text-orientation', 'mixed')
    .width('26px')
    .height('120px')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .fontSize('0.70rem')
    .fontWeight('700')
    .set('letter-spacing', '0.12em')
    .set('text-transform', 'uppercase')
    .color(palette.text.subtle)
    .background(palette.background.raised)
    .border(`1px solid ${palette.border.default}`)
    .set('border-left', 'none')
    .set('border-radius', `0 ${options.radii.md} ${options.radii.md} 0`)
    .boxShadow('none')
    .set('user-select', 'none')
    .cursor('pointer')
    .set('pointer-events', 'auto')
    .zIndex(2)

  styleBuilder
    .select('.template-doc--toc-collapsed .page-toc__mobile-toggle-icon', theme)
    .display('none')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc:not(.doc-toc--open) .page-toc > :not(.page-toc__mobile-toggle)',
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

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .page-toc__mobile-toggle:focus-visible',
      theme,
    )
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc.doc-toc--open .page-toc__mobile-toggle',
      theme,
    )
    .left('auto')
    .right('16px')
    .top('16px')
    .transform('none')
    .set('writing-mode', 'horizontal-tb')
    .width('auto')
    .height('auto')
    .padding('6px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .gap('3px')
    .set('letter-spacing', '0.08em')
    .border(`1px solid ${palette.border.default}`)
    .set('border-radius', options.radii.md)

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc.doc-toc--open .page-toc__restore-toggle',
      theme,
    )
    .position('absolute')
    .top('16px')
    .right('16px')
    .zIndex(3)

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc.doc-toc--open .page-toc__mobile-toggle-icon',
      theme,
    )
    .display('inline-flex')
    .alignItems('center')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc.doc-toc--open .page-toc__mobile-toggle-icon svg',
      theme,
    )
    .width('14px')
    .height('14px')
    .display('block')
    .fill('none')
    .stroke('currentColor')
    .set('stroke-width', '2.1')
    .set('stroke-linecap', 'round')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc.doc-toc--open .page-toc__mobile-toggle:hover',
      theme,
    )
    .color(palette.text.accent)
    .background(palette.background.accentMuted)
  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc.doc-toc--open .page-toc__mobile-toggle',
      theme,
    )
    .display('none')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc .page-toc', theme)
    .height('100%')
    .overflow('visible')
    .padding('0')
    .borderRadius('0')
    .set('-webkit-overflow-scrolling', 'touch')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc.doc-toc--open .page-toc',
      theme,
    )
    .padding('30px 16px 14px')
    .gap('2px')
    .overflow('auto')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc .page-toc__header', theme)
    .paddingRight('104px')

  styleBuilder
    .select(
      '.template-doc--toc-collapsed .doc-toc .page-toc > .page-toc__list',
      theme,
    )
    .paddingBottom('8px')

  styleBuilder
    .select('.template-doc--toc-collapsed .doc-toc .page-toc__empty', theme)
    .paddingBottom('8px')
}
