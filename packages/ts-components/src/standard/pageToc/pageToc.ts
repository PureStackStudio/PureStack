import type { PageOutlineItem } from '@purestack/ts-common'
import { renderPageTocContent } from '@purestack/ts-page-scripts'
import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  type SRef,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  type ComponentVariantMode,
  resolveComponentClasses,
} from '../componentVariant'

export interface PageToc {
  outline?: PageOutlineItem[] | SRef<PageOutlineItem[]>
  title?: string
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  variantMode?: RefOrValue<ComponentVariantMode>
  classes?: ComputedRef<string>
}

const DEFAULT_PAGE_TOC_VARIANT: ComponentVariant = 'flat'
const DEFAULT_PAGE_TOC_VARIANT_MODE: ComponentVariantMode = 'stateless'

const pageTocTemplate = html`<nav
  class="page-toc"
  :class="classes"
  :data-page-toc-auto="autoOutline"
  aria-label="On this page"
>
  <button
    class="page-toc__panel-toggle tone-fill-button-all tone-text-button-all tone-border-button-all"
    type="button"
    aria-controls="doc-toc"
    aria-expanded="false"
  >
    <span class="page-toc__panel-toggle-label">on this page</span>
  </button>
  <div class="page-toc__header-row">
    <div class="page-toc__header">{{ title }}</div>
    <button
      class="page-toc__restore-toggle tone-text-button-all tone-fill-button-hover tone-fill-button-active tone-border-button-hover tone-border-button-active opacity-25 opacity-1-hover"
      type="button"
      title="Collapse table of contents"
      aria-label="Collapse table of contents"
      data-page-toc-restore
    >
      <span
        class="page-toc__header-toggle-icon page-toc__header-toggle-icon--collapse p-1"
      >
        <Icon name="iconoir:pin-slash"/>
      </span>
      <span
        class="page-toc__header-toggle-icon page-toc__header-toggle-icon--restore p-1"
      >
        <Icon name="iconoir:pin"/>
      </span>
    </button>
  </div>
  <div class="page-toc__content" r-html="contentHtml"></div>
  <script>
    window.tsSsgPageToc?.hydrate(document.currentScript?.parentElement)
  </script>
</nav>`

function resolveTitle(props: PageToc) {
  return typeof props.title === 'string' && props.title.trim().length > 0
    ? props.title.trim()
    : 'On this page'
}

function definePageTocComponent() {
  return defineComponent<PageToc>(pageTocTemplate, {
    props: ['outline', 'title', 'tone', 'variant', 'variantMode'],
    context: (head) => {
      const outline = unref(head.props.outline)
      return {
        title: resolveTitle(head.props),
        // Without an outline, the page build fills in the article's headings.
        autoOutline: outline === undefined ? '' : undefined,
        classes: computed(() =>
          resolveComponentClasses(head.props, {
            defaultVariant: DEFAULT_PAGE_TOC_VARIANT,
            defaultVariantMode: DEFAULT_PAGE_TOC_VARIANT_MODE,
          }),
        ),
        contentHtml: renderPageTocContent(outline ?? []),
      }
    },
  })
}

export function definePageTocComponents() {
  const pageToc = definePageTocComponent()
  return { pageToc }
}
