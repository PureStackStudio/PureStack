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
- `--out 2` or `--out=2` (`build`, `serve`; use `<outDir>-2` instead of `outDir`, such as `dist/site-2`; the name takes lowercase letters, digits, and hyphens)
- `--clean` (`build`, `serve`; empty the output directory and ignore its incremental manifest)
- `--no-cache` (`build`, `serve`, `publish`; skip persistent plugin caches outside the output directory, such as highlighted code and optimized images)
- `--port 4173` or `--port=4173` (`serve`)
- `--host 127.0.0.1` or `--host=127.0.0.1` (`serve`)
- `--no-watch` (`serve`)
- `--no-reload` (`serve`)
- `--full-render` (`serve`; render all pages and build the complete search index once at startup)

When the content directory holds a `purestack.config.ts`, every command loads its plugins; `serve` reloads it when it or a local file it imports changes. See [Plugins](#plugins).

`build`, `serve`, and `publish` lock their output directory (`publishDir` for `publish`) before building, so a second command targeting it fails immediately instead of cleaning it. Commands with different outputs run side by side, which is why `outDir` and `publishDir` must be the same directory or separate ones, never nested. `serve` keeps one output and its lock until it closes; restart it after changing `outDir`. Locks cover commands on the same machine. A killed command, including one stopped with Ctrl+C or restarted by a watcher, frees its output at once. To run a second server for the same site, give it its own output and port: `purestack serve --content ./content --out 2 --port 4174`.

Commands write only into output directories PureStack owns, marked by a `.purestack-output` file. A new or empty directory is claimed and marked; a directory holding other files without the marker is refused, never written into or cleaned. `--clean` and `publish` empty an owned output but keep its marker. Neither `outDir` nor `publishDir` may be a filesystem root, or be or contain the content directory, `rootDir`, the working directory, or the home directory.

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
    {
      "id": "github",
      "title": "GitHub",
      "url": "https://github.com/acme/docs"
    },
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

Nine plugins provide the standard site features and are enabled automatically for builds, publishing, and the development server:

| Package                      | Factory                 | Features                                                                                                                                     |
| ---------------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `@purestack/ts-components`   | `componentsPlugin()`    | Standard Regor components, SVG icons, and component styles                                                                                   |
| `@purestack/ts-theme`        | `themePlugin()`         | `doc` and `splash` layouts, theme CSS files and links, critical colors, theme switching, generated favicons, and Markdown table presentation |
| `@purestack/ts-page-scripts` | `pageScriptsPlugin()`   | Menus, code copying, search UI, table of contents, Tabs, and Modal runtimes                                                                  |
| `@purestack/ts-page-scripts` | `authStateHintPlugin()` | Early signed-in state hint                                                                                                                   |
| `@purestack/ts-page-scripts` | `consentPlugin()`       | Consent browser runtime                                                                                                                      |
| `@purestack/ts-page-scripts` | `analyticsPlugin()`     | Direct or consent-managed GA4 integration                                                                                                    |
| `@purestack/ts-seo`          | `seoPlugin()`           | Social previews, canonical URLs, and translated alternate links                                                                              |
| `@purestack/ts-highlight`    | `highlightPlugin()`     | Shiki and highlight.js backends and configured default selection                                                                             |
| `@purestack/ts-pagefind`     | `pagefindPlugin()`      | Full-build and lazy development search indexing                                                                                              |

These factories and `createDefaultPlugins()` are also exported from `@purestack/ts-ssg` and `purestack`. The stylesheet provider initializes before component factories. Components and templates resolve before every plugin's `onConfigResolved` hook runs in plugin order. Names do not change that order. Components are scoped to each build; config hooks can override them through `context.components`.

Plugins can supply a `head` template, with the same input as a page template and a `TSNode<'head'>` result. Head templates compose in plugin order before the page template, so page templates can inspect or change the complete head. The lifecycle hook set is unchanged.

Metadata defaults compose through `headConfig({ site, pageInfo })` in plugin order, before explicit frontmatter `head` overrides and before head markup is rendered. It returns `BasicHeadConfig` or a promise. The SEO plugin uses this contribution for Open Graph, Twitter, canonical URLs, and translated alternate links; page templates receive the completed `headConfig`. Basic titles, descriptions, explicit head settings, and `index: false` enforcement remain in core.

Auth hints, consent, and analytics are independent plugins in `ts-page-scripts`. The analytics plugin contributes automatic GA4 consent services during configuration resolution, before any factory or lifecycle hook runs. Omitting it removes automatic registration and direct tracking scripts. Explicitly configured consent services remain available. Analytics never bypasses enabled consent when the consent runtime plugin is omitted.

The theme plugin supplies `styles(config)`, which returns the `SiteStyles` writer used for full builds and lazy development assets. Only one plugin can supply it. Component, template, and default highlighter contributions marked `defaults: true` may be overridden by ordinary contributions; this flag controls merge precedence and never schedules hooks or factories. Conflicts within either group remain errors.

To choose the integrations explicitly, set `defaultPlugins: false` in `siteConfig.json` and list the plugins you want:

```json
{
  "defaultPlugins": false,
  "plugins": [
    "@purestack/ts-theme#themePlugin",
    "@purestack/ts-components#componentsPlugin"
  ]
}
```

The same selection is available in `purestack.config.ts` (or `options.defaultPlugins` programmatically):

```ts
import { componentsPlugin, defineConfig, themePlugin } from '@purestack/ts-ssg'

export default defineConfig({
  defaultPlugins: false,
  plugins: [themePlugin(), componentsPlugin()],
})
```

This keeps the standard layouts and components while omitting automatic social metadata, page runtimes, code highlighting, and search indexing. Theme switching, generated favicons, and Markdown table wrappers stay with the theme plugin. Tabs and Modal embeds belong to the page scripts plugin and are omitted with it. Without the theme plugin, provide templates through another plugin. Extension templates and components can still override the standard ones. Explicitly listing a standard plugin while defaults are enabled replaces that plugin by name without adding a second instance; it retains its initialization position. Duplicate names within the supplied plugin list are errors.

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
  siteConfig: {
    contentDir: './content',
    style: { theme: { skin: 'product' } },
  },
  options: { plugins: [productPlugin] },
})
```

Plugins apply in order:
- **Skins** are available while the site config resolves, so `style.theme.skin` can select one; they are removed afterwards and never leak into another build. A plugin skin cannot reuse a built-in skin's name, such as `standard`.
- **Components** are built from the resolved site config and may replace built-in components by name.
- **Templates** may replace the built-in `doc` and `splash` templates by name.
- **Markdown** remark and rehype plugins run in plugin order on every page and shared header or footer: remark on the Markdown tree, then rehype on the HTML tree, followed by `rehypePostPlugins` for final presentation, before outline collection and code highlighting. Regor markup reaches them as raw HTML nodes, and `file.path` is the content path with forward slashes.
- **Pages** generators return `{ path, source }` pages that build like files at those content paths. `source` is the text, or a function PureStack calls whenever it needs the text, without keeping what it returns. They see the site's content files, run on every build, and run again in the dev server whenever content or assets change; pages no longer generated are removed.
- **Hooks** run every plugin's handler for each lifecycle event, one after another. An error names the plugin it came from.
- **Dev middleware** sees each dev server request, except live reload, before the site; the first plugin to send headers handles it. Builds ignore it.
- **Assets** processors inspect the completed page document, resolve local sources, and emit owned files. Core tracks their dependencies and output ownership across full builds and lazy development requests.

Each plugin is checked when the build starts. An unknown field or hook name, such as `onPageRender`, a value of the wrong type, two plugins sharing a name, or two plugins defining the same skin, component, template, or generated page fails the build with the plugin's name. For a single hook, pass an inline plugin: `{ name: 'site', hooks: { … } }`.

### Optional image optimization

Install `@purestack/ts-images` and list it in `siteConfig.json` to optimize local raster images. It is not included in the default set and no TypeScript config is required:

```json
{
  "plugins": ["@purestack/ts-images#imagesPlugin"],
  "extensions": {
    "images": { "widths": [480, 960, 1440] }
  }
}
```

For callbacks or custom factory defaults, use `purestack.config.ts`:

```ts
import { defineConfig } from '@purestack/ts-ssg'
import { imagesPlugin } from '@purestack/ts-images'

