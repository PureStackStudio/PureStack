import type { SemanticTone } from '@purestack/ts-style'
import type { PreviewConfig } from './site-config-types'

/**
 * Normalized frontmatter for a content page.
 *
 * This shape is produced from MD/MDX frontmatter and is consumed by template
 * rendering, navigation building, head generation, and page-level runtime
 * embedding.
 *
 * Known keys are normalized case-insensitively. Custom keys are preserved.
 */
export interface PageFrontmatter {
  /**
   * Primary page title.
   *
   * Used by templates, head generation, and as a fallback for navigation
   * titles when `nav.title` is not provided.
   */
  title?: string

  /**
   * Short page summary for metadata and presentation surfaces such as
   * `<meta name="description">`.
   */
  description?: string

  /**
   * Arbitrary head-related metadata.
   *
   * This is intentionally open-ended so projects can attach custom values such
   * as canonical URLs or downstream head configuration inputs.
   */
  head?: Record<string, unknown>

  /**
   * Social/search preview metadata for this page.
   *
   * Missing fields are filled from the page title/description and site-level
   * preview defaults before Open Graph and Twitter tags are generated.
   */
  preview?: PreviewConfig

  /**
   * Page template key.
   *
   * Built-in templates include `doc` and `splash`. Custom template names can
   * also be provided by the host application.
   *
   * Defaults to `doc`.
   */
  template: string

  /**
   * Page sort order.
   *
   * Used by generated navigation unless overridden by `nav.order`.
   */
  order?: number

  /**
   * Hides the page from generated navigation when set to `true`.
   */
  hidden: boolean

  /**
   * Marks the page as draft content.
   *
   * Draft pages are excluded from generated navigation.
   */
  draft: boolean

  /**
   * Navigation-specific overrides for this page.
   */
  nav: FrontmatterNavOptions

  /**
   * Layout and template presentation controls.
   */
  layout: FrontmatterLayoutOptions

  /**
   * Page-level runtime embedding switches for supported MDX features.
   */
  embed?: FrontmatterEmbedOptions

  /**
   * Preserves additional custom frontmatter keys.
   */
  [key: string]: unknown
}

/**
 * Layout controls for the built-in page templates.
 *
 * These options are normalized from MD/MDX frontmatter and primarily affect
 * the built-in `doc` and `splash` templates.
 */
export interface FrontmatterLayoutOptions {
  /**
   * Controls how the page navigation is presented in the `doc` template.
   *
   * - `sidebar`: persistent sidebar layout on larger screens
   * - `drawer`: collapsible drawer-style navigation
   *
   * Defaults to `sidebar`. Any other value is invalid and should throw during
   * frontmatter normalization.
   */
  navMode: 'sidebar' | 'drawer'

  /**
   * Expands the main content area to the wider documentation layout.
   *
   * In the built-in `doc` template this adds the full-width main-content
   * treatment instead of the narrower default reading width.
   *
   * Defaults to `false`.
   */
  fullWidth: boolean

  /**
   * Enables table-of-contents rendering when the page outline contains items.
   *
   * The TOC appears only when this flag is `true` and the page actually has
   * extracted headings.
   *
   * Defaults to the site-level `pageToc.enabled` setting.
   */
  showToc: boolean

  /**
   * Controls whether the generated page navigation menu is rendered.
   *
   * This is separate from `nav.hidden`: `nav.hidden` removes the current page
   * from generated navigation, while `showNav` controls the navigation shell on
   * the current page.
   *
   * Defaults to `true`.
   */
  showNav: boolean

  /**
   * Starts the built-in TOC in its collapsed visual state.
   *
   * This does not disable the TOC. It only changes the initial presentation
   * when `showToc` is enabled and a TOC is available.
   *
   * Defaults to `false`.
   */
  tocCollapsed?: boolean

  /**
   * Overrides the page TOC tone for this page.
   *
   * When present, this takes precedence over the resolved site TOC tone for
   * the current page render only.
   */
  tocTone?: SemanticTone

  /**
   * Controls whether the resolved page footer is rendered.
   *
   * Defaults to `true`.
   */
  showFooter: boolean

  /**
   * Allows template-specific custom layout keys without narrowing the public
   * frontmatter surface to only the built-in options.
   */
  [key: string]: unknown
}

/**
 * Navigation-specific overrides for a single page.
 *
 * These values are consumed when building navigation trees and take precedence
 * over the page-level equivalents where noted.
 */
export interface FrontmatterNavOptions {
  /**
   * Overrides the title shown in generated navigation.
   *
   * Navigation title fallback order is:
   * `nav.title` -> `title` -> first `# heading` -> filename.
   */
  title?: string

  /**
   * Overrides page sort order inside navigation.
   *
   * When present, this takes precedence over the page-level `order` field.
   */
  order?: number

  /**
   * Badge text shown with this page's generated navigation item.
   */
  badge?: string

  /**
   * Icon name shown with this page's generated navigation item.
   */
  icon?: string

  /**
   * Overrides the navigation menu tone for this page.
   *
   * When present, this takes precedence over the resolved site navigation tone
   * for the current page render only.
   */
  tone?: SemanticTone

  /**
   * Excludes the page from generated navigation when set to `true`.
   *
   * This is evaluated together with the page-level `hidden` and `draft` flags.
   */
  hidden: boolean

  /**
   * Allows additional project-specific navigation metadata.
   */
  [key: string]: unknown
}

/**
 * Runtime asset injection controls for MDX features that require page-level
 * scripts or supporting markup.
 */
export interface FrontmatterEmbedOptions {
  /**
   * Chooses where the tabs runtime is injected.
   *
   * - `head`: inject supporting runtime into the page head
   * - `body`: inject supporting runtime near the end of the body
   */
  tabs?: 'head' | 'body'

  /**
   * Chooses where the modal runtime is injected.
   *
   * - `head`: inject supporting runtime into the page head
   * - `body`: inject supporting runtime near the end of the body
   */
  modal?: 'head' | 'body'

  /**
   * Allows future or project-specific embed flags.
   */
  [key: string]: unknown
}

/**
 * Parsed page source split into normalized frontmatter and markdown/MDX body.
 */
export interface ParsedFrontmatterSource {
  /**
   * Page content without the frontmatter block.
   */
  body: string

  /**
   * Normalized page frontmatter.
   */
  frontmatter: PageFrontmatter
}
