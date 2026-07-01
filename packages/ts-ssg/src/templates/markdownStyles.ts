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
  markdown(theme)
    .select(':where(:scope)')
    .apply(palette.applyFont(palette.font.size.body))
    .color(palette.current.text.default)

  markdown(theme).select(':where(p)').margin('0 0 1em')
}

function registerHeadingStyles(theme: ThemeMode, palette: ThemePalette) {
  markdown(theme)
    .select(':where(h1, h2, h3, h4, h5, h6)')
    .margin('0 0 0.6em')
    .scrollMarginTop('6rem')

  markdown(theme)
    .select(':where(h1)')
    .apply(palette.applyFont(palette.font.size.h1, palette.font.weight.w700))
    .margin('0 0 0.5em')
  markdown(theme)
    .select(':where(h2)')
    .apply(palette.applyFont(palette.font.size.h2, palette.font.weight.w700))

  markdown(theme)
    .select(':where(h3)')
    .apply(palette.applyFont(palette.font.size.h3, palette.font.weight.w600))
  markdown(theme)
    .select(':where(h4)')
    .apply(palette.applyFont(palette.font.size.h4, palette.font.weight.w600))
  markdown(theme)
    .select(':where(h5)')
    .apply(palette.applyFont(palette.font.size.h5, palette.font.weight.w600))
  markdown(theme)
    .select(':where(h6)')
    .apply(palette.applyFont(palette.font.size.h6, palette.font.weight.w600))

  markdown(theme)
    .select(':where(* + h1, * + h2, * + h3, * + h4, * + h5, * + h6)')
    .marginTop('1.2em')
}

function registerListStyles(theme: ThemeMode) {
  markdown(theme).select(':where(ul, ol)').margin('0 0 1em 1.4em').padding('0')
  markdown(theme).select(':where(li)').margin('0.35em 0')
  markdown(theme).select(':where(li > p)').margin('0.4em 0')
}

function registerLinkStyles(theme: ThemeMode, palette: ThemePalette) {
  markdown(theme)
    .select(':where(a)')
    .color(palette.current.text.default)
    .textDecoration('none')
    .fontWeight(palette.font.weight.w600)
  markdown(theme).select(':where(a:hover)').textDecoration('underline')
  markdown(theme)
    .select(':where(a:focus-visible)')
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
  markdown(theme)
    .select(':where(code, pre)')
    .fontFamily("'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace")
    .apply(palette.applyFont(palette.font.size.xs))
    .background(palette.semanticTone.neutral.surfaceAlt.rest.background)
    .color(palette.semanticTone.neutral.surfaceAlt.rest.text)
    .border(`1px solid ${palette.current.border.default}`)
    .borderRadius(palette.radii.sm)
    .margin('0')
    .marginBlockEnd('1rem')
    .overflowX('auto')
  markdown(theme)
    .select(':where(code)')
    .padding('0.15em 0.35em')
    .overflowWrap('anywhere')
    .wordBreak('break-word')
  markdown(theme)
    .select(':where(pre)')
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
  markdown(theme)
    .select(':where(pre > .code-copy-button)')
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
  markdown(theme)
    .select(
      ':where(pre:hover > .code-copy-button, pre:focus-within > .code-copy-button)',
    )
    .opacity(1)
    .pointerEvents('auto')

  markdown(theme)
    .select(':where(pre > .code-copy-button:hover)')
    .background(palette.semanticTone.neutral.surface.hover.background)
    .borderColor(palette.current.border.default)

  markdown(theme)
    .select(':where(pre > .code-copy-button:active)')
    .background(palette.semanticTone.neutral.surface.active.background)
    .borderColor(palette.current.border.default)
}

function registerCopyButtonStateStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  markdown(theme)
    .select(':where(pre > .code-copy-button:focus-visible)')
    .opacity(1)
    .pointerEvents('auto')
    .outline(`2px solid ${palette.semanticTone.neutral.button.focusRing}`)

  markdown(theme)
    .select(':where(pre > .code-copy-button:disabled)')
    .background(palette.semanticTone.neutral.surface.disabled.background)
    .color(palette.current.text.subtle)
    .borderColor(palette.current.border.subtle)
    .cursor('not-allowed')

  markdown(theme)
    .select(':where(pre > .code-copy-button)')
    .media('hover: none')
    .opacity(1)
    .pointerEvents('auto')

  markdown(theme)
    .select(':where(pre > .code-copy-button.is-copied)')
    .background(palette.semanticTone.success.button.rest.background)
    .borderColor(palette.semanticTone.success.border.default)
    .color(palette.semanticTone.success.text.default)

  markdown(theme)
    .select(':where(pre > .code-copy-button.is-error)')
    .background(palette.semanticTone.danger.button.rest.background)
    .borderColor(palette.semanticTone.danger.border.default)
    .color(palette.semanticTone.danger.text.default)
}

function registerPreCodeResetStyles(theme: ThemeMode) {
  markdown(theme)
    .select(':where(pre code)')
    .background('transparent')
    .border('none')
    .padding('0')
}

