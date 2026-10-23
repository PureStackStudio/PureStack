import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { typography } from '../../theme/skin'

export function registerFooterStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.landing-page .site-footer').css({
    paddingTop: '48px',
    background: tone.neutral.canvas,
  })
  root.select('.landing-page .footer-top').css({
    gap: '40px',
    paddingBottom: '43px',
  })
  root.select('.landing-page .footer-top p').css({
    marginTop: '18px',
    fontSize: palette.font.size.xs,
    lineHeight: '1.9',
    color: tone.neutral.root.text.subtle,
  })
  root.select('.landing-page .footer-top nav').css({
    display: 'flex',
    gap: '84px',
    paddingTop: '4px',
  })
  root.select('.landing-page .footer-top nav > div').css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '9px',
  })
  root.select('.landing-page .footer-label').css({
    marginBottom: '6px',
    color: tone.neutral.text.subtle,
    font: `8px ${typography.mono}`,
    letterSpacing: '1.5px',
  })
  root.select('.landing-page .footer-top nav a').css({
    fontSize: palette.font.size.xs,
    color: tone.neutral.text.subtle,
  })
  root.select('.landing-page .site-footer a:hover').css({
    color: tone.accent.text.default,
  })
  root.select('.landing-page .footer-bottom').css({
    borderTop: `1px solid ${tone.neutral.border.subtle}`,
    gap: '15px',
    paddingBlock: '23px',
    font: `9px ${typography.mono}`,
    color: tone.neutral.surface.active.border,
  })
  root.select('.landing-page .footer-built').css({
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  })
  root.select('.landing-page .footer-actions').css({
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  })
  // The consent runtime moves its settings button here. Show it as one more
  // footer link rather than a button.
  root
    .select('.landing-page .footer-actions .consent-settings-teleport-area')
    .css({
      display: 'contents',
    })
  root.select('.landing-page .footer-actions .btn').css({
    minHeight: '0',
    padding: '0',
    borderColor: 'transparent',
    background: 'none',
    boxShadow: 'none',
    font: 'inherit',
    color: 'inherit',
  })
  root.select('.landing-page .footer-actions .btn:hover').css({
    color: tone.accent.text.default,
  })
  root.select('.landing-page .footer-built .status-dot').css({
    width: '4px',
    height: '4px',
  })
}
