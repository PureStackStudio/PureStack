# RFC 0001: First-Class Blog Feature for `@purestack/ts-ssg`

- Status: Proposed
- Author: Codex
- Date: 2026-02-13

## Summary

Add a first-class blog system to `ts-ssg` that integrates with the existing file-based content model, templates, navigation, incremental build, sitemap, and Pagefind pipeline.

The feature introduces:

1. Blog-aware frontmatter fields.
2. Blog site config (`siteConfig.json` + runtime config).
3. A blog index model built from discovered content.
4. Built-in blog templates (`blog-post`, `blog-index`, `blog-tag`).
5. Generated archive/tag pages and feeds (RSS, Atom, JSON feed).
6. Incremental rebuild correctness for derived blog artifacts.

## Motivation

`ts-ssg` already has stable primitives:

1. Deterministic route resolution from content files.
2. Strong frontmatter normalization with strict validation patterns.
3. Template resolution (`doc`, `splash`) with customizable template maps.
4. Incremental build manifests and dirty-route rendering.

What is missing for a production blog is generated, metadata-driven outputs:

1. Chronological listing pages.
2. Tag taxonomy pages.
3. Feed files.
4. Related/series metadata and article SEO defaults.

Implementing blog as a first-class layer avoids duplicated logic in userland and preserves the existing architecture.

## Goals

1. Zero-break change for existing `doc`/`splash` users.
2. Blog can be enabled with config, not custom build scripts.
3. Derived outputs remain deterministic and incremental-friendly.
4. Blog metadata can be extended without weakening validation.

## Non-Goals

1. Runtime hydration or client-side blog rendering.
2. CMS/editor integration.
3. Multi-language fallback/routing system (can be added later).

## Design Constraints

1. Preserve static rendering constraints in Regor components.
2. Reuse existing build hooks and config precedence rules.
3. Keep manifest-compatible incremental behavior.
4. Maintain current route conventions (`/path/index.html`).

## Proposed API and Type Changes

### 1) Frontmatter changes (`src/frontmatter/frontmatter.ts`)

Add the following types:

```ts
export type BlogPostStatus = 'published' | 'scheduled' | 'draft'

export interface BlogAuthorRef {
  id?: string
  name?: string
  email?: string
  url?: string
  avatar?: string
  [key: string]: unknown
}

export interface BlogFrontmatterOptions {
  enabled?: boolean
  slug?: string
  excerpt?: string
  publishedAt?: string
  updatedAt?: string
  tags?: string[]
  author?: string | BlogAuthorRef
  series?: string
  coverImage?: string
  canonicalUrl?: string
  featured?: boolean
  readingTimeMinutes?: number
  noIndex?: boolean
  [key: string]: unknown
}
```

Extend `PageFrontmatter`:

```ts
export interface PageFrontmatter {
  // existing fields...
  blog?: BlogFrontmatterOptions
}
```

Normalization rules:

1. `blog` omitted => `undefined`.
2. `publishedAt` and `updatedAt` must be valid ISO-8601 strings if present; invalid values throw.
3. `tags` normalized to unique, trimmed, lower-cased values while preserving input order.
4. `readingTimeMinutes` must be a positive integer if present.
5. `canonicalUrl` must be absolute URL if present; invalid value throws.

### 2) Site config changes (`src/config/config.ts`)

Add blog config types:

```ts
export interface BlogAuthorConfig {
  id: string
  name: string
  email?: string
  url?: string
  avatar?: string
}

export interface BlogFeedConfig {
  enabled: boolean
  rss: boolean
  atom: boolean
  json: boolean
  maxItems: number
  rssFileName: string
  atomFileName: string
  jsonFileName: string
}

export interface BlogConfig {
  enabled: boolean
  basePath: string
  postsPerPage: number
  includeDraftsInDev: boolean
  defaultAuthorId?: string
  authors: BlogAuthorConfig[]
  feed: BlogFeedConfig
}
```

Extend `SiteConfig` and partial variants:

```ts
export interface SiteConfig {
  // existing fields...
  blog: BlogConfig
}

export type PartialSiteConfig = Partial<
  Omit<SiteConfig, 'theme' | 'sitemap' | 'logo' | 'consent' | 'pagefind' | 'blog'>
> & {
  // existing partial fields...
  blog?: PartialBlogConfig
}
```

Add `resolveBlogConfig(input?, file?)` with strict defaults:

1. `enabled`: `false`.
2. `basePath`: `/blog/`.
3. `postsPerPage`: `12`.
4. `feed.enabled`: `true` when `blog.enabled`, otherwise `false`.
5. `feed.maxItems`: `50`.

### 3) Blog domain model (`src/blog/index.ts`, new)

