import { defineComponent, html } from 'regor'

const logoTemplate = html`<div class="site-logo">
  <a class="site-logo__link" :href="href ?? '/'" :aria-label="ariaLabel">
    <span class="site-logo__glyph" aria-hidden="true">
      <Icon class="site-logo__icon" :name="icon" r-if="icon"/>
      <span class="site-logo__glyph-mark" r-else></span>
    </span>
    <span class="site-logo__stack">
      <span class="site-logo__brand">
        <span
          r-for="brandLetter in brandLetters"
          class="site-logo__brand-letter"
          :class="{
            'site-logo__brand-letter--primary': brandLetter.tone === 'primary',
            'site-logo__brand-letter--accent': brandLetter.tone === 'accent',
            'site-logo__brand-letter--space': brandLetter.isSpace,
          }"
        >
          {{ brandLetter.value }}
        </span>
      </span>
      <span class="site-logo__subtitle" r-if="subtitle">
        <span
          r-for="subtitleLetter in subtitleLetters"
          class="site-logo__subtitle-letter"
        >
          {{ subtitleLetter }}
        </span>
      </span>
    </span>
  </a>
</div>`

interface LogoLetter {
  value: string
  tone: 'primary' | 'accent'
  isSpace?: boolean
}

export interface SiteLogo {
  wordOne?: string
  wordTwo?: string
  brandLetters?: LogoLetter[]
  subtitle?: string
  subtitleLetters?: string[]
  href?: string
  icon?: string
  ariaLabel?: string
}

function resolveSiteLogo(props: SiteLogo): SiteLogo {
  const wordOne = props.wordOne
  const wordTwo = props.wordTwo
  const brandLetters = buildBrandLetters(wordOne, wordTwo)
  const subtitle = props.subtitle
  const subtitleLetters = subtitle
    ? [...subtitle].map((character) =>
        character === ' ' ? '\u00A0' : character,
      )
    : undefined
  const href = props.href
  const icon = props.icon
  const ariaLabel = props.ariaLabel

  return {
    wordOne,
    wordTwo,
    brandLetters,
    subtitle,
    subtitleLetters,
    href,
    icon,
    ariaLabel,
  }
}

function buildBrandLetters(
  wordOne: string | undefined,
  wordTwo: string | undefined,
): LogoLetter[] | undefined {
  const letters: LogoLetter[] = []

  if (wordOne) {
    letters.push(
      ...[...wordOne].map((character) => ({
        value: character === ' ' ? '\u00A0' : character,
        tone: 'primary' as const,
        isSpace: character === ' ',
      })),
    )
  }

  if (wordOne && wordTwo) {
    letters.push({
      value: '\u00A0',
      tone: 'primary',
      isSpace: true,
    })
  }

  if (wordTwo) {
    letters.push(
      ...[...wordTwo].map((character) => ({
        value: character === ' ' ? '\u00A0' : character,
        tone: 'accent' as const,
        isSpace: character === ' ',
      })),
    )
  }

  return letters.length > 0 ? letters : undefined
}

function defineSiteLogoComponent() {
  return defineComponent<SiteLogo>(logoTemplate, {
    props: ['wordOne', 'wordTwo', 'subtitle', 'href', 'icon'],
    context: (head) => resolveSiteLogo(head.props),
  })
}

export function defineLogoComponents() {
  return {
    siteLogo: defineSiteLogoComponent(),
  }
}
