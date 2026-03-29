import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerExpandablePanelStyles() {
  themes.forEach((theme, palette, options) => {
    registerExpandablePanelShellStyles(theme, palette, options)
    registerExpandablePanelSummaryStyles(theme, palette, options)
    registerExpandablePanelBodyStyles(theme, palette, options)
    registerExpandablePanelResponsiveStyles(theme)
  })
}

function registerExpandablePanelShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.expandable-panel', theme)
    .display('grid')
    .margin('0 0 16px')
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.lg)
    .background(palette.background.raised)
    .boxShadow(palette.effect.panelShadow)
    .color(palette.text.default)
    .overflow('hidden')
    .transition(
      'border-color 180ms ease, box-shadow 180ms ease, background 180ms ease',
    )

  styleBuilder
    .select('.expandable-panel[open]', theme)
    .borderColor(palette.border.strong)
    .boxShadow(palette.effect.panelShadowStrong)

  styleBuilder
    .select('.expandable-panel--tone-neutral', theme)
    .background(palette.background.raised)
    .borderColor(palette.border.default)

  styleBuilder
    .select('.expandable-panel--tone-neutral[open]', theme)
    .background(palette.background.surface)

  styleBuilder
    .select('.expandable-panel--tone-accent', theme)
    .background(palette.background.surface)
    .borderColor(palette.border.accent)

  styleBuilder
    .select('.expandable-panel--tone-accent[open]', theme)
    .background(palette.background.feature)

  styleBuilder
    .select('.expandable-panel--tone-info', theme)
    .background(palette.status.info.background)
    .borderColor(palette.status.info.border)

  styleBuilder
    .select('.expandable-panel--tone-success', theme)
    .background(palette.status.success.background)
    .borderColor(palette.status.success.border)

  styleBuilder
    .select('.expandable-panel--tone-warning', theme)
    .background(palette.status.warning.background)
    .borderColor(palette.status.warning.border)

  styleBuilder
    .select('.expandable-panel--tone-danger', theme)
    .background(palette.status.danger.background)
    .borderColor(palette.status.danger.border)
}

function registerExpandablePanelSummaryStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.expandable-panel__summary', theme)
    .listStyle('none')
    .display('grid')
    .gridTemplateColumns('auto minmax(0, 1fr) auto')
    .alignItems('center')
    .gap('16px')
    .padding('18px 22px')
    .cursor('pointer')
    .minWidth('0')

  styleBuilder
    .select('.expandable-panel__summary::-webkit-details-marker', theme)
    .display('none')

  styleBuilder
    .select('.expandable-panel__summary:hover', theme)
    .background(palette.action.ghost.hover)

  styleBuilder
    .select('.expandable-panel__summary:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('-2px')

  styleBuilder
    .select('.expandable-panel__icon-wrap', theme)
    .width('44px')
    .height('44px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius(options.radii.md)
    .background(palette.icon.accent.gradient)
    .backgroundColor(palette.icon.accent.background)
    .border(`1px solid ${palette.icon.accent.ring}`)
    .boxShadow(palette.effect.interactiveShadow)
    .color(palette.icon.accent.color)

  styleBuilder
    .select('.expandable-panel--tone-neutral .expandable-panel__icon-wrap', theme)
    .background(palette.icon.neutral.gradient)
    .backgroundColor(palette.icon.neutral.background)
    .borderColor(palette.icon.neutral.ring)
    .color(palette.icon.neutral.color)

  styleBuilder
    .select('.expandable-panel--tone-info .expandable-panel__icon-wrap', theme)
    .background(palette.icon.neutral.gradient)
    .backgroundColor(palette.status.info.background)
    .borderColor(palette.status.info.border)
    .color(palette.status.info.text)

  styleBuilder
    .select('.expandable-panel--tone-success .expandable-panel__icon-wrap', theme)
    .background(palette.icon.neutral.gradient)
    .backgroundColor(palette.status.success.background)
    .borderColor(palette.status.success.border)
    .color(palette.status.success.text)

  styleBuilder
    .select('.expandable-panel--tone-warning .expandable-panel__icon-wrap', theme)
    .background(palette.icon.neutral.gradient)
    .backgroundColor(palette.status.warning.background)
    .borderColor(palette.status.warning.border)
    .color(palette.status.warning.text)

  styleBuilder
    .select('.expandable-panel--tone-danger .expandable-panel__icon-wrap', theme)
    .background(palette.icon.neutral.gradient)
    .backgroundColor(palette.status.danger.background)
    .borderColor(palette.status.danger.border)
    .color(palette.status.danger.text)

  styleBuilder
    .select('.expandable-panel__icon', theme)
    .width('22px')
    .height('22px')

  styleBuilder
    .select('.expandable-panel__summary-copy', theme)
    .display('flex')
    .alignItems('center')
    .gap('10px')
    .flexWrap('wrap')
    .minWidth('0')

  styleBuilder
    .select('.expandable-panel__title', theme)
    .minWidth('0')
    .fontSize('1.06rem')
    .fontWeight('700')
    .lineHeight('1.3')
    .letterSpacing('-0.02em')
    .color(palette.text.strong)

  styleBuilder
    .select('.expandable-panel__badge', theme)
    .display('inline-flex')
    .alignItems('center')
    .padding('4px 9px')
    .borderRadius(options.radii.pill)
    .background(palette.badge.muted.background)
    .color(palette.badge.muted.text)
    .fontSize('11px')
    .fontWeight('700')
    .letterSpacing('0.08em')
    .textTransform('uppercase')

  styleBuilder
    .select('.expandable-panel__description', theme)
    .minWidth('100%')
    .fontSize('0.97rem')
    .lineHeight('1.55')
    .color(palette.text.muted)

  styleBuilder
    .select('.expandable-panel__summary-side', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('flex-end')
    .gap('12px')
    .minWidth('0')
    .color(palette.text.subtle)

  styleBuilder
    .select('.expandable-panel__summary-meta', theme)
    .fontSize('0.95rem')
    .fontWeight('600')
    .color(palette.text.accent)

  styleBuilder
    .select('.expandable-panel__chevron', theme)
    .width('34px')
    .height('34px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.subtle}`)
    .background(palette.background.panel)
    .color(palette.text.subtle)
    .transition(
      'transform 180ms ease, color 180ms ease, border-color 180ms ease, background 180ms ease',
    )

  styleBuilder
    .select('.expandable-panel__chevron-icon', theme)
    .width('16px')
    .height('16px')

  styleBuilder
    .select('.expandable-panel[open] .expandable-panel__chevron', theme)
    .transform('rotate(180deg)')
    .borderColor(palette.border.accent)
    .background(palette.background.accentMuted)
    .color(palette.text.accent)
}

function registerExpandablePanelBodyStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.expandable-panel__body', theme)
    .display('grid')
    .gap('16px')
    .padding('24px')
    .borderTop(`1px solid ${palette.border.subtle}`)

  styleBuilder
    .select('.expandable-panel:not([open]) .expandable-panel__body', theme)
    .display('none')

  styleBuilder
    .select('.expandable-panel__body :where(h2, h3, h4, p, ul, ol)', theme)
    .margin('0')

  styleBuilder
    .select('.expandable-panel__body :where(p, li)', theme)
    .lineHeight('1.7')
    .color(palette.text.default)

  styleBuilder
    .select('.expandable-panel__body :where(ul, ol)', theme)
    .paddingLeft('1.2rem')

  styleBuilder
    .select('.expandable-panel__body :where(strong)', theme)
    .color(palette.text.strong)

  styleBuilder
    .select('.expandable-panel__body :where(a)', theme)
    .color(palette.text.accent)
    .fontWeight('600')
    .textDecoration('underline')

  styleBuilder
    .select('.expandable-panel__body :where(img)', theme)
    .display('block')
    .width('100%')
    .height('auto')
    .borderRadius(options.radii.sm)
}

function registerExpandablePanelResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.expandable-panel__summary', theme)
    .media('max-width: 760px')
    .gridTemplateColumns('1fr')
    .alignItems('stretch')

  styleBuilder
    .select('.expandable-panel__summary-side', theme)
    .media('max-width: 760px')
    .justifyContent('space-between')
}
