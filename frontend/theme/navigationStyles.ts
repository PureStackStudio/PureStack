import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'

export function registerNavigationStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .site-header').css({
    position: 'sticky',
    zIndex: '20',
    top: '0',
    borderBottom: `1px solid color-mix(in srgb, ${tone.neutral.border.subtle} 80%, transparent)`,
    background: `color-mix(in srgb, ${tone.neutral.canvas} 93%, transparent)`,
    backdropFilter: 'blur(16px)',
  })
  root.select('.studio .header-inner').css({
    height: '78px',
    gap: '40px',
  })
  root.select('.studio .wordmark').css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: palette.font.size.h3,
    fontWeight: '650',
    letterSpacing: '-1px',
    lineHeight: '1',
  })
  root.select('.studio .brand-mark').css({
    display: 'inline-flex',
    color: tone.accent.text.default,
  })
  root.select('.studio .brand-mark .icon').css({
    width: '30px',
    height: '30px',
  })
  root.select('.studio .brand-period').css({
    color: tone.accent.text.default,
  })
  root.select('.studio .desktop-nav').css({
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    marginInline: 'auto',
    paddingLeft: '28px',
  })
  root.select('.studio .desktop-nav a, .studio .header-source').css({
    fontSize: '13px',
    fontWeight: '500',
    color: tone.neutral.text.subtle,
    transition: 'color 160ms',
  })
  root
    .select('.studio .desktop-nav a:hover, .studio .header-source:hover')
    .css({
      color: tone.accent.text.default,
    })
  root.select('.studio .header-source').css({
    display: 'flex',
    gap: '9px',
    alignItems: 'center',
    color: tone.neutral.text.default,
  })
  root.select('.studio .header-source > span:last-child').css({
    color: tone.neutral.root.text.subtle,
    marginLeft: '3px',
  })
  root.select('.studio .header-source .icon').css({
    width: '17px',
    height: '17px',
  })
  root.select('.studio .mobile-menu').css({
    display: 'none',
  })
}
