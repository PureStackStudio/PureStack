import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { studioTypography } from './studioSkin'

export function registerGettingStartedStyles(
  root: Style,
  palette: ThemePalette,
) {
  const tone = palette.semanticTone
  root.select('.studio .start-section').css({
    borderBlock: `1px solid ${tone.neutral.border.subtle}`,
    background: tone.neutral.surface.rest.background,
    paddingBlock: '77px',
  })
  root.select('.studio .start-layout').css({
    gap: '100px',
  })
  root.select('.studio .start-copy > p').css({
    fontSize: '13px',
    color: tone.neutral.text.subtle,
    lineHeight: '1.9',
    maxWidth: '390px',
    marginTop: '21px',
  })
  root.select('.studio .start-steps').css({
    listStyle: 'none',
    margin: '32px 0 0',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  })
  root.select('.studio .start-steps li').css({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
  })
  root.select('.studio .start-steps li > span').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '27px',
    height: '27px',
    border: `1px solid ${tone.neutral.surfaceAlt.rest.border}`,
    borderRadius: '50%',
    color: tone.success.text.default,
    background: tone.accent.surface.rest.background,
    font: `9px ${studioTypography.mono}`,
  })
  root.select('.studio .start-steps strong').css({
    color: tone.accent.surface.hover.text,
    fontSize: palette.font.size.sm,
    fontWeight: '500',
  })
  root.select('.studio .start-steps p').css({
    color: tone.neutral.root.text.subtle,
    fontSize: palette.font.size.xs,
    marginTop: '2px',
  })
  root.select('.studio .start-terminal').css({
    minWidth: '0',
    border: `1px solid ${tone.neutral.surfaceAlt.rest.border}`,
    borderRadius: palette.radii.lg,
    overflow: 'hidden',
    boxShadow: '0 12px 28px #0002',
    background: tone.neutral.canvas,
  })
  root.select('.studio .terminal-heading').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    padding: '15px 20px',
    borderBottom: `1px solid ${tone.neutral.border.default}`,
    background: tone.neutral.surface.hover.background,
  })
  root.select('.studio .terminal-heading > span:first-child').css({
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    fontSize: palette.font.size.xs,
    color: tone.neutral.surfaceAlt.rest.text,
  })
  root.select('.studio .terminal-heading .icon').css({
    width: '14px',
    height: '14px',
  })
  root.select('.studio .terminal-heading > span:last-child').css({
    font: `8px ${studioTypography.mono}`,
    color: tone.success.text.subtle,
    letterSpacing: '1px',
  })
  root.select('.studio .terminal-body').css({
    padding: '27px 24px',
  })
  root.select('.studio .terminal-command').css({
    position: 'relative',
    paddingRight: '20px',
    marginBottom: '27px',
    font: `10px / 1.9 ${studioTypography.mono}`,
  })
  root.select('.studio .terminal-command > span').css({
    display: 'block',
    marginBottom: '7px',
    color: tone.neutral.root.text.subtle,
  })
  root
    .select('.studio .terminal-command pre, .studio .terminal-command code')
    .css({
      display: 'block',
      color: tone.neutral.surfaceAlt.rest.text,
      font: `11px / 1.9 ${studioTypography.mono}`,
      background: 'none',
      border: '0',
      padding: '0',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
    })
  root.select('.studio .terminal-command .copy-button').css({
    position: 'absolute',
    right: '-7px',
    top: '-8px',
  })
  root.select('.studio .terminal-address').css({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: tone.success.text.subtle,
    font: `9px / 1.7 ${studioTypography.mono}`,
    paddingTop: '5px',
  })
  root.select('.studio .terminal-address .status-dot').css({
    width: '4px',
    height: '4px',
  })
  root.select('.studio .terminal-footer').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '13px 20px',
    borderTop: `1px solid ${tone.neutral.border.default}`,
    background: tone.neutral.surfaceAlt.rest.background,
    color: `${tone.success.text.default} !important`,
    fontSize: palette.font.size.xxs,
  })
  root.select('.studio .terminal-footer:hover').css({
    background: tone.accent.surface.rest.background,
  })
}
