import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { studioTypography } from './studioSkin'

export function registerHeroStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .hero').css({
    position: 'relative',
    isolation: 'isolate',
    paddingTop: '65px',
  })
  root.select('.studio .hero-grid').css({
    position: 'absolute',
    zIndex: '-1',
    top: '0',
    right: '0',
    left: '0',
    height: '680px',
    backgroundImage: `linear-gradient(color-mix(in srgb, ${tone.success.surface.rest.border} 5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, ${tone.success.surface.rest.border} 5%, transparent) 1px, transparent 1px)`,
    backgroundSize: '72px 72px',
    maskImage: 'radial-gradient(ellipse at 50% 20%, #000 5%, transparent 70%)',
    pointerEvents: 'none',
  })
  root.select('.studio .hero::before').css({
    content: '""',
    position: 'absolute',
    zIndex: '-1',
    top: '-70px',
    left: '50%',
    width: 'min(850px, 95%)',
    height: '580px',
    transform: 'translateX(-50%)',
    background: `radial-gradient(ellipse, color-mix(in srgb, ${tone.success.text.subtle} 13%, transparent) 0%, transparent 67%)`,
    pointerEvents: 'none',
  })
  root.select('.studio .hero-content').css({
    textAlign: 'center',
  })
  root.select('.studio .release-note').css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 11px',
    border: `1px solid ${tone.accent.border.subtle}`,
    borderRadius: '5px',
    background: `color-mix(in srgb, ${tone.neutral.surface.hover.background} 50%, transparent)`,
    color: `${tone.accent.surface.rest.text} !important`,
    font: `10px / 1.5 ${studioTypography.mono}`,
    letterSpacing: '1px',
    transition: 'border-color 180ms',
  })
  root.select('.studio .release-note:hover').css({
    borderColor: tone.accent.text.default,
  })
  root.select('.studio .release-note > span:last-child').css({
    marginLeft: '6px',
    fontSize: palette.font.size.body,
  })
  root.select('.studio .status-dot').css({
    display: 'inline-block',
    width: '6px',
    height: '6px',
    flexShrink: '0',
    borderRadius: '50%',
    background: tone.accent.text.default,
    boxShadow: `0 0 9px color-mix(in srgb, ${tone.accent.text.default} 13%, transparent)`,
  })
  root.select('.studio .hero h1').css({
    marginTop: '27px',
    fontSize: 'clamp(52px, 6.1vw, 80px)',
    lineHeight: '1.055',
    letterSpacing: '-4px',
    fontWeight: '600',
  })
  root.select('.studio .hero h1 > span').css({
    color: tone.accent.text.default,
  })
  root.select('.studio .hero-description').css({
    marginTop: '26px !important',
    color: tone.neutral.text.subtle,
    fontSize: palette.font.size.h5,
    lineHeight: '1.8',
    letterSpacing: '-0.15px',
  })
  root.select('.studio .hero-actions').css({
    gap: '12px',
    marginTop: '29px',
  })
  root.select('.studio .button').css({
    gap: '14px',
    minHeight: '46px',
    padding: '11px 20px',
    borderRadius: palette.radii.md,
    fontSize: '13px',
    fontWeight: '600',
    lineHeight: '1.5',
    transition: 'background 160ms, border-color 160ms, transform 160ms',
  })
  root.select('.studio .button:hover').css({
    transform: 'translateY(-2px)',
  })
  root.select('.studio .button .icon').css({
    width: '17px',
    height: '17px',
  })
  root.select('.studio .hero-notes').css({
    gap: '23px',
    marginTop: '19px',
    color: tone.success.text.subtle,
    fontSize: palette.font.size.xs,
  })
  root.select('.studio .hero-notes > span').css({
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  })
  root.select('.studio .hero-notes .icon').css({
    color: tone.neutral.root.text.subtle,
    width: '13px',
    height: '13px',
  })
}
