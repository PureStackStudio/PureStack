import type { Style } from '@purestack/ts-css'
import { styleBuilder, themes, type ThemePalette } from '@purestack/ts-style'
import {
  createDocumentationColors,
  documentationColorBindings,
  setDocumentationColorVariables,
  type DocumentationColors,
} from './documentationColors'
import { registerDocumentationDetailStyles } from './documentationDetailStyles'

/** A reading treatment for the documentation, independent of the demo palette. */
export function registerDocumentationStyles() {
  themes.forEach((theme, palette) => {
    setDocumentationColorVariables(
      styleBuilder.get(theme).select(':where(:scope)'),
      createDocumentationColors(palette),
    )
    const colors = documentationColorBindings
    const docs = styleBuilder
      .get(theme)
      .scope('body.template-doc:not(.preview)')
    const article = docs.scope('.doc-main > .doc-content')

    docs.select(':scope').background(colors.canvas)
    article.select(':scope').maxWidth('72rem')

    registerProseStyles(article, colors)
    registerHeadingStyles(article, colors)
    registerLinkStyles(article, palette)
    registerBlockquoteStyles(article, palette, colors)
    registerCodeStyles(article, colors)
    registerTableStyles(article, colors)
    registerShellSurfaceStyles(docs, colors)
    registerNavigationTypographyStyles(docs, colors)
    registerNavigationStateStyles(docs, palette, colors)
    registerReferenceStyles(article, colors)
    registerPropertyStyles(article, colors)
    registerMetadataStyles(article, colors)
    registerDocumentationDetailStyles(docs, palette, colors)
  })
}

function registerProseStyles(article: Style, colors: DocumentationColors) {
  const { ink } = colors

  // Direct prose children preserve typography utilities inside live examples.
  article
    .select(':scope > :where(p, ul, ol, blockquote)')
    .maxWidth('70ch')
    .fontSize('1.0625rem')
    .lineHeight('1.75')
    .letterSpacing('normal')
    .color(ink)
    .marginBottom('1.25em')
}

function registerHeadingStyles(article: Style, colors: DocumentationColors) {
  const { heading } = colors

  article
    .select(':scope > :where(h1, h2, h3, h4, h5, h6)')
    .maxWidth('min(100%, 48rem)')
    .color(heading)
    .lineHeight('1.3')
    .letterSpacing('-0.015em')
    .fontWeight('600')

  article
    .select(':scope > :where(* + h2, * + h3, * + h4, * + h5, * + h6)')
    .marginTop('2em')
    .marginBottom('0.75em')
}

function registerLinkStyles(article: Style, palette: ThemePalette) {
  const accent = palette.semanticTone.accent

  article
    .select(':scope > :where(p, ul, ol, blockquote) a')
    .color(accent.text.default)
    .fontWeight('500')
    .textDecoration('underline')
    .textDecorationColor(accent.border.default)
    .textUnderlineOffset('0.18em')

  article
    .select(':scope > :where(p, ul, ol, blockquote) a:hover')
    .textDecorationColor('currentColor')
}

function registerBlockquoteStyles(
  article: Style,
  palette: ThemePalette,
  colors: DocumentationColors,
) {
  const { surface } = colors
  const accent = palette.semanticTone.accent

  article
    .select(':scope > blockquote')
    .background(surface)
    .borderInlineStart(`3px solid ${accent.border.default}`)
    .padding('1rem 1.25rem')
}

function registerCodeStyles(article: Style, colors: DocumentationColors) {
  const { code, border, ink } = colors

  article
    .select(
      ':scope > pre, :scope > .tabs > .tabs__list > .tabs__item > .tabs__panel > .tabs__panel-body > pre, :scope > :where(p, ul, ol, blockquote) code, .api-property__content pre, .api-property__content code, .api-contract pre, .api-contract code',
    )
    .fontSize('0.875rem')
    .lineHeight('1.7')
    .letterSpacing('normal')
    .background(code)
    .borderColor(border)
    .color(ink)

  article
    .select(
      ':scope > pre code, :scope > .tabs > .tabs__list > .tabs__item > .tabs__panel > .tabs__panel-body > pre code, .api-property__content pre code, .api-contract pre code',
    )
    .fontSize('inherit')
    .lineHeight('inherit')
    .letterSpacing('normal')
    .background('transparent')
    .border('none')
}

