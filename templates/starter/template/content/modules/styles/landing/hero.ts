import type { StarterStyle } from '../index'

export function registerLandingHeroStyles(root: StarterStyle) {
  root.select('.landing-hero').gap('clamp(2.5rem, 5vw, 4rem)')
  root.select('.landing-hero-copy').display('grid').gap('1.5rem')
  root
    .select('.landing-hero-title')
    .display('flex')
    .flexDirection('column')
    .gap('0.3rem')
    .fontSize('clamp(3.2rem, 6.2vw, 5.8rem)')
    .fontWeight('650')
    .lineHeight('1.14')
    .letterSpacing('-0.055em')
  root
    .select('.landing-hero-description')
    .maxWidth('36rem')
    .fontSize('clamp(1.05rem, 1.4vw, 1.15rem)')
    .fontWeight('400')
    .lineHeight('1.8')
    .letterSpacing('0')
  root.select('.landing-actions').gap('0.75rem')
}
