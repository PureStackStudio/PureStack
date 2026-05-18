# `@purestack/ts-ssg`

Static site generator for Markdown/MDX content with:

- deterministic file-based routing,
- built-in themed UI components (Regor),
- incremental rebuilds with manifest tracking,
- dev server with watch + live reload,
- sitemap/robots generation,
- Pagefind indexing.

## Installation

```bash
npm install @purestack/ts-ssg
# or
yarn add @purestack/ts-ssg
```

## Quick Start (Programmatic)

```ts
import path from 'node:path'
import { buildSite } from '@purestack/ts-ssg'

const rootDir = process.cwd()
const contentDir = path.join(rootDir, 'content')
const outDir = path.join(rootDir, 'dist', 'site')

await buildSite({
  rootDir,
  contentDir,
  outDir,
  siteTitle: 'My Docs',
})
```

## Quick Start (Dev Server)

```ts
import path from 'node:path'
import { startDevServer } from '@purestack/ts-ssg'

await startDevServer({
  rootDir: process.cwd(),
  contentDir: path.join(process.cwd(), 'content'),
  outDir: path.join(process.cwd(), 'dist', 'site'),
  host: '127.0.0.1',
  port: 4173,
})
```

## CLI Usage

`src/cli.ts` provides the CLI:

- `build` (default)
- `serve` / `dev` / `--serve`

Flags:

- `--port 4173` or `--port=4173`
- `--host 127.0.0.1` or `--host=127.0.0.1`
- `--content ./content` or `--content=./content`
- `--no-watch`
- `--no-reload`
- `--clean`

Examples from this monorepo:

```bash
yarn tsx packages/ts-ssg/src/cli.ts
yarn tsx packages/ts-ssg/src/cli.ts serve --content ./packages/ts-ssg/sample-content --port 4173
```

## Content Model

- Content files: `.md`, `.mdx`
- Static assets: everything else in `contentDir` (except `siteConfig.json`)
- Routes:
  - `index.mdx` -> `/`
  - `guide/index.md` -> `/guide/`
  - `guide/intro.mdx` -> `/guide/intro/`
- Output pages are always `index.html` in folder routes.

## Config Resolution

Config comes from:

1. defaults,
2. `contentDir/siteConfig.json`,
3. runtime input (`buildSite(...)` / `startDevServer(...)`) as highest priority.

`siteConfig.json` schema: `schema/siteConfig.schema.json`.

### `SiteConfig` Fields

- `rootDir`: project root. Default is package root.
- `contentDir`: default `rootDir/sample-content`.
- `outDir`: default `rootDir/dist/site`.
- `siteTitle`: default `"ts-ssg"`.
- `logo`: brand fields for top bar.
- `style.fileName`: default `"site.css"`.
- `style.href`: default `"/assets/site.css"`.
- `style.themes`: must include `"light"` and `"dark"`.
- `style.pretty`: default `false`. Set `true` to format generated CSS with Prettier.
- `navigation`: auto/custom/hybrid/none behavior.
- `style.theme`: palette/radii/spacing/typography/shadows.
- `html.minify`: default `false`. Set `true` to minify generated HTML files.
- `sitemap`: sitemap + robots settings.
- `consent`: GDPR-style consent manager config for optional scripts.
- `analytics`: analytics integrations (GA4 supported out of the box).
- `pagefind`: search indexing options (for example excluded route prefixes).

## `siteConfig.json` Example

```json
{
  "$schema": "../schema/siteConfig.schema.json",
  "siteTitle": "Acme Docs",
  "outDir": "dist/site",
  "style": {
    "fileName": "site.css",
    "href": "/assets/site.css",
    "themes": ["light", "dark"],
    "pretty": false
  },
  "html": {
    "minify": false
  },
  "navigation": {
    "mode": "auto",
    "navFileName": "_nav.json",
    "maxDepth": 3,
    "includeIndex": true,
    "sortBy": "order"
  },
  "sitemap": {
    "enabled": true,
    "baseUrl": "https://docs.acme.com",
    "fileName": "sitemap.xml",
    "robots": {
      "enabled": true,
      "fileName": "robots.txt",
      "userAgent": "*",
      "allow": ["/"],
      "disallow": ["/private/"],
      "additionalSitemaps": [],
      "customDirectives": []
    }
  },
  "analytics": {
    "ga4": {
      "measurementId": "G-XXXXXXXX"
    }
  }
}
```

