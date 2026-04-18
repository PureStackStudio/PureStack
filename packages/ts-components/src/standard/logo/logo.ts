import { defineComponent, html } from 'regor'

const logoTemplate = html`<div class="site-logo">
  <a class="site-logo__link" :href="href ?? '/'" :aria-label="ariaLabel">
    <span class="site-logo__glyph" aria-hidden="true">
      <Icon class="site-logo__icon" :name="icon" r-if="icon"/>
      <span class="site-logo__glyph-mark" r-else></span>
    </span>
    <span class="site-logo__stack">
      <span class="site-logo__brand">
        <span class="site-logo__word site-logo__word--primary">
          {{ wordOne }}
        </span>
        <span class="site-logo__word site-logo__word--accent">
          {{ wordTwo }}
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

export interface SiteLogo {
  wordOne?: string
  wordTwo?: string
  subtitle?: string
  subtitleLetters?: string[]
  href?: string
  icon?: string
  ariaLabel?: string
}

function resolveSiteLogo(props: SiteLogo): SiteLogo {
  const wordOne = props.wordOne
  const wordTwo = props.wordTwo
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
    subtitle,
    subtitleLetters,
    href,
    icon,
    ariaLabel,
  }
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
