import { styleBuilder, themes } from '@purestack/ts-style'

/** Shell sizing and fluid type; spacing, surfaces, and artwork stay in components. */
export function registerRecoveryStyles() {
  themes.forEach((theme) => {
    const root = styleBuilder.get(theme)
    root
      .select('.landing-page:has(.recovery-page)')
      .display('flex')
      .flexDirection('column')
      .minHeight('100dvh')
    root
      .select('.landing-page:has(.recovery-page) > main')
      .flex('1 0 auto')
      .display('flex')
      .alignItems('center')
    root.select('.landing-page .recovery-page').maxWidth('1000px')
    root
      .select('.landing-page .recovery-copy h1')
      .fontSize('clamp(2.5rem, 4.8vw, 4rem)')
  })
}
