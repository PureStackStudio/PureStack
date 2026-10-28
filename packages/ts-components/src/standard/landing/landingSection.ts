import { computed, defineComponent, html, unref } from 'regor'
import { resolveComponentClasses } from '../componentVariant'
import type { LandingSection } from './landingTypes'

export function defineLandingSectionComponent() {
  const landingSectionTemplate = html`<section class="landing-section d-block min-w-0 p-6 mb-5" :class="classes">
  <Grid
    class="landing-section__layout gap-6"
    columns="1"
    :columnsLg="layoutColumns"
    :alignItems="alignItems || 'start'"
  >
    <SectionHeader
      r-if="eyebrow || title || subtitle"
      class="landing-section__header d-flex flex-column min-w-0 gap-4"
      :class="headerClasses"
      :eyebrow="eyebrow"
      :title="title"
      :subtitle="subtitle"
      :titleTag="titleTag || 'h2'"
      eyebrowClass="landing-section__eyebrow m-0 fs-xxs opacity-75"
      titleClass="landing-section__title m-0 fw-600 wrap-anywhere"
      subtitleClass="landing-section__subtitle m-0 fs-body lh-6"
    >
      <div class="landing-section__actions d-flex flex-wrap align-center gap-3">
        <slot name="actions"></slot>
      </div>
    </SectionHeader>
    <Grid
      class="landing-section__content gap-5"
      columns="1"
      :columnsLg="contentColumns"
      :alignItems="alignItems || 'start'"
    >
      <slot></slot>
    </Grid>
  </Grid>
</section>`

  return {
    landingSection: defineComponent<LandingSection>(landingSectionTemplate, {
      props: [
        'eyebrow',
        'title',
        'subtitle',
        'titleTag',
        'tone',
        'variant',
        'variantMode',
        'layout',
        'align',
        'columns',
        'columnsLg',
        'alignItems',
      ],
      context: (head) => {
        const props = head.props
        return {
          ...props,
          classes: computed(() =>
            resolveComponentClasses(props, {
              defaultVariant: 'none',
              defaultVariantMode: 'stateless',
            }),
          ),
          headerClasses: computed(() =>
            unref(props.align) === 'center'
              ? 'align-center text-center'
              : 'align-flex-start text-start',
          ),
          layoutColumns: computed(() =>
            unref(props.layout) === 'split' &&
            (unref(props.eyebrow) ||
              unref(props.title) ||
              unref(props.subtitle))
              ? 'repeat(auto-fit, minmax(min(100%, 16rem), 1fr))'
              : 'minmax(0, 1fr)',
          ),
          contentColumns: computed(
            () => unref(props.columnsLg) || unref(props.columns) || 1,
          ),
        }
      },
    }),
  }
}
