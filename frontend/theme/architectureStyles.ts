import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { studioTypography } from './studioSkin'

export function registerArchitectureStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .ai-section').css({
    position: 'relative',
    borderBlock: `1px solid ${tone.neutral.border.subtle}`,
    paddingBlock: '80px',
    background: tone.accent.canvas,
  })
  root.select('.studio .ai-layout').css({
    gap: '100px',
  })
  root.select('.studio .ai-layout h2').css({
    fontSize: '39px',
    lineHeight: '1.2',
    letterSpacing: '-1.6px',
  })
  root.select('.studio .ai-layout h2 > span').css({
    color: tone.accent.text.default,
  })
  root.select('.studio .ai-layout > div > p').css({
    maxWidth: '460px',
    fontSize: '13px',
    color: tone.neutral.text.subtle,
    lineHeight: '1.9',
    marginTop: '19px',
  })
  root.select('.studio .ai-layout .text-link').css({
    marginTop: '22px',
  })
  root.select('.studio .source-diagram').css({
    minWidth: '0',
    textAlign: 'center',
  })
  root.select('.studio .diagram-inputs').css({
    gap: '8px',
  })
  root.select('.studio .diagram-inputs > span').css({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '9px',
    border: `1px solid ${tone.neutral.surfaceAlt.rest.border}`,
    borderRadius: '5px',
    padding: '14px 5px',
    color: tone.neutral.text.subtle,
    font: `9px ${studioTypography.mono}`,
    background: tone.neutral.surfaceAlt.rest.background,
  })
  root.select('.studio .diagram-inputs > span > span').css({
    fontSize: palette.font.size.sm,
  })
  root.select('.studio .diagram-lines').css({
    height: '49px',
    paddingInline: '12%',
  })
  root.select('.studio .diagram-lines i').css({
    height: '25px',
    borderBottom: `1px solid ${tone.success.surface.rest.border}`,
    borderLeft: `1px solid ${tone.success.surface.rest.border}`,
  })
  root.select('.studio .diagram-lines i:first-child').css({
    borderBottomLeftRadius: '10px',
  })
  root.select('.studio .diagram-lines i:last-child').css({
    borderLeft: '0',
    borderRight: `1px solid ${tone.success.surface.rest.border}`,
    borderBottomRightRadius: '10px',
  })
  root.select('.studio .diagram-lines::after').css({
    content: '""',
    position: 'absolute',
    left: '50%',
  })
  root.select('.studio .diagram-core').css({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '67%',
    marginInline: 'auto',
    padding: '24px',
    background: tone.accent.surfaceAlt.rest.background,
    border: `1px solid ${tone.accent.surface.hover.border}`,
    borderRadius: '9px',
    boxShadow: `0 0 38px color-mix(in srgb, ${tone.success.text.default} 4%, transparent)`,
  })
  root.select('.studio .diagram-core::before').css({
    content: '""',
    position: 'absolute',
    top: '-25px',
    left: '50%',
    height: '24px',
    width: '1px',
    background: tone.success.surface.rest.border,
  })
  root.select('.studio .diagram-core > .icon').css({
    width: '30px',
    height: '30px',
    color: tone.accent.text.default,
  })
  root.select('.studio .diagram-core > strong').css({
    marginTop: '8px',
    fontSize: palette.font.size.h4,
    fontWeight: '500',
    letterSpacing: '-0.5px',
  })
  root.select('.studio .diagram-core > span').css({
    marginTop: '5px',
    color: tone.accent.text.subtle,
    font: `8px ${studioTypography.mono}`,
  })
  root.select('.studio .diagram-stem').css({
    width: '1px',
    height: '33px',
    marginInline: 'auto',
    background: tone.success.surface.rest.border,
  })
  root.select('.studio .diagram-output').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '80%',
    marginInline: 'auto',
    padding: '15px',
    border: `1px solid ${tone.accent.surface.rest.border}`,
    borderRadius: '5px',
    background: tone.neutral.surfaceAlt.rest.background,
    font: `11px ${studioTypography.mono}`,
    color: tone.accent.surface.rest.text,
  })
  root.select('.studio .diagram-output .icon').css({
    width: '15px',
    height: '15px',
  })
  root.select('.studio .diagram-output .status-dot').css({
    marginLeft: 'auto',
    width: '4px',
    height: '4px',
  })
  root.select('.studio .source-diagram > p').css({
    font: `9px ${studioTypography.mono} !important`,
    color: `${tone.neutral.root.text.subtle} !important`,
    marginTop: '21px !important',
  })
}
