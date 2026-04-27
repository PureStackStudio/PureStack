import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export interface SectionHeader {
  eyebrow?: RefOrValue<string>
  title?: RefOrValue<string>
  subtitle?: RefOrValue<string>
  footnote?: RefOrValue<string>
  titleTag?: RefOrValue<string>
  eyebrowClass?: RefOrValue<string>
  titleClass?: RefOrValue<string>
  subtitleClass?: RefOrValue<string>
  footnoteClass?: RefOrValue<string>
  resolvedTitleTag?: ComputedRef<string>
}

const sectionHeaderTemplate = html`<div class="section-header">
  <div class="text-eyebrow" :class="eyebrowClass" r-if="eyebrow">
    {{ eyebrow }}
  </div>
  <div
    :is="resolvedTitleTag"
    class="text-title"
    :class="titleClass"
    r-if="title"
  >
    {{ title }}
  </div>
  <p class="text-tagline" :class="subtitleClass" r-if="subtitle">
    {{ subtitle }}
  </p>
  <p class="prose-meta" :class="footnoteClass" r-if="footnote">
    {{ footnote }}
  </p>
  <slot></slot>
</div>`

function defineSectionHeaderComponent() {
  return defineComponent<SectionHeader>(sectionHeaderTemplate, {
    props: [
      'eyebrow',
      'title',
      'subtitle',
      'footnote',
      'titleTag',
      'eyebrowClass',
      'titleClass',
      'subtitleClass',
      'footnoteClass',
    ],
    context: (head) => resolveSectionHeader(head.props),
  })
}

export function defineSectionHeaderComponents() {
  return {
    sectionHeader: defineSectionHeaderComponent(),
  }
}

function resolveSectionHeader(props: SectionHeader): SectionHeader {
  return {
    ...props,
    resolvedTitleTag: computed(() => resolveTitleTag(unref(props.titleTag))),
  }
}

function resolveTitleTag(value: unknown): string {
  const normalized = resolveString(value).toLowerCase()
  if (
    normalized === 'h1' ||
    normalized === 'h2' ||
    normalized === 'h3' ||
    normalized === 'h4' ||
    normalized === 'h5' ||
    normalized === 'h6' ||
    normalized === 'p' ||
    normalized === 'div' ||
    normalized === 'span'
  ) {
    return normalized
  }
  return 'h2'
}

function resolveString(value: unknown) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}