```ts
export interface BlogPostMeta {
  relPath: string
  urlPath: string
  title: string
  description?: string
  excerpt?: string
  publishedAt: string
  updatedAt?: string
  tags: string[]
  author?: BlogAuthorRef
  series?: string
  coverImage?: string
  featured: boolean
  readingTimeMinutes?: number
  template: string
}

export interface BlogTagIndex {
  tag: string
  slug: string
  count: number
  posts: BlogPostMeta[]
}

export interface BlogSeriesIndex {
  series: string
  slug: string
  posts: BlogPostMeta[]
}

export interface BlogIndex {
  posts: BlogPostMeta[]
  featured: BlogPostMeta[]
  tags: BlogTagIndex[]
  series: BlogSeriesIndex[]
  byRelPath: Record<string, BlogPostMeta>
}

export interface BuildBlogIndexInput {
  contentDir: string
  files: ContentFile[]
  blog: BlogConfig
  mode: 'build' | 'dev'
}

export async function buildBlogIndex(
  input: BuildBlogIndexInput,
): Promise<BlogIndex>
```

Behavior:

1. Include only pages where `frontmatter.blog?.enabled === true`.
2. Exclude `draft/hidden` posts in build mode.
3. Sort posts by `publishedAt desc`, tie-break with `relPath asc`.
4. Resolve author references against `blog.authors`.

### 4) Template additions (`src/templates/page-templates.ts`)

Extend built-ins:

```ts
export const defaultTemplates: PageTemplateMap = {
  doc: renderDocTemplate,
  splash: renderSplashTemplate,
  'blog-post': renderBlogPostTemplate,
  'blog-index': renderBlogIndexTemplate,
  'blog-tag': renderBlogTagTemplate,
}
```

Add optional blog context on `PageTemplateInput`:

```ts
export interface PageTemplateInput {
  // existing fields...
  blog?: {
    index?: BlogIndex
    post?: BlogPostMeta
    posts?: BlogPostMeta[]
    tag?: string
    page?: number
    totalPages?: number
  }
}
```

Note: this is additive and does not affect existing templates.

### 5) Build pipeline changes (`src/build/*`)

Add generated artifact model:

```ts
export interface GeneratedPageInput {
  relPath: string
  urlPath: string
  template: 'blog-index' | 'blog-tag'
  frontmatter: PageFrontmatter
  bodyHtml: string
}

export interface GeneratedPageResult {
  relPath: string
  outPath: string
  urlPath: string
  template: string
}
```

Add build helpers:

```ts
export async function buildGeneratedPages(
  context: BuildContext,
  blogIndex: BlogIndex,
): Promise<GeneratedPageResult[]>

export async function writeBlogFeeds(
  outDir: string,
  site: SiteConfig,
  blogIndex: BlogIndex,
): Promise<BlogFeedWriteResult | null>
```

Extend `BuildContext`:

```ts
export interface BuildContext {
  // existing fields...
  blogIndex?: BlogIndex
}
```

### 6) Feed writer types (`src/build/feeds.ts`, new)

```ts
export interface BlogFeedWriteResult {
  rssOutPath?: string
  atomOutPath?: string
  jsonOutPath?: string
  items: number
}

export function buildRssXml(baseUrl: string, posts: BlogPostMeta[]): string
export function buildAtomXml(baseUrl: string, posts: BlogPostMeta[]): string
export function buildJsonFeed(
  baseUrl: string,
  posts: BlogPostMeta[],
): Record<string, unknown>
```

### 7) Incremental/manifest updates (`src/build/manifest.ts`, `src/build/incremental*.ts`)

Manifest compatibility should include blog-relevant configuration in the config signature (already hash-based, but keep documented intent explicit).

Derived outputs that must be rewritten when a blog post changes:

1. `/blog/` and paginated list pages.
2. Tag pages touched by added/removed tags.
3. Feed files.

Proposed helper:

```ts
export interface BlogDerivedPaths {
  pageOutPaths: string[]
  feedOutPaths: string[]
}

export function resolveBlogDerivedPaths(
  outDir: string,
  blog: BlogConfig,
): BlogDerivedPaths
```

## SEO/Head Behavior

When `frontmatter.blog?.enabled === true` and post is publishable:

1. Inject `article` OpenGraph defaults into head merge path.
2. Inject canonical URL if configured (`blog.canonicalUrl` > `frontmatter.head.canonicalUrl` precedence is configurable; default should favor explicit `frontmatter.head`).
3. Inject JSON-LD `BlogPosting` script with title, date, author, tags, and canonical URL.
4. Respect `blog.noIndex` by emitting robots noindex meta.

## URL and Output Strategy

1. Blog posts keep file-based routing (`content/blog/my-post.mdx` -> `/blog/my-post/`) unless `blog.slug` overrides final segment.
2. Generated pages:
   - `/blog/`
   - `/blog/page/{n}/` for `n >= 2`
   - `/blog/tag/{tagSlug}/`
3. Feeds at project root by default:
   - `/feed.xml`
   - `/atom.xml`
   - `/feed.json`

## Rollout Plan (PR Sequence)

### PR 1: Core Types + Config

- [ ] `packages/ts-ssg/src/frontmatter/frontmatter.ts`
  - Add `BlogFrontmatterOptions` and validators.
  - Add parse/normalize rules and error messages.
- [ ] `packages/ts-ssg/src/frontmatter/frontmatter.test.ts` (new)
  - Add coverage for valid/invalid blog frontmatter.
- [ ] `packages/ts-ssg/src/config/config.ts`
  - Add `BlogConfig`, partial types, `resolveBlogConfig`.
