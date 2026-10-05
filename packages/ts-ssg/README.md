# `@purestack/ts-ssg`

Static site generator for Markdown/Regor MDX content with:

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
  siteConfig: {
    rootDir,
    contentDir,
    outDir,
    siteTitle: 'My Docs',
  },
})
```

## Quick Start (Dev Server)

```ts
import path from 'node:path'
import { startDevServer } from '@purestack/ts-ssg'

await startDevServer({
  build: {
    siteConfig: {
      rootDir: process.cwd(),
      contentDir: path.join(process.cwd(), 'content'),
      outDir: path.join(process.cwd(), 'dist', 'site'),
    },
  },
  host: '127.0.0.1',
  port: 4173,
})
```

## CLI Usage

`src/cli.ts` provides the CLI:

- `build`
- `serve`
- `publish`

Flags:

- `--content ./content` or `--content=./content` (required; directory must contain `siteConfig.json`)
- `--clean` (`build`, `serve`)
- `--port 4173` or `--port=4173` (`serve`)
- `--host 127.0.0.1` or `--host=127.0.0.1` (`serve`)
- `--no-watch` (`serve`)
- `--no-reload` (`serve`)
- `--full-render` (`serve`; render all pages and build the complete search index once at startup)

When the content directory holds a `purestack.config.ts`, every command loads its plugins; `serve` reloads it when it or a local file it imports changes. See [Plugins](#plugins).

Examples from this monorepo:

```bash
yarn tsx packages/ts-ssg/src/cli.ts build --content ./packages/ts-ssg/sample-content
yarn tsx packages/ts-ssg/src/cli.ts serve --content ./packages/ts-ssg/sample-content --port 4173
yarn frontend --clean --full-render
yarn tsx packages/ts-ssg/src/cli.ts publish --content ./packages/ts-ssg/sample-content
```

`sample-content` is the Waypoint starter site: a fictional team workspace with
connected marketing, dashboard, pricing, editorial, form, and guide pages. The
product details and data are illustrative. Start at `/guide/getting-started/`
after serving it, and review `/guide/launch-checklist/` before adapting it for
a real launch.

## Content Model

- Content files: `.md`, `.mdx`, `.rmdx`
- Shared content: a content file whose name, or a folder above it, starts with `_` is never a page. Pages show it with `<import-content src="./_shared.mdx"/>`, which inserts its Markdown before compilation. It has no frontmatter, its own import tags resolve from it, and an import cycle fails the build.
- Regor MDX files can use either `.mdx` or `.rmdx`.
  Use `.mdx` if you prefer the familiar MDX extension.
  Use `.rmdx` if you want to make the Regor-specific dialect explicit.
- Static assets: everything else in `contentDir` (except `siteConfig.json`)
- Routes:
  - `index.mdx` -> `/`
  - `guide/index.md` -> `/guide/`
  - `guide/guide.mdx` -> `/guide/`
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
- `outDir`: development output directory. Default `rootDir/dist/site`.
- `publishDir`: clean output directory used by the `publish` command. Default `rootDir/dist/publish`.
- `basePath`: optional public mount path such as `"/docs"` or `"/admin-panel"`. It prefixes generated public URLs without changing output file paths.
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
- `pagefind`: search indexing options.
- `preview`: site-level social/search preview defaults for canonical, Open Graph, and Twitter Card metadata.
- `i18n`: optional multilingual routing. Omit it for unchanged single-language behavior.

## `siteConfig.json` Example

```json
{
  "$schema": "../schema/siteConfig.schema.json",
  "siteTitle": "Acme Docs",
  "basePath": "/docs",
  "outDir": "dist/site",
  "publishDir": "dist/publish",
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
    "sortBy": "order",
    "tone": "neutral",
    "variant": "flat",
    "class": ""
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
  },
  "pagefind": {
    "enabled": true,
    "excludePaths": ["/privacy/"]
  },
  "preview": {
    "title": "Acme Docs",
    "description": "Practical documentation for Acme products.",
    "image": "/assets/preview.png",
    "imageAlt": "Acme Docs preview",
    "imageWidth": 1200,
    "imageHeight": 630,
    "twitterCard": "summary_large_image"
  },
  "i18n": {
    "defaultLocale": "en",
    "locales": ["en", "de"],
    "urlStrategy": "prefix-all"
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
preview:
  title: Getting Started
  description: First steps with Acme Docs
  image: /assets/previews/getting-started.png
  imageWidth: 1200
  imageHeight: 630
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
- `preview` overrides site-level preview defaults for the current page. Missing preview fields fall back to page `title` / `description`, then `siteConfig.preview`.

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
`navigation.roots` can mark folders as nav roots for descendant pages, e.g.
`"roots": ["docs"]` makes every page under `docs/` use the `docs` menu.

Each nav file may be:

1. an array (treated as `override`), or
2. an object:

```json
{
  "mode": "merge",
  "root": "reference",
  "pageLinks": true,
  "sequence": ["index.md", "github", "guide/", "guide/install.md"],
  "items": [
    { "id": "github", "title": "GitHub", "url": "https://github.com/acme/docs" },
    {
      "title": "Guide",
      "url": "/guide/",
      "children": [{ "title": "Install", "url": "/guide/install/" }]
    }
  ]
}
```

For object form, `mode` accepts `merge` or `override` and defaults to `merge`.
Supported nav item fields: `id`, `title`, `url|href|path`, `order`, `hidden`, `group`, `icon`, `children`.
Set `root` in a nav file to make pages in that folder and descendant folders
render a specific navigation root. Relative values resolve from the nav file
folder; leading-slash values resolve from the content root.
`sequence` orders the final mixed menu after auto and custom items are combined.
Entries are resolved relative to the nav file folder and are inherited by
descendant folders, so one root nav file can order nested pages like
`usage/transactions.md`. It can match auto pages (`getting-started.md`,
`getting-started`, `/docs/getting-started/`), auto folders (`usage/`,
`/docs/usage/`), or custom items by `id`. Unmatched menu entries are appended
using normal `sortBy`; unknown sequence entries are ignored.

Set `"pageLinks": true` in a nav file to render previous/next `BtnLink`
controls after doc page content. The links follow the final visible navigation
order, inherit into child folders, and skip external URLs.

## Plugins

A plugin is a named bundle of extensions: skins, components, templates, Markdown transforms, generated pages, build hooks, and dev server middleware. The [Plugins guide](https://purestack.studio/guides/extending/plugins/) walks through each part.

A site lists its plugins in `purestack.config.ts`, next to `siteConfig.json`, and the CLI loads it:

```ts
import { defineConfig } from '@purestack/ts-ssg'
import { productPlugin } from '../plugins/product'

export default defineConfig({ plugins: [productPlugin] })
```

The config and the local files it imports are bundled with esbuild when it loads; packages are imported from `node_modules`, and PureStack packages resolve to the copy running the build. `buildSite` and `startDevServer` do not look for the file: pass plugins through `options.plugins`, or give `startDevServer` the file as `configFile` to load and reload it as `serve` does. Config plugins apply after `options.plugins`.

```ts
import { h } from '@purestack/ts-html'
import { buildSite, definePlugin } from '@purestack/ts-ssg'
import { themeSkins } from '@purestack/ts-style'

const productPlugin = definePlugin({
  name: 'product',
  skins: {
    product: { create: () => themeSkins.standard.create() },
  },
  components: (config) => ({
    // Regor components, built from the resolved site config
  }),
  templates: {
    product: ({ head, bodyHtml }) =>
      h('html').push(
        head,
        h('body').push(h('main').attr({ class: 'product' }).raw(bodyHtml)),
      ),
  },
  hooks: {
    onPageRendered(context, page) {
      page.html = page.html.replace('</body>', '<!-- product --></body>')
    },
  },
})

await buildSite({
  siteConfig: { contentDir: './content', style: { theme: { skin: 'product' } } },
  options: { plugins: [productPlugin] },
})
```

Plugins apply in order:

- **Skins** are available while the site config resolves, so `style.theme.skin` can select one; they are removed afterwards and never leak into another build. A plugin skin cannot reuse a built-in skin's name, such as `standard`.
- **Components** are built from the resolved site config and may replace built-in components by name.
- **Templates** may replace the built-in `doc` and `splash` templates by name.
- **Markdown** remark and rehype plugins run in plugin order on every page and shared header or footer: remark on the Markdown tree, then rehype on the HTML tree, before outline collection and code highlighting. Regor markup reaches them as raw HTML nodes, and `file.path` is the content path with forward slashes.
- **Pages** generators return `{ path, source }` pages that build like files at those content paths. `source` is the text, or a function PureStack calls whenever it needs the text, without keeping what it returns. They see the site's content files, run on every build, and run again in the dev server whenever content or assets change; pages no longer generated are removed.
- **Hooks** run every plugin's handler for each lifecycle event, one after another. An error names the plugin it came from.
- **Dev middleware** sees each dev server request, except live reload, before the site; the first plugin to send headers handles it. Builds ignore it.

Each plugin is checked when the build starts. An unknown field or hook name, such as `onPageRender`, a value of the wrong type, two plugins sharing a name, or two plugins defining the same skin, component, template, or generated page fails the build with the plugin's name. For a single hook, pass an inline plugin: `{ name: 'site', hooks: { … } }`.

### Hooks

Every page render, in a full build or a dev server re-render, runs the page hooks:

- `onPageStart(context, file)`: before the page renders.
- `onPageDocument(context, page)`: on the rendered document, before it becomes HTML and before its links resolve. `page` holds the `document`, `file`, `frontmatter`, and `urlPath`. The hook may await: the document, and the global `document` with it, stay this page's while other pages render.
- `onPageRendered(context, page)`: after it becomes HTML; changes to `page.html` are written.
- `onPageWritten(context, page)`: after the HTML file is written.

Each full build also runs, in order:

- `onConfigResolved(context)`: before any output; register styles here.
- `onContentDiscovered(context, files)`: after content discovery, before pages render.
- `onNavigationBuilt(context, navigation)`
- `onStylesWritten(context, result)`
- `onBuildComplete(context, result)`

By default, the dev server prepares routes and shared navigation when it starts. Pages render on their first request and are cached until an edit affects them; static assets copy on request. Site or plugin config changes prepare a fresh request cache. Page hooks run only for pages that are requested; `onBuildComplete` belongs to full builds. With `--full-render` (or `startDevServer({ fullRender: true })`), startup runs one full build, including all pages, assets, and the complete search index. Site requests wait for that initial build to finish. After startup, watched changes use the same incremental invalidation and rendering on request as the default mode.

## Templates

Built-in templates:

- `doc` (default)
- `splash`

Add templates with a plugin's `templates` field and select one with the page's `template` frontmatter.

A template receives a `PageTemplateInput`: the prepared `head`, the compiled `bodyHtml`, the page's nearest `headerHtml` and `footerHtml`, `site` config, `navigation`, `outline`, and `pageInfo`, whose `frontmatter` keeps any custom fields the page defines.

## Components and Regor MDX

Every component in `@purestack/ts-components` is registered for each build, so content can use them directly. The [component reference](https://purestack.studio/components/) documents each one.

Add your own Regor components with a plugin's `components` field. A component registered as `productCard` is used as `<ProductCard>` in content.

Components render to static HTML at build time. For behavior in the browser, load a page script with `PageScript` or mount a browser-side Regor app with `RegorApp`.

## Theming

The built-in skin is `standard`. Select a skin with `style.theme.skin` in `siteConfig.json`.

Add skins with a plugin's `skins` field. `themeSkins` in `@purestack/ts-style` holds the registered skins; see the [Themes guide](https://purestack.studio/guides/styling/themes/) for creating one.

`style.themes` controls generated files:

- `assets/site.css` for `light`
- `assets/site.dark.css` for `dark`
- `assets/site.<theme>.css` for additional themes

## Markdown/Regor MDX Compilation

- Markdown: `remark-parse` + `remark-gfm`
- Regor MDX (`.mdx`, `.rmdx`): `remark-parse` + `remark-gfm` with Regor component markup preservation
- Plugin remark and rehype plugins, in plugin order
- HTML output via HAST + rehype
- `<import-codeblock src="./file.ts"/>` becomes a code block holding that file before compilation, anywhere a code block works; `src` resolves from the file the tag is in and must stay inside the content folder, and `lang` overrides the language inferred from the extension. Tags inside code stay as written, and the dev server re-renders the pages, headers, and footers that show a file when it changes.
- H2/H3 outline extraction for page TOC
- Code highlighting with highlight.js or Shiki

`siteConfig.mdx` options:

- `highlighter`: `"highlightjs"` (default) or `"shiki"`
- `disableHighlighter`: skip highlighting
- `compileMdAsMdx`: compile `.md` files as Regor MDX (default `true`); set `false` to keep `.md` as plain Markdown

## Build Options

- `plugins`: plugins to apply, in order; see [Plugins](#plugins).
- `cleanOutDir`: empty the output folder before building.
- `writeErrorPages`: when true, render failures write an HTML error page to the target output path and an archive copy under `<outDir>/.ts-ssg/errors/`. The dev server enables it.

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
- a page affected by a shared change, such as a header, footer, or navigation edit, renders again on its next request, before it is served,
- site config changes refresh shared state and invalidate cached pages,
- a change to `purestack.config.ts` or a local file it imports loads the config again and invalidates cached pages,
- plugin generated pages regenerate when content or assets change,
- pages render only when requested, including after file edits,
- live reload is served over SSE (`/__ts-ssg/events`).
- dev server enables `writeErrorPages` automatically so template/MDX errors are visible immediately at the failing route.

## Search and SEO

### Pagefind

When enabled, full builds run Pagefind indexing over `outDir` and write to:

- `<outDir>/pagefind`

Optional config:

- `pagefind.enabled`: enables Pagefind indexing and the built-in search runtime. Defaults to `true`.
- `pagefind.excludePaths`: array of route prefixes excluded from indexing (e.g. `["/privacy/", "/imprint/", "/terms/"]`).

When `basePath` is configured, the search runtime loads Pagefind from the public mount path while Pagefind indexing still reads the normal output directory.

In the default dev server mode, requesting a Pagefind asset builds the search index from pages rendered in the current session. Unopened pages are not compiled for search. Full builds index the complete site; `serve --full-render` starts with that complete index, then handles watched changes incrementally.

When disabled, stale `<outDir>/pagefind` output is removed. Build logs include indexed page count and total indexed byte size when indexing runs.

### Sitemap / Robots

If enabled:

- sitemap written to `<outDir>/<sitemap.fileName>`
- robots written to `<outDir>/<sitemap.robots.fileName>` when `robots.enabled`

Validation:

- sitemap requires non-empty absolute `sitemap.baseUrl` when enabled.
- sitemap and robots URLs include `basePath` when configured.

### Social Previews

`siteConfig.preview` provides defaults for generated canonical, Open Graph, and
Twitter Card metadata. Page frontmatter can override only the fields that differ.
Relative preview images are resolved against `sitemap.baseUrl` and include
`basePath` when configured. Declare `imageWidth` and `imageHeight` when the
dimensions are known so preview crawlers can render cards without probing the
image first. Explicit `head` frontmatter still wins for custom metadata.

### Multilingual Sites

i18n is opt-in. Without `siteConfig.i18n`, existing content routes and output
paths are unchanged.

When i18n is enabled, localized content lives under configured locale folders.
Content outside those folders remains ordinary global site content:

```txt
content/
  index.mdx
  about.mdx
  en/
    index.mdx
    docs/index.md
  de/
    index.mdx
    docs/index.md
```

Supported URL strategies:

- `prefix-all`: public URLs include the locale, e.g. `/en/docs/` and `/de/docs/`.
- `hidden`: output is still written under locale folders, but canonical public
  routes stay unprefixed, e.g. `/docs/`. Hosts can select the locale using
  `?lang=tr`, the configured cookie, `Accept-Language`, then `defaultLocale`.

Rendered pages expose `locale`, `locales`, `defaultLocale`, and
`resolveLocaleHref(locale)` through `TsSsgContext`. The default templates add
`<html lang="...">`. Prefixed i18n pages emit canonical and `hreflang`
alternate links when localized URLs are distinct.

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

Functions:

- `buildSite`, `startDevServer`, `runCli`
- `definePlugin`, `defineConfig`
- `resolveSiteConfig`
- `normalizeFrontmatter`, `parseFrontmatterSource`
- `buildNavigation`, `resolveNavigationConfig`, `resolvePageNavigation`
- `createMdxHighlighter`, `DEFAULT_MDX_CODE_LANGS`, `DEFAULT_MDX_CODE_THEMES`
- `defaultTemplates`, `resolvePageTemplate`

Types:

- Build: `BuildInput`, `BuildOptions`, `BuildResult`, `BuildCountSummary`, `PublishOptions`
- Plugins and hooks: `PureStackPlugin`, `PureStackConfig`, `PureStackMarkdown`, `GeneratedPage`, `PageGenerationContext`, `BuildHooks`, `BuildContext`, `ResolvedContentFile`, `PageDocument`, `PageRenderResult`, `NavigationTree`, `WriteStylesResult`
- Templates: `PageTemplateMap`, `PageTemplate`, `PageTemplateInput`, `PageInfo`, `PageFrontmatter`
- Config and components: `SiteConfig`, `SiteConfigInput`, `TsSsgContext`
- Dev server: `DevServerInput`, `DevServerOptions`, `DevServerHandle`
- Highlighting: `MdxCodeHighlighter`, `MdxCodeLangs`, `MdxCodeThemes`

Related packages: `@purestack/ts-html` builds template markup (`h`), `@purestack/ts-style` provides skins (`themeSkins`, `ThemeSkin`), and `@purestack/ts-components` provides the built-in components.

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