export default defineConfig({
  plugins: [imagesPlugin({ widths: [480, 960, 1440] })],
})
```

Rendered images receive responsive AVIF/WebP sources, JPEG/PNG fallbacks, dimensions, and loading defaults. Author attributes are preserved, and original assets remain available. Remote images, SVGs, animations, and existing responsive markup pass through. See the [image plugin README](../ts-images/README.md) for presets, opt-outs, caching, limits, and diagnostics.

### Asset processors

An optional `assets(config)` factory returns a `SiteAssets` processor, or `undefined` to disable it. Each processor declares a unique lowercase `namespace` (letters, digits, `_`, and `-`) and a `processPage(input)` function. Processors run in plugin order after all `onPageDocument` hooks and before content URLs are rewritten. Their state belongs to one site.

The factory creates one processor per build/session. A page awaits each processor in order, but lazy requests for different pages may invoke the same processor concurrently. Keep page-local state inside the call and coordinate shared queues or caches inside the processor. A config reload creates new processors. Full-build completion hooks do not run for individual lazy requests.

`input.document` is the rendered DOM, including component output. `await input.resolveSource(element, url)` resolves local assets using shared-content provenance and locale fallback, records source dependencies, and returns `{ relPath, absPath, publicPath }`. It returns `undefined` for external URLs. Sources must remain inside the content root. `input.dependOn(relPath)` records additional content-relative dependencies, including missing files that may appear later.

`await input.emit(fileName, bytes)` writes a `Uint8Array` under `/assets/<namespace>/` and returns an encoded root-relative URL. Use immutable, content-addressed filenames: emitting different bytes under the same name is an error. Core applies the site's base path during URL rewriting. Await all emission work before `processPage` returns, and inspect template fragments explicitly when relevant; `querySelectorAll` does not traverse their content.

Core verifies existing output bytes on first use in each build/session. Repeated emissions reuse successful verification while file identity, size, and modification/change timestamps remain unchanged; changed files are checked again and repaired when necessary. Different-sized files are replaced without reading their obsolete contents. Symlink checks still run for every emission, and pruning or a new build clears the verification state.

Input methods expire when their processor call completes. Outstanding source-resolution or emission work fails the page; core waits for it to settle before cleanup. Saved handles cannot register dependencies or emit files later. Later processors see earlier DOM changes, but `resolveSource` resolves original content files only: an emitted URL is not implicitly added to the source inventory. Combine dependent transforms inside one processor when they need intermediate bytes.

Core persists per-page dependencies and output references in the build manifest. Source edits invalidate dependent pages. Shared outputs remain until their final referencing page changes or disappears; failed renders release pending outputs. Removing a processor cleans up its recorded outputs. Source assets are retained, and generated outputs cannot overwrite them. Do not write these files directly from hooks: `emit` supplies ownership, safe paths, and atomic writes.

Core registers actual compiled-script output paths, including cache-busted names, and rejects collisions regardless of which producer runs first. Processor instances, receipts, and ownership operations are private builder state; lifecycle hooks receive the public build context and page result.

### Plugin configuration

`siteConfig.json` can select installed plugins through a `plugins` array. Use `package#exportName` to select a named JavaScript export, or just `package` for its default export. Package subpaths work too: `package/subpath#exportName`. Each selected export must be a plugin object or a no-argument factory; factories may be asynchronous and run once per builder/session. A package can expose several plugins without a default export:

