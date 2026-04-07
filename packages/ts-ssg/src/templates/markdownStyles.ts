import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export interface MarkdownStyleOptions {
  includeShikiStyles?: boolean
}

export function registerMarkdownStyles(options: MarkdownStyleOptions = {}) {
  const includeShikiStyles = options.includeShikiStyles !== false
  themes.forEach((theme, palette, options) => {
    registerBaseProseStyles(theme, palette, options)
    registerHeadingStyles(theme, palette)
    registerListStyles(theme)
    registerLinkStyles(theme, palette)
    registerCodeStyles(theme, palette, options, includeShikiStyles)
    registerBlockquoteStyles(theme, palette, options)
    registerTableStyles(theme, palette, options)
    registerHrStyles(theme, palette)
    registerMediaStyles(theme, palette, options)
  })
}

function registerBaseProseStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content', theme)
    .fontSize(options.typography.baseSize)
    .lineHeight('1.7')
    .color(palette.text.default)

  styleBuilder.select('.doc-content :where(p)', theme).margin('0 0 1em')
}

function registerHeadingStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(h1, h2, h3, h4, h5, h6)', theme)
    .fontWeight('700')
    .letterSpacing('-0.015em')
    .lineHeight('1.15')
    .margin('0 0 0.6em')
    .scrollMarginTop('96px')

  styleBuilder
    .select('.doc-content :where(h1)', theme)
    .fontSize('2.4rem')
    .margin('0 0 0.5em')
  styleBuilder.select('.doc-content :where(h2)', theme).fontSize('1.9rem')
  styleBuilder.select('.doc-content :where(h3)', theme).fontSize('1.5rem')
  styleBuilder.select('.doc-content :where(h4)', theme).fontSize('1.25rem')

  styleBuilder
    .select('.doc-content :where(h5, h6)', theme)
    .textTransform('uppercase')

  styleBuilder
    .select('.doc-content :where(h5)', theme)
    .fontSize('1.05rem')
    .letterSpacing('0.04em')
  styleBuilder
    .select('.doc-content :where(h6)', theme)
    .fontSize('0.95rem')
    .letterSpacing('0.06em')
    .color(palette.text.subtle)

  styleBuilder
    .select(
      '.doc-content :where(* + h1, * + h2, * + h3, * + h4, * + h5, * + h6)',
      theme,
    )
    .marginTop('1.2em')
}

function registerListStyles(theme: ThemeMode) {
  styleBuilder
    .select('.doc-content :where(ul, ol)', theme)
    .margin('0 0 1em 1.4em')
    .padding('0')
  styleBuilder.select('.doc-content :where(li)', theme).margin('0.35em 0')
  styleBuilder.select('.doc-content :where(li > p)', theme).margin('0.4em 0')
}

function registerLinkStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(a)', theme)
    .color(palette.text.accent)
    .textDecoration('none')
    .fontWeight('600')
  styleBuilder
    .select('.doc-content :where(a:hover)', theme)
    .textDecoration('underline')
  styleBuilder
    .select('.doc-content :where(a:focus-visible)', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
}

function registerCodeStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
  includeShikiStyles: boolean,
) {
  registerInlineCodeStyles(theme, palette, options)
  registerPreAndCopyButtonStyles(theme, palette, options)
  if (includeShikiStyles) {
    registerShikiStyles(theme)
  }
}

function registerInlineCodeStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(code)', theme)
    .fontFamily("'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace")
    .fontSize('0.9em')
    .background(palette.background.surfaceAlt)
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.sm)
    .padding('0.15em 0.35em')
}

function registerPreAndCopyButtonStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  registerPreShellStyles(theme, palette, options)
  registerCopyButtonBaseStyles(theme, palette, options)
  registerCopyButtonInteractionStyles(theme, palette)
  registerCopyButtonStateStyles(theme, palette)
  registerPreCodeResetStyles(theme)
}

function registerPreShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(pre)', theme)
    .margin('0 0 1.4em')
    .padding('18px 20px')
    .background(palette.background.surfaceAlt)
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.md)
    .position('relative')
    .overflow('auto')
    .lineHeight('1.6')
    .fontSize('0.9em')
}

function registerCopyButtonBaseStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button)', theme)
    .position('absolute')
    .top('12px')
    .right('12px')
    .zIndex(2)
    .border(`1px solid ${palette.border.default}`)
    .background(palette.semanticTone.neutral.background)
    .color(palette.semanticTone.neutral.text)
    .width('2.15rem')
    .height('2.15rem')
    .padding('0')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius(options.radii.sm)
    .boxShadow(palette.effect.interactiveShadow)
    .cursor('pointer')
    .opacity(0)
    .transform('translateY(-4px)')
    .pointerEvents('none')
    .transition(
      'opacity 140ms ease, transform 180ms ease, background-color 140ms ease, border-color 140ms ease, color 140ms ease',
    )
}

function registerCopyButtonInteractionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select(
      '.doc-content :where(pre:hover > .code-copy-button, pre:focus-within > .code-copy-button)',
      theme,
    )
    .opacity(1)
    .transform('translateY(0)')
    .pointerEvents('auto')

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button svg)', theme)
    .width('1.05rem')
    .height('1.05rem')
    .display('block')

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button:hover)', theme)
    .background(palette.semanticTone.neutral.hover)
    .borderColor(palette.border.strong)

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button:active)', theme)
    .background(palette.semanticTone.neutral.active)
    .borderColor(palette.border.strong)
}

function registerCopyButtonStateStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button:focus-visible)', theme)
    .opacity(1)
    .transform('translateY(0)')
    .pointerEvents('auto')
    .outline(`2px solid ${palette.semanticTone.neutral.focusRing}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button:disabled)', theme)
    .background(palette.semanticTone.neutral.disabled)
    .color(palette.text.soft)
    .borderColor(palette.border.subtle)
    .cursor('not-allowed')

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button)', theme)
    .media('hover: none')
    .opacity(1)
    .transform('translateY(0)')
    .pointerEvents('auto')

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button.is-copied)', theme)
    .background(palette.semanticTone.accent.background)
    .borderColor(palette.border.accent)
    .color(palette.semanticTone.accent.text)

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button.is-error)', theme)
    .background(palette.semanticTone.danger.background)
    .borderColor(palette.semanticTone.danger.border)
    .color(palette.semanticTone.danger.text)
}

function registerPreCodeResetStyles(theme: ThemeMode) {
  styleBuilder
    .select('.doc-content :where(pre code)', theme)
    .background('transparent')
    .border('none')
    .padding('0')
    .fontSize('inherit')
}

function registerShikiStyles(theme: ThemeMode) {
  styleBuilder
    .select('.doc-content :where(pre.shiki.shiki-themes)', theme)
    .background(`var(--shiki-${theme}-bg)`)
    .color(`var(--shiki-${theme})`)

  styleBuilder
    .select('.doc-content :where(pre.shiki.shiki-themes .line)', theme)
    .color(`var(--shiki-${theme})`)

  styleBuilder
    .select('.doc-content :where(pre.shiki.shiki-themes span)', theme)
    .color(`var(--shiki-${theme})`)

  styleBuilder
    .select('.doc-content :where(code.shiki-inline)', theme)
    .color(`var(--shiki-${theme})`)
    .background(`var(--shiki-${theme}-bg)`)
    .border('none')
}

function registerBlockquoteStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(blockquote)', theme)
    .margin('0 0 1.4em')
    .padding('0.65em 1.1em')
    .borderLeft(`3px solid ${palette.border.subtle}`)
    .background(palette.background.surfaceAlt)
    .borderRadius(options.radii.sm)
}

function registerTableStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  registerTableContainerStyles(theme, palette, options)
  registerTableHeaderStyles(theme, palette, options)
  registerTableBodyRowStyles(theme, palette, options)
  registerTableCellStyles(theme, palette)
  registerTableInlineCodeStyles(theme, palette, options)
  registerTableResponsiveStyles(theme)
}

function registerTableContainerStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(.table-scroll)', theme)
    .margin('0 0 1.4em')
    .maxWidth('100%')
    .overflowX('auto')
    .background(palette.background.surface)
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.md)
    .boxShadow(palette.effect.panelShadow)

  styleBuilder
    .select('.doc-content :where(table)', theme)
    .width('max-content')
    .minWidth('100%')
    .borderCollapse('separate')
    .borderSpacing('0')
    .tableLayout('auto')
    .margin('0')
}

function registerTableHeaderStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(thead th)', theme)
    .background(palette.background.raised)
    .color(palette.text.strong)
    .fontSize('0.79rem')
    .textTransform('uppercase')
    .letterSpacing('0.055em')
    .borderBottom(`1px solid ${palette.border.default}`)

  styleBuilder
    .select('.doc-content :where(thead th:first-child)', theme)
    .borderTopLeftRadius(options.radii.md)

  styleBuilder
    .select('.doc-content :where(thead th:last-child)', theme)
    .borderTopRightRadius(options.radii.md)
}

function registerTableBodyRowStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(tbody tr)', theme)
    .transition('background-color 140ms ease')

  styleBuilder
    .select('.doc-content :where(tbody tr:nth-child(even))', theme)
    .background(palette.background.surfaceAlt)

  styleBuilder
    .select('.doc-content :where(tbody tr:hover)', theme)
    .background(palette.semanticTone.ghost.hover)

  styleBuilder
    .select('.doc-content :where(tbody tr:last-child td)', theme)
    .borderBottom('none')

  styleBuilder
    .select('.doc-content :where(tbody tr:last-child td:first-child)', theme)
    .borderBottomLeftRadius(options.radii.md)

  styleBuilder
    .select('.doc-content :where(tbody tr:last-child td:last-child)', theme)
    .borderBottomRightRadius(options.radii.md)
}

function registerTableCellStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(th + th, td + td)', theme)
    .borderLeft(`1px solid ${palette.border.subtle}`)

  styleBuilder
    .select('.doc-content :where(tbody td:first-child)', theme)
    .fontWeight('600')
    .color(palette.text.strong)

  styleBuilder
    .select('.doc-content :where(th, td)', theme)
    .padding('11px 14px')
    .textAlign('left')
    .verticalAlign('top')
    .borderBottom(`1px solid ${palette.border.subtle}`)
}

function registerTableInlineCodeStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(table code)', theme)
    .background(palette.semanticTone.danger.background)
    .color(palette.semanticTone.danger.text)
    .border(`1px solid ${palette.border.default}`)
    .borderRadius(options.radii.pill)
    .fontSize('0.84em')
    .opacity(0.9)
}

function registerTableResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.doc-content :where(th, td)', theme)
    .media('max-width: 900px')
    .padding('9px 11px')
}

function registerHrStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(hr)', theme)
    .border('none')
    .borderTop(`1px solid ${palette.border.subtle}`)
    .margin('2em 0')
}

function registerMediaStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(img, video)', theme)
    .maxWidth('100%')
    .height('auto')
    .borderRadius(options.radii.md)
    .border(`1px solid ${palette.border.subtle}`)

  styleBuilder.select('.doc-content :where(figure)', theme).margin('0 0 1.4em')

  styleBuilder
    .select('.doc-content :where(figcaption)', theme)
    .marginTop('0.6em')
    .fontSize('0.9em')
    .color(palette.text.subtle)
}
