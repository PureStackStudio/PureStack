import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import type { ThemeMode, ThemeOptions, ThemePalette } from '../../style/themeOptions'
import { themes } from '../../style/themeOptions'

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

const heroActionTemplate = html`<a
  class="hero__action"
  :class="className"
  :href="href"
  r-if="hasHref"
  :data-icon="hasIcon ? icon : null"
  :target="hasTarget ? target : null"
  :rel="hasRel ? rel : null"
>
  <slot></slot>
</a>`

const heroMediaTemplate = html`<div class="hero__logo-frame" r-if="hasMedia">
  <img class="hero__logo" :src="src" :alt="alt" />
</div>`

interface HeroActionProps {
  href?: string
  variant?: string
  icon?: string
  target?: string
  rel?: string
}

interface HeroActionContext {
  href: string
  className: string
  icon: string
  target: string
  rel: string
  hasHref: boolean
  hasIcon: boolean
  hasTarget: boolean
  hasRel: boolean
}

interface HeroMediaProps {
  src?: string
  alt?: string
}

interface HeroMediaContext {
  src: string
  alt: string
  hasMedia: boolean
}

function registerHeroStyles() {
  themes.forEach((theme, palette, options) => {
    applyHeroShellStyles(theme, palette, options)
    applyHeroContentStyles(theme, palette)
    applyHeroActionStyles(theme, palette, options)
    applyHeroMediaStyles(theme, palette, options)
    applyHeroResponsiveStyles(theme)
  })
}

function applyHeroShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.hero', theme)
    .position('relative')
    .overflow('hidden')
    .padding('28px')
    .borderRadius(options.radii.lg)
    .border(`1px solid ${palette.hero.border}`)
    .background(palette.hero.background)
    .boxShadow(options.shadows.soft)
    .margin('0 0 32px')
    .color(palette.hero.title)

  styleBuilder
    .select('.hero::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .opacity('0.35')
    .background(palette.hero.glow)
    .pointerEvents('none')

  styleBuilder
    .select('.hero__inner', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1.1fr) minmax(0, 0.9fr)')
    .gap('32px')
    .alignItems('center')
    .position('relative')
    .zIndex('1')
}

function applyHeroContentStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.hero__content', theme)
    .display('grid')
    .gap('16px')
    .maxWidth('640px')

  styleBuilder
    .select('.hero__eyebrow', theme)
    .textTransform('uppercase')
    .letterSpacing('0.12em')
    .fontSize('11px')
    .fontWeight('700')
    .color(palette.hero.eyebrow)

  styleBuilder
    .select('.hero__title', theme)
    .margin('0')
    .fontSize('clamp(36px, 5vw, 60px)')
    .lineHeight('1.05')
    .letterSpacing('-0.02em')
    .fontWeight('700')
    .color(palette.hero.title)

  styleBuilder.select('.hero__title:empty', theme).display('none')

  styleBuilder
    .select('.hero__tagline', theme)
    .margin('0')
    .fontSize('17px')
    .lineHeight('1.6')
    .whiteSpace('pre-line')
    .color(palette.hero.tagline)

  styleBuilder.select('.hero__tagline:empty', theme).display('none')
  styleBuilder.select('.hero__eyebrow:empty', theme).display('none')
}

function applyHeroActionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.hero__actions', theme)
    .display('flex')
    .flexWrap('wrap')
    .gap('16px')
    .alignItems('center')

  styleBuilder.select('.hero__actions:empty', theme).display('none')

  styleBuilder
    .select('.hero__action', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('8px')
    .padding('12px 22px')
    .borderRadius(options.radii.pill)
    .border('1px solid transparent')
    .fontWeight('600')
    .textDecoration('none')
    .cursor('pointer')
    .transition(
      'transform 180ms ease, box-shadow 180ms ease, background 180ms ease, color 180ms ease, border-color 180ms ease',
    )

  styleBuilder
    .select('.hero__action:focus-visible', theme)
    .outline(`2px solid ${palette.hero.focusRing}`)
    .outlineOffset('2px')

  styleBuilder
    .select('.hero__action--primary', theme)
    .background(palette.hero.primaryBackground)
    .color(palette.hero.primaryText)
    .boxShadow(palette.hero.primaryShadow)

  styleBuilder
    .select('.hero__action--primary:hover', theme)
    .background(palette.hero.primaryHover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.hero__action--minimal', theme)
    .color(palette.hero.secondaryText)
    .borderColor(palette.hero.secondaryBorder)

  styleBuilder
    .select('.hero__action--minimal:hover', theme)
    .background(palette.hero.secondaryHover)

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
}

function applyHeroMediaStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.hero__media', theme)
    .display('flex')
    .justifyContent('center')
    .alignItems('center')

  styleBuilder.select('.hero__media:empty', theme).display('none')

  styleBuilder
    .select('.hero__logo-frame', theme)
    .padding('18px 22px')
    .borderRadius(options.radii.lg)
    .background(palette.hero.logoBackground)
    .border(`1px solid ${palette.hero.logoBorder}`)
    .boxShadow(palette.hero.logoShadow)

  styleBuilder
    .select('.hero__logo', theme)
    .maxWidth('360px')
    .width('100%')
    .height('auto')
    .display('block')
}

function applyHeroResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.hero__inner', theme)
    .media('max-width: 980px')
    .gridTemplateColumns('1fr')

  styleBuilder
    .select('.hero__content', theme)
    .media('max-width: 980px')
    .maxWidth('100%')

  styleBuilder
    .select('.hero__actions', theme)
    .media('max-width: 600px')
    .flexDirection('column')
    .alignItems('stretch')

  styleBuilder
    .select('.hero__action', theme)
    .media('max-width: 600px')
    .justifyContent('center')
}

function createHeroBannerComponent() {
  return createComponent<Record<string, never>>(heroTemplate, {})
}

function createHeroActionComponent() {
  return createComponent<HeroActionContext>(heroActionTemplate, {
    props: ['href', 'variant', 'icon', 'target', 'rel'],
    context: (head) => resolveHeroActionContext(head.props),
  })
}

function createHeroMediaComponent() {
  return createComponent<HeroMediaContext>(heroMediaTemplate, {
    props: ['src', 'alt'],
    context: (head) => resolveHeroMediaContext(head.props),
  })
}

export function createHeroComponents() {
  registerHeroStyles()
  return {
    heroBanner: createHeroBannerComponent(),
    heroAction: createHeroActionComponent(),
    heroMedia: createHeroMediaComponent(),
  }
}

function resolveHeroActionContext(props: HeroActionProps): HeroActionContext {
  const href = resolveString(props.href)
  const normalizedVariant = resolveString(props.variant).toLowerCase()
  const variant =
    normalizedVariant === 'primary'
      ? 'hero__action--primary'
      : 'hero__action--minimal'
  const icon = resolveString(props.icon)
  const target = resolveString(props.target)
  const relRaw = resolveString(props.rel)
  const rel = relRaw || (target === '_blank' ? 'noopener noreferrer' : '')
  return {
    href,
    className: variant,
    icon,
    target,
    rel,
    hasHref: Boolean(href),
    hasIcon: Boolean(icon),
    hasTarget: Boolean(target),
    hasRel: Boolean(rel),
  }
}

function resolveHeroMediaContext(props: HeroMediaProps): HeroMediaContext {
  const src = resolveString(props.src)
  const alt = resolveString(props.alt)
  return {
    src,
    alt: alt || 'Hero image',
    hasMedia: Boolean(src),
  }
}

function resolveString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}
