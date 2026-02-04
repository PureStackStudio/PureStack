import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { getThemeOptions, getThemePalette } from '../../style/themeOptions'
import { resolveTsSsgContext } from '../resolveTsSsgContext'
import type { TsSsgContext } from '../ts-ssg-context'

interface HeroImage {
  file?: string
  src?: string
  alt?: string
}

interface HeroActionInput {
  text?: string
  label?: string
  link?: string
  href?: string
  icon?: string
  variant?: string
  target?: string
  rel?: string
  attrs?: Record<string, unknown>
}

interface HeroFrontmatter {
  title?: string
  tagline?: string
  eyebrow?: string
  image?: HeroImage
  actions?: HeroActionInput[]
}

interface HeroAction {
  text: string
  link: string
  icon?: string
  variant?: string
  target?: string
  rel?: string
}

interface HeroContext {
  hasHero: boolean
  title: string
  tagline: string
  eyebrow: string
  imageSrc: string
  imageAlt: string
  actionsHtml: string
  hasActions: boolean
}

const heroTemplate = html`<section class="hero" r-if="hasHero">
  <div class="hero__inner">
    <div class="hero__content">
      <p class="hero__eyebrow" r-if="eyebrow">{{ eyebrow }}</p>
      <h1 class="hero__title">{{ title }}</h1>
      <p class="hero__tagline" r-if="tagline">{{ tagline }}</p>
      <div class="hero__actions" r-if="hasActions" r-html="actionsHtml"></div>
    </div>
    <div class="hero__media" r-if="imageSrc">
      <div class="hero__logo-frame">
        <img class="hero__logo" :src="imageSrc" :alt="imageAlt" />
      </div>
    </div>
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

  const baseTagline = (theme: string) =>
    styleBuilder
      .select('.hero__tagline', theme)
      .margin('0')
      .fontSize('17px')
      .lineHeight('1.6')
      .whiteSpace('pre-line')

  baseTagline('light').color(palette('light').hero.tagline)
  baseTagline('dark').color(palette('dark').hero.tagline)

  const baseActions = (theme: string) =>
    styleBuilder
      .select('.hero__actions', theme)
      .display('flex')
      .flexWrap('wrap')
      .gap('16px')
      .alignItems('center')

  baseActions('light')
  baseActions('dark')

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
  return createComponent<HeroContext>(heroTemplate, {
    context: (head) => resolveHeroContext(resolveTsSsgContext(head)),
  })
}

export function createHeroComponents() {
  registerHeroStyles()
  return { heroBanner: createHeroBannerComponent() }
}

function resolveHeroContext(context: TsSsgContext): HeroContext {
  const frontmatter = context?.page?.frontmatter ?? {}
  const hero = isPlainObject(frontmatter.hero)
    ? (frontmatter.hero as HeroFrontmatter)
    : undefined
  const title =
    resolveString(hero?.title) || resolveString(frontmatter.title) || ''
  const tagline = resolveString(hero?.tagline) || ''
  const eyebrow = resolveString(hero?.eyebrow) || ''
  const image = isPlainObject(hero?.image) ? hero?.image : undefined
  const imageSrc = resolveString(image?.file) || resolveString(image?.src) || ''
  const imageAlt = resolveString(image?.alt) || title || 'Hero image'
  const actions = resolveHeroActions(hero?.actions)
  const actionsHtml = actions.map(renderHeroAction).join('')
  const hasHero = Boolean(
    title || tagline || imageSrc || actions.length > 0 || eyebrow,
  )
  return {
    hasHero,
    title,
    tagline,
    eyebrow,
    imageSrc,
    imageAlt,
    actionsHtml,
    hasActions: actions.length > 0,
  }
}

function resolveHeroActions(value: unknown): HeroAction[] {
  if (!Array.isArray(value)) return []
  const actions: HeroAction[] = []
  for (const raw of value) {
    if (!isPlainObject(raw)) continue
    const text =
      resolveString(raw.text) ||
      resolveString(raw.label) ||
      resolveString(raw.title)
    const link = resolveString(raw.link) || resolveString(raw.href)
    if (!text || !link) continue
    const icon = resolveString(raw.icon)
    const variant = resolveString(raw.variant)
    const attrs = isPlainObject(raw.attrs) ? raw.attrs : undefined
    const target =
      resolveString(attrs?.target) || resolveString(raw.target) || undefined
    const rel = resolveString(attrs?.rel) || resolveString(raw.rel) || undefined
    const safeRel =
      rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)
    actions.push({
      text,
      link,
      icon,
      variant,
      target,
      rel: safeRel,
    })
  }
  return actions
}

function renderHeroAction(action: HeroAction) {
  const variant =
    action.variant && action.variant.toLowerCase() === 'minimal'
      ? 'hero__action--minimal'
      : 'hero__action--primary'
  const attrs = [
    `class="hero__action ${variant}"`,
    `href="${escapeAttr(action.link)}"`,
  ]
  if (action.icon) {
    attrs.push(`data-icon="${escapeAttr(action.icon)}"`)
  }
  if (action.target) {
    attrs.push(`target="${escapeAttr(action.target)}"`)
  }
  if (action.rel) {
    attrs.push(`rel="${escapeAttr(action.rel)}"`)
  }
  return `<a ${attrs.join(' ')}>${escapeHtml(action.text)}</a>`
}

function resolveString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAttr(value: string) {
  return escapeHtml(value).replace(/"/g, '&quot;')
}
