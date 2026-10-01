import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { studioTypography } from './studioSkin'

export function registerEcosystemStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .split-heading').css({
    gap: '40px',
  })
  root.select('.studio .split-heading > p').css({
    maxWidth: '355px',
    fontSize: palette.font.size.sm,
    paddingBottom: '3px',
  })
  root.select('.studio .package-grid').css({
    border: `1px solid ${tone.neutral.border.subtle}`,
    borderRadius: '7px',
    overflow: 'hidden',
  })
  root.select('.studio .package-card').css({
    display: 'flex',
    gap: '18px',
    padding: '30px',
    background: tone.neutral.surface.rest.bgcolor,
    transition: 'background 180ms',
  })
  root.select('.studio .package-card:nth-child(odd)').css({
    borderRight: `1px solid ${tone.neutral.border.subtle}`,
  })
  root.select('.studio .package-card:nth-child(-n + 2)').css({
    borderBottom: `1px solid ${tone.neutral.border.subtle}`,
  })
  root.select('.studio .package-card:hover').css({
    background: tone.neutral.surface.hover.bgcolor,
  })
  root.select('.studio .package-number').css({
    paddingTop: '5px',
    color: tone.neutral.root.text.subtle,
    font: `10px ${studioTypography.mono}`,
  })
  root.select('.studio .package-card > span:last-child').css({
    marginLeft: 'auto',
    color: tone.success.text.subtle,
    fontSize: '18px',
  })
  root.select('.studio .package-card h3').css({
    fontSize: palette.font.size.h6,
    letterSpacing: '-0.3px',
  })
  root.select('.studio .package-card p').css({
    maxWidth: '365px',
    marginTop: '10px',
    fontSize: palette.font.size.sm,
    color: tone.success.text.subtle,
    lineHeight: '1.8',
  })
  root.select('.studio .package-card code').css({
    display: 'block',
    marginTop: '20px',
    color: tone.accent.surface.rest.text,
    font: `10px ${studioTypography.mono}`,
    background: 'none',
    padding: '0',
    border: '0',
  })
  root.select('.studio .ecosystem-note').css({
    gap: '20px',
    marginTop: '22px',
    color: tone.neutral.root.text.subtle,
    fontSize: palette.font.size.xs,
  })
  root.select('.studio .ecosystem-note > span').css({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  })
  root.select('.studio .ecosystem-note .icon').css({
    width: '16px',
    height: '16px',
  })
  root.select('.studio .ecosystem-note .text-link').css({
    fontSize: palette.font.size.xs,
  })
}
