import type { Style } from '@purestack/ts-css'
import { BREAKPOINTS, mediaMin, type ThemePalette } from '@purestack/ts-style'
import type { DocumentationColors } from './colors'

/** Visual landmarks and controls around the documentation's reading column. */
export function registerDocumentationDetailStyles(
  docs: Style,
  palette: ThemePalette,
  colors: DocumentationColors,
) {
  const article = docs.scope('.doc-main > .doc-content')

  registerTitleAccentStyles(article, palette)
  registerSectionLinkStyles(article, palette, colors)
  registerNavigationRailStyles(docs, palette, colors)
  registerComponentHeaderStyles(article, palette, colors)
  registerExampleFrameStyles(article, colors)
  registerCodeFrameStyles(article, colors)
  registerCopyControlStyles(article, palette, colors)
  registerTableFrameStyles(article, colors)
  registerAdjacentPageCardStyles(article, colors)
  registerAdjacentPageControlStyles(article, palette, colors)
}

function registerTitleAccentStyles(article: Style, palette: ThemePalette) {
  const accent = palette.semanticTone.accent
  const secondary = palette.semanticTone.secondary

  article
    .select(':scope > h1')
    .marginBottom('0.65em')
    .letterSpacing('-0.035em')
    .fontWeight('650')

  article
    .select(':scope > h1::before')
    .content('""')
    .display('block')
    .width('2.75rem')
    .height('0.25rem')
    .marginBottom('1rem')
    .borderRadius('1rem')
    .background(
      `linear-gradient(90deg, ${accent.text.default}, ${secondary.text.default})`,
    )
}

function registerSectionLinkStyles(
  article: Style,
  palette: ThemePalette,
  colors: DocumentationColors,
) {
  const { border } = colors
  const accent = palette.semanticTone.accent

  article
    .select(':scope > h2')
    .paddingTop('1.25rem')
    .borderTop(`1px solid ${border}`)
    .marginTop('1.75em')
    .letterSpacing('-0.025em')

  article
    .select(':scope > :is(h2, h3) > .doc-heading-link')
    .display('inline-block')
    .marginInlineStart('0.45em')
    .color(accent.text.default)
    .fontSize('0.7em')
    .fontWeight('400')
    .textDecoration('none')
    .verticalAlign('0.05em')
    .opacity('0.45')

  article
    .select(
      ':scope > :is(h2, h3):hover > .doc-heading-link, .doc-heading-link:focus-visible',
    )
    .opacity('1')
  article
    .select(':scope > :is(h2, h3) > .doc-heading-link::before')
    .content('"#"')
}

function registerNavigationRailStyles(
  docs: Style,
  palette: ThemePalette,
  colors: DocumentationColors,
) {
  const { shadow, border, tint } = colors
  const accent = palette.semanticTone.accent

  docs.select(':scope > .topbar').boxShadow(`0 1px 12px ${shadow}`)

  // Only docked rails recede; floating panels retain their opaque reading surface.
  docs
    .select(
      ':scope:not(.template-doc--nav-drawer):not(.template-doc--nav-collapsed) .doc-sidebar > .nav__menu',
    )
    .media(mediaMin(BREAKPOINTS.lg))
    .background('transparent')
    .borderColor('transparent')

  docs
    .select(':scope:not(.template-doc--toc-collapsed) .doc-toc > .page-toc')
    .media(mediaMin(BREAKPOINTS.toc))
    .background('transparent')
    .borderColor('transparent')
    .borderInlineStart(`1px solid ${border}`)
    .borderRadius('0 !important')

  docs
    .select(
      '.doc-sidebar > .nav__menu .btn[aria-current="page"], .doc-toc > .page-toc .page-toc__link.active',
    )
    .background(tint)
    .boxShadow(`inset 2px 0 ${accent.text.default}`)
    .borderRadius(palette.radii.sm)
}

function registerComponentHeaderStyles(
  article: Style,
  palette: ThemePalette,
  colors: DocumentationColors,
) {
  const { surface, border, elevation, tint } = colors
  const accent = palette.semanticTone.accent
  const secondary = palette.semanticTone.secondary

  article
    .select(':scope > .component-header, :scope > .api-overview')
    .padding('clamp(1.25rem, 3vw, 1.75rem)')
    .background(
      `radial-gradient(ellipse at 100% 0%, color-mix(in srgb, ${secondary.text.default} 8%, transparent), transparent 70%), ${surface}`,
    )
    .borderColor(border)
    .borderInlineStart(`3px solid ${accent.border.default}`)
    .boxShadow(elevation)
    .borderRadius('0.875rem')

  article
    .select(':scope > .component-header .component-header__links a')
    .display('inline-flex')
    .alignItems('center')
    .gap('0.25em')
    .padding('0.3rem 0.65rem')
    .background(tint)
    .border(`1px solid ${accent.border.subtle}`)
    .borderRadius(palette.radii.md)
    .textDecoration('none')

  article
    .select(
      ':scope > .component-header .component-header__links a:is(:hover, :focus-visible)',
    )
    .borderColor(accent.border.default)
    .background(accent.surface.rest.background)
}

