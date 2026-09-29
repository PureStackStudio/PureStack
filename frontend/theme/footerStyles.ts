import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { studioTypography } from './studioSkin'

export function registerFooterStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .site-footer').css({
    paddingTop: '48px',
    background: tone.neutral.canvas,
  })
  root.select('.studio .footer-top').css({
    gap: '40px',
    paddingBottom: '43px',
  })
  root.select('.studio .footer-top p').css({
    marginTop: '18px',
    fontSize: palette.font.size.xs,
    lineHeight: '1.9',
    color: tone.neutral.root.text.subtle,
  })
  root.select('.studio .footer-top nav').css({
    display: 'flex',
    gap: '84px',
    paddingTop: '4px',
  })
  root.select('.studio .footer-top nav > div').css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '9px',
  })
  root.select('.studio .footer-label').css({
    marginBottom: '6px',
    color: tone.success.text.subtle,
    font: `8px ${studioTypography.mono}`,
    letterSpacing: '1.5px',
  })
  root.select('.studio .footer-top nav a').css({
    fontSize: palette.font.size.xs,
    color: tone.neutral.text.subtle,
  })
  root.select('.studio .site-footer a:hover').css({
    color: tone.accent.text.default,
  })
  root.select('.studio .footer-bottom').css({
    borderTop: `1px solid ${tone.neutral.border.subtle}`,
    gap: '15px',
    paddingBlock: '23px',
    font: `9px ${studioTypography.mono}`,
    color: tone.neutral.surface.active.border,
  })
  root.select('.studio .footer-built').css({
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  })
  root.select('.studio .footer-built .status-dot').css({
    width: '4px',
    height: '4px',
  })
}
