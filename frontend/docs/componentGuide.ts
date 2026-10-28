import type { Style } from '@purestack/ts-css'
import {
  BREAKPOINTS,
  mediaBelow,
  styleBuilder,
  type ThemePalette,
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
    <div class="component-header__identity">
      <code>{{ name }}</code><span class="tracking-wide">{{ kind }}</span>
    </div>
    <nav class="component-header__links" aria-label="Component resources">
      <a href="#api-reference">API <span aria-hidden="true">↗</span></a>
      <a :href="source" target="_blank" rel="noopener"
        >Source <span aria-hidden="true">↗</span></a>
    </nav>
  </div>
  <p class="component-header__summary">{{ summary }}</p>
  <a class="component-header__back" :href="sectionHref"
    >{{ section }} <span aria-hidden="true">↗</span></a>
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
  <header class="component-example__heading">
    <span class="component-example__dot" aria-hidden="true"></span><strong>{{ label }}</strong><span class="component-example__tag tracking-wide">COMPOSITION</span>
  </header>
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
    registerToneGuideStyles(root, palette)
    registerRuntimeExampleStyles(root)
    registerLayoutDemoStyles(root, palette)
    registerComponentHeaderStyles(root, palette)
    registerComponentExampleStyles(root, palette)
    registerAppearanceGalleryStyles(root, palette)
    registerDataWindowStyles(root, palette)
    registerFormSampleStyles(root, palette)
    registerComponentDirectoryStyles(root, palette)
    registerLandingGalleryStyles(root)
    registerLandingIntroductionStyles(root)
    registerLandingFeatureStyles(root)
    registerLandingWorkflowStyles(root, palette)
  })
}

function registerToneGuideStyles(root: Style, palette: ThemePalette) {
  const accent = palette.semanticTone.accent

  root.select('.tone-guide-swatch').minHeight('7rem').width('100%')

  root
    .select(':where(.tone-guide-state)')
    .background('transparent')
    .border('0 solid transparent')
    .color('inherit')
    .cursor('pointer')

  root.select('.tone-guide-state').font('inherit').textAlign('start')

  root
    .select('.tone-guide-flow')
    .display('grid')
    .gridTemplateColumns('repeat(auto-fit, minmax(min(100%, 10rem), 1fr))')
    .gap('0.75rem')

  root
    .select('.tone-guide-flow > div')
    .padding('1rem')
    .border(`1px solid ${accent.border.subtle}`)
    .borderRadius('0.75rem')
    .background(accent.surface.rest.background)
    .minWidth('0')

  root
    .select('.tone-guide-flow code, .tone-guide-gallery code')
    .overflowWrap('anywhere')
    .whiteSpace('normal')

  root.select('.tone-guide-glass-field').backgroundColor(accent.spotlight.field)
}

function registerRuntimeExampleStyles(root: Style) {
  root
    .select('.runtime-code')
    .whiteSpace('pre-wrap')
    .overflowWrap('anywhere')
    .fontSize('0.75rem')
    .padding('1rem')

  root.select('.runtime-code code').whiteSpace('inherit')

  root.select('app[data-review-counter]').display('block').minWidth('0')
}

function registerLayoutDemoStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.layout-demo-track')
    .minHeight('7rem')
    .padding('0.75rem')
    .border(`1px dashed ${accent.border.subtle}`)
    .borderRadius('0.5rem')
    .background(neutral.surface.rest.background)
    .gap('0.5rem')

  root
    .select('.layout-demo-item')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .minWidth('2rem')
    .padding('0.5rem')
    .borderRadius('0.4rem')
    .background(accent.surface.rest.background)
    .color(accent.text.default)
    .fontWeight('600')

  root.select('.layout-demo-item--tall').minHeight('4rem').fontSize('1.3rem')

  root.select('.layout-demo-scroll').overflowX('auto').minWidth('0')

  root.select('.layout-playground-frame').height('20rem')

  root.select('.layout-playground-frame--compact').height('14rem')

  root.select('.layout-playground-frame--tall').height('28rem')

  root.select('.layout-playground-width--narrow').width('24rem')

  root.select('.layout-playground-width--medium').width('40rem')

  root.select('.layout-playground-width--wide').width('60rem')

  root.select('.layout-demo-track--narrow').width('9rem').minHeight('7rem')

  root.select('.layout-grid-demo').gap('0.25rem').minWidth('0')

  root
    .select('.layout-grid-tile')
    .padding('0.65rem 0')
    .textAlign('center')
    .minWidth('0')
    .fontSize('0.6rem')
    .borderRadius('0.25rem')
    .background(accent.surface.rest.background)
    .color(accent.text.default)

  root
    .select('.layout-icon-sample')
    .display('inline-flex')
    .justifyContent('center')
    .color(accent.text.default)

  root.select('.layout-icon-sample--sm').fontSize('1rem')

  root.select('.layout-icon-sample--md').fontSize('1.75rem')

  root.select('.layout-icon-sample--lg').fontSize('2.5rem')

  root
    .media('min-width: 640px')
    .select('.layout-featured-card')
    .gridColumn('span 2')
}

function registerComponentHeaderStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.component-header')
    .position('relative')
    .overflow('hidden')
    .padding('1rem 1.25rem')
    .margin('0.75rem 0 1.5rem')
    .border(`1px solid ${neutral.border.subtle}`)
    .borderLeft(`3px solid ${accent.border.default}`)
    .borderRadius('0.75rem')
    .background(
      `radial-gradient(ellipse at 100% 0%, ${accent.surface.rest.background}, transparent 70%), ${neutral.surface.rest.background}`,
    )

  root
    .select('.component-header__top')
    .display('flex')
    .flexWrap('wrap')
    .alignItems('baseline')
    .justifyContent('space-between')
    .gap('0.6rem 1.25rem')

  root
    .select('.component-header__back')
    .fontSize('0.75rem')
    .color(neutral.text.subtle)
    .textDecoration('none')

  root
    .select('.component-header__identity')
    .display('flex')
    .flexWrap('wrap')
    .alignItems('baseline')
    .gap('0.4rem 0.75rem')
    .minWidth('0')

  root
    .select('.component-header__identity code')
    .color(accent.text.default)
    .fontSize('1rem')
    .background('none')
    .border('none')
    .padding('0')
    .margin('0')
    .lineHeight('1.4')
    .overflowWrap('anywhere')

  root
    .select('.component-header__identity span, .component-example__tag')
    .fontSize('0.65rem')
    .textTransform('uppercase')
    .color(neutral.text.subtle)

  root
    .select('.component-header__summary')
    .fontSize('0.95rem')
    .lineHeight('1.6')
    .margin('0.6rem 0 0.4rem')

  root
    .select('.component-header__links')
    .display('flex')
    .flexWrap('wrap')
    .alignItems('baseline')
    .gap('0.75rem')
    .flexShrink('0')

  root
    .select('.component-header__links a')
    .fontSize('0.75rem')
    .fontWeight('600')
    .textDecoration('none')
    .color(accent.text.default)

  root.select('.component-header a:hover').textDecoration('underline')
}

function registerComponentExampleStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.component-example')
    .margin('1.5rem 0')
    .border(`1px solid ${neutral.border.subtle}`)
    .borderRadius('1rem')
    .background(neutral.surface.rest.background)

  root
    .select('.component-example__heading')
    .display('flex')
    .flexWrap('wrap')
    .alignItems('center')
    .gap('0.6rem')
    .padding('0.9rem 1.25rem')
    .borderBottom(`1px solid ${neutral.border.subtle}`)
    .fontSize('0.8rem')

  root
    .select('.component-example__dot')
    .width('0.5rem')
    .height('0.5rem')
    .borderRadius('50%')
    .background(accent.text.default)

  root.select('.component-example__tag').marginLeft('auto')

  root
    .select('.component-example__stage')
    .padding('clamp(1rem, 3vw, 2rem)')
    .background(
      `radial-gradient(${neutral.border.subtle} 1px, transparent 1px)`,
    )
    .backgroundSize('16px 16px')
    .minWidth('0')

  root
    .select('.component-example__caption')
    .margin('0')
    .padding('0.9rem 1.25rem')
    .borderTop(`1px solid ${neutral.border.subtle}`)
    .fontSize('0.8rem')
    .color(neutral.text.subtle)
    .lineHeight('1.6')

  root
    .select('.component-preview-stage')
    .padding('clamp(1rem, 3vw, 2rem)')
    .minWidth('0')
}

function registerAppearanceGalleryStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral

  root
    .select('.component-appearance-grid')
    .display('grid')
    .gridTemplateColumns('repeat(auto-fit, minmax(min(100%, 14rem), 1fr))')
    .gap('1rem')
    .alignItems('start')

  root
    .select('.component-appearance-cell')
    .display('flex')
    .flexDirection('column')
    .alignItems('stretch')
    .gap('1rem')
    .padding('1rem')
    .minWidth('0')
    .border(`1px solid ${neutral.border.subtle}`)
    .borderRadius('0.75rem')
    .background(neutral.surface.rest.background)

  root
    .select('.component-appearance-cell > code')
    .fontSize('0.75rem')
    .color(neutral.text.subtle)
    .background('none')
    .border('none')
    .padding('0')

  root
    .select('.forms-appearance-grid--composer')
    .gridTemplateColumns('repeat(auto-fit, minmax(min(100%, 24rem), 1fr))')

  root
    .select('.data-chart-gallery')
    .gridTemplateColumns('repeat(auto-fit, minmax(min(100%, 16rem), 1fr))')

  root
    .select('.data-chart-gallery .component-appearance-cell > svg')
    .alignSelf('center')
    .maxWidth('100%')

  root
    .select(
      '.data-chart-gallery text, .component-example .bar-chart text, .component-example .line-chart text, .component-example .doughnut-chart text',
    )
    .fill('currentColor')
}

function registerDataWindowStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.data-window-diagram')
    .display('flex')
    .flexDirection('column')
    .gap('0.5rem')
    .padding('1rem')
    .border(`1px solid ${neutral.border.subtle}`)
    .borderRadius('0.75rem')
    .background(neutral.surface.rest.background)

  root
    .select('.data-window-diagram__spacer')
    .padding('0.75rem')
    .textAlign('center')
    .border(`1px dashed ${neutral.border.subtle}`)
    .color(neutral.text.subtle)
    .fontSize('0.8rem')

  root
    .select('.data-window-diagram__rows')
    .padding('1rem')
    .borderLeft(`3px solid ${accent.text.default}`)
    .background(accent.surface.rest.background)
}

function registerFormSampleStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral

  root
    .select('.forms-copy-sample')
    .border('none')
    .padding('0')
    .margin('0')
    .minWidth('0')

  root
    .select('.forms-composer-card')
    .width('100%')
    .padding('1rem')
    .border(`1px solid ${neutral.border.subtle}`)
    .borderRadius('0.75rem')
    .background(neutral.surface.rest.background)

  root
    .select('.component-appearance-cell > .btn-group__dropdown')
    .alignSelf('start')
}

function registerComponentDirectoryStyles(root: Style, palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const accent = palette.semanticTone.accent

  root
    .select('.component-directory-lead')
    .fontSize('clamp(1.4rem, 3vw, 2rem)')
    .lineHeight('1.35')
    .fontWeight('600')
    .maxWidth('34rem')
    .color(accent.text.default)

  root
    .select('.component-recipe')
    .padding('1.5rem')
    .border(`1px solid ${neutral.border.subtle}`)
    .borderRadius('0.85rem')
    .background(neutral.surface.rest.background)
    .boxShadow('0 8px 24px rgb(0 0 0 / 0.06)')

  root
    .select('.component-recipe h3')
    .margin('0.4rem 0 0.75rem')
    .fontSize('1.25rem')

  root
    .select('.component-recipe > p')
    .margin('0.5rem 0 1.25rem')
    .color(neutral.text.subtle)

  root
    .select('.component-guide-grid')
    .display('grid')
    .gridTemplateColumns('repeat(2, minmax(0, 1fr))')
    .gap('1rem')

  root
    .select('.component-guide-card')
    .display('flex')
    .flexDirection('column')
    .padding('1.5rem')
    .border(`1px solid ${neutral.border.subtle}`)
    .borderRadius('1rem')
    .background(neutral.surface.rest.background)
    .minWidth('0')

  root
    .select('.component-guide-card h3')
    .margin('1.25rem 0 0.5rem')
    .overflowWrap('anywhere')

  root
    .select('.component-guide-card > p')
    .color(neutral.text.subtle)
    .fontSize('0.9rem')
    .flexGrow('1')

  root
    .select('.component-guide-card__preview')
    .display('flex')
    .alignItems('center')
    .justifyContent('center')
    .flexWrap('wrap')
    .gap('0.5rem')
    .minHeight('6rem')
    .padding('1rem')
    .borderRadius('0.75rem')
    .background(accent.surface.rest.background)

  root
    .select('.component-guide-card > a')
    .fontWeight('600')
    .fontSize('0.85rem')
    .color(accent.text.default)

  root.select('.component-guide-card > .badge').alignSelf('start')

  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.component-guide-grid')
    .gridTemplateColumns('minmax(0, 1fr)')
}

