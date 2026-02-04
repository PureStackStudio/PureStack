import { styleBuilder } from '../style/styles'
import { getThemeOptions, getThemePalette } from '../style/themeOptions'

export function registerMarkdownStyles() {
  const themeOptions = getThemeOptions()
  const palette = (theme: string) => getThemePalette(theme, themeOptions)
  const linkColor = (theme: string) => palette(theme).topBar.logo

  const baseProse = (theme: string) =>
    styleBuilder
      .select('.doc-content', theme)
      .fontSize(themeOptions.typography.baseSize)
      .lineHeight('1.7')
      .color(palette(theme).panel.text)

  baseProse('light')
  baseProse('dark')

  const headingBase = (selector: string, theme: string) =>
    styleBuilder
      .select(selector, theme)
      .fontWeight('700')
      .letterSpacing('-0.015em')
      .lineHeight('1.15')
      .margin('2.2em 0 0.6em')
      .set('scroll-margin-top', '96px')

  headingBase('.doc-content h1', 'light').fontSize('2.4rem').margin('0 0 0.5em')
  headingBase('.doc-content h1', 'dark').fontSize('2.4rem').margin('0 0 0.5em')
  headingBase('.doc-content h2', 'light').fontSize('1.9rem')
  headingBase('.doc-content h2', 'dark').fontSize('1.9rem')
  headingBase('.doc-content h3', 'light').fontSize('1.5rem')
  headingBase('.doc-content h3', 'dark').fontSize('1.5rem')
  headingBase('.doc-content h4', 'light').fontSize('1.25rem')
  headingBase('.doc-content h4', 'dark').fontSize('1.25rem')
  headingBase('.doc-content h5', 'light')
    .fontSize('1.05rem')
    .textTransform('uppercase')
    .letterSpacing('0.04em')
  headingBase('.doc-content h5', 'dark')
    .fontSize('1.05rem')
    .textTransform('uppercase')
    .letterSpacing('0.04em')
  headingBase('.doc-content h6', 'light')
    .fontSize('0.95rem')
    .textTransform('uppercase')
    .letterSpacing('0.06em')
    .color(palette('light').nav.textMuted)
  headingBase('.doc-content h6', 'dark')
    .fontSize('0.95rem')
    .textTransform('uppercase')
    .letterSpacing('0.06em')
    .color(palette('dark').nav.textMuted)

  styleBuilder.select('.doc-content h1:first-child', 'light').marginTop('0')
  styleBuilder.select('.doc-content h1:first-child', 'dark').marginTop('0')

  const baseParagraph = (theme: string) =>
    styleBuilder.select('.doc-content p', theme).margin('0 0 1em')
  baseParagraph('light')
  baseParagraph('dark')

  const baseLists = (theme: string) =>
    styleBuilder
      .select('.doc-content ul, .doc-content ol', theme)
      .margin('0 0 1em 1.4em')
      .padding('0')
  baseLists('light')
  baseLists('dark')

  const baseListItems = (theme: string) =>
    styleBuilder.select('.doc-content li', theme).margin('0.35em 0')
  baseListItems('light')
  baseListItems('dark')

  styleBuilder.select('.doc-content li > p', 'light').margin('0.4em 0')
  styleBuilder.select('.doc-content li > p', 'dark').margin('0.4em 0')

  const baseLinks = (theme: string) =>
    styleBuilder
      .select('.doc-content a', theme)
      .color(linkColor(theme))
      .textDecoration('none')
      .fontWeight('600')
  baseLinks('light')
  baseLinks('dark')

  styleBuilder
    .select('.doc-content a:hover', 'light')
    .textDecoration('underline')
  styleBuilder
    .select('.doc-content a:hover', 'dark')
    .textDecoration('underline')

  styleBuilder
    .select('.doc-content a:focus-visible', 'light')
    .outline(`2px solid ${palette('light').nav.focusRing}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.doc-content a:focus-visible', 'dark')
    .outline(`2px solid ${palette('dark').nav.focusRing}`)
    .outlineOffset('2px')

  const baseInlineCode = (theme: string) =>
    styleBuilder
      .select('.doc-content code', theme)
      .fontFamily("'SFMono-Regular', 'Consolas', 'Liberation Mono', monospace")
      .fontSize('0.9em')
      .background(palette(theme).surface.altBackground)
      .border(`1px solid ${palette(theme).surface.altBorder}`)
      .borderRadius(themeOptions.radii.sm)
      .padding('0.15em 0.35em')
  baseInlineCode('light')
  baseInlineCode('dark')

  const basePre = (theme: string) =>
    styleBuilder
      .select('.doc-content pre', theme)
      .margin('0 0 1.4em')
      .padding('18px 20px')
      .background(palette(theme).surface.altBackground)
      .border(`1px solid ${palette(theme).surface.altBorder}`)
      .borderRadius(themeOptions.radii.md)
      .overflow('auto')
      .lineHeight('1.6')
      .fontSize('0.9em')
  basePre('light')
  basePre('dark')

  styleBuilder
    .select('.doc-content pre code', 'light')
    .background('transparent')
    .border('none')
    .padding('0')
    .fontSize('inherit')
  styleBuilder
    .select('.doc-content pre code', 'dark')
    .background('transparent')
    .border('none')
    .padding('0')
    .fontSize('inherit')

  const baseBlockquote = (theme: string) =>
    styleBuilder
      .select('.doc-content blockquote', theme)
      .margin('0 0 1.4em')
      .padding('0.65em 1.1em')
      .borderLeft(`3px solid ${palette(theme).surface.border}`)
      .background(palette(theme).surface.altBackground)
      .borderRadius(themeOptions.radii.sm)
  baseBlockquote('light')
  baseBlockquote('dark')

  const baseTables = (theme: string) =>
    styleBuilder
      .select('.doc-content table', theme)
      .width('100%')
      .borderCollapse('collapse')
      .margin('0 0 1.4em')
  baseTables('light')
  baseTables('dark')

  const baseCells = (theme: string) =>
    styleBuilder
      .select('.doc-content th, .doc-content td', theme)
      .border(`1px solid ${palette(theme).surface.border}`)
      .padding('8px 10px')
      .textAlign('left')
  baseCells('light')
  baseCells('dark')

  styleBuilder
    .select('.doc-content th', 'light')
    .background(palette('light').surface.altBackground)
    .fontWeight('700')
  styleBuilder
    .select('.doc-content th', 'dark')
    .background(palette('dark').surface.altBackground)
    .fontWeight('700')

  const baseHr = (theme: string) =>
    styleBuilder
      .select('.doc-content hr', theme)
      .border('none')
      .borderTop(`1px solid ${palette(theme).surface.border}`)
      .margin('2em 0')
  baseHr('light')
  baseHr('dark')

  const baseMedia = (theme: string) =>
    styleBuilder
      .select('.doc-content img, .doc-content video', theme)
      .maxWidth('100%')
      .height('auto')
      .borderRadius(themeOptions.radii.md)
      .border(`1px solid ${palette(theme).surface.border}`)
  baseMedia('light')
  baseMedia('dark')

  styleBuilder.select('.doc-content figure', 'light').margin('0 0 1.4em')
  styleBuilder.select('.doc-content figure', 'dark').margin('0 0 1.4em')

  styleBuilder
    .select('.doc-content figcaption', 'light')
    .marginTop('0.6em')
    .fontSize('0.9em')
    .color(palette('light').nav.textMuted)
  styleBuilder
    .select('.doc-content figcaption', 'dark')
    .marginTop('0.6em')
    .fontSize('0.9em')
    .color(palette('dark').nav.textMuted)
}
