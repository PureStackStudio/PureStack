import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  mediaMax,
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
    registerBaseProseStyles(theme, palette)
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

function registerBaseProseStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content', theme)
    .apply(palette.applyFont(palette.font.size.body))
    .color(palette.current.text.default)

  styleBuilder.select('.doc-content :where(p)', theme).margin('0 0 1em')
}

function registerHeadingStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(h1, h2, h3, h4, h5, h6)', theme)
    .margin('0 0 0.6em')
    .scrollMarginTop('96px')

  styleBuilder
    .select('.doc-content :where(h1)', theme)
    .apply(palette.applyFont(palette.font.size.h1, palette.font.weight.w700))
    .margin('0 0 0.5em')
  styleBuilder
    .select('.doc-content :where(h2)', theme)
    .apply(palette.applyFont(palette.font.size.h2, palette.font.weight.w700))

  styleBuilder
    .select('.doc-content :where(h3)', theme)
    .apply(palette.applyFont(palette.font.size.h3, palette.font.weight.w600))
  styleBuilder
    .select('.doc-content :where(h4)', theme)
    .apply(palette.applyFont(palette.font.size.h4, palette.font.weight.w600))
  styleBuilder
    .select('.doc-content :where(h5)', theme)
    .apply(palette.applyFont(palette.font.size.h5, palette.font.weight.w600))
  styleBuilder
    .select('.doc-content :where(h6)', theme)
    .apply(palette.applyFont(palette.font.size.h6, palette.font.weight.w600))

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
    .color(palette.current.text.default)
    .textDecoration('none')
    .fontWeight(palette.font.weight.w600)
  styleBuilder
    .select('.doc-content :where(a:hover)', theme)
    .textDecoration('underline')
  styleBuilder
    .select('.doc-content :where(a:focus-visible)', theme)
    .outline(`2px solid ${palette.current.border.focus}`)
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
    .apply(palette.applyFont(palette.font.size.xs))
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .border(`1px solid ${palette.current.border.default}`)
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
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .border(`1px solid ${palette.current.border.default}`)
    .borderRadius(options.radii.md)
    .position('relative')
    .overflow('auto')
    .apply(palette.applyFont(palette.font.size.xs))
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
    .background(palette.semanticTone.neutral.surface.hover.background)
    .borderColor(palette.current.border.default)

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button:active)', theme)
    .background(palette.semanticTone.neutral.surface.active.background)
    .borderColor(palette.current.border.default)
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
    .outline(`2px solid ${palette.semanticTone.neutral.button.focusRing}`)

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button:disabled)', theme)
    .background(palette.semanticTone.neutral.surface.disabled.background)
    .color(palette.current.text.subtle)
    .borderColor(palette.current.border.subtle)
    .cursor('not-allowed')

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button)', theme)
    .media('hover: none')
    .opacity(1)
    .transform('translateY(0)')
    .pointerEvents('auto')

  styleBuilder
    .select('.doc-content pre > .code-copy-button.is-copied', theme)
    .background(palette.semanticTone.success.button.rest.background)
    .borderColor(palette.semanticTone.success.border.default)
    .color(palette.semanticTone.success.text.default)

  styleBuilder
    .select('.doc-content pre > .code-copy-button.is-error', theme)
    .background(palette.semanticTone.danger.button.rest.background)
    .borderColor(palette.semanticTone.danger.border.default)
    .color(palette.semanticTone.danger.text.default)
}

function registerPreCodeResetStyles(theme: ThemeMode) {
  styleBuilder
    .select('.doc-content :where(pre code)', theme)
    .background('transparent')
    .border('none')
    .padding('0')
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
    .borderLeft(`3px solid ${palette.current.border.subtle}`)
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
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
    .background(palette.semanticTone.neutral.surface.rest.background)
    .border(`1px solid ${palette.current.border.default}`)
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
    .background(palette.semanticTone.neutral.surface.rest.background)
    .color(palette.current.text.default)
    .apply(palette.applyFont(palette.font.size.xxs))
    .textTransform('uppercase')
    .borderBottom(`1px solid ${palette.current.border.default}`)

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
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)

  styleBuilder
    .select('.doc-content :where(tbody tr:hover)', theme)
    .background(palette.current.tone)
    .color(palette.current.text.default)

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
    .borderLeft(`1px solid ${palette.current.border.subtle}`)

  styleBuilder
    .select('.doc-content :where(th, td)', theme)
    .padding('11px 14px')
    .textAlign('left')
    .verticalAlign('top')
    .borderBottom(`1px solid ${palette.current.border.subtle}`)
}

function registerTableInlineCodeStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.doc-content :where(table code)', theme)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .color(palette.semanticTone.neutral.surface.rest.text)
    .border(`1px solid ${palette.semanticTone.neutral.surface.rest.border}`)
    .borderRadius(options.radii.pill)
    .opacity(0.9)
}

function registerTableResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.doc-content :where(th, td)', theme)
    .media(mediaMax(BREAKPOINTS.lg))
    .padding('9px 11px')
}

function registerHrStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(hr)', theme)
    .border('none')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
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
    .border(`1px solid ${palette.current.border.subtle}`)

  styleBuilder.select('.doc-content :where(figure)', theme).margin('0 0 1.4em')

  styleBuilder
    .select('.doc-content :where(figcaption)', theme)
    .marginTop('0.6em')
    .apply(palette.applyFont(palette.font.size.sm))
    .color(palette.current.text.subtle)
}
