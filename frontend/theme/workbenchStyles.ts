import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'
import { studioTypography } from './studioSkin'

export function registerWorkbenchStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .workbench-wrap').css({
    marginTop: '51px',
  })
  root.select('.studio .workbench').css({
    overflow: 'hidden',
    borderRadius: '10px',
    textAlign: 'left',
  })
  root.select('.studio .workbench-toolbar').css({
    gap: '21px',
    height: '42px',
    padding: '0 19px',
    borderBottom: `1px solid ${tone.neutral.border.subtle}`,
    background: tone.neutral.surfaceAlt.rest.background,
  })
  root.select('.studio .window-dots').css({
    gap: '6px',
  })
  root.select('.studio .window-dots i').css({
    display: 'block',
    width: '7px',
    height: '7px',
    background: tone.neutral.surface.hover.border,
    borderRadius: '50%',
  })
  root.select('.studio .window-dots i:first-child').css({
    background: tone.neutral.surface.active.border,
  })
  root.select('.studio .window-dots i:nth-child(2)').css({
    background: tone.neutral.surface.active.border,
  })
  root.select('.studio .window-dots i:nth-child(3)').css({
    background: tone.accent.surface.hover.border,
  })
  root.select('.studio .workbench-title').css({
    color: tone.neutral.text.subtle,
    font: `10px ${studioTypography.mono}`,
    letterSpacing: '0.4px',
  })
  root.select('.studio .workbench-language').css({
    marginLeft: 'auto',
    color: tone.neutral.root.text.subtle,
    font: `10px ${studioTypography.mono}`,
  })
  root.select('.studio-tabs .tabs__tabs-row').css({
    display: 'flex',
    alignItems: 'stretch',
    height: '47px',
    borderBottom: `1px solid ${tone.neutral.border.subtle}`,
    background: tone.neutral.surface.rest.background,
  })
  root.select('.studio-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn)').css({
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '0 23px',
    position: 'relative',
    color: tone.neutral.root.text.subtle,
    background: 'transparent',
    border: '0',
    borderRight: `1px solid color-mix(in srgb, ${tone.neutral.border.subtle} 50%, transparent)`,
    font: `11px ${studioTypography.mono}`,
  })
  root
    .select('.studio-tabs :is(.tabs__tab, .tabs__tab-buttons > .btn):hover')
    .css({
      color: tone.accent.surface.hover.text,
      background: tone.neutral.surfaceAlt.rest.background,
    })
  root.select('.studio-tabs .tabs__tab-buttons > .btn.active').css({
    color: tone.neutral.text.default,
    background: tone.neutral.surfaceAlt.rest.background,
  })
  root.select('.studio-tabs .tabs__tab-buttons > .btn.active::before').css({
    content: '""',
    position: 'absolute',
    top: '-1px',
    left: '0',
    right: '0',
    height: '2px',
    background: tone.accent.text.default,
  })
  root.select('.studio .example-panel').css({
    minHeight: '345px',
  })
  root.select('.studio .source-pane').css({
    minWidth: '0',
    background: tone.neutral.surface.rest.background,
    borderRight: `1px solid ${tone.neutral.border.subtle}`,
  })
  root.select('.studio .pane-caption').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '43px',
    padding: '0 23px',
    color: tone.neutral.root.text.subtle,
    font: `9px ${studioTypography.mono}`,
    letterSpacing: '1px',
  })
  root.select('.studio .pane-caption > span').css({
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  })
  root.select('.studio .pane-caption > .icon').css({
    width: '13px',
    height: '13px',
    color: tone.neutral.surface.active.border,
  })
  root.select('.studio .pane-caption .status-dot').css({
    width: '4px',
    height: '4px',
  })
  root.select('.studio .copy-button').css({
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '6px',
    minWidth: '32px',
    minHeight: '32px',
    padding: '4px 7px',
    borderRadius: palette.radii.sm,
    font: `10px ${studioTypography.mono} !important`,
    letterSpacing: '0',
  })
  root.select('.studio .copy-button .icon').css({
    width: '13px',
    height: '13px',
  })
  root.select('.studio .copy-button.is-copied').css({
    color: tone.accent.text.default,
  })
  root.select('.studio .copy-button.is-failed').css({
    color: tone.danger.text.default,
  })
  root.select('.studio .copy-toast').css({
    position: 'fixed',
    zIndex: '50',
    bottom: '25px',
    left: '50%',
    transform: 'translate(-50%, 8px)',
    maxWidth: 'calc(100% - 40px)',
    padding: '11px 18px',
    border: `1px solid ${tone.success.surface.rest.border}`,
    borderRadius: palette.radii.md,
    background: tone.accent.surfaceAlt.rest.background,
    color: tone.accent.surface.hover.text,
    boxShadow: '0 8px 25px #0005',
    opacity: '0',
    pointerEvents: 'none',
    fontSize: palette.font.size.sm,
    transition: 'opacity 180ms, transform 180ms',
  })
  root.select('.studio .copy-toast.is-visible').css({
    opacity: '1',
    transform: 'translate(-50%, 0)',
  })
  root.select('.studio .source-code').css({
    padding: '8px 28px 28px 44px',
    font: `12px / 1.9 ${studioTypography.mono}`,
    tabSize: '2',
    whiteSpace: 'pre',
    overflowX: 'auto',
    color: tone.neutral.surfaceAlt.rest.text,
    background: 'transparent',
    border: '0',
    borderRadius: '0',
  })
  root.select('.studio .source-code code').css({
    font: 'inherit',
    color: 'inherit',
    background: 'none',
    padding: '0',
    border: '0',
  })
  root.select('.studio .syntax-muted').css({
    color: tone.neutral.surface.active.border,
  })
  root.select('.studio .syntax-green').css({
    color: tone.success.text.default,
  })
  root.select('.studio .syntax-blue').css({
    color: tone.info.text.default,
  })
  root.select('.studio .syntax-amber').css({
    color: tone.warning.text.default,
  })
  root.select('.studio .syntax-purple').css({
    color: tone.feature.text.default,
  })
  root.select('.studio .preview-pane').css({
    minWidth: '0',
    background: `radial-gradient(ellipse at 50% 70%, color-mix(in srgb, ${tone.accent.surface.hover.background} 18%, transparent), transparent 75%), ${tone.neutral.surface.rest.background}`,
  })
  root.select('.studio .content-preview').css({
    padding: '26px 44px 35px',
  })
  root.select('.studio .preview-eyebrow').css({
    font: `9px ${studioTypography.mono}`,
    letterSpacing: '1.6px',
    color: tone.neutral.root.text.subtle,
  })
  root.select('.studio .content-preview h2').css({
    fontSize: palette.font.size.h2,
    letterSpacing: '-1.6px',
    lineHeight: '1.3',
    marginTop: '10px',
  })
  root.select('.studio .content-preview h2 > span').css({
    color: tone.accent.text.default,
  })
  root.select('.studio .content-preview > p').css({
    marginTop: '7px',
    color: tone.accent.text.subtle,
    fontSize: palette.font.size.sm,
  })
  root.select('.studio .demo-panel').css({
    marginTop: '25px',
    padding: '0',
    borderRadius: palette.radii.md,
  })
  root.select('.studio .demo-panel .panel__body').css({
    padding: '18px',
  })
  root.select('.studio .demo-panel .badge, .studio .sample-top .badge').css({
    display: 'inline-flex',
    padding: '3px 7px',
    borderRadius: '3px',
    font: `9px ${studioTypography.mono}`,
    lineHeight: '1.4',
  })
  root.select('.studio .demo-panel p').css({
    marginTop: '10px',
    fontSize: palette.font.size.sm,
  })
  root.select('.studio .preview-footnote').css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    color: tone.neutral.root.text.subtle,
    font: `9px / 1.6 ${studioTypography.mono}`,
    marginTop: '19px',
  })
  root.select('.studio .content-preview .preview-footnote').css({
    justifyContent: 'start',
  })
  root.select('.studio .preview-footnote .icon').css({
    width: '12px',
    height: '12px',
  })
  root.select('.studio .counter-preview').css({
    textAlign: 'center',
    padding: '35px 24px 24px',
  })
  root.select('.studio .counter-preview h2').css({
    fontSize: palette.font.size.h3,
    letterSpacing: '-0.6px',
    marginTop: '12px',
  })
  root.select('.studio #counter').css({
    marginTop: '24px',
  })
  root.select('.studio #counter button').css({
    minWidth: '185px',
    minHeight: '48px',
    borderRadius: palette.radii.md,
    background: tone.accent.text.default,
    color: tone.accent.button.rest.text,
    border: `1px solid ${tone.accent.button.rest.border}`,
    fontSize: palette.font.size.body,
    fontWeight: '600',
    padding: '11px 20px',
    transition: 'transform 120ms',
  })
  root.select('.studio #counter button:active').css({
    transform: 'scale(0.97)',
  })
  root.select('.studio .counter-preview > p').css({
    marginTop: '20px',
    color: tone.neutral.text.subtle,
    fontSize: palette.font.size.xs,
  })
  root.select('.studio .style-preview').css({
    padding: '32px 45px',
    textAlign: 'center',
  })
  root.select('.studio .your-card').css({
    border: `1px solid ${tone.neutral.surface.hover.border}`,
  })
  root.select('.studio .your-card > .icon').css({
    width: '30px',
    height: '30px',
  })
  root.select('.studio .your-card h2').css({
    marginTop: '13px',
    fontSize: palette.font.size.h3,
    letterSpacing: '-0.6px',
  })
  root.select('.studio .your-card p').css({
    marginTop: '8px',
    fontSize: palette.font.size.sm,
    opacity: '0.75',
  })
  root.select('.studio .workbench-status').css({
    minHeight: '32px',
    gap: '12px',
    padding: '6px 19px',
    borderTop: `1px solid ${tone.neutral.border.default}`,
    background: tone.neutral.surfaceAlt.rest.background,
    color: tone.success.text.subtle,
    font: `9px ${studioTypography.mono}`,
  })
  root.select('.studio .workbench-status > span').css({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  })
  root.select('.studio .workbench-status .icon').css({
    width: '12px',
    height: '12px',
  })
  root.select('.studio .workbench-caption').css({
    marginTop: '16px !important',
    textAlign: 'center',
    color: tone.neutral.root.text.subtle,
    fontSize: palette.font.size.xs,
  })
}