function registerExampleFrameStyles(
  article: Style,
  colors: DocumentationColors,
) {
  const { border, elevation, tint, heading, muted } = colors

  article
    .select(':scope > .component-example')
    .marginBlock('1.75rem')
    .borderColor(border)
    .boxShadow(elevation)

  article
    .select(':scope > .component-example > .component-example__heading')
    .background(tint)
    .color(heading)
    .fontSize('0.875rem')
    .letterSpacing('normal')
    .borderBottomColor(border)
    .borderRadius('1rem 1rem 0 0')

  article
    .select(':scope > .component-example .component-example__tag')
    .padding('0.2rem 0.5rem')
    .border(`1px solid ${border}`)
    .borderRadius('1rem')
    .color(muted)
    .letterSpacing('0.06em')
}

function registerCodeFrameStyles(article: Style, colors: DocumentationColors) {
  const { border, elevation } = colors

  article
    .select(':scope > pre, .api-property__content > pre, .api-contract > pre')
    .padding('1.4rem')
    .border(`1px solid ${border}`)
    .borderRadius('0.75rem')
    .boxShadow(elevation)
}

function registerCopyControlStyles(
  article: Style,
  palette: ThemePalette,
  colors: DocumentationColors,
) {
  const button =
    ':is(:scope > pre, :scope > .tabs .tabs__panel-body > pre, .api-property__content pre, .api-contract pre) > .code-copy-button'
  const idle = `${button}:not(.is-copied, .is-error)`
  const { muted, surface, border } = colors

  article
    .select(button)
    .width('2.25rem')
    .height('2.25rem')
    .padding('0.5rem')
    .borderRadius('0.625rem')
    .boxShadow('none')

  article
    .select(idle)
    .color(muted)
    .background(surface)
    .border(`1px solid ${border}`)

  article.select(`${button} > svg`).width('1.125rem').height('1.125rem')
  registerCopyControlInteractionStyles(article, idle, palette, colors)
  registerCopyControlFeedbackStyles(article, button, palette)
}

function registerCopyControlInteractionStyles(
  article: Style,
  button: string,
  palette: ThemePalette,
  colors: DocumentationColors,
) {
  const accent = palette.semanticTone.accent
  article
    .select(`${button}:is(:hover, :focus-visible)`)
    .background(colors.tint)
    .borderColor(accent.border.default)
    .color(accent.text.default)
    .boxShadow(`0 2px 8px ${colors.shadow}`)

  article
    .select(`${button}:focus-visible`)
    .outline(`2px solid ${accent.border.focus}`)
    .outlineOffset('3px')

  article.select(`${button}:active`).transform('scale(0.96)')
}

function registerCopyControlFeedbackStyles(
  article: Style,
  button: string,
  palette: ThemePalette,
) {
  for (const [state, tone] of [
    ['is-copied', palette.semanticTone.success],
    ['is-error', palette.semanticTone.danger],
  ] as const) {
    article
      .select(`${button}.${state}`)
      .background(tone.surface.rest.background)
      .borderColor(tone.border.default)
      .color(tone.surface.rest.text)
  }
}

function registerTableFrameStyles(article: Style, colors: DocumentationColors) {
  const { shadow, tint } = colors

  article
    .select(':scope > .table-scroll')
    .borderRadius('0.75rem')
    .boxShadow(`0 3px 12px ${shadow}`)

  article.select(':scope > .table-scroll thead').background(tint)
}

function registerAdjacentPageCardStyles(
  article: Style,
  colors: DocumentationColors,
) {
  const { border, surface, heading, shadow } = colors

  article
    .select(':scope > nav[aria-label="Adjacent pages"]')
    .marginTop('3.5rem')
    .gap('1rem')
    .borderTopColor(border)

  article
    .select(':scope > nav[aria-label="Adjacent pages"] .btn')
    .padding('1.1rem 1.25rem')
    .minHeight('5rem')
    .fontSize('1rem')
    .lineHeight('1.5')
    .letterSpacing('normal')
    .background(surface)
    .color(heading)
    .border(`1px solid ${border}`)
    .borderRadius('0.75rem')
    .boxShadow(`0 3px 12px ${shadow}`)
}

function registerAdjacentPageControlStyles(
  article: Style,
  palette: ThemePalette,
  colors: DocumentationColors,
) {
  const { muted, tint } = colors
  const accent = palette.semanticTone.accent

  article
    .select(':scope > nav[aria-label="Adjacent pages"] .text-eyebrow')
    .fontSize('0.6875rem !important')
    .color(muted)

  article
    .select(
      ':scope > nav[aria-label="Adjacent pages"] .btn:is(:hover, :focus-visible)',
    )
    .background(tint)
    .borderColor(accent.border.default)
    .color(accent.text.default)
}
