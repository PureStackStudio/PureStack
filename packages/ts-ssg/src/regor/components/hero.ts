import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import type { ThemeMode, ThemeOptions } from '../../style/themeOptions'
import { themes } from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'

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

interface HeroActionContext extends HeroActionProps {
  className: string
  hasHref: boolean
  hasIcon: boolean
  hasTarget: boolean
  hasRel: boolean
}

interface HeroMediaProps {
  src?: string
  alt?: string
}

interface HeroMediaContext extends HeroMediaProps {
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
    .border(`1px solid ${palette.border.subtle}`)
    .background(palette.background.showcase)
    .boxShadow(options.shadows.soft)
    .margin('0 0 32px')
    .color(palette.text.default)

  styleBuilder
    .select('.hero::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .opacity('0.35')
    .background(palette.effect.glowPrimary)
    .pointerEvents('none')

  styleBuilder
    .select('.hero__inner', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1.1fr) minmax(0, 0.9fr)')
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
    .color(palette.text.subtle)

  styleBuilder
    .select('.hero__title', theme)
    .margin('0')
    .fontSize('clamp(36px, 5vw, 60px)')
    .lineHeight('1.05')
    .letterSpacing('-0.02em')
    .fontWeight('700')
    .color(palette.text.default)

  styleBuilder.select('.hero__title:empty', theme).display('none')

  styleBuilder
    .select('.hero__tagline', theme)
    .margin('0')
    .fontSize('17px')
    .lineHeight('1.6')
    .whiteSpace('pre-line')
    .color(palette.text.subtle)

  styleBuilder.select('.hero__tagline:empty', theme).display('none')
  styleBuilder.select('.hero__eyebrow:empty', theme).display('none')
}

function applyHeroActionStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  applyHeroActionShellStyles(theme, palette, options)
  applyHeroActionVariantStyles(theme, palette)
  applyHeroActionIconStyles(theme)
}

function applyHeroActionShellStyles(
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
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
}

function applyHeroActionVariantStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.hero__action--primary', theme)
    .background(palette.action.accent.background)
    .color(palette.action.accent.text)
    .boxShadow(palette.effect.accentShadow)

  styleBuilder
    .select('.hero__action--primary:hover', theme)
    .background(palette.action.accent.hover)
    .transform('translateY(-1px)')

  styleBuilder
    .select('.hero__action--minimal', theme)
    .color(palette.action.neutral.text)
    .borderColor(palette.border.strong)

  styleBuilder
    .select('.hero__action--minimal:hover', theme)
    .background(palette.action.neutral.hover)
}

function applyHeroActionIconStyles(theme: ThemeMode) {
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
    .background(palette.background.panel)
    .border(`1px solid ${palette.border.subtle}`)
    .boxShadow(palette.effect.floatingShadow)

  styleBuilder
    .select('.hero__logo', theme)
    .width('100%')
    .height('auto')
    .display('block')
}

function applyHeroResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.hero__inner', theme)
    .media('max-width: 980px')
    .gridTemplateColumns('1fr')
    .gap('24px')

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
  const normalizedVariant = props.variant?.toLowerCase()
  const className =
    normalizedVariant === 'primary'
      ? 'hero__action--primary'
      : 'hero__action--minimal'
  const rel =
    props.rel || (props.target === '_blank' ? 'noopener noreferrer' : '')
  return {
    ...props,
    className,
    rel,
    hasHref: Boolean(props.href),
    hasIcon: Boolean(props.icon),
    hasTarget: Boolean(props.target),
    hasRel: Boolean(rel),
  }
}

function resolveHeroMediaContext(props: HeroMediaProps): HeroMediaContext {
  return {
    ...props,
    alt: props.alt || 'Hero image',
    hasMedia: Boolean(props.src),
  }
}
