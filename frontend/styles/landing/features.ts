import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { typography } from '../../theme/skin'

export function registerFeaturesStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.landing-page .build-for').css({
    marginTop: '63px',
    paddingBottom: '37px',
    borderBottom: `1px solid ${tone.neutral.border.subtle}`,
    textAlign: 'center',
  })
  root.select('.landing-page .build-for > span').css({
    font: `9px ${typography.mono}`,
    letterSpacing: '1.5px',
    color: tone.neutral.root.text.subtle,
  })
  root.select('.landing-page .build-for > div').css({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px 45px',
    marginTop: '20px',
    color: tone.accent.surface.rest.text,
    fontSize: palette.font.size.body,
    fontWeight: '500',
    letterSpacing: '-0.2px',
  })
  root.select('.landing-page .section').css({
    paddingBlock: '92px',
  })
  root.select('.landing-page .eyebrow').css({
    display: 'block',
    color: tone.accent.text.subtle,
    font: `10px / 1.6 ${typography.mono}`,
    letterSpacing: '1.7px',
    marginBottom: '19px',
  })
  root
    .select('.landing-page .section h2, .landing-page .start-section h2')
    .css({
      fontSize: palette.font.size.h1,
      lineHeight: '1.16',
      letterSpacing: '-1.8px',
    })
  root
    .select(
      '.landing-page .section h2 > span, .landing-page .start-section h2 > span',
    )
    .css({
      color: tone.accent.text.subtle,
    })
  root.select('.landing-page .section-heading').css({
    marginBottom: '37px',
  })
  root.select('.landing-page .section-heading > p').css({
    fontSize: palette.font.size.body,
    lineHeight: '1.85',
    marginTop: '19px',
    color: tone.neutral.text.subtle,
  })
  root.select('.landing-page .feature-grid').css({
    gap: '15px',
  })
  root.select('.landing-page .feature-card').css({
    position: 'relative',
    borderRadius: palette.radii.lg,
    overflow: 'hidden',
    transition: 'border-color 200ms',
  })
  root
    .select('.landing-page .feature-content, .landing-page .feature-components')
    .css({
      gridColumn: 'span 3',
    })
  root.select('.landing-page .feature-small').css({
    gridColumn: 'span 2',
  })
  root.select('.landing-page .feature-icon').css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '35px',
    height: '35px',
    borderRadius: '7px',
    marginBottom: '19px',
  })
  root.select('.landing-page .feature-icon .icon').css({
    width: '19px',
    height: '19px',
  })
  root.select('.landing-page .feature-card h3').css({
    fontSize: palette.font.size.h4,
    letterSpacing: '-0.5px',
    lineHeight: '1.5',
  })
  root.select('.landing-page .feature-card .feature-summary').css({
    color: tone.neutral.text.subtle,
    fontSize: '13px',
    marginTop: '10px',
    lineHeight: '1.85',
    maxWidth: '425px',
  })
  root.select('.landing-page .file-tree').css({
    padding: '20px 20px 17px',
    marginBlock: '27px 23px',
    border: `1px solid ${tone.neutral.border.default}`,
    borderRadius: palette.radii.md,
    background: tone.neutral.canvas,
    font: `11px / 2.6 ${typography.mono}`,
  })
  root.select('.landing-page .file-tree > div').css({
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    color: tone.accent.surface.rest.text,
  })
  root.select('.landing-page .file-tree .tree-note').css({
    marginLeft: 'auto',
    fontSize: palette.font.size.xxxs,
    color: tone.neutral.surface.active.border,
  })
  root.select('.landing-page .tree-folder').css({
    color: tone.neutral.text.subtle,
  })
  root.select('.landing-page .tree-indent').css({
    paddingLeft: '15px',
  })
  root.select('.landing-page .tree-indent-deep').css({
    paddingLeft: '30px',
  })
  root.select('.landing-page .text-link').css({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '13px',
    fontSize: palette.font.size.sm,
    lineHeight: '1.6',
    transition: 'color 180ms',
  })
  root.select('.landing-page .component-sample').css({
    marginBlock: '27px 23px',
    padding: '18px 20px',
    border: `1px solid ${tone.neutral.surfaceAlt.rest.border}`,
    borderRadius: palette.radii.md,
    background: tone.neutral.surfaceAlt.rest.bgcolor,
  })
  root.select('.landing-page .sample-top').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '8px',
    fontSize: palette.font.size.xs,
    fontWeight: '500',
    color: tone.neutral.surfaceAlt.rest.text,
  })
  root.select('.landing-page .sample-chart').css({
    marginTop: '15px',
  })
  root.select('.landing-page .sample-chart-label').css({
    font: `9px ${typography.mono}`,
    color: tone.neutral.root.text.subtle,
  })
  root.select('.landing-page .sample-chart .bar-chart').css({
    display: 'block',
    width: '100%',
    height: '90px',
    marginTop: '6px',
    padding: '0',
    border: '0',
    borderBottom: `1px solid ${tone.accent.surface.rest.border}`,
    borderRadius: '0',
    background: `repeating-linear-gradient( to top, transparent 0, transparent 24px, color-mix(in srgb, ${tone.accent.text.subtle} 5%, transparent) 25px, transparent 26px )`,
  })
  root.select('.landing-page .sample-chart-axis').css({
    display: 'flex',
    justifyContent: 'space-between',
    color: tone.neutral.root.text.subtle,
    font: `8px ${typography.mono}`,
    marginTop: '6px',
  })
  root.select('.landing-page .sample-bottom').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    marginTop: '18px',
    borderTop: `1px solid ${tone.neutral.border.default}`,
    paddingTop: '11px',
    fontSize: palette.font.size.xxxs,
    color: tone.accent.text.subtle,
  })
  root.select('.landing-page .sample-bottom > span:first-child').css({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  })
  root.select('.landing-page .sample-bottom .status-dot').css({
    width: '4px',
    height: '4px',
  })
  root.select('.landing-page .sample-avatar').css({
    display: 'grid',
    placeItems: 'center',
    width: '22px',
    height: '22px',
    borderRadius: '50%',
    background: tone.accent.border.subtle,
    color: tone.neutral.surfaceAlt.rest.text,
    font: `8px ${typography.mono}`,
  })
  root.select('.landing-page .feature-small').css({
    minHeight: '294px',
  })
  root.select('.landing-page .feature-small h3').css({
    fontSize: palette.font.size.h5,
  })
  root.select('.landing-page .feature-small .feature-summary').css({
    fontSize: palette.font.size.sm,
    lineHeight: '1.9',
  })
  root.select('.landing-page .tone-sample').css({
    display: 'flex',
    alignItems: 'center',
    marginTop: '26px',
    paddingBlock: '2px',
  })
  root.select('.landing-page .tone-sample i').css({
    display: 'block',
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    background: tone.accent.text.default,
    border: `3px solid ${tone.neutral.surface.rest.bgcolor}`,
  })
  root.select('.landing-page .tone-sample i + i').css({
    marginLeft: '-6px',
  })
  root.select('.landing-page .tone-sample i:nth-child(2)').css({
    background: tone.info.tone,
  })
  root.select('.landing-page .tone-sample i:nth-child(3)').css({
    background: tone.accent.surface.hover.border,
  })
  root.select('.landing-page .tone-sample i:nth-child(4)').css({
    background: tone.warning.tone,
  })
  root.select('.landing-page .tone-sample i:nth-child(5)').css({
    background: tone.danger.tone,
  })
  root.select('.landing-page .tone-sample > span').css({
    marginLeft: '12px',
    font: `9px / 1.5 ${typography.mono}`,
    color: tone.neutral.text.subtle,
  })
  root.select('.landing-page .output-sample').css({
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
    marginTop: '28px',
    font: `9px ${typography.mono}`,
  })
  root.select('.landing-page .output-sample > span').css({
    border: `1px solid ${tone.neutral.surfaceAlt.rest.border}`,
    borderRadius: palette.radii.sm,
    padding: '5px 7px',
    color: tone.neutral.text.subtle,
  })
  root.select('.landing-page .output-sample .output-js').css({
    borderStyle: 'dashed',
    color: tone.warning.text.default,
  })
  root.select('.landing-page .output-sample .output-web').css({
    background: tone.accent.surface.hover.bgcolor,
    color: tone.accent.surface.rest.text,
    borderColor: tone.neutral.surface.hover.border,
  })
  root.select('.landing-page .output-sample .icon').css({
    width: '13px',
    height: '13px',
    color: tone.neutral.root.text.subtle,
  })
  root.select('.landing-page .editor-sample').css({
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    marginTop: '25px',
    font: `11px ${typography.mono}`,
    background: tone.neutral.canvas,
    border: `1px solid ${tone.accent.surface.hover.bgcolor}`,
    borderRadius: palette.radii.sm,
    padding: '12px',
  })
  root.select('.landing-page .editor-sample > small').css({
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    position: 'absolute',
    right: '8px',
    top: '-15px',
    font: `8px ${typography.mono}`,
    padding: '4px 6px',
    color: tone.accent.text.default,
    background: tone.accent.surface.hover.bgcolor,
    border: `1px solid ${tone.neutral.surface.hover.border}`,
    borderRadius: '3px',
  })
  root.select('.landing-page .editor-sample .icon').css({
    width: '10px',
    height: '10px',
  })
  root.select('.landing-page .editor-caret').css({
    display: 'block',
    height: '13px',
    width: '1px',
    background: tone.accent.text.default,
  })
}
