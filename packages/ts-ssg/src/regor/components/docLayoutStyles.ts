import { styleBuilder } from '../../style/styles'

export function registerDocLayoutStyles() {
  const baseDoc = (theme: string) =>
    styleBuilder
      .select('.template-doc', theme)
      .set('margin', '0')
      .set('min-height', '100vh')
      .set('font-family', "'Manrope', 'Segoe UI', system-ui, sans-serif")
      .set('background', theme === 'dark' ? '#14171d' : '#f5f7fb')
      .set('color', theme === 'dark' ? '#e7eaf3' : '#1f2937')

  baseDoc('light')
  baseDoc('dark')

  const baseShell = (theme: string) =>
    styleBuilder
      .select('.doc-shell', theme)
      .set('display', 'grid')
      .set('gap', '28px')
      .set('padding', '32px')
      .set('max-width', '1200px')
      .set('margin', '0 auto')
      .set('width', '100%')
      .set('box-sizing', 'border-box')
      .set('grid-template-columns', '260px minmax(0, 1fr)')

  baseShell('light')
  baseShell('dark')

  const singleShell = (theme: string) =>
    styleBuilder
      .select('.doc-shell--single', theme)
      .set('grid-template-columns', '1fr')

  singleShell('light')
  singleShell('dark')

  const baseMain = (theme: string) =>
    styleBuilder.select('.doc-main', theme).set('min-width', '0')
  baseMain('light')
  baseMain('dark')

  const baseContent = (theme: string) =>
    styleBuilder
      .select('.doc-content', theme)
      .set('max-width', '920px')
      .set('margin', '0')
      .set('padding', '8px 0 80px')

  baseContent('light')
  baseContent('dark')

  const baseSidebar = (theme: string) =>
    styleBuilder
      .select('.doc-sidebar', theme)
      .set('position', 'sticky')
      .set('top', '24px')
      .set('align-self', 'start')
      .set('height', 'calc(100vh - 48px)')
      .set('overflow', 'auto')

  baseSidebar('light')
  baseSidebar('dark')

  styleBuilder
    .select('.doc-nav', 'light')
    .set('background', '#f6f7fb')
    .set('border', '1px solid #e1e4ef')
    .set('border-radius', '16px')
    .set('padding', '16px')
    .set('height', '100%')
    .set('box-sizing', 'border-box')
  styleBuilder
    .select('.doc-nav', 'dark')
    .set('background', '#1b1f27')
    .set('border', '1px solid #2a2f38')
    .set('border-radius', '16px')
    .set('padding', '16px')
    .set('height', '100%')
    .set('box-sizing', 'border-box')

  const baseDocList = (theme: string) =>
    styleBuilder
      .select('.doc-nav__list', theme)
      .set('list-style', 'none')
      .set('margin', '0')
      .set('padding', '0')
      .set('display', 'grid')
      .set('gap', '6px')

  baseDocList('light')
  baseDocList('dark')

  styleBuilder
    .select('.doc-nav__list .doc-nav__list', 'light')
    .set('padding-left', '12px')
    .set('border-left', '1px solid #d9deee')
  styleBuilder
    .select('.doc-nav__list .doc-nav__list', 'dark')
    .set('padding-left', '12px')
    .set('border-left', '1px solid #2b313c')

  const baseDocItem = (theme: string) =>
    styleBuilder.select('.doc-nav__item', theme).set('display', 'grid')

  baseDocItem('light')
  baseDocItem('dark')

  const baseDocLink = (theme: string) =>
    styleBuilder
      .select('.doc-nav__item a', theme)
      .set('display', 'block')
      .set('padding', '8px 12px')
      .set('border-radius', '10px')
      .set('text-decoration', 'none')
      .set('font-weight', 600)
      .set('transition', 'background 160ms ease, color 160ms ease')

  baseDocLink('light').set('color', '#1f2937')
  baseDocLink('dark').set('color', '#e6e9f2')

  styleBuilder
    .select('.doc-nav__item a:hover', 'light')
    .set('background', '#e9edf7')
  styleBuilder
    .select('.doc-nav__item a:hover', 'dark')
    .set('background', '#262b35')

  const baseDocText = (theme: string) =>
    styleBuilder
      .select('.doc-nav__item span', theme)
      .set('display', 'block')
      .set('padding', '8px 12px')
      .set('border-radius', '10px')
      .set('font-weight', 600)

  baseDocText('light').set('color', '#4b5563')
  baseDocText('dark').set('color', '#b0b6c6')

  const mobileShell = (theme: string) =>
    styleBuilder
      .select('.doc-shell', theme)
      .media('max-width: 1023px')
      .set('grid-template-columns', '1fr')
      .set('padding', '16px')

  mobileShell('light')
  mobileShell('dark')

  const mobileSidebar = (theme: string) =>
    styleBuilder
      .select('.doc-sidebar', theme)
      .media('max-width: 1023px')
      .set('position', 'fixed')
      .set('top', '72px')
      .set('left', '16px')
      .set('right', '16px')
      .set('bottom', '16px')
      .set('height', 'auto')
      .set('transform', 'translateX(-120%)')
      .set('transition', 'transform 220ms ease')
      .set('z-index', '35')
      .set('box-shadow', '0 20px 40px rgba(0, 0, 0, 0.4)')

  mobileSidebar('light')
  mobileSidebar('dark')

  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-shell .doc-sidebar', 'light')
    .set('transform', 'translateX(0)')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-shell .doc-sidebar', 'dark')
    .set('transform', 'translateX(0)')
}