- [ ] `packages/ts-ssg/src/config/config.test.ts`
  - Add tests for blog defaults, overrides, and validation.
- [ ] `packages/ts-ssg/schema/siteConfig.schema.json`
  - Add `blog` schema section.
- [ ] `packages/ts-ssg/src/index.ts`
  - Export new blog-related public types.

### PR 2: Blog Index Model

- [ ] `packages/ts-ssg/src/blog/index.ts` (new)
  - Implement `buildBlogIndex` and helpers.
- [ ] `packages/ts-ssg/src/blog/index.test.ts` (new)
  - Verify sorting, draft filtering, tags, series, author resolution.
- [ ] `packages/ts-ssg/src/build/page.ts`
  - Attach per-page blog metadata to render context when applicable.

### PR 3: Templates + Components

- [ ] `packages/ts-ssg/src/templates/page-templates.ts`
  - Add `blog-post`, `blog-index`, `blog-tag`.
- [ ] `packages/ts-ssg/src/templates/docLayoutStyles.ts`
  - Add blog layout/style selectors.
- [ ] `packages/ts-ssg/src/regor/components/blogMeta/blogMeta.ts` (new)
- [ ] `packages/ts-ssg/src/regor/components/blogMeta/blogMetaStyle.ts` (new)
- [ ] `packages/ts-ssg/src/regor/components/blogCard/blogCard.ts` (new)
- [ ] `packages/ts-ssg/src/regor/components/blogCard/blogCardStyle.ts` (new)
- [ ] `packages/ts-ssg/src/regor/components/tagList/tagList.ts` (new)
- [ ] `packages/ts-ssg/src/regor/components/tagList/tagListStyle.ts` (new)
- [ ] `packages/ts-ssg/src/regor/initBuiltinComponents.ts`
  - Register blog component factories.
- [ ] `packages/ts-ssg/src/regor/components/*.test.ts`
  - Add static-render and accessibility assertions.

### PR 4: Generated Pages + Feeds

- [ ] `packages/ts-ssg/src/build/generated-pages.ts` (new)
  - Build and write blog index/tag pages.
- [ ] `packages/ts-ssg/src/build/feeds.ts` (new)
  - Write RSS/Atom/JSON feed artifacts.
- [ ] `packages/ts-ssg/src/build/site.ts`
  - Orchestrate generated pages and feeds in full build flow.
- [ ] `packages/ts-ssg/src/build/incremental.ts`
  - Update incremental change handling for blog-derived outputs.
- [ ] `packages/ts-ssg/src/build/manifest.ts`
  - Document or extend manifest semantics for derived artifacts.
- [ ] `packages/ts-ssg/src/build/renderer.test.ts`
  - Add rendering assertions for new templates.

### PR 5: SEO, Docs, and Sample Content

- [ ] `packages/ts-ssg/src/build/head-config.ts`
  - Add article meta + JSON-LD merge behavior.
- [ ] `packages/ts-ssg/src/build/sitemap.ts`
  - Ensure generated blog pages and feeds are included/excluded intentionally.
- [ ] `packages/ts-ssg/sample-content/blog/index.md` (new)
- [ ] `packages/ts-ssg/sample-content/blog/first-post.mdx` (new)
- [ ] `packages/ts-ssg/sample-content/blog/second-post.mdx` (new)
- [ ] `packages/ts-ssg/sample-content/siteConfig.json`
  - Add example `blog` section.
- [ ] `packages/ts-ssg/README.md`
  - Document blog frontmatter/config/templates/feeds.
- [ ] `packages/ts-ssg/ROADMAP.md`
  - Mark blog feature status and follow-up items.

## Testing Strategy

1. Unit tests for pure normalization/index/feed functions.
2. Rendering tests for template outputs and head tags.
3. Incremental tests for changed/deleted post side effects.
4. End-to-end sample-content build assertions:
   - Blog index exists.
   - Tag pages exist.
   - Feed files exist.
   - Draft posts excluded from sitemap + feeds + pagefind.

## Backward Compatibility

1. Existing sites unaffected because `blog.enabled` defaults to `false`.
2. Existing `template: doc|splash` behavior unchanged.
3. New frontmatter fields are optional and additive.

## Risks and Mitigations

1. Risk: Derived page invalidation bugs in incremental mode.
   - Mitigation: explicit derived-path tracking + targeted tests.
2. Risk: SEO/head field merge conflicts with custom `head`.
   - Mitigation: strict precedence rules and tests.
3. Risk: Template complexity increases.
   - Mitigation: isolate blog helpers and keep template input small.

## Open Questions

1. Should feed paths be nested under `/blog/` or remain root-level?
2. Should `blog.slug` support full-path overrides or segment-only overrides?
3. Should scheduled posts be rendered in build output with `noindex`, or excluded entirely?

## Acceptance Criteria

1. A blog-enabled post appears automatically on `/blog/`, tag pages, and configured feeds.
2. Draft posts never appear in nav/blog index/sitemap/feeds/pagefind in production build mode.
3. Incremental changes to one post only rewrite impacted blog outputs.
4. All existing tests pass and no behavior regression for non-blog sites.

