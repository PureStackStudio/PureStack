import type { ThemePalette } from '@purestack/ts-style'
import type { StarterStyle } from '../index'

export function registerLandingFoundationStyles(
  root: StarterStyle,
  palette: ThemePalette,
) {
  root.select('.landing-section-heading').gap('2rem').marginBottom('2rem')
  root.select('.landing-section-heading > div').display('grid').gap('1.25rem')
  root
    .select('.landing-section-title')
    .maxWidth('24ch')
    .fontSize('clamp(1.85rem, 3vw, 2.6rem)')
    .fontWeight('650')
    .lineHeight('1.3')
    .letterSpacing('-0.035em')
  root.select('.landing-features').gap('1.5rem')
  root.select('.landing-feature-card').height('100%')
  root
    .select('.landing-feature-card:hover')
    .borderColor(palette.semanticTone.accent.border.default)
  root
    .select('.landing-feature-body')
    .padding('1.5rem')
    .height('100%')
    .display('flex')
    .flexDirection('column')
    .gap('1.25rem')
  root.select('.landing-feature-heading').gap('1rem')
  root
    .select('.landing-feature-number')
    .fontSize('2.25rem')
    .fontWeight('300')
    .lineHeight('1')
    .letterSpacing('-0.05em')
    .color(palette.current.text.subtle)
  root
    .select('.landing-feature-body h3')
    .fontSize('1.25rem')
    .fontWeight('600')
    .lineHeight('1.4')
    .letterSpacing('-0.015em')
  root.select('.landing-feature-body > p').flex('1')
  root.select('.landing-card-link').alignSelf('flex-start')
}