```json
{
  "plugins": [
    "@purestack/ts-page-scripts#consentPlugin",
    "@purestack/ts-page-scripts#analyticsPlugin"
  ]
}
```

The suffix is the exported symbol's name, not the returned plugin's `name`. A missing export is an error. Repeating a selection (including `package` together with `package#default`) or selecting different exports with the same plugin name is an error. Install packages in the site project; the loader never downloads them. Both JSON declarations and TypeScript config imports use PureStack's own copy of a package when available, keeping shared registries together; other packages resolve from the site. Each plugin still owns its configuration namespace, for example `extensions.images`.

Plugin declarations execute installed JavaScript with the build process's permissions; treat changes to `plugins` as code changes, including when other site settings are edited through a CMS.

JSON declarations compose with the standard plugins and `purestack.config.ts`. An explicit TypeScript/programmatic instance replaces a JSON-selected plugin with the same `name`. The JSON `defaultPlugins` flag defaults to `true`; set it to `false` to disable the automatic set and use only declared or explicitly supplied plugins. This also works without a `plugins` array. An explicit TypeScript/programmatic `defaultPlugins` value overrides the JSON flag. Build, publish, the programmatic builder, and the dev server all use this selection path. Changes to `siteConfig.json` recreate the dev builder and its middleware; restart the server after updating an installed package.

