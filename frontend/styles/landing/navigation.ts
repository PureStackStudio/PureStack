import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'

export function registerNavigationStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.landing-page .site-header').css({
    position: 'sticky',
    zIndex: '20',
    top: '0',
    borderBottom: `1px solid color-mix(in srgb, ${tone.neutral.border.subtle} 80%, transparent)`,
    background: `color-mix(in srgb, ${tone.neutral.canvas} 93%, transparent)`,
    backdropFilter: 'blur(16px)',
  })
  root.select('.landing-page .header-inner').css({
    height: '78px',
    gap: '40px',
  })
  root.select('.landing-page .header-inner > .site-logo').css({
    flexShrink: '0',
  })
  root.select('.landing-page .header-actions').css({
    display: 'flex',
    alignItems: 'center',
    gap: '0rem',
    flexShrink: '0',
  })
  root.select('.landing-page .desktop-nav').css({
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    marginInline: 'auto',
    paddingLeft: '28px',
  })
  root
    .select('.landing-page .desktop-nav a, .landing-page .header-source')
    .css({
      fontSize: '13px',
      fontWeight: '500',
      color: tone.neutral.text.subtle,
      transition: 'color 160ms',
    })
  root
    .select(
      '.landing-page .desktop-nav a:hover, .landing-page .header-source:hover',
    )
    .css({
      color: tone.accent.text.default,
    })
  root.select('.landing-page .header-source').css({
    display: 'flex',
    gap: '9px',
    alignItems: 'center',
    color: tone.neutral.text.default,
  })
  root.select('.landing-page .header-source > span:last-child').css({
    color: tone.neutral.root.text.subtle,
    marginLeft: '3px',
  })
  root.select('.landing-page .header-source .icon').css({
    width: '17px',
    height: '17px',
  })
  root.select('.landing-page .mobile-menu').css({
    display: 'none',
  })
}
