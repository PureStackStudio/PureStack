import type { ThemePalette } from '@purestack/ts-style'
import type { StarterStyle } from '../index'

export function registerLandingNextStepStyles(
  root: StarterStyle,
  palette: ThemePalette,
) {
  root.select('.landing-next').borderRadius(palette.radii.lg)
  root.select('.landing-next-body').padding('clamp(1.5rem, 3vw, 2.5rem)')
  root.select('.landing-next-layout').gap('2rem')
  root.select('.landing-next-layout > div').display('grid').gap('1rem')
  root
    .select('.landing-next-title')
    .fontSize('clamp(1.6rem, 2.5vw, 2rem)')
    .fontWeight('600')
    .lineHeight('1.35')
    .letterSpacing('-0.025em')
  root.select('.landing-next .landing-body').maxWidth('60ch')
  root.select('.landing-next .landing-button').justifySelf('start')
}