The synchronous `resolveSiteConfig` helper normalizes settings using its explicitly supplied plugin instances and `options.defaultPlugins`; it does not apply JSON plugin selection (`plugins` or `defaultPlugins`) or load `purestack.config.ts`.

`resolveSiteConfig(input)` returns `DefaultSiteConfig` when using the untouched standard plugin set. Supplying `options.plugins` returns `SiteConfig`, even with defaults enabled: entries can replace standard plugins by name and remove their configuration guarantees.

Plugins contribute configuration through optional, synchronous `config.resolve`, `config.normalize`, and `config.finalize` functions, each receiving `{ config, input, file }` and returning an object to merge into config. Do not mutate the inputs. All resolvers run first in plugin order to supply defaults and overrides. All normalizers then validate and canonicalize the completed overrides. Finally, all finalizers derive dependent settings from the normalized config. Finalizers should not change the inputs used by other finalizers. Every phase finishes before highlighters, Markdown processors, styles, search providers, components, and templates initialize. Analytics derives its automatic GA4 consent service only after every normalizer finishes, regardless of plugin order. The existing `onConfigResolved` hook still runs after factories. Publishing applies its output-directory and minification overrides after configuration composition.

Custom site settings belong under `extensions` in `siteConfig.json`. File values merge with programmatic input, which takes precedence. The standard JSON schema allows plugin namespaces here while continuing to reject unknown top-level fields. Each plugin owns validation, defaults, and normalization for its namespace. Other namespaces are preserved.

`resolve` and `normalize` receive `SiteConfigDraft`: core fields are available, while plugin sections and nested extension values may still be partial. Every selected owner's normalizer runs before `finalize`, whose `SiteConfigFinalizer` receives normalized `SiteConfig`. Factories also receive normalized settings. Type augmentation describes the owning plugin's settings; it does not install that plugin. A plugin consuming another owner's settings must select that owner or validate those inputs itself.

```json
{ "extensions": { "brand": { "label": "Acme" } } }
```

Use TypeScript module augmentation for typed settings:

```ts
import { definePlugin } from 'purestack'

declare module '@purestack/ts-common' {
  interface SiteExtensions {
    brand?: { label: string }
  }
}

export const brandPlugin = definePlugin({
  name: 'brand',
  config: {
    resolve({ config }) {
      const brand = config.extensions.brand
      if (
        brand !== undefined &&
        (brand === null ||
          typeof brand !== 'object' ||
          typeof brand.label !== 'string')
      ) {
        throw new Error('extensions.brand requires a string label.')
      }
      return { extensions: { brand: { label: brand?.label ?? 'Docs' } } }
    },
  },
  components(config) {
    // config.extensions.brand contains the normalized settings here.
    return {}
  },
})
```

