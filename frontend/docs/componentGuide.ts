import {
  BREAKPOINTS,
  mediaBelow,
  styleBuilder,
  themes,
} from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue } from 'regor'

export interface ComponentHeader {
  name: RefOrValue<string>
  summary: RefOrValue<string>
  source: RefOrValue<string>
  kind: RefOrValue<string>
  section?: RefOrValue<string>
  sectionHref?: RefOrValue<string>
}

export interface ComponentExample {
  label: RefOrValue<string>
  caption: RefOrValue<string>
}

export function defineComponentGuideComponents() {
  return {
    ComponentHeader: defineComponent<ComponentHeader>(
      html`<header class="component-header">
      <div class="component-header__top">
        <div class="component-header__identity"><code>{{ name }}</code><span>{{ kind }}</span></div>
        <nav class="component-header__links" aria-label="Component resources">
          <a href="#api-reference">API <span aria-hidden="true">↗</span></a>
          <a :href="source" target="_blank" rel="noopener noreferrer">Source <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
      <p class="component-header__summary">{{ summary }}</p>
      <a class="component-header__back" :href="sectionHref">{{ section }} <span aria-hidden="true">↗</span></a>
    </header>`,
      {
        props: ['name', 'summary', 'source', 'kind', 'section', 'sectionHref'],
        context: (head) => ({
          ...head.props,
          section: head.props.section ?? 'Actions & feedback',
          sectionHref: head.props.sectionHref ?? '/components/actions/',
        }),
      },
    ),
    ComponentExample: defineComponent<ComponentExample>(
      html`<section class="component-example" :aria-label="label">
      <header class="component-example__heading"><span class="component-example__dot" aria-hidden="true"></span><strong>{{ label }}</strong><span class="component-example__tag">COMPOSITION</span></header>
      <div class="component-example__stage"><slot></slot></div>
      <p class="component-example__caption">{{ caption }}</p>
    </section>`,
      { props: ['label', 'caption'] },
    ),
  }
}

