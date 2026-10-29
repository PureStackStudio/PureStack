import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  docLayoutDefaults,
  docLayoutVars,
  mediaBelow,
  styleBuilder,
  type ThemeMode,
  themes,
} from '@purestack/ts-style'

export function registerSearchBoxStyles() {
  themes.forEach((theme, palette) => {
    registerSearchBoxShellStyles(theme)
    registerSearchBoxControlStyles(theme, palette)
    registerSearchBoxResultStyles(theme, palette)
  })
}

export function registerSearchBoxShellStyles(theme: ThemeMode) {
  styleBuilder
    .select('.site-search', theme)
    .position('relative')
    .minWidth('0')
    .maxWidth('100%')
  styleBuilder.select('.site-search__control', theme).position('relative')
  styleBuilder
    .select('.site-search__sr-only', theme)
    .position('absolute')
    .width('1px')
    .height('1px')
    .padding('0')
    .margin('-1px')
    .overflow('hidden')
    .clip('rect(0, 0, 0, 0)')
    .whiteSpace('nowrap')
    .border('0')
}

function registerSearchBoxControlStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder.select('.topbar .site-search', theme).maxWidth('28rem')
  styleBuilder
    .select('.site-search__control .form-block__input-shell', theme)
    .minHeight('2.75rem')
    .alignItems('center')
  styleBuilder
    .select('.site-search__control .form-block__input', theme)
    .minWidth('0')
    .paddingRight('3rem')
  styleBuilder
    .select('.site-search__control .form-block__input-icon', theme)
    .color(palette.current.text.subtle)
  styleBuilder
    .select(
      '.site-search .site-search__control:focus-within .form-block__input-shell',
      theme,
    )
    .borderColor(palette.semanticTone.accent.border.focus)
    .boxShadow(
      `0 0 0 3px ${palette.semanticTone.accent.surface.rest.background}`,
    )
  styleBuilder
    .select('.site-search .site-search__shortcut', theme)
    .position('absolute')
    .right('0.75rem')
    .top('50%')
    .transform('translateY(-50%)')
    .pointerEvents('none')
    .minWidth('1.375rem')
    .height('1.375rem')
    .display('grid')
    .placeItems('center')
    .padding('0')
    .margin('0')
    .borderRadius(palette.radii.sm)
    .border(`1px solid ${palette.current.border.subtle}`)
    .background(palette.current.surface.rest.background)
    .color(palette.current.text.subtle)
    .fontSize('0.75rem')
    .lineHeight('1')
    .boxShadow('0 1px 1px rgb(0 0 0 / 0.06)')
}

export function registerSearchBoxResultStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  registerSearchBoxResultContainerStyles(theme, palette)
  registerSearchBoxPanelChromeStyles(theme, palette)
  registerSearchBoxResultListStyles(theme, palette)
  registerSearchBoxResultContentStyles(theme, palette)
  registerSearchBoxMessageStyles(theme, palette)
}

function registerSearchBoxResultContainerStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  const neutral = palette.semanticTone.neutral
  styleBuilder
    .select('.site-search__results', theme)
    .position('absolute')
    .top('calc(100% + 0.75rem)')
    .right('0')
    .width('min(42rem, calc(100vw - 2rem))')
    .maxHeight('min(38rem, calc(100dvh - 7rem))')
    .display('flex')
    .flexDirection('column')
    .overflow('hidden')
    .boxSizing('border-box')
    .padding('0')
    .borderRadius(palette.radii.lg)
    .border(`1px solid ${neutral.border.default}`)
    .background(neutral.surface.rest.background)
    .boxShadow(palette.effect.strongShadow)
    .zIndex('60')
    .fontFamily(palette.font.family.base)
    .fontSize(palette.font.size.sm)
    .lineHeight('1.5')
    .letterSpacing('normal')
    .textTransform('none')
    .color(neutral.text.default)
    .textAlign('left')
  styleBuilder.select('.site-search__results[hidden]', theme).display('none')
  styleBuilder
    .select('.topbar .site-search__results', theme)
    .position('fixed')
    .top(`var(${docLayoutVars.sidebarTop}, ${docLayoutDefaults.sidebarTop})`)
    .left('50%')
    .right('auto')
    .transform('translateX(-50%)')
    .zIndex('120')
  styleBuilder
    .select('.site-search__results', theme)
    .media(mediaBelow(BREAKPOINTS.sm))
    .position('fixed')
    .top('5rem')
    .left('1rem')
    .right('1rem')
    .width('auto')
    .maxHeight('calc(100dvh - 6rem)')
  styleBuilder
    .select('.site-search__body', theme)
    .overflowY('auto')
    .overscrollBehavior('contain')
    .scrollbarWidth('thin')
    .scrollbarColor(`${neutral.border.default} transparent`)
    .minHeight('0')
    .padding('0.5rem')
}

function registerSearchBoxPanelChromeStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent
  styleBuilder
    .select('.site-search__header', theme)
    .display('grid')
    .gridTemplateColumns('2.5rem minmax(0, 1fr) auto')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('1rem')
    .padding('1.125rem 1.375rem')
    .flexShrink('0')
    .borderBottom(`1px solid ${neutral.border.subtle}`)
    .backgroundImage(
      `radial-gradient(ellipse at top right, ${accent.surface.rest.background}, transparent 70%)`,
    )
  styleBuilder.select('.site-search__header > div', theme).minWidth('0')
  styleBuilder
    .select('.site-search__header-icon', theme)
    .display('grid')
    .placeItems('center')
    .width('2.5rem')
    .height('2.5rem')
    .borderRadius(palette.radii.md)
    .background(accent.button.rest.background)
    .color(accent.button.rest.text)
  styleBuilder
    .select('.site-search__header-icon svg', theme)
    .width('1.25rem')
    .height('1.25rem')
  styleBuilder
    .select('.site-search__eyebrow', theme)
    .display('block')
    .fontSize('0.625rem')
    .fontWeight(palette.font.weight.w700)
    .letterSpacing('0.14em')
    .textTransform('uppercase')
    .color(accent.tone)
    .marginBottom('0.25rem')
  styleBuilder
    .select('.site-search .site-search__heading', theme)
    .margin('0')
    .fontSize('0.9375rem')
    .fontWeight(palette.font.weight.w600)
    .overflow('hidden')
    .textOverflow('ellipsis')
    .whiteSpace('nowrap')
  styleBuilder
    .select('.site-search__count', theme)
    .flexShrink('0')
    .borderRadius(palette.radii.pill)
    .padding('0.25rem 0.625rem')
    .fontSize('0.6875rem')
    .fontWeight(palette.font.weight.w500)
    .whiteSpace('nowrap')
    .border(`1px solid ${neutral.border.subtle}`)
    .background(neutral.surfaceAlt.rest.background)
    .color(neutral.text.subtle)
  styleBuilder
    .select('.site-search__footer', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .flexShrink('0')
    .gap('0.75rem')
    .padding('0.625rem 1.25rem')
    .borderTop(`1px solid ${neutral.border.subtle}`)
    .background(neutral.surfaceAlt.rest.background)
    .color(neutral.text.subtle)
    .fontSize('0.6875rem')
  styleBuilder
    .select('.site-search__footer > span', theme)
    .display('flex')
    .alignItems('center')
    .gap('0.375rem')
  styleBuilder
    .select('.site-search__footer kbd', theme)
    .display('inline-grid')
    .placeItems('center')
    .minWidth('1.125rem')
    .height('1.125rem')
    .padding('0 0.2rem')
    .margin('0')
    .fontFamily('inherit')
    .fontSize('0.625rem')
    .lineHeight('1')
    .borderRadius(palette.radii.sm)
    .border(`1px solid ${neutral.border.default}`)
    .background(neutral.surface.rest.background)
    .color(neutral.text.subtle)
    .boxShadow('0 1px 1px rgb(0 0 0 / 0.05)')
}

function registerSearchBoxResultListStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent
  styleBuilder
    .select('.site-search .site-search__list', theme)
    .listStyle('none')
    .margin('0')
    .padding('0')
    .display('grid')
    .gap('0.125rem')
  styleBuilder
    .select('.site-search .site-search__item', theme)
    .margin('0')
    .padding('0')
  styleBuilder
    .select('.site-search .site-search__link', theme)
    .display('grid')
    .gridTemplateColumns('2.25rem minmax(0, 1fr) 1rem')
    .alignItems('start')
    .gap('0.875rem')
    .padding('0.875rem')
    .borderRadius(palette.radii.md)
    .border('1px solid transparent')
    .textDecoration('none')
    .color(neutral.text.default)
    .background('transparent')
    .scrollMargin('0.5rem')
    .transition('background-color 140ms ease, border-color 140ms ease')
  styleBuilder
    .select(
      '.site-search .site-search__link:hover, .site-search .site-search__link:focus-visible',
      theme,
    )
    .background(accent.surface.rest.background)
    .borderColor(accent.surface.rest.border)
  styleBuilder
    .select('.site-search .site-search__link:focus-visible', theme)
    .outline(`2px solid ${accent.border.focus}`)
    .outlineOffset('-2px')
  styleBuilder
    .select('.site-search__result-icon', theme)
    .display('grid')
    .placeItems('center')
    .width('2.25rem')
    .height('2.5rem')
    .borderRadius(palette.radii.md)
    .border(`1px solid ${neutral.border.subtle}`)
    .background(neutral.surfaceAlt.rest.background)
    .color(neutral.text.subtle)
  styleBuilder
    .select('.site-search__result-icon svg', theme)
    .width('1.125rem')
    .height('1.125rem')
  styleBuilder
    .select('.site-search__arrow', theme)
    .color(neutral.text.subtle)
    .paddingTop('0.25rem')
  styleBuilder
    .select('.site-search__arrow svg', theme)
    .width('1rem')
    .height('1rem')
  styleBuilder
    .select(
      '.site-search__link:hover .site-search__result-icon, .site-search__link:focus-visible .site-search__result-icon',
      theme,
    )
    .background(accent.surfaceAlt.rest.background)
    .borderColor(accent.surfaceAlt.rest.border)
    .color(accent.surfaceAlt.rest.text)
  styleBuilder
    .select('.site-search__result-copy', theme)
    .display('grid')
    .gap('0.25rem')
    .minWidth('0')
  styleBuilder
    .select('.site-search .site-search__link', theme)
    .media(mediaBelow(BREAKPOINTS.sm))
    .gap('0.625rem')
    .padding('0.75rem 0.5rem')
}

function registerSearchBoxResultContentStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent
  styleBuilder
    .select('.site-search__path', theme)
    .display('block')
    .fontSize('0.6875rem')
    .lineHeight('1.4')
    .color(neutral.text.subtle)
    .overflow('hidden')
    .textOverflow('ellipsis')
    .whiteSpace('nowrap')
  styleBuilder
    .select('.site-search__title', theme)
    .display('block')
    .fontSize('0.9375rem')
    .lineHeight('1.45')
    .fontWeight(palette.font.weight.w600)
    .color(neutral.text.default)
    .overflowWrap('anywhere')
  styleBuilder
    .select('.site-search__excerpt', theme)
    .display('-webkit-box')
    .margin('0')
    .fontSize('0.8125rem')
    .lineHeight('1.65')
    .fontWeight(palette.font.weight.w400)
    .color(neutral.text.subtle)
    .lineClamp('2')
    .maxHeight('3.3em')
    .webkitBoxOrient('vertical')
    .overflow('hidden')
    .overflowWrap('anywhere')
  styleBuilder
    .select('.site-search mark.site-search__highlight', theme)
    .padding('0.0625rem 0.125rem')
    .borderRadius('0.1875rem')
    .background(accent.button.rest.background)
    .color(accent.button.rest.text)
    .fontWeight(palette.font.weight.w600)
}

function registerSearchBoxMessageStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent
  styleBuilder
    .select('.site-search__message', theme)
    .display('grid')
    .justifyItems('center')
    .textAlign('center')
    .padding('2.5rem 1.5rem')
    .gap('0.5rem')
  styleBuilder
    .select('.site-search__message-icon', theme)
    .display('grid')
    .placeItems('center')
    .width('3rem')
    .height('3rem')
    .marginBottom('1rem')
    .borderRadius(palette.radii.lg)
    .border(`1px solid ${accent.surface.rest.border}`)
    .background(accent.surface.rest.background)
    .color(accent.surface.rest.text)
    .boxShadow(`0 0 0 0.5rem ${neutral.surfaceAlt.rest.background}`)
  styleBuilder
    .select('.site-search__message-icon svg', theme)
    .width('1.5rem')
    .height('1.5rem')
  styleBuilder
    .select('.site-search .site-search__message-title', theme)
    .margin('0')
    .fontSize('1rem')
    .fontWeight(palette.font.weight.w600)
    .overflowWrap('anywhere')
  styleBuilder
    .select('.site-search .site-search__message-detail', theme)
    .margin('0')
    .maxWidth('24rem')
    .fontSize('0.8125rem')
    .color(neutral.text.subtle)
  styleBuilder
    .select('.site-search__message--error .site-search__message-icon', theme)
    .background(palette.semanticTone.danger.surface.rest.background)
    .borderColor(palette.semanticTone.danger.surface.rest.border)
    .color(palette.semanticTone.danger.surface.rest.text)
  styleBuilder
    .select('.site-search__message--loading .site-search__message-icon', theme)
    .opacity('0.6')
}