`resolveSiteConfig(input, { plugins, defaultPlugins })` composes the supplied plugin instances with the standard plugins by default. Plugin-owned sections (`style`, `docLayout`, `pageToc`, `logo`, `auth`, `consent`, `analytics`, `pagefind`, and `preview`) are optional in `SiteConfig`: an omitted plugin does not supply defaults or validate its unused input. A replacement plugin reads its settings from `input` and `file`, then contributes normalized config. Analytics also resolves explicitly configured consent when its browser runtime is omitted, so enabled consent is never bypassed. Configuration contributions are synchronous and may run whenever a project configuration is resolved; keep file writes and other side effects in lifecycle hooks.

`config.cache` is `false` when a run uses `--no-cache` or `options.cache: false`. A plugin that keeps a persistent cache outside the output directory should neither read nor write it then. Site settings cannot change this flag, and it never invalidates incremental output.

Builder style state is isolated across asynchronous operations, including concurrent sites. Its owned theme options remain linked to `context.config.style.theme`, so in-place config-hook changes and `themes.setOptions` update page colors, CSS, and generated favicons consistently. Head, metadata, template, Markdown, provider, and lifecycle errors identify their owning plugin and preserve the original cause. Markdown wrappers preserve unified presets, duplicate-plugin option merging, and callback transforms.

### Code highlighting

Use `markdown.resolveHighlighter(lang)` to select a code-to-HTML callback for a language:

```ts
import { definePlugin } from '@purestack/ts-ssg'
import { renderCustomCode } from './custom-code'

export const customCodePlugin = definePlugin({
  name: 'custom-code',
  markdown: {
    resolveHighlighter: (lang) => (lang === 'custom' ? renderCustomCode : null),
  },
})
```

The resolver can be synchronous or asynchronous and receives the trimmed, lowercase language, or `''` when absent. Its callback accepts `(code, lang?)` and returns the HTML as `string | Promise<string>`. Resolvers are awaited in plugin order; the first callback returned handles the block. If all return `null`, the configured default highlighter handles it, including its existing behavior for unknown languages.

Custom callbacks also work when `mdx.disableHighlighter` is `true`. In that case, if all resolvers return `null`, the source is HTML-escaped and displayed in a plain `<pre><code>` block without syntax highlighting.

#### Default highlighter provider

The default `highlightPlugin()` comes from `@purestack/ts-highlight`. It selects Shiki or highlight.js from `mdx.highlighter`, initializes the selected backend once, and skips creation when `mdx.disableHighlighter` is true. Its adapters preserve language aliases, tagged TypeScript templates, and light/dark themes.

To configure the native Shiki factory, replace the default plugin:

```ts
import { highlightPlugin } from '@purestack/ts-highlight'
import { defineConfig } from '@purestack/ts-ssg'
import { createHighlighter } from 'shiki'
import grammar from './mylang.tmLanguage.json' with { type: 'json' }

export default defineConfig({
  plugins: [
    highlightPlugin({
      createShiki: (options) =>
        createHighlighter({
          ...options,
          langs: [...options.langs, grammar],
        }),
    }),
  ],
})
```

The same plugin accepts `createHighlightJs()`, which returns a configured highlight.js instance synchronously or asynchronously. Use `hljs.newInstance()` and register the grammars you need to avoid mutating the shared registry. Backend-specific factories belong to `HighlightPluginOptions`; the SSG plugin API uses the backend-independent `markdown.createHighlighter(config)` contract.

A custom `markdown.createHighlighter({ mdx, cache })` receives the MDX configuration and the run's cache policy, and returns an object with `codeToHtml(code, lang?)`, or `undefined` to leave source unhighlighted. The standard Shiki backend reuses highlighted code across builds from a cache in the OS temporary directory; `cache` is `false` for `--no-cache` runs. An ordinary provider replaces the default without initializing it. Competing providers in the same precedence group fail before either initializes. Per-language `resolveHighlighter(lang)` callbacks still run before the selected provider.

Highlighters may also return `flush(): void | Promise<void>` to persist buffered computation results. Core awaits it after full builds, change batches, and lazy development renders, including failed batches. Resolver composition preserves the provider's flush method. Standalone consumers must await it themselves after rendering. `PersistentCache` from `@purestack/ts-util-node` supplies buffered JSON shards, separate files for large/binary values, and inter-process merging for build-time plugins and components; pass `enabled: cache` and return `flush: () => persistentCache.flush()` from a cached highlighter.

