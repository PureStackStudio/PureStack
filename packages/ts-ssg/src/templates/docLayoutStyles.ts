import { styleBuilder } from '../style/styles'
import { getThemeOptions, getThemePalette } from '../style/themeOptions'

export function registerDocLayoutStyles() {
  const themeOptions = getThemeOptions()
  const palette = (theme: string) => getThemePalette(theme, themeOptions)

  const baseDoc = (theme: string) =>
    styleBuilder
      .select('.template-doc', theme)
      .margin('0')
      .minHeight('100vh')
      .fontFamily(themeOptions.typography.baseFamily)
      .background(palette(theme).app.background)
      .color(palette(theme).app.text)

  baseDoc('light')
  baseDoc('dark')

  const baseShell = (theme: string) =>
    styleBuilder
      .select('.doc-shell', theme)
      .display('grid')
      .gap('28px')
      .padding('32px')
      .maxWidth('1200px')
      .margin('0 auto')
      .width('100%')
      .boxSizing('border-box')
      .gridTemplateColumns('260px minmax(0, 1fr)')

  baseShell('light')
  baseShell('dark')

  const singleShell = (theme: string) =>
    styleBuilder.select('.doc-shell--single', theme).gridTemplateColumns('1fr')

  singleShell('light')
  singleShell('dark')

  const drawerShell = (theme: string) =>
    styleBuilder
      .select('.doc-shell--nav-drawer', theme)
      .gridTemplateColumns('1fr')

  drawerShell('light')
  drawerShell('dark')

  const baseMain = (theme: string) =>
    styleBuilder.select('.doc-main', theme).minWidth('0')
  baseMain('light')
  baseMain('dark')

  const baseContent = (theme: string) =>
    styleBuilder
      .select('.doc-content', theme)
      .maxWidth('920px')
      .margin('0')
      .padding('8px 0 80px')

  baseContent('light')
  baseContent('dark')

  const baseSidebar = (theme: string) =>
    styleBuilder
      .select('.doc-sidebar', theme)
      .position('sticky')
      .top('24px')
      .alignSelf('start')
      .height('calc(100vh - 48px)')
      .overflow('auto')

  baseSidebar('light')
  baseSidebar('dark')

  const drawerSidebar = (theme: string) =>
    styleBuilder
      .select('.template-doc--nav-drawer .doc-sidebar', theme)
      .position('fixed')
      .top('72px')
      .right('16px')
      .left('auto')
      .width('fit-content')
      .maxWidth('min(360px, calc(100vw - 32px))')
      .maxHeight('calc(100vh - 88px)')
      .height('auto')
      .transform('translateX(120%)')
      .transition('transform 220ms ease')
      .zIndex(35)
      .overflow('auto')
      .boxShadow(themeOptions.shadows.strong)

  drawerSidebar('light')
  drawerSidebar('dark')

  styleBuilder
    .select('.doc-nav', 'light')
    .background(palette('light').nav.background)
    .border(`1px solid ${palette('light').nav.border}`)
    .borderRadius(themeOptions.radii.lg)
    .padding('16px')
    .height('100%')
    .boxSizing('border-box')
  styleBuilder
    .select('.doc-nav', 'dark')
    .background(palette('dark').nav.background)
    .border(`1px solid ${palette('dark').nav.border}`)
    .borderRadius(themeOptions.radii.lg)
    .padding('16px')
    .height('100%')
    .boxSizing('border-box')

  const baseDocList = (theme: string) =>
    styleBuilder
      .select('.doc-nav__list', theme)
      .listStyle('none')
      .margin('0')
      .padding('0')
      .display('grid')
      .gap('6px')

  baseDocList('light')
  baseDocList('dark')

  styleBuilder
    .select('.doc-nav__list .doc-nav__list', 'light')
    .paddingLeft('12px')
    .borderLeft(`1px solid ${palette('light').nav.nestedBorder}`)
  styleBuilder
    .select('.doc-nav__list .doc-nav__list', 'dark')
    .paddingLeft('12px')
    .borderLeft(`1px solid ${palette('dark').nav.nestedBorder}`)

  const baseDocItem = (theme: string) =>
    styleBuilder.select('.doc-nav__item', theme).display('grid')

  baseDocItem('light')
  baseDocItem('dark')

  const baseDocLink = (theme: string) =>
    styleBuilder
      .select('.doc-nav__item a', theme)
      .display('block')
      .padding('8px 12px')
      .borderRadius('10px')
      .textDecoration('none')
      .fontWeight('600')
      .transition('background 160ms ease, color 160ms ease')

  baseDocLink('light').color(palette('light').nav.text)
  baseDocLink('dark').color(palette('dark').nav.text)

  styleBuilder
    .select('.doc-nav__item a:hover', 'light')
    .background(palette('light').nav.hoverBackground)
  styleBuilder
    .select('.doc-nav__item a:hover', 'dark')
    .background(palette('dark').nav.hoverBackground)

  const baseDocText = (theme: string) =>
    styleBuilder
      .select('.doc-nav__item span', theme)
      .display('block')
      .padding('8px 12px')
      .borderRadius('10px')
      .fontWeight('600')

  baseDocText('light').color(palette('light').nav.textMuted)
  baseDocText('dark').color(palette('dark').nav.textMuted)

  const mobileShell = (theme: string) =>
    styleBuilder
      .select('.doc-shell', theme)
      .media('max-width: 1023px')
      .gridTemplateColumns('1fr')
      .padding('16px')

  mobileShell('light')
  mobileShell('dark')

  const mobileSidebar = (theme: string) =>
    styleBuilder
      .select('.template-doc--nav-drawer .doc-sidebar', theme)
      .media('max-width: 1023px')
      .position('fixed')
      .top('72px')
      .left('16px')
      .right('16px')
      .bottom('16px')
      .height('auto')
      .transform('translateX(-120%)')
      .transition('transform 220ms ease')
      .zIndex(35)
      .boxShadow(themeOptions.shadows.strong)

  mobileSidebar('light')
  mobileSidebar('dark')

  const mobileInlineSidebar = (theme: string) =>
    styleBuilder
      .select('.template-doc:not(.template-doc--nav-drawer) .doc-sidebar', theme)
      .media('max-width: 1023px')
      .position('static')
      .top('auto')
      .height('auto')

  mobileInlineSidebar('light')
  mobileInlineSidebar('dark')

  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-shell .doc-sidebar', 'light')
    .transform('translateX(0)')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-shell .doc-sidebar', 'dark')
    .transform('translateX(0)')
}
