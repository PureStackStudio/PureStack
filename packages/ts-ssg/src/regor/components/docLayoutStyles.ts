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

  const baseHeader = (theme: string) =>
    styleBuilder
      .select('.doc-header', theme)
      .set('display', 'none')
      .set('align-items', 'center')
      .set('justify-content', 'space-between')
      .set('gap', '16px')
      .set('padding', '16px')
      .set('position', 'sticky')
      .set('top', '0')
      .set('z-index', '40')
      .set('backdrop-filter', 'blur(10px)')
      .set('border-bottom', '1px solid transparent')

  baseHeader('light')
    .set('background', '#f8f9fd')
    .set('border-bottom-color', '#e1e4ef')
  baseHeader('dark')
    .set('background', '#222733')
    .set('border-bottom-color', '#2d3340')

  const baseLogo = (theme: string) =>
    styleBuilder
      .select('.doc-header__logo', theme)
      .set('font-size', '22px')
      .set('font-weight', 700)
      .set('text-decoration', 'none')

  baseLogo('light').set('color', '#2f4ea1')
  baseLogo('dark').set('color', '#a9c1ff')

  const baseActions = (theme: string) =>
    styleBuilder
      .select('.doc-header__actions', theme)
      .set('display', 'flex')
      .set('align-items', 'center')
      .set('gap', '10px')

  baseActions('light')
  baseActions('dark')

  const baseIcon = (theme: string) =>
    styleBuilder
      .select('.doc-header__icon', theme)
      .set('width', '42px')
      .set('height', '42px')
      .set('border-radius', '999px')
      .set('display', 'grid')
      .set('place-items', 'center')
      .set('border', '1px solid transparent')
      .set('background', 'transparent')
      .set('cursor', 'pointer')
      .set('position', 'relative')
      .set('padding', '0')

  baseIcon('light').set('color', '#3c4250')
  baseIcon('dark').set('color', '#d2d8e8')

  styleBuilder
    .select('.doc-header__toggle', 'light')
    .set('background', '#ffffff')
    .set('border-color', '#d8deee')
  styleBuilder
    .select('.doc-header__toggle', 'dark')
    .set('background', '#f3f5fb')
    .set('border-color', '#d7ddef')
    .set('color', '#1b2030')

  styleBuilder
    .select('.doc-header__search', 'light')
    .set('border', '0')
    .set('background', 'transparent')
  styleBuilder
    .select('.doc-header__search', 'dark')
    .set('border', '0')
    .set('background', 'transparent')

  const baseSearchBefore = (theme: string) =>
    styleBuilder
      .select('.doc-header__search::before', theme)
      .set('content', '""')
      .set('width', '16px')
      .set('height', '16px')
      .set('border', '2px solid currentColor')
      .set('border-radius', '50%')
      .set('position', 'absolute')
      .set('top', '11px')
      .set('left', '11px')

  baseSearchBefore('light')
  baseSearchBefore('dark')

  const baseSearchAfter = (theme: string) =>
    styleBuilder
      .select('.doc-header__search::after', theme)
      .set('content', '""')
      .set('width', '10px')
      .set('height', '2px')
      .set('background', 'currentColor')
      .set('position', 'absolute')
      .set('right', '9px')
      .set('bottom', '12px')
      .set('transform', 'rotate(45deg)')

  baseSearchAfter('light')
  baseSearchAfter('dark')

  const baseToggleBefore = (theme: string) =>
    styleBuilder
      .select('.doc-header__toggle::before', theme)
      .set('content', '""')
      .set('width', '18px')
      .set('height', '2px')
      .set('background', 'currentColor')
      .set('position', 'absolute')
      .set('top', '14px')
      .set('left', '12px')
      .set('transition', 'transform 200ms ease, top 200ms ease')
      .set('box-shadow', '0 6px 0 0 currentColor')

  baseToggleBefore('light')
  baseToggleBefore('dark')

  const baseToggleAfter = (theme: string) =>
    styleBuilder
      .select('.doc-header__toggle::after', theme)
      .set('content', '""')
      .set('width', '18px')
      .set('height', '2px')
      .set('background', 'currentColor')
      .set('position', 'absolute')
      .set('top', '26px')
      .set('left', '12px')
      .set('transition', 'transform 200ms ease, top 200ms ease')

  baseToggleAfter('light')
  baseToggleAfter('dark')

  styleBuilder
    .select('.doc-nav-toggle', 'light')
    .set('display', 'none')
  styleBuilder
    .select('.doc-nav-toggle', 'dark')
    .set('display', 'none')

  const baseOverlay = (theme: string) =>
    styleBuilder
      .select('.doc-overlay', theme)
      .set('position', 'fixed')
      .set('inset', '0')
      .set('background', 'rgba(8, 11, 18, 0.6)')
      .set('opacity', '0')
      .set('pointer-events', 'none')
      .set('transition', 'opacity 200ms ease')
      .set('z-index', '30')

  baseOverlay('light').set('background', 'rgba(20, 24, 33, 0.45)')
  baseOverlay('dark').set('background', 'rgba(8, 11, 18, 0.65)')

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

  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-overlay', 'light')
    .set('opacity', '1')
    .set('pointer-events', 'auto')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-overlay', 'dark')
    .set('opacity', '1')
    .set('pointer-events', 'auto')

  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-header .doc-header__toggle::before', 'light')
    .set('top', '20px')
    .set('transform', 'rotate(45deg)')
    .set('box-shadow', 'none')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-header .doc-header__toggle::before', 'dark')
    .set('top', '20px')
    .set('transform', 'rotate(45deg)')
    .set('box-shadow', 'none')

  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-header .doc-header__toggle::after', 'light')
    .set('top', '20px')
    .set('transform', 'rotate(-45deg)')
  styleBuilder
    .select('.doc-nav-toggle:checked ~ .doc-header .doc-header__toggle::after', 'dark')
    .set('top', '20px')
    .set('transform', 'rotate(-45deg)')

  const mobileShell = (theme: string) =>
    styleBuilder
      .select('.doc-shell', theme)
      .media('max-width: 1023px')
      .set('grid-template-columns', '1fr')
      .set('padding', '16px')

  mobileShell('light')
  mobileShell('dark')

  const mobileHeader = (theme: string) =>
    styleBuilder
      .select('.doc-header', theme)
      .media('max-width: 1023px')
      .set('display', 'flex')

  mobileHeader('light')
  mobileHeader('dark')

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