### Search providers

The default `pagefindPlugin()` comes from `@purestack/ts-pagefind` and supplies `search(config): SiteSearch`. The builder calls its `write({ outDir, excludeFiles, onlyFiles })` method after a full build and when its `ownsPath(pathname)` matches a lazy development request. `excludeFiles` contains the output paths excluded by `index: false`; `onlyFiles` limits lazy indexing to pages rendered in this session. The builder coordinates revisions and concurrent requests, so content edits and deletions invalidate search output.

Only one search provider may be installed. Replace `purestack:pagefind` by name, or set `defaultPlugins: false` and supply your own provider. A provider uses decoded URLs relative to the site's base path. Pagefind continues to honor `pagefind.enabled`, exclusions, output cleanup, and its existing warning behavior. The browser search runtime remains owned by `ts-page-scripts`.

### Hooks

Every page render, in a full build or a dev server re-render, runs the page hooks:
- `onPageStart(context, file)`: before the page renders.
- `onPageDocument(context, page)`: on the rendered document, before it becomes HTML and before its links resolve. `page` holds the `document`, `file`, `frontmatter`, `urlPath`, and recorded `runtimeEmbeds`. The hook may await: the document, and the global `document` with it, stay this page's while other pages render.
- `onPageRendered(context, page)`: after it becomes HTML; changes to `page.html` are written.
- `onPageWritten(context, page)`: after the HTML file is written.

Each full build also runs, in order:
- `onConfigResolved(context)`: before any output; register styles here.
- `onContentDiscovered(context, files)`: after content discovery, before pages render.
- `onNavigationBuilt(context, navigation)`
- `onStylesWritten(context, result)`
- `onBuildComplete(context, result)`

By default, the dev server prepares routes and shared navigation when it starts. Pages render on their first request and are cached until an edit affects them; static assets copy on request. Site or plugin config changes prepare a fresh request cache. Page hooks run only for pages that are requested; `onBuildComplete` belongs to full builds. With `--full-render` (or `startDevServer({ fullRender: true })`), startup runs one full build, including all pages, assets, and the complete search index. Site requests wait for that initial build to finish. After startup, watched changes use the same incremental invalidation and rendering on request as the default mode.

An initial build error is logged while the dev server keeps watching for fixes.
Embedded callers can set `startDevServer({ failOnInitialBuildError: true })` to
reject startup and close the server instead. PurStack Forge previews use this option to
report startup failures.

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

TypeScript page scripts share Regor automatically, including imports from their component dependencies. Add other browser ESM libraries through `scripts.sharedLibraries` in `siteConfig.json`:

```json
{
  "scripts": {
    "sharedLibraries": ["my-library", "my-library/extra"]
  }
}
```

List exact package import specifiers, including any subpaths used by page scripts. Regor is always included. Shared entries build together so their common dependencies also share one module instance. Generated modules live under `assets/runtime/` with content-hashed filenames; their URLs stay the same when only a page script changes. Page scripts continue to build independently.

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
- `<import-codeblock src="./file.ts"/>` becomes a code block holding that file before compilation, anywhere a code block works; `src` resolves from the file the tag is in and must stay inside the content folder, and `lang` overrides the language inferred from the extension. Both import tags register their files during rendering, including nested imports and imports in headers, footers, and generated pages. Full builds copy static assets after rendering and exclude these registered files. In lazy dev mode, an importing page's first render excludes its imports and removes any copies already in the output folder; removing the last import makes the file available as a static asset again after re-rendering. Tags inside code stay as written, and the dev server re-renders the pages, headers, and footers that show a file when it changes.
- H2/H3 outline extraction for page TOC
- Code highlighting with highlight.js or Shiki

`siteConfig.mdx` options:
- `highlighter`: `"highlightjs"` (default) or `"shiki"`
- `disableHighlighter`: skip highlighting
- `compileMdAsMdx`: compile `.md` files as Regor MDX (default `true`); set `false` to keep `.md` as plain Markdown

