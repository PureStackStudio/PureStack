import type { ThemePalette } from '@purestack/ts-style'
import {
  BREAKPOINTS,
  mediaMax,
  styleBuilder,
  type ThemeMode,
  themes,
} from '@purestack/ts-style'

export interface MarkdownStyleOptions {
  includeShikiStyles?: boolean
}

export function registerMarkdownStyles(options: MarkdownStyleOptions = {}) {
  const includeShikiStyles = options.includeShikiStyles !== false
  themes.forEach((theme, palette) => {
    registerBaseProseStyles(theme, palette)
    registerHeadingStyles(theme, palette)
    registerListStyles(theme)
    registerLinkStyles(theme, palette)
    registerCodeStyles(theme, palette, includeShikiStyles)
    registerBlockquoteStyles(theme, palette)
    registerTableStyles(theme, palette)
    registerHrStyles(theme, palette)
    registerMediaStyles(theme, palette)
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
    .scrollMarginTop('6rem')

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
  includeShikiStyles: boolean,
) {
  registerInlineCodeStyles(theme, palette)
  registerPreAndCopyButtonStyles(theme, palette)
  if (includeShikiStyles) {
    registerShikiStyles(theme)
  }
}

function registerInlineCodeStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(code, pre)', theme)
    .fontFamily("'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace")
    .apply(palette.applyFont(palette.font.size.xs))
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .color(palette.semanticTone.neutral.surfaceAlt.rest.text)
    .border(`1px solid ${palette.current.border.default}`)
    .borderRadius(palette.radii.sm)
    .margin('0')
    .marginBlockEnd('1rem')
    .overflowX('auto')
  styleBuilder
    .select('.doc-content :where(code)', theme)
    .padding('0.15em 0.35em')
  styleBuilder
    .select('.doc-content :where(pre)', theme)
    .padding('1.125rem 1.25rem')
    .position('relative')
}

function registerPreAndCopyButtonStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  registerCopyButtonBaseStyles(theme, palette)
  registerCopyButtonInteractionStyles(theme, palette)
  registerCopyButtonStateStyles(theme, palette)
  registerPreCodeResetStyles(theme)
}

function registerCopyButtonBaseStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button)', theme)
    .position('absolute')
    .top('0.75rem')
    .right('0.75rem')
    .zIndex(2)
    .width('2.15rem')
    .height('2.15rem')
    .padding('0.25em')
    .fontSize(palette.font.size.xxs)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderWidth('1px')
    .borderRadius(palette.radii.sm)
    .boxShadow(palette.effect.interactiveShadow)
    .cursor('pointer')
    .opacity(0)
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
    .pointerEvents('auto')

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

function registerBlockquoteStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(blockquote)', theme)
    .margin('0 0 1.4em')
    .padding('0.65em 1.1em')
    .set('border-inline-start', `0.5em solid ${palette.current.tone}`)
    .set('padding-inline-start', '0.5em')
    .background(palette.current.button.rest.background)
    .color(palette.current.button.rest.text)
    .borderRadius(palette.radii.sm)

  styleBuilder
    .select('.doc-content blockquote :where(p)', theme)
    .margin('0')
    .padding('0')
}

function registerTableStyles(theme: ThemeMode, palette: ThemePalette) {
  registerTableContainerStyles(theme, palette)
  registerTableHeaderStyles(theme, palette)
  registerTableBodyRowStyles(theme, palette)
  registerTableCellStyles(theme, palette)
  registerTableHeaderCellStyles(theme, palette)
  registerTableInlineCodeStyles(theme, palette)
  registerTableResponsiveStyles(theme)
}

function registerTableContainerStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(.table-scroll)', theme)
    .margin('0 0 1.4em')
    .maxWidth('100%')
    .overflowX('auto')
    .background(palette.current.surface.rest.background)
    .border(`1px solid ${palette.current.border.default}`)
    .borderRadius(palette.radii.md)
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

function registerTableHeaderStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(thead)', theme)
    .background(palette.current.surface.rest.background)
    .boxShadow(`inset 0 -1px ${palette.current.border.default}`)

  styleBuilder
    .select('.doc-content :where(thead tr)', theme)
    .color(palette.current.text.default)
    .apply(palette.applyFont(palette.font.size.xxs))
    .textTransform('uppercase')
}

function registerTableHeaderCellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.doc-content :where(thead th:first-child)', theme)
    .borderTopLeftRadius(palette.radii.md)

  styleBuilder
    .select('.doc-content :where(thead th:last-child)', theme)
    .borderTopRightRadius(palette.radii.md)

  styleBuilder
    .select('.doc-content :where(thead th)', theme)
    .borderBottom('none')
}

function registerTableBodyRowStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(tbody tr:last-child td)', theme)
    .borderBottom('none')

  styleBuilder
    .select('.doc-content :where(tbody tr:last-child td:first-child)', theme)
    .borderBottomLeftRadius(palette.radii.md)

  styleBuilder
    .select('.doc-content :where(tbody tr:last-child td:last-child)', theme)
    .borderBottomRightRadius(palette.radii.md)
}

function registerTableCellStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(th + th, td + td)', theme)
    .borderLeft(`1px solid ${palette.current.border.subtle}`)

  styleBuilder
    .select('.doc-content :where(th, td)', theme)
    .padding('0.6875rem 0.875rem')
    .textAlign('left')
    .verticalAlign('top')
    .borderBottom(`1px solid ${palette.current.border.subtle}`)
}

function registerTableInlineCodeStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.doc-content :where(table code)', theme)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .color(palette.semanticTone.neutral.surface.rest.text)
    .border(`1px solid ${palette.semanticTone.neutral.surface.rest.border}`)
    .borderRadius(palette.radii.pill)
    .opacity(0.9)
}

function registerTableResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.doc-content :where(th, td)', theme)
    .media(mediaMax(BREAKPOINTS.lg))
    .padding('0.5625rem 0.6875rem')
}

function registerHrStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(hr)', theme)
    .border('none')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
    .margin('2em 0')
}

function registerMediaStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(img, video)', theme)
    .maxWidth('100%')
    .height('auto')
    .borderRadius(palette.radii.md)
    .border(`1px solid ${palette.current.border.subtle}`)

  styleBuilder.select('.doc-content :where(figure)', theme).margin('0 0 1.4em')

  styleBuilder
    .select('.doc-content :where(figcaption)', theme)
    .marginTop('0.6em')
    .apply(palette.applyFont(palette.font.size.sm))
    .color(palette.current.text.subtle)
}