function registerShikiStyles(theme: ThemeMode) {
  markdown(theme)
    .select(':where(pre.shiki.shiki-themes)')
    .background(`var(--shiki-${theme}-bg)`)
    .color(`var(--shiki-${theme})`)

  markdown(theme)
    .select(':where(pre.shiki.shiki-themes .line)')
    .color(`var(--shiki-${theme})`)

  markdown(theme)
    .select(':where(pre.shiki.shiki-themes span)')
    .color(`var(--shiki-${theme})`)

  markdown(theme)
    .select(':where(code.shiki-inline)')
    .color(`var(--shiki-${theme})`)
    .background(`var(--shiki-${theme}-bg)`)
    .border('none')
}

function registerBlockquoteStyles(theme: ThemeMode, palette: ThemePalette) {
  markdown(theme)
    .select(':where(blockquote)')
    .margin('0 0 1.4em')
    .padding('0.65em 1.1em')
    .set('border-inline-start', `0.5em solid ${palette.current.tone}`)
    .set('padding-inline-start', '0.5em')
    .background(palette.current.button.rest.background)
    .color(palette.current.button.rest.text)
    .borderRadius(palette.radii.sm)

  markdown(theme).select(':where(blockquote p)').margin('0').padding('0')
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
  markdown(theme)
    .select(':where(.table-scroll)')
    .margin('0 0 1.4em')
    .maxWidth('100%')
    .overflowX('auto')
    .background(palette.current.surface.rest.background)
    .border(`1px solid ${palette.current.border.default}`)
    .borderRadius(palette.radii.md)
    .boxShadow(palette.effect.panelShadow)

  markdown(theme)
    .select(':where(table)')
    .width('max-content')
    .minWidth('100%')
    .borderCollapse('separate')
    .borderSpacing('0')
    .tableLayout('auto')
    .margin('0')
}

function registerTableHeaderStyles(theme: ThemeMode, palette: ThemePalette) {
  markdown(theme)
    .select(':where(thead)')
    .background(palette.current.surface.rest.background)
    .boxShadow(`inset 0 -1px ${palette.current.border.default}`)

  markdown(theme)
    .select(':where(thead tr)')
    .color(palette.current.text.default)
    .apply(palette.applyFont(palette.font.size.xxs))
    .textTransform('uppercase')
}

function registerTableHeaderCellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  markdown(theme)
    .select(':where(thead th:first-child)')
    .borderTopLeftRadius(palette.radii.md)

  markdown(theme)
    .select(':where(thead th:last-child)')
    .borderTopRightRadius(palette.radii.md)

  markdown(theme).select(':where(thead th)').borderBottom('none')
}

function registerTableBodyRowStyles(theme: ThemeMode, palette: ThemePalette) {
  markdown(theme).select(':where(tbody tr:last-child td)').borderBottom('none')

  markdown(theme)
    .select(':where(tbody tr:last-child td:first-child)')
    .borderBottomLeftRadius(palette.radii.md)

  markdown(theme)
    .select(':where(tbody tr:last-child td:last-child)')
    .borderBottomRightRadius(palette.radii.md)
}

function registerTableCellStyles(theme: ThemeMode, palette: ThemePalette) {
  markdown(theme)
    .select(':where(th + th, td + td)')
    .borderLeft(`1px solid ${palette.current.border.subtle}`)

  markdown(theme)
    .select(':where(th, td)')
    .padding('0.6875rem 0.875rem')
    .textAlign('left')
    .verticalAlign('top')
    .borderBottom(`1px solid ${palette.current.border.subtle}`)
}

function registerTableInlineCodeStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  markdown(theme)
    .select(':where(table code)')
    .background(palette.semanticTone.neutral.surface.rest.background)
    .color(palette.semanticTone.neutral.surface.rest.text)
    .border(`1px solid ${palette.semanticTone.neutral.surface.rest.border}`)
    .borderRadius(palette.radii.pill)
    .opacity(0.9)
}

function registerTableResponsiveStyles(theme: ThemeMode) {
  markdown(theme)
    .select(':where(th, td)')
    .media(mediaMax(BREAKPOINTS.lg))
    .padding('0.5625rem 0.6875rem')
}

function registerHrStyles(theme: ThemeMode, palette: ThemePalette) {
  markdown(theme)
    .select(':where(hr)')
    .border('none')
    .borderTop(`1px solid ${palette.current.border.subtle}`)
    .margin('2em 0')
}

function registerMediaStyles(theme: ThemeMode, palette: ThemePalette) {
  markdown(theme)
    .select(':where(img, video)')
    .maxWidth('100%')
    .height('auto')
    .borderRadius(palette.radii.md)
    .border(`1px solid ${palette.current.border.subtle}`)

  markdown(theme).select(':where(figure)').margin('0 0 1.4em')

  markdown(theme)
    .select(':where(figcaption)')
    .marginTop('0.6em')
    .apply(palette.applyFont(palette.font.size.sm))
    .color(palette.current.text.subtle)
}

function markdown(theme: ThemeMode) {
  return styleBuilder.get(theme).scope('.doc-content')
}
