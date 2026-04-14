import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  type ThemePalette,
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
    .border(`1px solid ${palette.semanticTone.neutral.border.default}`)
    .borderRadius(options.radii.lg)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .boxShadow(palette.effect.panelShadow)
    .overflow('hidden')
    .transition(
      'border-color 180ms ease, box-shadow 180ms ease, background 180ms ease',
    )

  styleBuilder
    .select('.expandable-panel[open]', theme)
    .borderColor(palette.semanticTone.neutral.border.default)
    .boxShadow(palette.effect.panelShadowStrong)
}

function registerExpandablePanelSummaryStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  registerExpandablePanelToneHoverStyles(theme, palette)

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
    .borderRadius('16px')

  styleBuilder
    .select('.expandable-panel[open] .expandable-panel__summary', theme)
    .borderRadius('16px 16px 0 0')

  styleBuilder
    .select('.expandable-panel__summary::-webkit-details-marker', theme)
    .display('none')

  styleBuilder
    .select('.expandable-panel__summary:focus-visible', theme)
    .outline(`2px solid ${palette.semanticTone.neutral.border.focus}`)
    .outlineOffset('-2px')

  styleBuilder
    .select('.expandable-panel__icon', theme)
    .width('22px')
    .height('22px')

  styleBuilder
    .select('.expandable-panel__header', theme)
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

  styleBuilder
    .select('.expandable-panel__badge', theme)
    .display('inline-flex')
    .alignItems('center')
    .padding('4px 9px')
    .borderRadius(options.radii.pill)
    .background(palette.semanticTone.neutral.button.rest.background)
    .color(palette.semanticTone.neutral.text.default)
    .fontSize('11px')
    .fontWeight('700')
    .letterSpacing('0.08em')
    .textTransform('uppercase')

  styleBuilder
    .select('.expandable-panel__description', theme)
    .minWidth('100%')
    .fontSize('0.97rem')
    .lineHeight('1.55')

  styleBuilder
    .select('.expandable-panel__header-side', theme)
    .display('flex')
    .alignItems('center')
    .justifyContent('flex-end')
    .gap('12px')
    .minWidth('0')

  styleBuilder
    .select('.expandable-panel__header-meta', theme)
    .fontSize('0.95rem')
    .fontWeight('600')

  styleBuilder
    .select('.expandable-panel__chevron', theme)
    .width('34px')
    .height('34px')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.semanticTone.neutral.border.subtle}`)
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
}

function registerExpandablePanelToneHoverStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select(
      '.expandable-panel.tone-surface--neutral .expandable-panel__summary:hover',
      theme,
    )
    .background(palette.semanticTone.neutral.surface.hover.background)

  styleBuilder
    .select(
      '.expandable-panel.tone-surface--accent .expandable-panel__summary:hover',
      theme,
    )
    .background(palette.semanticTone.accent.surface.hover.background)

  styleBuilder
    .select(
      '.expandable-panel.tone-surface--ghost .expandable-panel__summary:hover',
      theme,
    )
    .background(palette.semanticTone.ghost.surface.hover.background)

  styleBuilder
    .select(
      '.expandable-panel.tone-surface--info .expandable-panel__summary:hover',
      theme,
    )
    .background(palette.semanticTone.info.surface.hover.background)

  styleBuilder
    .select(
      '.expandable-panel.tone-surface--success .expandable-panel__summary:hover',
      theme,
    )
    .background(palette.semanticTone.success.surface.hover.background)

  styleBuilder
    .select(
      '.expandable-panel.tone-surface--warning .expandable-panel__summary:hover',
      theme,
    )
    .background(palette.semanticTone.warning.surface.hover.background)

  styleBuilder
    .select(
      '.expandable-panel.tone-surface--danger .expandable-panel__summary:hover',
      theme,
    )
    .background(palette.semanticTone.danger.surface.hover.background)
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
    .borderTop(`1px solid ${palette.semanticTone.neutral.border.subtle}`)

  styleBuilder
    .select('.expandable-panel:not([open]) .expandable-panel__body', theme)
    .display('none')

  styleBuilder
    .select('.expandable-panel__body :where(h2, h3, h4, p, ul, ol)', theme)
    .margin('0')

  styleBuilder
    .select('.expandable-panel__body :where(p, li)', theme)
    .lineHeight('1.7')

  styleBuilder
    .select('.expandable-panel__body :where(ul, ol)', theme)
    .paddingLeft('1.2rem')

  styleBuilder
    .select('.expandable-panel__body :where(strong)', theme)
    .fontWeight('700')

  styleBuilder
    .select('.expandable-panel__body :where(a)', theme)
    .color(palette.semanticTone.accent.text.default)
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
    .select('.expandable-panel__header-side', theme)
    .media('max-width: 760px')
    .justifyContent('space-between')
}
