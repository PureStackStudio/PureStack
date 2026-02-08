import { styleBuilder } from '../style/styles'
import {
  type ThemeMode,
  themes,
} from '../style/themeOptions'

export function registerMarkdownStyles() {
  registerBaseProseStyles()
  registerHeadingStyles()
  registerListStyles()
  registerLinkStyles()
  registerCodeStyles()
  registerBlockquoteStyles()
  registerTableStyles()
  registerHrStyles()
  registerMediaStyles()
}

function registerBaseProseStyles() {
  themes.forEach((theme, palette, options) => {
    styleBuilder
      .select('.doc-content', theme)
      .fontSize(options.typography.baseSize)
      .lineHeight('1.7')
      .color(palette.panel.text)

    styleBuilder.select('.doc-content :where(p)', theme).margin('0 0 1em')
  })
}

function registerHeadingStyles() {
  const headingBase = (selector: string, theme: ThemeMode) =>
    styleBuilder
      .select(selector, theme)
      .fontWeight('700')
      .letterSpacing('-0.015em')
      .lineHeight('1.15')
      .margin('2.2em 0 0.6em')
      .scrollMarginTop('96px')

  themes.forEach((theme, palette) => {
    headingBase('.doc-content :where(h1)', theme)
      .fontSize('2.4rem')
      .margin('0 0 0.5em')
    headingBase('.doc-content :where(h2)', theme).fontSize('1.9rem')
    headingBase('.doc-content :where(h3)', theme).fontSize('1.5rem')
    headingBase('.doc-content :where(h4)', theme).fontSize('1.25rem')
    headingBase('.doc-content :where(h5)', theme)
      .fontSize('1.05rem')
      .textTransform('uppercase')
      .letterSpacing('0.04em')
    headingBase('.doc-content :where(h6)', theme)
      .fontSize('0.95rem')
      .textTransform('uppercase')
      .letterSpacing('0.06em')
      .color(palette.nav.textMuted)

    styleBuilder.select('.doc-content :where(h1:first-child)', theme).marginTop('0')
  })
}

function registerListStyles() {
  themes.forEach((theme) => {
    styleBuilder
      .select('.doc-content :where(ul, ol)', theme)
      .margin('0 0 1em 1.4em')
      .padding('0')
    styleBuilder.select('.doc-content :where(li)', theme).margin('0.35em 0')
    styleBuilder.select('.doc-content :where(li > p)', theme).margin('0.4em 0')
  })
}

function registerLinkStyles() {
  themes.forEach((theme, palette) => {
    styleBuilder
      .select('.doc-content :where(a)', theme)
      .color(palette.topBar.logo)
      .textDecoration('none')
      .fontWeight('600')
    styleBuilder.select('.doc-content :where(a:hover)', theme).textDecoration('underline')
    styleBuilder
      .select('.doc-content :where(a:focus-visible)', theme)
      .outline(`2px solid ${palette.nav.focusRing}`)
      .outlineOffset('2px')
  })
}

function registerCodeStyles() {
  registerInlineCodeStyles()
  registerPreAndCopyButtonStyles()
  registerShikiStyles()
}

function registerInlineCodeStyles() {
  themes.forEach((theme, palette, options) => {
    styleBuilder
      .select('.doc-content :where(code)', theme)
      .fontFamily("'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace")
      .fontSize('0.9em')
      .background(palette.surface.altBackground)
      .border(`1px solid ${palette.surface.altBorder}`)
      .borderRadius(options.radii.sm)
      .padding('0.15em 0.35em')
  })
}

