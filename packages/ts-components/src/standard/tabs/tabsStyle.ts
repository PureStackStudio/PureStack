import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerTabsStyles() {
  themes.forEach((theme, palette, options) => {
    registerTabsShellStyles(theme, palette, options)
    registerTabsControlStyles(theme, palette, options)
    registerTabsPanelStyles(theme, palette, options)
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
    .padding('16px')
    .borderRadius(options.radii.lg)
    .border(`1px solid ${palette.border.subtle}`)
    .background(palette.background.surface)
    .boxShadow(options.shadows.soft)

  styleBuilder
    .select('.tabs__header', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('space-between')
    .gap('12px')

  styleBuilder
    .select('.tabs__list', theme)
    .display('grid')
    .gridTemplateColumns('repeat(auto-fit, minmax(120px, 1fr))')
    .gap('12px 8px')
    .alignItems('stretch')
    .minWidth('0')

  styleBuilder.select('.tabs__item', theme).display('contents')

  styleBuilder
    .select('.tabs__tabs-row', theme)
    .display('none')
    .alignItems('center')
    .gap('8px')
    .minWidth('0')

  styleBuilder
    .select('.tabs__tab-buttons', theme)
    .display('flex')
    .alignItems('center')
    .gap('8px')
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
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.panel)
    .color(palette.text.default)
    .cursor('pointer')

  styleBuilder
    .select('.tabs__overflow-toggle:hover', theme)
    .background(palette.background.accentMuted)

  styleBuilder
    .select('.tabs__overflow-toggle:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

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
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.raised)
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
    .padding('8px 10px')
    .border('none')
    .borderRadius(options.radii.sm)
    .background('transparent')
    .color(palette.text.default)
    .textAlign('left')
    .fontSize('0.88rem')
    .fontWeight('600')
    .whiteSpace('nowrap')
    .cursor('pointer')

  styleBuilder
    .select('.tabs__overflow-option:hover', theme)
    .background(palette.background.accentMuted)

  styleBuilder
    .select('.tabs__overflow-option--active', theme)
    .background(palette.background.feature)
    .color(palette.text.accent)

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
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.panel)
    .color(palette.text.default)
    .fontSize('0.92rem')
    .fontWeight('600')
    .lineHeight('1.2')
    .appearance('none')
    .webkitAppearance('none')
    .mozAppearance('none')
    .backgroundImage(
      'linear-gradient(45deg, transparent 50%, currentColor 50%), linear-gradient(135deg, currentColor 50%, transparent 50%)',
    )
    .backgroundPosition(
      'calc(100% - 20px) calc(50% - 2px), calc(100% - 14px) calc(50% - 2px)',
    )
    .backgroundSize('6px 6px, 6px 6px')
    .backgroundRepeat('no-repeat')

  styleBuilder
    .select('.tabs__select:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
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
    .minHeight('42px')
    .padding('10px 14px')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.background.panel)
    .color(palette.text.subtle)
    .fontSize('0.88rem')
    .fontWeight('700')
    .lineHeight('1.2')
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
    .select('.tabs__tab:hover, .tabs__tab-button:hover', theme)
    .background(palette.action.ghost.hover)
    .color(palette.text.default)

  styleBuilder
    .select('.tabs__control:checked + .tabs__tab', theme)
    .borderColor('transparent')
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select(
      '.tabs__list:not(:has(.tabs__control:checked)) .tabs__item:first-child .tabs__tab, .tabs__tab-button--active',
      theme,
    )
    .borderColor('transparent')
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.tabs__control:focus-visible + .tabs__tab', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.tabs__control:disabled + .tabs__tab, .tabs__tab--disabled', theme)
    .opacity('0.45')
    .cursor('not-allowed')

  styleBuilder
    .select('.tabs__tab-button:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.tabs__tab-button:disabled', theme)
    .opacity('0.45')
    .cursor('not-allowed')

  styleBuilder.select('.tabs__tab-button--hidden', theme).display('none')
}

function registerTabsPanelStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.tabs__panel', theme)
    .gridRow('2')
    .gridColumn('1 / -1')
    .display('none')
    .minWidth('0')
    .padding('0')
    .borderRadius(options.radii.md)
    .border('none')
    .background(palette.background.panel)
    .color(palette.text.default)

  styleBuilder
    .select('.tabs__control:checked + .tabs__tab + .tabs__panel', theme)
    .display('block')

  styleBuilder
    .select(
      '.tabs__list:not(:has(.tabs__control:checked)) .tabs__item:first-child .tabs__panel',
      theme,
    )
    .display('block')

  styleBuilder
    .select('.tabs__panel-body', theme)
    .margin('0')
    .minWidth('0')
    .fontSize('0.95rem')
    .lineHeight('1.7')
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
