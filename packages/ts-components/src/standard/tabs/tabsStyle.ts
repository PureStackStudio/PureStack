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
    registerTabsControlStyles(theme, palette, options)
    registerTabsPanelStyles(theme, options)
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
    .gap('12px')
    .alignContent('start')
    .padding('16px')
    .borderRadius(options.radii.lg)
    .border('1px solid transparent')
    .boxShadow(options.shadows.soft)

  styleBuilder
    .select('.tabs__list', theme)
    .display('grid')
    .gridTemplateColumns('repeat(auto-fit, minmax(120px, 1fr))')
    .gap('12px 8px')
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
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .width('34px')
    .height('34px')
    .padding('0')
    .borderRadius(options.radii.md)
    .border('1px solid transparent')
    .cursor('pointer')

  styleBuilder
    .select('.tabs__overflow-menu', theme)
    .display('none')
    .position('absolute')
    .right('0')
    .top('calc(100% + 6px)')
    .zIndex(20)
    .minWidth('100%')
    .width('max-content')
    .maxWidth('min(92vw, 460px)')
    .padding('6px')
    .borderRadius(options.radii.md)
    .border('1px solid transparent')
    .boxShadow(options.shadows.soft)

  styleBuilder
    .select('.tabs__overflow--open .tabs__overflow-menu', theme)
    .display('grid')
    .gap('4px')

  styleBuilder
    .select('.tabs__overflow-option', theme)
    .display('flex')
    .alignItems('center')
    .gap('0.5em')
    .width('100%')
    .padding('0.4em 0.6em')
    .border('1px solid transparent')
    .borderRadius(options.radii.sm)
    .textAlign('left')
    .whiteSpace('nowrap')
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w600))
    .cursor('pointer')
    .opacity(0.5)
    .background('transparent')

  styleBuilder.select('.tabs__overflow-option:hover', theme).opacity(1)

  styleBuilder
    .select('.tabs__select-wrap', theme)
    .display('none')
    .margin('2px 0 4px')

  styleBuilder
    .select('.tabs__select', theme)
    .display('block')
    .width('100%')
    .minHeight('42px')
    .padding('10px 40px 10px 12px')
    .borderRadius(options.radii.md)
    .border('1px solid transparent')
    .apply(palette.applyFont(palette.font.size.xs, palette.font.weight.w600))
    .appearance('none')
    .webkitAppearance('none')
    .mozAppearance('none')
}

function registerTabsControlStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.tabs__control', theme)
    .position('absolute')
    .width('1px')
    .height('1px')
    .opacity('0')
    .pointerEvents('none')

  styleBuilder
    .select('.tabs__tab, .tabs__tab-button', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .padding('0.75em 0.75em')
    .borderRadius(options.radii.md)
    .border('1px solid transparent')
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
    .select('.tabs__tab-button', theme)
    .flexShrink('0')
    .whiteSpace('nowrap')
    .opacity(0.5)

  styleBuilder.select('.tabs__tab-button:hover', theme).opacity(1)

  styleBuilder.select('.tabs__tab-button--active', theme).opacity(1)

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
    .select('.tabs__tab-button:disabled', theme)
    .opacity('0.45')
    .cursor('not-allowed')

  styleBuilder
    .select('.tabs__control:focus-visible + .tabs__tab', theme)
    .outline('2px solid currentColor')
    .outlineOffset('2px')

  styleBuilder.select('.tabs__tab-button--hidden', theme).display('none')
}

function registerTabsPanelStyles(theme: ThemeMode, options: ThemeOptions) {
  styleBuilder
    .select('.tabs__panel', theme)
    .gridRow('2')
    .gridColumn('1 / -1')
    .display('none')
    .minWidth('0')
    .padding('0')
    .borderRadius(options.radii.md)
    .border('none')

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
