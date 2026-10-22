import { BREAKPOINTS, mediaBelow, type ThemePalette } from '@purestack/ts-style'
import { registerFooterStyles } from './footer'
import type { StarterStyle } from './index'

export function registerShellStyles(root: StarterStyle, palette: ThemePalette) {
  // Match the content edges across the header, page, and footer.
  const gutter = 'clamp(1.25rem, 4vw, 3rem)'
  registerLayoutStyles(root, palette, gutter)
  registerHeaderStyles(root, palette, gutter)
  registerPageStyles(root)
  registerFooterStyles(root, palette, gutter)
  registerChecklistStyles(root, palette)
  registerResponsiveStyles(root)
}

function registerLayoutStyles(
  root: StarterStyle,
  palette: ThemePalette,
  gutter: string,
) {
  root.select('.template-doc').fontFamily(palette.font.family.base)
  root
    .select('.template-doc .doc-shell')
    .maxWidth('82rem')
    .margin('0 auto')
    .padding(`clamp(2.5rem, 5vw, 4rem) ${gutter} clamp(3rem, 6vw, 5rem)`)
}

function registerHeaderStyles(
  root: StarterStyle,
  palette: ThemePalette,
  gutter: string,
) {
  root
    .select('.starter-topbar')
    .borderBottom(`1px solid ${palette.current.border.subtle}`)
    .padding(`1rem ${gutter}`)
  root.select('.starter-topbar > .flex').maxWidth('76rem').margin('0 auto')
  root.select('.starter-top-links').marginRight('1rem')
  root
    .select('.starter-top-links a')
    .color(palette.current.text.subtle)
    .fontSize('0.85rem')
    .fontWeight('600')
    .textDecoration('none')
    .whiteSpace('nowrap')
  root
    .select('.starter-top-links a:hover')
    .color(palette.semanticTone.accent.text.default)
}

function registerPageStyles(root: StarterStyle) {
  root
    .select('.starter-page-title')
    .fontSize('clamp(2.4rem, 5vw, 4.3rem)')
    .letterSpacing('-0.055em')
    .lineHeight('1.08')
    .maxWidth('16ch')
  root
    .select('.doc-main > .doc-content > .section-header')
    .maxWidth('48rem')
    .marginBottom('3rem')
  root
    .select('.doc-main .section-header')
    .display('flex')
    .flexDirection('column')
    .gap('1rem')
  root
    .select(
      '.doc-main .section-header > :where(.text-eyebrow, .text-title, .text-tagline)',
    )
    .margin('0')
  root
    .select('.doc-main .section-header > .text-tagline')
    .maxWidth('42rem')
    .lineHeight('1.75')
  root
    .select('.doc-main > .doc-content > h2')
    .marginTop('3rem')
    .marginBottom('1rem')
  root.select('.doc-main > .doc-content > .section-header + h2').marginTop('0')
}

function registerChecklistStyles(root: StarterStyle, palette: ThemePalette) {
  root
    .select('.starter-checklist-progress')
    .display('block')
    .width('100%')
    .height('0.55rem')
    .accentColor(palette.semanticTone.accent.tone)
  root
    .select('.starter-checklist-input')
    .width('1.15rem')
    .height('1.15rem')
    .accentColor(palette.semanticTone.accent.tone)
    .flexShrink('0')
    .marginTop('0.2rem')
  root
    .select('.starter-checklist-row')
    .display('flex')
    .alignItems('flex-start')
    .gap('0.75rem')
    .padding('1rem 0')
    .borderBottom(`1px solid ${palette.current.border.subtle}`)
    .cursor('pointer')
  root
    .select('.starter-checklist-row:has(input:checked) strong')
    .textDecoration('line-through')
    .color(palette.current.text.subtle)
}

function registerResponsiveStyles(root: StarterStyle) {
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.starter-top-links')
    .display('none')
}
