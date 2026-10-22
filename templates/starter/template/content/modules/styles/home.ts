import type { ThemePalette } from '@purestack/ts-style'
import type { StarterStyle } from './index'
import { registerLandingCanvasStyles } from './landing/canvas'
import { registerLandingFoundationStyles } from './landing/foundation'
import { registerLandingHeroStyles } from './landing/hero'
import { registerLandingNextStepStyles } from './landing/next-step'

export function registerHomeStyles(root: StarterStyle, palette: ThemePalette) {
  registerLandingBaseStyles(root, palette)
  registerLandingHeroStyles(root)
  registerLandingCanvasStyles(root, palette)
  registerLandingFoundationStyles(root, palette)
  registerLandingNextStepStyles(root, palette)
}

function registerLandingBaseStyles(root: StarterStyle, palette: ThemePalette) {
  root.select('.landing-page').display('grid').gap('clamp(4rem, 8vw, 6rem)')
  root.select('.landing-page :where(h1, h2, h3, p)').margin('0')
  root
    .select('.landing-eyebrow')
    .fontSize('0.75rem')
    .fontWeight('600')
    .lineHeight('1.6')
    .letterSpacing('0.15em')
    .textTransform('uppercase')
    .color(palette.current.text.subtle)
  root
    .select('.landing-accent, .landing-eyebrow--accent')
    .color(palette.semanticTone.accent.text.default)
  root
    .select('.landing-body')
    .fontSize('1rem')
    .fontWeight('400')
    .lineHeight('1.75')
    .letterSpacing('0')
    .color(palette.current.text.subtle)
  root
    .select('.landing-note')
    .fontSize('0.8rem')
    .fontWeight('400')
    .lineHeight('1.6')
    .letterSpacing('0.015em')
    .color(palette.current.text.subtle)
  root.select('.landing-hero-description').color(palette.current.text.subtle)
  root
    .select('.landing-page .landing-button')
    .padding('0.85rem 1.1rem')
    .fontSize('1rem')
    .fontWeight('600')
    .lineHeight('1.5')
    .letterSpacing('0')
  root
    .select('.landing-page .landing-card-link')
    .padding('0')
    .fontSize('0.94rem')
    .fontWeight('600')
    .lineHeight('1.5')
    .letterSpacing('0')
}
