import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

export function registerTabsStyles() {
  themes.forEach((theme, palette, options) => {
    registerTabsShellStyles(theme, palette, options)
    registerTabsControlStyles(theme, palette)
    registerTabsPanelStyles(theme)
    registerTabsResponsiveStyles(theme)
  })
}

function registerTabsShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.tabs', theme)
    .display('grid')
    .gap('0.6em')
    .alignContent('start')
    .padding('1em')
    .boxShadow(palette.effect.softShadow)

  styleBuilder
    .select('.tabs__list', theme)
    .display('grid')
    .gridTemplateColumns('repeat(auto-fit, minmax(7.5rem, 1fr))')
    .gap('0.6em 0.4em')
    .alignItems('stretch')
    .alignContent('start')
    .minWidth('0')

  styleBuilder.select('.tabs__item', theme).display('contents')

  styleBuilder
    .select('.tabs__tabs-row', theme)
    .display('none')
    .alignItems('center')
    .gap('0.5em')
    .minWidth('0')

  styleBuilder
    .select('.tabs__tab-buttons', theme)
    .display('flex')
    .alignItems('center')
    .gap('0.5em')
    .minWidth('0')
    .flex('1')
    .overflow('hidden')

  styleBuilder
    .select('.tabs__overflow', theme)
    .display('none')
    .position('relative')
    .flexShrink('0')

  styleBuilder.select('.tabs__overflow--visible', theme).display('inline-flex')

  styleBuilder
    .select('.tabs__overflow-toggle', theme)
    .width('2.3em')
    .height('2.3em')
    .padding('0')

  styleBuilder
    .select('.tabs__overflow-menu', theme)
    .display('none')
    .position('absolute')
    .right('0')
    .top('calc(100% + 0.375rem)')
    .zIndex(20)
    .minWidth('100%')
    .width('max-content')
    .maxWidth('min(92vw, 28.75rem)')
    .padding('0.375rem')
    .borderRadius(options.radii.md)
    .border('1px solid transparent')
    .boxShadow(palette.effect.softShadow)

  styleBuilder
    .select('.tabs__overflow--open .tabs__overflow-menu', theme)
    .display('grid')
    .gap('0.25rem')

  styleBuilder
    .select('.tabs__overflow-option', theme)
    .width('100%')
    .padding('0.4em 0.6em')
    .textAlign('left')
    .whiteSpace('nowrap')
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w600))

  styleBuilder.select('.tabs__overflow-option:hover', theme)

  styleBuilder
    .select('.tabs__select-wrap', theme)
    .display('none')
    .margin('0.125rem 0 0.25rem')

  styleBuilder
    .select('.tabs__select', theme)
    .display('block')
    .width('100%')
    .minHeight('2.625rem')
    .padding('0.625rem 2.5rem 0.625rem 0.75rem')
    .borderRadius(options.radii.md)
    .border('1px solid transparent')
    .apply(palette.applyFont(palette.font.size.xs, palette.font.weight.w600))
    .appearance('none')
    .webkitAppearance('none')
    .mozAppearance('none')
}

function registerTabsControlStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.tabs__control', theme)
    .position('absolute')
    .width('1px')
    .height('1px')
    .opacity('0')
    .pointerEvents('none')

  styleBuilder
    .select('.tabs__tab, .tabs__tab-buttons > .btn', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .padding('0.5em 0.75em')
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .gap('0.5em')
    .overflow('hidden')
    .textAlign('center')
    .cursor('pointer')
    .transition(
      'background 160ms ease, color 160ms ease, border-color 160ms ease',
    )

  styleBuilder.select('.tabs__tab', theme).gridRow('1')

  styleBuilder
    .select('.tabs__tab-buttons > .btn', theme)
    .flexShrink('0')
    .whiteSpace('nowrap')

  styleBuilder.select('.tabs__tab-buttons > .btn:hover', theme)

  styleBuilder.select('.tabs__tab-buttons > .btn.active', theme)

  styleBuilder
    .select('.tabs__tab-icon', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .width('1.7em')
    .height('1.7em')
    .flexShrink('0')

  styleBuilder
    .select('.tabs__tab-icon svg', theme)
    .display('block')
    .width('100%')
    .height('100%')

  styleBuilder.select('.tabs__tab-label', theme).display('inline-block')
  styleBuilder
    .select('.tabs__tab-label', theme)
    .overflow('hidden')
    .textOverflow('ellipsis')
    .whiteSpace('nowrap')
    .maxWidth('100%')

  styleBuilder
    .select('.tabs__control:disabled + .tabs__tab, .tabs__tab--disabled', theme)
    .opacity('0.45')
    .cursor('not-allowed')

  styleBuilder
    .select('.tabs__tab-buttons > .btn:disabled', theme)
    .opacity('0.45')
    .cursor('not-allowed')

  styleBuilder
    .select('.tabs__control:focus-visible + .tabs__tab', theme)
    .outline('2px solid currentColor')
    .outlineOffset('2px')

  styleBuilder
    .select('.tabs__tab-buttons > .btn[hidden]', theme)
    .display('none')
}

function registerTabsPanelStyles(theme: ThemeMode) {
  styleBuilder
    .select('.tabs__panel', theme)
    .gridRow('2')
    .gridColumn('1 / -1')
    .display('none')
    .minWidth('0')
    .padding('0')

  styleBuilder
    .select('.tabs__control:checked + .tabs__tab + .tabs__panel', theme)
    .display('block')

  styleBuilder
    .select(
      '.tabs__list:not(:has(.tabs__control:checked)) .tabs__item:first-child .tabs__panel',
      theme,
    )
    .display('block')

  styleBuilder.select('.tabs__panel-body', theme)
}

function registerTabsResponsiveStyles(theme: ThemeMode) {
  styleBuilder.select('.tabs--enhanced .tabs__tabs-row', theme).display('flex')

  styleBuilder
    .select('.tabs--compact .tabs__select-wrap', theme)
    .display('block')

  styleBuilder.select('.tabs--enhanced .tabs__tab', theme).display('none')

  styleBuilder.select('.tabs--compact .tabs__tabs-row', theme).display('none')

  styleBuilder
    .select('.tabs--compact .tabs__list', theme)
    .gridTemplateColumns('1fr')
}