## Frontmatter

Known fields (custom fields are allowed):

```yaml
---
title: Getting Started
description: First steps
template: doc # doc | splash | custom template key
order: 10
hidden: false
draft: false
head:
  canonicalUrl: https://docs.acme.com/getting-started/
nav:
  title: Start Here
  order: 1
  badge: New
  icon: iconoir:star
  hidden: false
layout:
  navMode: sidebar # sidebar | drawer
  fullWidth: false
  showToc: true
  tocCollapsed: false
  showFooter: true
---
```

Notes:

- `layout.navMode` accepts only `sidebar` or `drawer` (invalid values throw).
- `draft: true` hides page from generated navigation.
- Title fallback order for nav: `nav.title` -> `title` -> first `# heading` -> filename.

## Navigation

Types:

- `auto`: generated from content.
- `custom`: from nav files only.
- `hybrid`: auto + nav files (merge/override per folder).
- `none`: disabled.

Exact behavior by mode (from `buildNavigation` + `resolveBaseFolderItems`):

- `auto`: builds only automatic navigation from content frontmatter/headings. Custom nav files are not read.
- `custom`: reads nav files and uses only their items.
- `hybrid`: reads nav files and combines them with auto items.
  - nav file with `mode: "override"` replaces auto items for that folder.
  - nav file with `mode: "merge"` appends to auto items and re-sorts.

Nav file name is configurable via `navigation.navFileName` and defaults to `_nav.json`.
Nav files are discovered per folder only in `custom` and `hybrid` modes.

Each nav file may be:

1. an array (treated as `override`), or
2. an object:

```json
{
  "mode": "merge",
  "items": [
    { "title": "Overview", "url": "/" },
    {
      "title": "Guide",
      "url": "/guide/",
      "children": [{ "title": "Install", "url": "/guide/install/" }]
    }
  ]
}
```

For object form, `mode` accepts `merge` or `override` and defaults to `merge`.
Supported nav item fields: `title`, `url|href|path`, `order`, `hidden`, `group`, `icon`, `children`.

## Templates

Built-in templates:

- `doc` (default)
- `splash`

Provide custom templates via `buildSite({ templates })`:

```ts
import { h, type TSNode } from '@purestack/ts-html'
import type { PageTemplateMap } from '@purestack/ts-ssg'

const templates: PageTemplateMap = {
  product: ({ head, bodyHtml }) =>
    h('html').push(
      head,
      h('body').push(h('main').attr({ class: 'product' }).raw(bodyHtml)),
    ) as TSNode<'html'>,
}
```

## Components and MDX

Built-in component sets are initialized automatically each build:

- alert: `alertBox`
- card grid: `card`, `cardGrid`
- consent: `consent`
- contact: `contactForm`
- expandable panel: `expandablePanel`
- panel: `panel`
- footer: `siteFooter`
- top bar: `topBar`
- logo: `siteLogo`
- navigation: `navMenu`, `navList`, `navItem`
- page toc: `pageToc`
- pricing: `pricingTable`, `pricingPlan`, `pricingFeature`
- search: `searchBox`
- tabs: `tabs`, `tabPane`
- theme switcher: `themeSwitcher`

Important rendering constraint: Regor components are rendered statically. Component state/events are not runtime-hydrated.

## Theming

Built-in skins export:

- `ocean`
- `evergreen`
- `pastel`
- `extrao`
- `cyberpunk`
- `neon`

Theme utilities:

- `builtInSkins`
- `themes.resolve(...)`
- `themes.setOptions(...)`
- `themes.getOptions()`
- `styleBuilder`

`style.themes` controls generated files:

- `assets/site.css` for `light`
- `assets/site.dark.css` for `dark`
- `assets/site.<theme>.css` for additional themes

## Markdown/MDX Compilation

- Markdown: `remark-parse` + `remark-gfm`
- MDX: `remark-parse` + `remark-gfm` + `remark-mdx`
- HTML output via HAST + rehype
- H2/H3 outline extraction for page TOC
- Optional Shiki highlighting

`BuildInput.mdx` options:

- `highlighter`: custom highlighter (`codeToHtml`)
- `themes`: `{ light, dark }` for Shiki
- `langs`: language list for Shiki
- `disableHighlighter`: skip highlighting