export function registerComponentGuideStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    const neutral = palette.semanticTone.neutral
    const accent = palette.semanticTone.accent
    root.select('.runtime-code').css({
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere',
      fontSize: '0.75rem',
      padding: '1rem',
    })
    root.select('.runtime-code code').css({ whiteSpace: 'inherit' })
    root
      .select('app[data-review-counter]')
      .css({ display: 'block', minWidth: '0' })
    root.select('.component-guide-card > .badge').css({ alignSelf: 'start' })
    root.select('.layout-demo-track').css({
      minHeight: '7rem',
      padding: '0.75rem',
      border: `1px dashed ${accent.border.subtle}`,
      borderRadius: '0.5rem',
      background: neutral.surface.rest.background,
      gap: '0.5rem',
    })
    root.select('.layout-demo-item').css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '2rem',
      padding: '0.5rem',
      borderRadius: '0.4rem',
      background: accent.surface.rest.background,
      color: accent.text.default,
      fontWeight: '600',
    })
    root
      .select('.layout-demo-item--tall')
      .css({ minHeight: '4rem', fontSize: '1.3rem' })
    root.select('.layout-demo-scroll').css({ overflowX: 'auto', minWidth: '0' })
    root
      .select('.layout-demo-track--narrow')
      .css({ width: '9rem', minHeight: '7rem' })
    root.select('.layout-grid-demo').css({ gap: '0.25rem', minWidth: '0' })
    root.select('.layout-grid-tile').css({
      padding: '0.65rem 0',
      textAlign: 'center',
      minWidth: '0',
      fontSize: '0.6rem',
      borderRadius: '0.25rem',
      background: accent.surface.rest.background,
      color: accent.text.default,
    })
    root.select('.layout-icon-sample').css({
      display: 'inline-flex',
      justifyContent: 'center',
      color: accent.text.default,
    })
    root.select('.layout-icon-sample--sm').css({ fontSize: '1rem' })
    root.select('.layout-icon-sample--md').css({ fontSize: '1.75rem' })
    root.select('.layout-icon-sample--lg').css({ fontSize: '2.5rem' })
    root
      .media('min-width: 640px')
      .select('.layout-featured-card')
      .css({ gridColumn: 'span 2' })
    root.select('.component-header').css({
      position: 'relative',
      overflow: 'hidden',
      padding: '1rem 1.25rem',
      margin: '0.75rem 0 1.5rem',
      border: `1px solid ${neutral.border.subtle}`,
      borderLeft: `3px solid ${accent.border.default}`,
      borderRadius: '0.75rem',
      background: `radial-gradient(ellipse at 100% 0%, ${accent.surface.rest.background}, transparent 70%), ${neutral.surface.rest.background}`,
    })
    root.select('.component-header__top').css({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: '0.6rem 1.25rem',
    })
    root.select('.component-header__back').css({
      fontSize: '0.75rem',
      color: neutral.text.subtle,
      textDecoration: 'none',
    })
    root.select('.component-header__identity').css({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: '0.4rem 0.75rem',
      minWidth: '0',
    })
    root.select('.component-header__identity code').css({
      color: accent.text.default,
      fontSize: '1rem',
      background: 'none',
      border: 'none',
      padding: '0',
      margin: '0',
      lineHeight: '1.4',
      overflowWrap: 'anywhere',
    })
    root
      .select('.component-header__identity span, .component-example__tag')
      .css({
        fontSize: '0.65rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: neutral.text.subtle,
      })
    root.select('.component-header__summary').css({
      fontSize: '0.95rem',
      lineHeight: '1.6',
      margin: '0.6rem 0 0.4rem',
    })
    root.select('.component-header__links').css({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      gap: '0.75rem',
      flexShrink: '0',
    })
    root.select('.component-header__links a').css({
      fontSize: '0.75rem',
      fontWeight: '600',
      textDecoration: 'none',
      color: accent.text.default,
    })
    root
      .select('.component-header a:hover')
      .css({ textDecoration: 'underline' })
    root.select('.component-example').css({
      margin: '1.5rem 0',
      border: `1px solid ${neutral.border.subtle}`,
      borderRadius: '1rem',
      background: neutral.surface.rest.background,
    })
    root.select('.component-example__heading').css({
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: '0.6rem',
      padding: '0.9rem 1.25rem',
      borderBottom: `1px solid ${neutral.border.subtle}`,
      fontSize: '0.8rem',
    })
    root.select('.component-example__dot').css({
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      background: accent.text.default,
    })
    root.select('.component-example__tag').css({ marginLeft: 'auto' })
    root.select('.component-example__stage').css({
      padding: 'clamp(1rem, 3vw, 2rem)',
      background: `radial-gradient(${neutral.border.subtle} 1px, transparent 1px)`,
      backgroundSize: '16px 16px',
      minWidth: '0',
    })
    root.select('.component-example__caption').css({
      margin: '0',
      padding: '0.9rem 1.25rem',
      borderTop: `1px solid ${neutral.border.subtle}`,
      fontSize: '0.8rem',
      color: neutral.text.subtle,
      lineHeight: '1.6',
    })
    root
      .select('.component-preview-stage')
      .css({ padding: 'clamp(1rem, 3vw, 2rem)', minWidth: '0' })
    root.select('.component-appearance-grid').css({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))',
      gap: '1rem',
      alignItems: 'start',
    })
    root.select('.component-appearance-cell').css({
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
      gap: '1rem',
      padding: '1rem',
      minWidth: '0',
      border: `1px solid ${neutral.border.subtle}`,
      borderRadius: '0.75rem',
      background: neutral.surface.rest.background,
    })
    root.select('.component-appearance-cell > code').css({
      fontSize: '0.75rem',
      color: neutral.text.subtle,
      background: 'none',
      border: 'none',
      padding: '0',
    })
    root.select('.forms-appearance-grid--composer').css({
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 24rem), 1fr))',
    })
    root.select('.data-chart-gallery').css({
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))',
    })
    root.select('.data-chart-gallery .component-appearance-cell > svg').css({
      alignSelf: 'center',
      maxWidth: '100%',
    })
    root
      .select(
        '.data-chart-gallery text, .component-example .bar-chart text, .component-example .line-chart text, .component-example .doughnut-chart text',
      )
      .css({ fill: 'currentColor' })
    root.select('.data-window-diagram').css({
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      padding: '1rem',
      border: `1px solid ${neutral.border.subtle}`,
      borderRadius: '0.75rem',
      background: neutral.surface.rest.background,
    })
    root.select('.data-window-diagram__spacer').css({
      padding: '0.75rem',
      textAlign: 'center',
      border: `1px dashed ${neutral.border.subtle}`,
      color: neutral.text.subtle,
      fontSize: '0.8rem',
    })
    root.select('.data-window-diagram__rows').css({
      padding: '1rem',
      borderLeft: `3px solid ${accent.text.default}`,
      background: accent.surface.rest.background,
    })
    root.select('.forms-copy-sample').css({
      border: 'none',
      padding: '0',
      margin: '0',
      minWidth: '0',
    })
    root.select('.forms-composer-card').css({
      width: '100%',
      padding: '1rem',
      border: `1px solid ${neutral.border.subtle}`,
      borderRadius: '0.75rem',
      background: neutral.surface.rest.background,
    })
    root
      .select('.component-appearance-cell > .btn-group__dropdown')
      .css({ alignSelf: 'start' })
    root.select('.component-directory-lead').css({
      fontSize: 'clamp(1.4rem, 3vw, 2rem)',
      lineHeight: '1.35',
      fontWeight: '600',
      maxWidth: '34rem',
      color: accent.text.default,
    })
    root.select('.component-recipe').css({
      padding: '1.5rem',
      border: `1px solid ${neutral.border.subtle}`,
      borderRadius: '0.85rem',
      background: neutral.surface.rest.background,
      boxShadow: '0 8px 24px rgb(0 0 0 / 0.06)',
    })
    root
      .select('.component-recipe h3')
      .css({ margin: '0.4rem 0 0.75rem', fontSize: '1.25rem' })
    root
      .select('.component-recipe > p')
      .css({ margin: '0.5rem 0 1.25rem', color: neutral.text.subtle })
    root.select('.component-guide-grid').css({
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      gap: '1rem',
    })
    root.select('.component-guide-card').css({
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      border: `1px solid ${neutral.border.subtle}`,
      borderRadius: '1rem',
      background: neutral.surface.rest.background,
      minWidth: '0',
    })
    root
      .select('.component-guide-card h3')
      .css({ margin: '1.25rem 0 0.5rem', overflowWrap: 'anywhere' })
    root
      .select('.component-guide-card > p')
      .css({ color: neutral.text.subtle, fontSize: '0.9rem', flexGrow: '1' })
    root.select('.component-guide-card__preview').css({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '0.5rem',
      minHeight: '6rem',
      padding: '1rem',
      borderRadius: '0.75rem',
      background: accent.surface.rest.background,
    })
    root.select('.component-guide-card > a').css({
      fontWeight: '600',
      fontSize: '0.85rem',
      color: accent.text.default,
    })
    root
      .select('.landing-appearance-sample, .landing-directory-preview > *')
      .css({
        width: '100%',
        minWidth: '0',
      })
    root
      .select('.landing-appearance-sample > *, .landing-directory-preview > *')
      .css({
        marginBottom: '0',
      })
    root
      .select('.landing-appearance-gallery pre, .landing-directory-preview pre')
      .css({
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
      })
    root
      .select(
        '.landing-appearance-gallery .grid, .landing-directory-preview .grid',
      )
      .css({
        gridTemplateColumns: 'minmax(0, 1fr)',
      })
    root.select('.landing-band-mini, .landing-directory-preview').css({
      minWidth: '0',
      overflow: 'hidden',
    })
    root
      .select(
        '.landing-band-mini > section, .landing-appearance-sample > section, .landing-directory-preview > section',
      )
      .css({
        marginInlineStart: '0 !important',
        marginInlineEnd: '0 !important',
        paddingInlineStart: '1rem !important',
        paddingInlineEnd: '1rem !important',
      })
    root
      .select(
        '.landing-appearance-gallery h2, .landing-appearance-gallery h3, .landing-directory-preview h2, .landing-directory-preview h3',
      )
      .css({
        fontSize: '1.15rem',
        lineHeight: '1.35',
      })
    root.select('.landing-title-tags .section-header > .text-title').css({
      fontSize: '1.15rem',
      lineHeight: '1.35',
    })
    root
      .media(mediaBelow(BREAKPOINTS.md))
      .select('.component-guide-grid')
      .css({ gridTemplateColumns: 'minmax(0, 1fr)' })
  })
}
