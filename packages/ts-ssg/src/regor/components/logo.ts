import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import type { ThemeMode, ThemeOptions } from '../../style/themeOptions'
import { themes } from '../../style/themeOptions'
import type { ThemePalette } from '../../style/themePalette'

const logoTemplate = html`<div class="regor-logo">
  <a class="regor-logo__link" :href="href" :aria-label="ariaLabel" r-if="hasHref">
    <span class="regor-logo__glyph" aria-hidden="true"></span>
    <span class="regor-logo__stack">
      <span class="regor-logo__brand">
        <span class="regor-logo__word regor-logo__word--primary">{{ wordOne }}</span>
        <span class="regor-logo__word regor-logo__word--accent">{{ wordTwo }}</span>
      </span>
      <span class="regor-logo__subtitle" r-if="hasSubtitle">{{ subtitle }}</span>
    </span>
  </a>
  <div class="regor-logo__link" :aria-label="ariaLabel" r-else>
    <span class="regor-logo__glyph" aria-hidden="true"></span>
    <span class="regor-logo__stack">
      <span class="regor-logo__brand">
        <span class="regor-logo__word regor-logo__word--primary">{{ wordOne }}</span>
        <span class="regor-logo__word regor-logo__word--accent">{{ wordTwo }}</span>
      </span>
      <span class="regor-logo__subtitle" r-if="hasSubtitle">{{ subtitle }}</span>
    </span>
  </div>
</div>`

interface RegorLogoProps {
  wordOne?: string
  wordTwo?: string
  subtitle?: string
  href?: string
}

interface RegorLogoContext {
  wordOne: string
  wordTwo: string
  subtitle: string
  href: string
  ariaLabel: string
  hasSubtitle: boolean
  hasHref: boolean
}

function registerLogoStyles() {
  themes.forEach((theme, palette, options) => {
    registerLogoShellStyles(theme, palette, options)
    registerLogoTextStyles(theme, palette, options)
    registerLogoInteractiveStyles(theme, palette)
    registerLogoResponsiveStyles(theme)
  })
}

function registerLogoShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder.select('.regor-logo', theme).display('inline-block')

  styleBuilder
    .select('.regor-logo__link', theme)
    .display('inline-flex')
    .alignItems('center')
    .gap('12px')
    .padding('10px 14px')
    .borderRadius(options.radii.pill)
    .border(`1px solid ${palette.border.subtle}`)
    .textDecoration('none')
    .position('relative')
    .overflow('hidden')
    .background(palette.background.panel)
    .boxShadow(palette.effect.panelShadow)

  styleBuilder
    .select('.regor-logo__link::before', theme)
    .content('""')
    .position('absolute')
    .inset('0')
    .opacity('0.48')
    .pointerEvents('none')
    .background(
      `linear-gradient(135deg, ${palette.icon.accent.gradient} 0%, ${palette.background.panel} 70%)`,
    )

  styleBuilder
    .select('.regor-logo__glyph', theme)
    .width('36px')
    .height('36px')
    .borderRadius(options.radii.md)
    .display('inline-block')
    .position('relative')
    .zIndex('1')
    .background(palette.icon.accent.gradient)
    .border(`1px solid ${palette.icon.accent.ring}`)
    .boxShadow(palette.effect.interactiveShadow)

  styleBuilder
    .select('.regor-logo__glyph::before', theme)
    .content('""')
    .position('absolute')
    .inset('9px 10px')
    .borderRadius('4px')
    .background(palette.icon.accent.color)
}

function registerLogoTextStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.regor-logo__stack', theme)
    .display('grid')
    .alignItems('center')
    .gap('1px')
    .position('relative')
    .zIndex('1')

  styleBuilder
    .select('.regor-logo__brand', theme)
    .display('inline-flex')
    .alignItems('baseline')
    .gap('3px')
    .whiteSpace('nowrap')

  styleBuilder
    .select('.regor-logo__word', theme)
    .fontFamily(options.typography.baseFamily)
    .fontSize('15px')
    .lineHeight('1')
    .fontWeight('800')
    .letterSpacing('0.03em')
    .textTransform('uppercase')

  styleBuilder
    .select('.regor-logo__word--primary', theme)
    .color(palette.text.default)

  styleBuilder
    .select('.regor-logo__word--accent', theme)
    .color(palette.text.accent)

  styleBuilder
    .select('.regor-logo__subtitle', theme)
    .fontSize('7.8px')
    .lineHeight('1.2')
    .fontWeight('700')
    .letterSpacing('0.08em')
    .textTransform('uppercase')
    .color(palette.text.subtle)
}

function registerLogoInteractiveStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.regor-logo__link[href]', theme)
    .cursor('pointer')
    .transition(
      'transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
    )

  styleBuilder
    .select('.regor-logo__link[href]:hover', theme)
    .transform('translateY(-1px)')
    .borderColor(palette.border.accent)
    .boxShadow(palette.effect.accentShadow)

  styleBuilder
    .select('.regor-logo__link[href]:focus-visible', theme)
    .outline(`2px solid ${palette.border.focus}`)
    .outlineOffset('2px')
}

function registerLogoResponsiveStyles(theme: ThemeMode) {
  styleBuilder
    .select('.regor-logo__link', theme)
    .media('max-width: 640px')
    .padding('9px 12px')
    .gap('10px')

  styleBuilder
    .select('.regor-logo__glyph', theme)
    .media('max-width: 640px')
    .width('32px')
    .height('32px')

  styleBuilder
    .select('.regor-logo__word', theme)
    .media('max-width: 640px')
    .fontSize('13px')

  styleBuilder
    .select('.regor-logo__subtitle', theme)
    .media('max-width: 640px')
    .fontSize('8px')
}

function resolveLogoContext(props: RegorLogoProps): RegorLogoContext {
  const wordOne = normalizeWord(props.wordOne, 'Pure')
  const wordTwo = normalizeWord(props.wordTwo, 'Stack')
  const subtitle = normalizeOptionalText(props.subtitle)
  const href = normalizeOptionalText(props.href)
  const hasSubtitle = subtitle.length > 0
  const hasHref = href.length > 0
  const ariaLabel = hasSubtitle
    ? `${wordOne} ${wordTwo}: ${subtitle}`
    : `${wordOne} ${wordTwo}`
  return {
    wordOne,
    wordTwo,
    subtitle,
    href,
    ariaLabel,
    hasSubtitle,
    hasHref,
  }
}

function normalizeWord(value: string | undefined, fallback: string): string {
  const trimmed = normalizeOptionalText(value)
  return trimmed.length > 0 ? trimmed : fallback
}

function normalizeOptionalText(value: string | undefined): string {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function createRegorLogoComponent() {
  return createComponent<RegorLogoContext>(logoTemplate, {
    props: ['wordOne', 'wordTwo', 'subtitle', 'href'],
    context: (head) => resolveLogoContext(head.props),
  })
}

export function createLogoComponents() {
  registerLogoStyles()
  return { regorLogo: createRegorLogoComponent() }
}
