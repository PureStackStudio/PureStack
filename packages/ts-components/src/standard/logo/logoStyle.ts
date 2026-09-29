import { styleBuilder, themes } from '@purestack/ts-style'

export function registerLogoStyles() {
  themes.forEach((theme, palette) => {
    const neutral = palette.semanticTone.neutral
    const accent = `var(--ps-logo-accent-color, ${palette.current.text.default})`
    const brand = `var(--ps-logo-brand-color, ${neutral.text.default})`
    styleBuilder.select('.site-logo', theme).css({
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--ps-logo-gap, 0.375rem)',
      width: 'fit-content',
      maxWidth: '100%',
      minWidth: '0',
      verticalAlign: 'middle',
      textDecoration: 'none',
      color: brand,
      lineHeight: '1',
      borderRadius: palette.radii.md,
      '--ps-logo-size-brand': 'clamp(1.25rem, 3vw, 1.5rem)',
      '--ps-logo-size-mark': 'clamp(1.625rem, 4vw, 2rem)',
      '--ps-logo-size-subtitle': '0.65rem',
    })
    styleBuilder.select('.site-logo--sm', theme).css({
      '--ps-logo-size-brand': '1.25rem',
      '--ps-logo-size-mark': '1.625rem',
      '--ps-logo-size-subtitle': '0.6rem',
    })
    styleBuilder.select('.site-logo--lg', theme).css({
      '--ps-logo-size-brand': '2rem',
      '--ps-logo-size-mark': '2.75rem',
      '--ps-logo-size-subtitle': '0.75rem',
    })
    styleBuilder.select('.site-logo--xl', theme).css({
      '--ps-logo-size-brand': '3rem',
      '--ps-logo-size-mark': '4rem',
      '--ps-logo-size-subtitle': '0.875rem',
    })
    styleBuilder.select('.site-logo--badge, .site-logo--outline', theme).css({
      padding: '0.75rem 1rem',
      border: `1px solid ${neutral.border.subtle}`,
    })
    styleBuilder
      .select('.site-logo--badge', theme)
      .css({ background: neutral.surfaceAlt.rest.background })
    styleBuilder.select('.site-logo--stacked', theme).css({
      flexDirection: 'column',
      textAlign: 'center',
      gap: 'var(--ps-logo-gap, 0.5rem)',
    })
    styleBuilder
      .select('.site-logo--stacked .site-logo__copy', theme)
      .alignItems('center')
    styleBuilder.select('.site-logo__mark', theme).css({
      display: 'inline-grid',
      placeItems: 'center',
      flexShrink: '0',
      width: 'var(--ps-logo-mark-size, var(--ps-logo-size-mark))',
      height: 'var(--ps-logo-mark-size, var(--ps-logo-size-mark))',
      borderRadius: palette.radii.md,
      boxSizing: 'border-box',
      overflow: 'hidden',
      color: `var(--ps-logo-mark-color, ${accent})`,
      background: 'var(--ps-logo-mark-background, transparent)',
    })
    styleBuilder
      .select(
        '.site-logo .site-logo__mark > .icon, .site-logo__mark > svg',
        theme,
      )
      .css({ width: '100%', height: '100%' })
    styleBuilder.select('.site-logo--mark-soft .site-logo__mark', theme).css({
      padding: '0.2em',
      background: `var(--ps-logo-mark-background, ${palette.current.surface.rest.background})`,
    })
    styleBuilder.select('.site-logo--mark-solid .site-logo__mark', theme).css({
      padding: '0.2em',
      background: `var(--ps-logo-mark-background, ${palette.current.button.rest.background})`,
      color: `var(--ps-logo-mark-color, ${palette.current.button.rest.text})`,
    })
    styleBuilder
      .select('.site-logo--mark-outline .site-logo__mark', theme)
      .css({ padding: '0.2em', border: `1px solid ${accent}` })
    styleBuilder
      .select('.site-logo--square .site-logo__mark', theme)
      .borderRadius('0')
    styleBuilder
      .select('.site-logo--circle .site-logo__mark', theme)
      .borderRadius('50%')
    styleBuilder.select('.site-logo__images, .site-logo__image', theme).css({
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'contain',
    })
    styleBuilder
      .select('.site-logo__image--dark', theme)
      .display(theme === 'dark' ? 'block' : 'none')
    styleBuilder
      .select('.site-logo__image--light', theme)
      .display(theme === 'dark' ? 'none' : 'block')
    styleBuilder.select('.site-logo__monogram', theme).css({
      fontSize:
        'calc(var(--ps-logo-mark-size, var(--ps-logo-size-mark)) * 0.45)',
      fontWeight: '750',
      letterSpacing: '-0.04em',
    })
    styleBuilder.select('.site-logo__copy', theme).css({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      minWidth: '0',
      gap: '0.35rem',
    })
    styleBuilder.select('.site-logo__name', theme).css({
      fontSize: 'var(--ps-logo-brand-size, var(--ps-logo-size-brand))',
      fontWeight: '700',
      letterSpacing: '-0.045em',
      lineHeight: '1.05',
      overflowWrap: 'anywhere',
      color: brand,
    })
    styleBuilder.select('.site-logo__brand', theme).color(brand)
    styleBuilder.select('.site-logo__suffix', theme).color(accent)
    styleBuilder
      .select('.site-logo--wordmark-accent .site-logo__brand', theme)
      .color(accent)
    styleBuilder
      .select('.site-logo--wordmark-gradient .site-logo__brand', theme)
      .css({
        backgroundImage: `linear-gradient(115deg, ${brand}, ${accent})`,
        backgroundClip: 'text',
        '-webkit-background-clip': 'text',
        color: 'transparent',
      })
    styleBuilder.select('.site-logo__subtitle', theme).css({
      fontSize: 'var(--ps-logo-subtitle-size, var(--ps-logo-size-subtitle))',
      color: neutral.text.subtle,
      lineHeight: '1.4',
      letterSpacing: '0.06em',
      overflowWrap: 'anywhere',
    })
    styleBuilder
      .select('.site-logo[href]', theme)
      .css({ cursor: 'pointer', transition: 'opacity 160ms ease' })
    styleBuilder
      .select('.site-logo[href]:hover', theme)
      .css({ textDecoration: 'none', opacity: '0.85' })
    styleBuilder.select('.site-logo[href]:focus-visible', theme).css({
      outline: `2px solid ${palette.current.border.focus}`,
      outlineOffset: '5px',
    })
    styleBuilder
      .select('.site-logo--wordmark-gradient .site-logo__brand', theme)
      .media('(forced-colors: active)')
      .css({ backgroundImage: 'none', color: 'LinkText' })
  })
}
