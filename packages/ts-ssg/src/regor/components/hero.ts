import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { getThemeOptions, getThemePalette } from '../../style/themeOptions'

export interface ThemeHeroColors {
  background: string
  border: string
  title: string
  tagline: string
  eyebrow: string
  focusRing: string
  primaryBackground: string
  primaryText: string
  primaryHover: string
  primaryShadow: string
  secondaryText: string
  secondaryHover: string
  secondaryBorder: string
  logoBackground: string
  logoBorder: string
  logoShadow: string
  glow: string
}

const heroTemplate = html`<section class="hero">
  <div class="hero__inner">
    <div class="hero__content">
      <p class="hero__eyebrow"><slot name="eyebrow"></slot></p>
      <h1 class="hero__title"><slot name="title"></slot></h1>
      <p class="hero__tagline"><slot name="tagline"></slot></p>
      <div class="hero__actions"><slot name="actions"></slot></div>
    </div>
    <div class="hero__media"><slot name="media"></slot></div>
  </div>
</section>`

function registerHeroStyles() {
  const themeOptions = getThemeOptions()
  const palette = (theme: string) => getThemePalette(theme, themeOptions)

  const baseHero = (theme: string) =>
    styleBuilder
      .select('.hero', theme)
      .position('relative')
      .overflow('hidden')
      .padding('28px')
      .borderRadius(themeOptions.radii.lg)
      .border(`1px solid ${palette(theme).hero.border}`)
      .background(palette(theme).hero.background)
      .boxShadow(themeOptions.shadows.soft)
      .margin('0 0 32px')
      .color(palette(theme).hero.title)

  baseHero('light')
  baseHero('dark')

  const baseHeroBefore = (theme: string) =>
    styleBuilder
      .select('.hero::before', theme)
      .content('""')
      .position('absolute')
      .inset('0')
      .opacity('0.35')
      .background(palette(theme).hero.glow)
      .pointerEvents('none')

  baseHeroBefore('light')
  baseHeroBefore('dark')

  const baseInner = (theme: string) =>
    styleBuilder
      .select('.hero__inner', theme)
      .display('grid')
      .gridTemplateColumns('minmax(0, 1.1fr) minmax(0, 0.9fr)')
      .gap('32px')
      .alignItems('center')
      .position('relative')
      .zIndex('1')

  baseInner('light')
  baseInner('dark')

  const baseContent = (theme: string) =>
    styleBuilder
      .select('.hero__content', theme)
      .display('grid')
      .gap('16px')
      .maxWidth('640px')

  baseContent('light')
  baseContent('dark')

  const baseEyebrow = (theme: string) =>
    styleBuilder
      .select('.hero__eyebrow', theme)
      .textTransform('uppercase')
      .letterSpacing('0.12em')
      .fontSize('11px')
      .fontWeight('700')

  baseEyebrow('light').color(palette('light').hero.eyebrow)
  baseEyebrow('dark').color(palette('dark').hero.eyebrow)

  const baseTitle = (theme: string) =>
    styleBuilder
      .select('.hero__title', theme)
      .margin('0')
      .fontSize('clamp(36px, 5vw, 60px)')
      .lineHeight('1.05')
      .letterSpacing('-0.02em')
      .fontWeight('700')

  baseTitle('light').color(palette('light').hero.title)
  baseTitle('dark').color(palette('dark').hero.title)

  const baseEmptyTitle = (theme: string) =>
    styleBuilder.select('.hero__title:empty', theme).display('none')
  baseEmptyTitle('light')
  baseEmptyTitle('dark')

  const baseTagline = (theme: string) =>
    styleBuilder
      .select('.hero__tagline', theme)
      .margin('0')
      .fontSize('17px')
      .lineHeight('1.6')
      .whiteSpace('pre-line')

  baseTagline('light').color(palette('light').hero.tagline)
  baseTagline('dark').color(palette('dark').hero.tagline)

  const baseEmptyTagline = (theme: string) =>
    styleBuilder.select('.hero__tagline:empty', theme).display('none')
  baseEmptyTagline('light')
  baseEmptyTagline('dark')

  const baseActions = (theme: string) =>
    styleBuilder
      .select('.hero__actions', theme)
      .display('flex')
      .flexWrap('wrap')
      .gap('16px')
      .alignItems('center')

  baseActions('light')
  baseActions('dark')

  const baseEmptyActions = (theme: string) =>
    styleBuilder.select('.hero__actions:empty', theme).display('none')
  baseEmptyActions('light')
  baseEmptyActions('dark')

  const baseAction = (theme: string) =>
    styleBuilder
      .select('.hero__action', theme)
      .display('inline-flex')
      .alignItems('center')
      .gap('8px')
      .padding('12px 22px')
      .borderRadius(themeOptions.radii.pill)
      .border('1px solid transparent')
      .fontWeight('600')
      .textDecoration('none')
      .cursor('pointer')
      .transition(
        'transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease, border-color 180ms ease',
      )

  baseAction('light')
  baseAction('dark')

  styleBuilder
    .select('.hero__action:focus-visible', 'light')
    .outline(`2px solid ${palette('light').hero.focusRing}`)
    .outlineOffset('2px')
  styleBuilder
    .select('.hero__action:focus-visible', 'dark')
    .outline(`2px solid ${palette('dark').hero.focusRing}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.hero__action--primary', 'light')
    .background(palette('light').hero.primaryBackground)
    .color(palette('light').hero.primaryText)
    .boxShadow(palette('light').hero.primaryShadow)
  styleBuilder
    .select('.hero__action--primary', 'dark')
    .background(palette('dark').hero.primaryBackground)
    .color(palette('dark').hero.primaryText)
    .boxShadow(palette('dark').hero.primaryShadow)

  styleBuilder
    .select('.hero__action--primary:hover', 'light')
    .background(palette('light').hero.primaryHover)
    .transform('translateY(-1px)')
  styleBuilder
    .select('.hero__action--primary:hover', 'dark')
    .background(palette('dark').hero.primaryHover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.hero__action--minimal', 'light')
    .color(palette('light').hero.secondaryText)
    .borderColor(palette('light').hero.secondaryBorder)
  styleBuilder
    .select('.hero__action--minimal', 'dark')
    .color(palette('dark').hero.secondaryText)
    .borderColor(palette('dark').hero.secondaryBorder)

  styleBuilder
    .select('.hero__action--minimal:hover', 'light')
    .background(palette('light').hero.secondaryHover)
  styleBuilder
    .select('.hero__action--minimal:hover', 'dark')
    .background(palette('dark').hero.secondaryHover)

  const baseActionArrow = (theme: string) =>
    styleBuilder
      .select('.hero__action[data-icon="right-arrow"]::after', theme)
      .content('""')
      .display('inline-block')
      .width('10px')
      .height('10px')
      .marginLeft('6px')
      .borderTop('2px solid currentColor')
      .borderRight('2px solid currentColor')
      .transform('rotate(45deg)')

  baseActionArrow('light')
  baseActionArrow('dark')

  const baseActionExternal = (theme: string) =>
    styleBuilder
      .select('.hero__action[data-icon="external"]::after', theme)
      .content('""')
      .display('inline-block')
      .width('10px')
      .height('10px')
      .marginLeft('8px')
      .borderTop('2px solid currentColor')
      .borderRight('2px solid currentColor')
      .transform('translateY(-1px)')

  baseActionExternal('light')
  baseActionExternal('dark')

  const baseMedia = (theme: string) =>
    styleBuilder
      .select('.hero__media', theme)
      .display('flex')
      .justifyContent('center')
      .alignItems('center')

  baseMedia('light')
  baseMedia('dark')

  const baseEmptyMedia = (theme: string) =>
    styleBuilder.select('.hero__media:empty', theme).display('none')
  baseEmptyMedia('light')
  baseEmptyMedia('dark')

  const baseEmptyEyebrow = (theme: string) =>
    styleBuilder.select('.hero__eyebrow:empty', theme).display('none')
  baseEmptyEyebrow('light')
  baseEmptyEyebrow('dark')

  const baseLogoFrame = (theme: string) =>
    styleBuilder
      .select('.hero__logo-frame', theme)
      .padding('18px 22px')
      .borderRadius(themeOptions.radii.lg)
      .background(palette(theme).hero.logoBackground)
      .border(`1px solid ${palette(theme).hero.logoBorder}`)
      .boxShadow(palette(theme).hero.logoShadow)

  baseLogoFrame('light')
  baseLogoFrame('dark')

  const baseLogo = (theme: string) =>
    styleBuilder
      .select('.hero__logo', theme)
      .maxWidth('360px')
      .width('100%')
      .height('auto')
      .display('block')

  baseLogo('light')
  baseLogo('dark')

  const mobileInner = (theme: string) =>
    styleBuilder
      .select('.hero__inner', theme)
      .media('max-width: 980px')
      .gridTemplateColumns('1fr')

  mobileInner('light')
  mobileInner('dark')

  const mobileContent = (theme: string) =>
    styleBuilder
      .select('.hero__content', theme)
      .media('max-width: 980px')
      .maxWidth('100%')

  mobileContent('light')
  mobileContent('dark')

  const mobileActions = (theme: string) =>
    styleBuilder
      .select('.hero__actions', theme)
      .media('max-width: 600px')
      .flexDirection('column')
      .alignItems('stretch')

  mobileActions('light')
  mobileActions('dark')

  const mobileAction = (theme: string) =>
    styleBuilder
      .select('.hero__action', theme)
      .media('max-width: 600px')
      .justifyContent('center')

  mobileAction('light')
  mobileAction('dark')
}

function createHeroBannerComponent() {
  return createComponent<Record<string, never>>(heroTemplate, {})
}

export function createHeroComponents() {
  registerHeroStyles()
  return { heroBanner: createHeroBannerComponent() }
}
