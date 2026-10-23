import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { typography } from '../../theme/skin'

export function registerClosingStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.landing-page .faq-layout').css({
    gap: '100px',
  })
  root.select('.landing-page .faq-layout h2').css({
    fontSize: '33px',
  })
  root.select('.landing-page .faq-intro').css({
    marginTop: '17px !important',
    color: tone.neutral.text.subtle,
    fontSize: '13px',
    lineHeight: '1.8',
  })
  root.select('.landing-page .faq-list').css({
    borderTop: `1px solid ${tone.neutral.border.subtle}`,
  })
  root.select('.landing-page .faq-list details').css({
    borderBottom: `1px solid ${tone.neutral.border.subtle}`,
  })
  root.select('.landing-page .faq-list summary').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    listStyle: 'none',
    paddingBlock: '21px',
    cursor: 'pointer',
    fontSize: '13px',
    color: tone.neutral.surfaceAlt.rest.text,
  })
  root.select('.landing-page .faq-list summary::-webkit-details-marker').css({
    display: 'none',
  })
  root.select('.landing-page .faq-list summary > span:last-child').css({
    fontSize: palette.font.size.h4,
    lineHeight: '1',
    color: tone.neutral.text.subtle,
    transition: 'transform 180ms',
  })
  root.select('.landing-page .faq-list details[open] summary').css({
    color: tone.accent.text.default,
  })
  root
    .select('.landing-page .faq-list details[open] summary > span:last-child')
    .css({
      transform: 'rotate(45deg)',
    })
  root.select('.landing-page .faq-list .expandable-panel__body > p').css({
    padding: '0 25px 22px 0',
    fontSize: palette.font.size.sm,
    color: tone.neutral.text.subtle,
    lineHeight: '1.9',
  })
  root.select('.landing-page .closing-section').css({
    position: 'relative',
    overflow: 'hidden',
    borderBlock: `1px solid ${tone.neutral.border.default}`,
    padding: '66px 0 72px',
    textAlign: 'center',
  })
  root.select('.landing-page .closing-section::before').css({
    content: '""',
    position: 'absolute',
    pointerEvents: 'none',
    width: '900px',
    height: '900px',
    border: `1px solid color-mix(in srgb, ${tone.neutral.root.text.subtle} 5%, transparent)`,
    borderRadius: '50%',
    top: '40px',
    left: 'calc(50% - 450px)',
    boxShadow: `0 0 0 65px color-mix(in srgb, ${tone.neutral.root.text.subtle} 2%, transparent), 0 0 0 130px color-mix(in srgb, ${tone.neutral.root.text.subtle} 2%, transparent)`,
  })
  root.select('.landing-page .closing-section .container').css({
    position: 'relative',
  })
  root.select('.landing-page .closing-icon').css({
    display: 'inline-flex',
    marginBottom: '21px',
    color: tone.accent.text.subtle,
  })
  root.select('.landing-page .closing-icon .icon').css({
    width: '32px',
    height: '32px',
  })
  root.select('.landing-page .closing-section h2').css({
    fontSize: '49px',
    lineHeight: '1.15',
    letterSpacing: '-2px',
  })
  root.select('.landing-page .closing-section h2 > span').css({
    color: tone.accent.text.default,
  })
  root.select('.landing-page .closing-section p').css({
    marginTop: '19px',
    color: tone.accent.text.subtle,
    fontSize: '13px',
  })
  root.select('.landing-page .closing-section .button').css({
    marginTop: '26px',
  })
  root.select('.landing-page .closing-note').css({
    display: 'block',
    marginTop: '17px',
    color: tone.neutral.root.text.subtle,
    font: `9px ${typography.mono}`,
  })
}