## Build Hooks

Hook into build lifecycle with `BuildHooks`:

- `onConfigResolved`
- `onContentDiscovered`
- `onNavigationBuilt`
- `onPageStart`
- `onPageRendered`
- `onPageWritten`
- `onStylesWritten`
- `onBuildComplete`

Build option:

- `writeErrorPages`: when true, render failures write an HTML error page to the target output path and an archive copy under `<outDir>/.ts-ssg/errors/`.

## Incremental Build and Manifest

`ts-ssg` stores incremental metadata at:

- `<outDir>/.ts-ssg/manifest.json`

Tracked:

- content file signatures (`mtimeMs`, `size`)
- asset signatures
- style signature
- config compatibility signature

In dev/watch mode:

- file changes apply incrementally when safe,
- site config changes trigger full rebuild,
- lazy route render can happen on first request for missing HTML route,
- live reload is served over SSE (`/__ts-ssg/events`).
- dev server enables `writeErrorPages` automatically so template/MDX errors are visible immediately at the failing route.

## Search and SEO

### Pagefind

Full builds run Pagefind indexing over `outDir` and write to:

- `<outDir>/pagefind`

Optional config:

- `pagefind.excludePaths`: array of route prefixes excluded from indexing (e.g. `["/privacy/", "/imprint/", "/terms/"]`).

Build logs include indexed page count and total indexed byte size.

### Sitemap / Robots

If enabled:

- sitemap written to `<outDir>/<sitemap.fileName>`
- robots written to `<outDir>/<sitemap.robots.fileName>` when `robots.enabled`

Validation:

- sitemap requires non-empty absolute `sitemap.baseUrl` when enabled.

## Consent Manager

`ts-ssg` can gate optional third-party scripts behind explicit consent.

Key behavior:

- no non-essential service scripts execute before consent,
- reject is as easy as accept (`accept all` and `reject non-essential`),
- users can reopen settings any time via a persistent privacy button,
- `policyVersion` invalidates previous consent when policy changes.

Example:

```json
{
  "consent": {
    "enabled": true,
    "policyVersion": "2026-02-12",
    "categories": [
      { "id": "necessary", "label": "Necessary", "required": true },
      { "id": "analytics", "label": "Analytics" }
    ],
    "services": [
      {
        "id": "ga4",
        "category": "analytics",
        "scripts": [
          {
            "src": "https://www.googletagmanager.com/gtag/js?id=G-XXXX",
            "async": true
          },
          {
            "content": "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);}"
          }
        ]
      }
    ]
  }
}
```

## GA4 Integration

Configure GA4 directly in `siteConfig.json`:

```json
{
  "analytics": {
    "ga4": {
      "measurementId": "G-XXXXXXXX"
    }
  }
}
```

Behavior:

- if consent is disabled, GA4 is injected directly in page head,
- if consent is enabled, GA4 is automatically added as a consent-gated service,
- defaults: `serviceId: "ga4"`, `consentCategory: "analytics"`.

## API Surface

Primary exports:

- `buildSite`
- `startDevServer`
- `resolveConfig` (`resolveSiteConfig`)
- `normalizeFrontmatter`, `parseFrontmatterSource`
- `buildNavigation`, `resolveNavigationConfig`, `resolvePageNavigation`
- `createMdxHighlighter`
- `componentRegistry`
- `defaultTemplates`, `resolvePageTemplate`
- `builtInSkins`, `themes`, `styleBuilder`

Useful types:

- `BuildInput`, `BuildResult`, `BuildHooks`
- `SiteConfig`, `PartialConfig`
- `DevServerInput`, `DevServerHandle`
- `PageFrontmatter`
- `NavigationConfig`, `NavigationTree`, `NavItem`
- `ThemeOptions`, `ThemePalette`
- `TsSsgContext`

## Build Result Shape

`buildSite(...)` returns:

```ts
type BuildResult = {
  outDir: string
  pages: number
  content?: { total: number; byExt: Record<string, number> }
  assets?: { total: number; byExt: Record<string, number> }
}
```

## Development (Package)

From repo root:

```bash
yarn workspace @purestack/ts-ssg build
yarn workspace @purestack/ts-ssg lint
yarn workspace @purestack/ts-ssg test
```

## License

MIT