## Build Options

- `plugins`: plugins to apply, in order; see [Plugins](#plugins).
- `cleanOutDir`: empty the output folder before building, keeping its `.purestack-output` marker.
- `outName`: build into `<outDir>-<outName>` instead of `outDir`, so a second build or dev server can run beside the default output. Lowercase letters, digits, and hyphens; not available with publish.
- `writeErrorPages`: when true, render failures write an HTML error page to the target output path and an archive copy under `<outDir>/.ts-ssg/errors/`. The dev server enables it.

## Incremental Build and Manifest

`ts-ssg` stores incremental metadata at:
- `<outDir>/.ts-ssg/manifest.json`

Tracked:
- content file signatures (`mtimeMs`, `size`)
- asset signatures
- style signature
- config compatibility signature

Builds delete outputs the manifest records when their sources go away. A manifest that records an output outside `outDir` is ignored, and every deletion refuses a path outside `outDir` or through a symlinked folder.

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
`resolveLocaleHref(locale)` through `PageContext`. The default templates add
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

## Embedded servers and WebSockets

`startDevServer()` resolves after listening and initial shared setup. Its handle
provides the actual `url` (including `basePath`) and an idempotent async `close()`.
Use `port: 0` to select an available port and `handleSignals: false` when an
embedding application owns shutdown.
Set `logLevel: 'WARN'` to initialize the default logger with warnings and errors
only. An existing caller-owned logger is preserved.

Optional `webSockets` endpoints share the existing HTTP listener:

```ts
const server = await startDevServer({
  host: '127.0.0.1',
  port: 0,
  handleSignals: false,
  build: { siteConfig: { contentDir: './content' } },
  webSockets: [
    {
      path: '/events',
      connect(peer) {
        peer.send('Connected')
        peer.onMessage((message) => peer.send(message))
        peer.onClose(() => console.log('Disconnected'))
      },
    },
  ],
})
console.log(server.url)
// Later: await server.close()
```

Each endpoint has an exact `path`, an optional `maxPayload` in bytes (default
1 MiB), and an optional synchronous `authorize(request)` callback. Returning
false rejects the upgrade with HTTP 403. Use authorization and origin checks for
endpoints that expose local operations. Paths are independent of the site's
`basePath`; unmatched upgrades receive 404. Connections send and receive strings
or binary `Uint8Array` messages. Listener registration returns unsubscribe
functions. Shutdown closes WebSocket peers and live-reload streams too.

## API Surface

Functions:
- `buildSite`, `startDevServer`, `runCli`
- `definePlugin`, `defineConfig`
- `resolveSiteConfig`
- `normalizeFrontmatter`, `parseFrontmatterSource`
- `buildNavigation`, `resolveNavigationConfig`, `resolvePageNavigation`
- `highlightPlugin`, `pagefindPlugin`; backend helpers such as `createMdxHighlighter` are exported by `@purestack/ts-highlight`
- `defaultTemplates`, `resolvePageTemplate`

Types:
- Build: `BuildInput`, `BuildOptions`, `BuildResult`, `BuildCountSummary`, `PublishOptions`
- Plugins and hooks: `PureStackPlugin`, `PureStackConfig`, `PureStackMarkdown`, `GeneratedPage`, `PageGenerationContext`, `BuildHooks`, `BuildContext`, `ResolvedContentFile`, `PageDocument`, `PageRenderResult`, `NavigationTree`, `WriteStylesResult`
- Templates: `PageTemplateMap`, `PageTemplate`, `PageTemplateInput`, `PageInfo`, `PageFrontmatter`
- Config and components: `SiteConfig`, `SiteConfigInput`, `PageContext`
- Dev server: `DevServerInput`, `DevServerOptions`, `DevServerHandle`, `DevWebSocketEndpoint`, `DevWebSocketConnection`, `DevWebSocketMessage`
- Highlighting: `MdxCodeHighlighter`, `MdxCodeLangs`, `MdxCodeThemes`, `MdxShikiFactory`

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