function registerPreAndCopyButtonStyles() {
  themes.forEach((theme, palette, options) => {
    styleBuilder
      .select('.doc-content :where(pre)', theme)
      .margin('0 0 1.4em')
      .padding('18px 20px')
      .background(palette.surface.altBackground)
      .border(`1px solid ${palette.surface.altBorder}`)
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
      .border(`1px solid ${palette.surface.border}`)
      .background(palette.panel.background)
      .color(palette.panel.text)
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
      .background(palette.surface.altBackground)
      .borderColor(palette.surface.altBorder)

    styleBuilder
      .select('.doc-content :where(pre > .code-copy-button:focus-visible)', theme)
      .opacity(1)
      .transform('translateY(0)')
      .pointerEvents('auto')
      .outline(`2px solid ${palette.nav.focusRing}`)
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
  })

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button.is-copied)', 'light')
    .background('#e8f8ef')
    .borderColor('#7ecb9c')
    .color('#0f6a3f')
  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button.is-copied)', 'dark')
    .background('#0f3325')
    .borderColor('#2f8f63')
    .color('#93f0bf')

  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button.is-error)', 'light')
    .background('#fff0f0')
    .borderColor('#e0a1a1')
    .color('#8b1d1d')
  styleBuilder
    .select('.doc-content :where(pre > .code-copy-button.is-error)', 'dark')
    .background('#3a1717')
    .borderColor('#9f4848')
    .color('#ffb0b0')
}

function registerShikiStyles() {
  const light = themes.palette('light')
  const dark = themes.palette('dark')
  styleBuilder
    .select('.doc-content :where(pre.shiki.shiki-themes)', 'light')
    .background(`var(--shiki-light-bg, ${light.surface.altBackground})`)
    .color(`var(--shiki-light, ${light.panel.text})`)
  styleBuilder
    .select('.doc-content :where(pre.shiki.shiki-themes)', 'dark')
    .background(`var(--shiki-dark-bg, ${dark.surface.altBackground})`)
    .color(`var(--shiki-dark, ${dark.panel.text})`)

  styleBuilder
    .select('.doc-content :where(pre.shiki.shiki-themes span)', 'light')
    .color('var(--shiki-light)')
  styleBuilder
    .select('.doc-content :where(pre.shiki.shiki-themes span)', 'dark')
    .color('var(--shiki-dark)')

  styleBuilder
    .select('.doc-content :where(code.shiki-inline)', 'light')
    .color(`var(--shiki-light, ${light.panel.text})`)
    .background(light.surface.altBackground)
    .border(`1px solid ${light.surface.altBorder}`)
  styleBuilder
    .select('.doc-content :where(code.shiki-inline)', 'dark')
    .color(`var(--shiki-dark, ${dark.panel.text})`)
    .background(dark.surface.altBackground)
    .border(`1px solid ${dark.surface.altBorder}`)
}

function registerBlockquoteStyles() {
  themes.forEach((theme, palette, options) => {
    styleBuilder
      .select('.doc-content :where(blockquote)', theme)
      .margin('0 0 1.4em')
      .padding('0.65em 1.1em')
      .borderLeft(`3px solid ${palette.surface.border}`)
      .background(palette.surface.altBackground)
      .borderRadius(options.radii.sm)
  })
}

function registerTableStyles() {
  themes.forEach((theme, palette) => {
    styleBuilder
      .select('.doc-content :where(table)', theme)
      .width('100%')
      .borderCollapse('collapse')
      .margin('0 0 1.4em')
    styleBuilder
      .select('.doc-content :where(th, td)', theme)
      .border(`1px solid ${palette.surface.border}`)
      .padding('8px 10px')
      .textAlign('left')
    styleBuilder
      .select('.doc-content :where(th)', theme)
      .background(palette.surface.altBackground)
      .fontWeight('700')
  })
}

function registerHrStyles() {
  themes.forEach((theme, palette) => {
    styleBuilder
      .select('.doc-content :where(hr)', theme)
      .border('none')
      .borderTop(`1px solid ${palette.surface.border}`)
      .margin('2em 0')
  })
}

function registerMediaStyles() {
  themes.forEach((theme, palette, options) => {
    styleBuilder
      .select('.doc-content :where(img, video)', theme)
      .maxWidth('100%')
      .height('auto')
      .borderRadius(options.radii.md)
      .border(`1px solid ${palette.surface.border}`)

    styleBuilder.select('.doc-content :where(figure)', theme).margin('0 0 1.4em')

    styleBuilder
      .select('.doc-content :where(figcaption)', theme)
      .marginTop('0.6em')
      .fontSize('0.9em')
      .color(palette.nav.textMuted)
  })
}