function registerTableStyles(article: Style, colors: DocumentationColors) {
  const { surface, border, ink } = colors

  article
    .select(':scope > :where(.table-scroll)')
    .background(surface)
    .borderColor(border)
    .fontSize('0.9375rem')
    .lineHeight('1.65')
    .letterSpacing('normal')
    .color(ink)

  article
    .select(':scope > .table-scroll :where(thead tr, code)')
    .fontSize('0.8125rem')
    .letterSpacing('normal')
}

function registerShellSurfaceStyles(docs: Style, colors: DocumentationColors) {
  const { surface, ink, border } = colors

  docs
    .select(':scope > .topbar, .doc-sidebar > .nav__menu, .doc-toc > .page-toc')
    .background(surface)
    .color(ink)
    .borderColor(border)
    .boxShadow('none')
    .backdropFilter('none')
}

function registerNavigationTypographyStyles(
  docs: Style,
  colors: DocumentationColors,
) {
  const { muted } = colors

  docs
    .select(
      '.doc-sidebar > .nav__menu .nav__item .btn, .doc-toc > .page-toc .page-toc__link',
    )
    .fontSize('0.875rem')
    .lineHeight('1.5')
    .letterSpacing('normal')
    .color(muted)

  // Override the TOC's fs-sm/fs-xs utilities, which otherwise force 11-12px text.
  docs
    .select('.doc-toc > .page-toc .page-toc__link')
    .fontSize('0.875rem !important')

  docs
    .select(
      '.doc-sidebar > .nav__menu .nav__header, .doc-toc > .page-toc .page-toc__header',
    )
    .fontSize('0.75rem')
    .letterSpacing('0.06em')
    .color(muted)
    .opacity('1')
    .marginBottom('0.75rem')
}

function registerNavigationStateStyles(
  docs: Style,
  palette: ThemePalette,
  colors: DocumentationColors,
) {
  const { heading } = colors
  const accent = palette.semanticTone.accent

  docs
    .select(
      '.doc-sidebar > .nav__menu .btn:is(:hover, :focus-visible), .doc-toc > .page-toc .page-toc__link:is(:hover, :focus-visible)',
    )
    .color(heading)
    .background(accent.surface.rest.background)

  docs
    .select(
      '.doc-sidebar > .nav__menu .btn[aria-current="page"], .doc-toc > .page-toc .page-toc__link.active',
    )
    .color(accent.text.default)
    .background(accent.surface.rest.background)
    .fontWeight('600')
}

function registerReferenceStyles(article: Style, colors: DocumentationColors) {
  const { surface, border, ink } = colors

  article
    .select(
      ':scope > .component-header, :scope > .api-overview, :scope > .api-contract',
    )
    .background(surface)
    .borderColor(border)
    .color(ink)

  article
    .select(
      '.component-header__summary, .api-overview > p, .api-contract > p, .api-property__content > :where(p, ul, ol)',
    )
    .maxWidth('70ch')
    .fontSize('1.0625rem')
    .lineHeight('1.75')
    .letterSpacing('normal')
    .color(ink)
}

function registerPropertyStyles(article: Style, colors: DocumentationColors) {
  const { border } = colors

  article.select('.api-property').paddingBlock('1.75rem').borderTopColor(border)

  article
    .select('.api-property__header code')
    .fontSize('0.875rem')
    .lineHeight('1.65')
    .letterSpacing('normal')

  article.select('.api-property__header h4 code').fontSize('1rem')
}

function registerMetadataStyles(article: Style, colors: DocumentationColors) {
  const { muted } = colors

  article
    .select(
      '.api-property__type, .api-property__default, .api-index a, .api-note, .component-header__back, .component-header__links a, .component-example__caption',
    )
    .fontSize('0.875rem')
    .lineHeight('1.65')
    .letterSpacing('normal')

  article
    .select(
      '.api-property__type, .api-property__default, .api-note, .component-header__back, .component-example__caption',
    )
    .color(muted)
}
