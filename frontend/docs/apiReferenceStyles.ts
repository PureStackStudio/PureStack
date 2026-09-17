import {
  BREAKPOINTS,
  mediaBelow,
  styleBuilder,
  themes,
} from '@purestack/ts-style'

export function registerApiReferenceStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    const neutral = palette.semanticTone.neutral
    const accent = palette.semanticTone.accent

    root.select('.api-overview').css({
      padding: '1.25rem',
      border: `1px solid ${neutral.border.subtle}`,
      borderTop: `3px solid ${accent.text.default}`,
      borderRadius: palette.radii.md,
      background: neutral.surface.rest.background,
    })
    root.select('.api-overview__signature').css({
      fontSize: palette.font.size.h3,
      color: accent.text.default,
      background: 'none',
      border: 'none',
      padding: '0',
    })
    root.select('.api-overview p').css({ margin: '0.75rem 0 0' })
    root.select('.api-index').css({
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.5rem',
      marginTop: '1rem',
    })
    root.select('.api-index a').css({
      padding: '0.3rem 0.65rem',
      border: `1px solid ${neutral.border.subtle}`,
      borderRadius: palette.radii.sm,
      fontSize: palette.font.size.xs,
      textDecoration: 'none',
    })
    root.select('.api-index a:hover, .api-index a:focus-visible').css({
      borderColor: accent.text.default,
      color: accent.text.default,
    })
    root.select('.api-property').css({
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 11rem) minmax(0, 1fr)',
      gap: '1.5rem',
      padding: '1.5rem 0',
      borderTop: `1px solid ${neutral.border.subtle}`,
      scrollMarginTop: '7rem',
    })
    root.select('.api-property:target').css({
      borderTopColor: accent.text.default,
      background: accent.surface.rest.background,
      boxShadow: `0 0 0 0.5rem ${accent.surface.rest.background}`,
    })
    root.select('.api-property__header, .api-property__content').minWidth('0')
    root.select('.api-property__header h4').css({
      margin: '0 0 0.5rem',
      fontSize: palette.font.size.h6,
    })
    root.select('.api-property__header h4 a').css({
      textDecoration: 'none',
      color: accent.text.default,
    })
    root.select('.api-property__header h4 span').css({
      color: neutral.text.subtle,
      fontWeight: '400',
    })
    root.select('.api-property__header h4 code, .api-property__type').css({
      background: 'none',
      border: 'none',
      padding: '0',
      overflowWrap: 'anywhere',
    })
    root.select('.api-property__type').css({
      color: neutral.text.subtle,
      fontSize: palette.font.size.xs,
    })
    root.select('.api-property__default').css({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: '0.4rem',
      margin: '0.8rem 0 0',
      fontSize: palette.font.size.xs,
    })
    root.select('.api-property__default dt').color(neutral.text.subtle)
    root.select('.api-property__default dd').margin('0')
    root.select('.api-property__content > p:first-child').marginTop('0')
    root.select('.api-property__content > :last-child').marginBottom('0')
    root.select('.api-values, .api-demo').css({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.5rem',
      margin: '0.85rem 0',
    })
    root.select('.api-demo').css({
      padding: '0.9rem',
      borderRadius: palette.radii.md,
      background: neutral.surface.rest.background,
    })
    root.select('.api-property__content pre').margin('0.8rem 0 0')
    root.select('.api-note').css({
      paddingLeft: '0.8rem',
      borderLeft: `2px solid ${accent.border.default}`,
      color: neutral.text.subtle,
      fontSize: palette.font.size.sm,
    })
    root.select('.api-contract').css({
      padding: '1.1rem 1.25rem',
      borderLeft: `2px solid ${accent.border.default}`,
      background: neutral.surface.rest.background,
    })
    root.select('.api-contract > :first-child').marginTop('0')
    root.select('.api-contract > :last-child').marginBottom('0')
    root.media(mediaBelow(BREAKPOINTS.md)).select('.api-property').css({
      gridTemplateColumns: 'minmax(0, 1fr)',
      gap: '0.8rem',
    })
    root.media(mediaBelow(BREAKPOINTS.md)).select('.api-property__header').css({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: '0.5rem 0.9rem',
    })
    root
      .media(mediaBelow(BREAKPOINTS.md))
      .select('.api-property__header h4')
      .margin('0')
    root
      .media(mediaBelow(BREAKPOINTS.md))
      .select('.api-property__default')
      .margin('0')
  })
}
