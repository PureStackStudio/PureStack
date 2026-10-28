import type { Style } from '@purestack/ts-css'
import {
  BREAKPOINTS,
  mediaBelow,
  styleBuilder,
  type ThemePalette,
  themes,
} from '@purestack/ts-style'

export function registerApiReferenceStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    registerOverviewStyles(root, palette)
    registerIndexStyles(root, palette)
    registerPropertyLayoutStyles(root, palette)
    registerPropertyMetadataStyles(root, palette)
    registerPropertyContentStyles(root, palette)
    registerContractStyles(root, palette)
    registerResponsivePropertyStyles(root)
  })
}

function registerOverviewStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.api-overview')
    .padding('1.25rem')
    .border(`1px solid ${neutral.border.subtle}`)
    .borderTop(`3px solid ${accent.text.default}`)
    .borderRadius(palette.radii.md)
    .background(neutral.surface.rest.background)
  root
    .select('.api-overview__signature')
    .fontSize(palette.font.size.h3)
    .color(accent.text.default)
    .background('none')
    .border('none')
    .padding('0')
  root.select('.api-overview p').margin('0.75rem 0 0')
}

function registerIndexStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.api-index')
    .display('flex')
    .flexWrap('wrap')
    .gap('0.5rem')
    .marginTop('1rem')
  root
    .select('.api-index a')
    .padding('0.3rem 0.65rem')
    .border(`1px solid ${neutral.border.subtle}`)
    .borderRadius(palette.radii.sm)
    .fontSize(palette.font.size.xs)
    .textDecoration('none')
  root
    .select('.api-index a:hover, .api-index a:focus-visible')
    .borderColor(accent.text.default)
    .color(accent.text.default)
}

function registerPropertyLayoutStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.api-property')
    .display('grid')
    .gridTemplateColumns('minmax(0, 11rem) minmax(0, 1fr)')
    .gap('1.5rem')
    .padding('1.5rem 0')
    .borderTop(`1px solid ${neutral.border.subtle}`)
    .scrollMarginTop('7rem')
  root
    .select('.api-property:target')
    .borderTopColor(accent.text.default)
    .background(accent.surface.rest.background)
    .boxShadow(`0 0 0 0.5rem ${accent.surface.rest.background}`)
  root.select('.api-property__header, .api-property__content').minWidth('0')
}

function registerPropertyMetadataStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.api-property__header h4')
    .margin('0 0 0.5rem')
    .fontSize(palette.font.size.h6)
  root
    .select('.api-property__header h4 a')
    .textDecoration('none')
    .color(accent.text.default)
  root
    .select('.api-property__header h4 span')
    .color(neutral.text.subtle)
    .fontWeight('400')
  root
    .select('.api-property__header h4 code, .api-property__type')
    .background('none')
    .border('none')
    .padding('0')
    .overflowWrap('anywhere')
  root
    .select('.api-property__type')
    .color(neutral.text.subtle)
    .fontSize(palette.font.size.xs)
  root
    .select('.api-property__default')
    .display('flex')
    .flexWrap('wrap')
    .alignItems('baseline')
    .gap('0.4rem')
    .margin('0.8rem 0 0')
    .fontSize(palette.font.size.xs)
  root.select('.api-property__default dt').color(neutral.text.subtle)
  root.select('.api-property__default dd').margin('0')
}

function registerPropertyContentStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root.select('.api-property__content > p:first-child').marginTop('0')
  root.select('.api-property__content > :last-child').marginBottom('0')
  root
    .select('.api-values, .api-demo')
    .display('flex')
    .flexWrap('wrap')
    .alignItems('center')
    .gap('0.5rem')
    .margin('0.85rem 0')
  root
    .select('.api-demo')
    .padding('0.9rem')
    .borderRadius(palette.radii.md)
    .background(neutral.surface.rest.background)
  root.select('.api-property__content pre').margin('0.8rem 0 0')
  root
    .select('.api-note')
    .paddingLeft('0.8rem')
    .borderLeft(`2px solid ${accent.border.default}`)
    .color(neutral.text.subtle)
    .fontSize(palette.font.size.sm)
}

function registerContractStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.api-contract')
    .padding('1.1rem 1.25rem')
    .borderLeft(`2px solid ${accent.border.default}`)
    .background(neutral.surface.rest.background)
  root.select('.api-contract > :first-child').marginTop('0')
  root.select('.api-contract > :last-child').marginBottom('0')
}

function registerResponsivePropertyStyles(root: Style) {
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.api-property')
    .gridTemplateColumns('minmax(0, 1fr)')
    .gap('0.8rem')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.api-property__header')
    .display('flex')
    .flexWrap('wrap')
    .alignItems('baseline')
    .gap('0.5rem 0.9rem')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.api-property__header h4')
    .margin('0')
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.api-property__default')
    .margin('0')
}
