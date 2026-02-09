import { styleBuilder } from '../style/styles'
import {
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '../style/themeOptions'
import { type ThemePalette } from '../style/themePalette'

export function registerMarkdownStyles() {
  themes.forEach((theme, palette, options) => {
    registerBaseProseStyles(theme, palette, options)
    registerHeadingStyles(theme, palette)
    registerListStyles(theme)
    registerLinkStyles(theme, palette)
    registerCodeStyles(theme, palette, options)
    registerBlockquoteStyles(theme, palette, options)
    registerTableStyles(theme, palette)
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
    .margin('2.2em 0 0.6em')
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
    .select('.doc-content :where(h1:first-child)', theme)
    .marginTop('0')
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
) {
  registerInlineCodeStyles(theme, palette, options)
  registerPreAndCopyButtonStyles(theme, palette, options)
  registerShikiStyles(theme)
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

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button)', theme)
    .position('absolute')
    .top('12px')
    .right('12px')
    .zIndex(2)
    .border(`1px solid ${palette.border.subtle}`)
    .background(palette.background.panel)
    .color(palette.text.default)
    .width('2.15rem')
    .height('2.15rem')
    .padding('0')
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .borderRadius(options.radii.sm)
    .boxShadow('0 1px 2px rgba(0,0,0,0.08)')
    .cursor('pointer')
    .opacity(0)
    .transform('translateY(-4px)')
    .pointerEvents('none')
    .transition(
      'opacity 140ms ease, transform 180ms ease, background-color 140ms ease, border-color 140ms ease, color 140ms ease',
    )

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
    .background(palette.background.surfaceAlt)
    .borderColor(palette.border.default)

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button:focus-visible)', theme)
    .opacity(1)
    .transform('translateY(0)')
    .pointerEvents('auto')
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button)', theme)
    .media('hover: none')
    .opacity(1)
    .transform('translateY(0)')
    .pointerEvents('auto')

  styleBuilder
    .select('.doc-content :where(pre code)', theme)
    .background('transparent')
    .border('none')
    .padding('0')
    .fontSize('inherit')

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button.is-copied)', theme)
    .background(palette.status.success.background)
    .borderColor(palette.status.success.border)
    .color(palette.status.success.text)

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button.is-error)', theme)
    .background(palette.status.danger.background)
    .borderColor(palette.status.danger.border)
    .color(palette.status.danger.text)
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

function registerTableStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.doc-content :where(table)', theme)
    .width('100%')
    .borderCollapse('collapse')
    .margin('0 0 1.4em')
  styleBuilder
    .select('.doc-content :where(th, td)', theme)
    .border(`1px solid ${palette.border.subtle}`)
    .padding('8px 10px')
    .textAlign('left')
  styleBuilder
    .select('.doc-content :where(th)', theme)
    .background(palette.background.surfaceAlt)
    .fontWeight('700')
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