function registerLandingGalleryStyles(root: Style) {
  root
    .select('.landing-appearance-sample, .landing-directory-preview > *')
    .width('100%')
    .minWidth('0')

  root
    .select('.landing-appearance-sample > *, .landing-directory-preview > *')
    .marginBottom('0')

  root
    .select('.landing-appearance-gallery pre, .landing-directory-preview pre')
    .whiteSpace('pre-wrap')
    .overflowWrap('anywhere')

  root
    .select(
      '.landing-appearance-gallery .grid, .landing-directory-preview .grid',
    )
    .gridTemplateColumns('minmax(0, 1fr)')

  root
    .select('.landing-band-mini, .landing-directory-preview')
    .minWidth('0')
    .overflow('hidden')

  root
    .select(
      '.landing-band-mini > section, .landing-appearance-sample > section, .landing-directory-preview > section',
    )
    .marginInlineStart('0 !important')
    .marginInlineEnd('0 !important')
    .paddingInlineStart('1rem !important')
    .paddingInlineEnd('1rem !important')

  root
    .select(
      '.landing-appearance-gallery h2, .landing-appearance-gallery h3, .landing-directory-preview h2, .landing-directory-preview h3',
    )
    .fontSize('1.15rem')
    .lineHeight('1.35')

  root
    .select('.landing-title-tags .section-header > .text-title')
    .fontSize('1.15rem')
    .lineHeight('1.35')
}

function registerLandingIntroductionStyles(root: Style) {
  root
    .select('.landing-section-demo')
    .padding('clamp(1.5rem, 4vw, 3.5rem) !important')
    .containerType('inline-size')

  root
    .select('.landing-section-demo .landing-section__title')
    .fontSize('clamp(1.75rem, 5cqi, 3.25rem)')

  root
    .select('.landing-section-demo .landing-section__eyebrow::before')
    .content('""')
    .width('1.5rem')
    .height('2px')
    .background('currentColor')
    .flexShrink('0')
}

function registerLandingFeatureStyles(root: Style) {
  root.select('.landing-section-demo__feature').padding('1.25rem')

  root
    .select('.landing-section-alignment-gallery')
    .gridTemplateColumns('minmax(0, 1fr)')

  root
    .select('.landing-section-demo__feature h3')
    .margin('0.25rem 0 0')
    .fontWeight('650')
    .lineHeight('1.35')

  root
    .select('.landing-section-demo__feature p')
    .fontSize('0.9375rem')
    .lineHeight('1.65')
}

function registerLandingWorkflowStyles(root: Style, palette: ThemePalette) {
  root.select('.landing-section-demo__workflow').padding('1.5rem')

  root.select('.landing-section-demo__workflow > .panel__body').gap('1.25rem')

  root.select('.landing-section-demo__step > div').gap('0.25rem')

  root.select('.landing-section-demo__step strong').fontSize('0.9375rem')

  root
    .select('.landing-section-demo__step span, .landing-section-demo__note')
    .fontSize('0.8125rem')

  root
    .select('.landing-section-demo__step span')
    .lineHeight('1.5')
    .color(palette.semanticTone.neutral.text.subtle)

  root.select('.landing-section-demo__note').paddingTop('1rem')
}
