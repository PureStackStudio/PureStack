import type { Style } from '@purestack/ts-css'
import { BREAKPOINTS, mediaBelow, type ThemePalette } from '@purestack/ts-style'
import { studioTypography } from './studioSkin'

export function registerEcosystemStyles(root: Style, palette: ThemePalette) {
  registerSectionHeadingStyles(root, palette)
  registerRegorHighlightStyles(root, palette)
  registerPackageStyles(root, palette)
  registerEcosystemNoteStyles(root, palette)
}

function registerSectionHeadingStyles(root: Style, palette: ThemePalette) {
  root.select('.studio .split-heading').css({
    gap: '40px',
  })
  root.select('.studio .split-heading > p').css({
    maxWidth: '355px',
    fontSize: palette.font.size.sm,
    paddingBottom: '3px',
  })
}

function registerRegorHighlightStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .regor-highlight').css({
    gap: '36px',
    padding: '36px',
    marginBottom: '24px',
    border: `1px solid ${tone.accent.surface.rest.border}`,
    borderRadius: palette.radii.lg,
    background: tone.accent.surface.rest.bgcolor,
    color: tone.accent.surface.rest.text,
  })
  root.select('.studio .regor-highlight > *').css({ minWidth: '0' })
  root.select('.studio .regor-highlight .eyebrow').css({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: tone.accent.surface.rest.text,
  })
  root.select('.studio .regor-highlight h3').css({
    fontSize: palette.font.size.h4,
    letterSpacing: '-0.5px',
    lineHeight: '1.25',
    marginTop: '16px',
  })
  root.select('.studio .regor-summary').css({
    marginTop: '16px',
    fontSize: palette.font.size.sm,
    lineHeight: '1.8',
  })
  root.select('.studio .regor-actions').css({
    gap: '12px',
    marginTop: '24px',
  })
  registerRegorConnectionStyles(root, palette)
  root
    .media(mediaBelow(BREAKPOINTS.sm))
    .select('.studio .regor-highlight')
    .css({
      gap: '24px',
      padding: '24px',
    })
}

function registerRegorConnectionStyles(root: Style, palette: ThemePalette) {
  registerRegorLoopPathStyles(root, palette)
  registerRegorLoopNodeStyles(root, palette)
  registerRegorLoopLabelStyles(root, palette)
  root.select('.studio .regor-connection figcaption').css({
    fontSize: palette.font.size.xs,
    lineHeight: '1.8',
  })
}

function registerRegorLoopPathStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .regor-connection').css({
    margin: '0',
    textAlign: 'center',
  })
  root.select('.studio .regor-loop').css({
    position: 'relative',
    height: '220px',
    maxWidth: '400px',
    marginInline: 'auto',
  })
  root.select('.studio .regor-loop-path').css({
    position: 'absolute',
    inset: '0',
    width: '100%',
    height: '100%',
    strokeWidth: '1.5',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  })
  root
    .select('.studio .regor-loop-ui')
    .css({ stroke: tone.accent.text.default })
  root
    .select('.studio .regor-loop-docs')
    .css({ stroke: tone.secondary.text.default })
}

function registerRegorLoopNodeStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .regor-loop-node').css({
    position: 'absolute',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    fontSize: palette.font.size.sm,
  })
  root.select('.studio .regor-loop-node--regor').css({
    left: '22.222%',
    color: tone.accent.text.default,
  })
  root.select('.studio .regor-loop-node--purestack').css({
    left: '77.778%',
    color: tone.secondary.text.default,
  })
  root.select('.studio .regor-loop-mark').css({
    display: 'grid',
    placeItems: 'center',
    width: '64px',
    height: '64px',
    border: '1px solid color-mix(in srgb, currentColor 30%, transparent)',
    borderRadius: palette.radii.lg,
    background: tone.neutral.surface.rest.bgcolor,
    boxShadow: '0 8px 24px color-mix(in srgb, currentColor 10%, transparent)',
  })
  root.select('.studio .regor-loop-mark .icon').css({
    width: '32px',
    height: '32px',
  })
}

function registerRegorLoopLabelStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
  root.select('.studio .regor-loop-label').css({
    position: 'absolute',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '5px 10px',
    borderRadius: palette.radii.pill,
    background: tone.accent.surface.rest.bgcolor,
    font: `10px ${studioTypography.mono}`,
    whiteSpace: 'nowrap',
  })
  root.select('.studio .regor-loop-label--ui').css({
    top: '35px',
    color: tone.accent.text.default,
  })
  root.select('.studio .regor-loop-label--docs').css({
    top: '185px',
    color: tone.secondary.text.default,
  })
  root.select('.studio .regor-loop-label .icon').css({
    width: '14px',
    height: '14px',
  })
}

function registerPackageStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
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
    color: tone.neutral.text.subtle,
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
    color: tone.neutral.text.subtle,
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
}

function registerEcosystemNoteStyles(root: Style, palette: ThemePalette) {
  const tone = palette.semanticTone
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
