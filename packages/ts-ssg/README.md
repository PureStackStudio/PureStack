# @purestack/ts-ssg

TypeScript-first static site generator for Markdown and MDX, built on the PureStack toolchain.
It converts `.md`/`.mdx` content to HTML, runs custom Regor components during render, and emits
static pages plus CSS generated via `@purestack/ts-css`.

## Highlights
- Markdown + MDX pipeline powered by Unified (remark/rehype).
- Frontmatter-aware head config (title/description plus arbitrary head overrides).
- Regor component rendering in MDX/HTML (server-side, using a custom minimal DOM).
- CSS collected during render and emitted as static files.
- Simple, programmatic build API with sensible defaults.
- Build hooks and optional concurrency for extensibility and speed.

## How it works
1. **Discover content**: `discoverContent()` scans the content directory for `.md` and `.mdx`.
2. **Parse frontmatter**: `gray-matter` extracts frontmatter + body content.
3. **Compile MDX**: `compileMdxToHtml()` uses remark/rehype and custom MDX JSX handlers.
4. **Render components**: `renderApp()` boots a Regor app in the minimal DOM, mounts components, and
   returns HTML.
5. **Build page shell**: `renderPage()` creates `<html>`, `<head>`, and `<body>` using
   `@purestack/ts-html`, injecting the stylesheet link.
6. **Write output**: HTML pages are written to `dist/site`, plus generated CSS files.

## Project layout
- `src/build/`: build pipeline (page rendering, output paths, head resolution, IO).
- `src/mdx.ts`: MDX/Markdown compiler and JSX handling.
- `src/renderer.ts`: HTML shell renderer and stylesheet injection.
- `src/regor/`: DOM globals + Regor component registry and built-ins.
- `src/styles.ts`: CSS builder registry.
- `sample-content/`: example MDX/Markdown content.

## Configuration
`resolveConfig()` builds a `SiteConfig` from defaults + overrides.

Default values:
- `rootDir`: package root (derived from `src` location).
- `contentDir`: `<rootDir>/sample-content`
- `outDir`: `<rootDir>/dist/site`
- `siteTitle`: `ts-ssg`
- `styleFileName`: `site.css`
- `styleHref`: `/<styleFileName>`

## Usage

### Programmatic build
```ts
import { buildSite } from '@purestack/ts-ssg'

await buildSite({
  contentDir: './content',
  outDir: './public',
  siteTitle: 'My Docs',
  cleanOutDir: true,
  concurrency: 4,
})
```

### Running as a CLI entry
When the package entry is executed directly, it runs `buildSite()` and logs a build summary.
This is useful for scripted builds after `tsc` output is available.

### Dev server (serve + watch + live reload)
Run a fast static server that rebuilds on content changes and refreshes the browser.

```bash
node ./dist/ts-ssg.js --serve --port 4173
```

Flags:
- `--serve` (or `serve`/`dev`): start the dev server
- `--port <number>`: port to bind (default 4173)
- `--host <string>`: host to bind (default 127.0.0.1)
- `--no-watch`: disable watching
- `--no-reload`: disable live reload injection
- `--clean`: clean output directory on each rebuild

## Content and routes
- Supported extensions: `.md` and `.mdx`
- Output paths:
  - `index.mdx` -> `<outDir>/index.html`
  - `guide/overview.md` -> `<outDir>/guide/overview/index.html`
  - `guide/index.mdx` -> `<outDir>/guide/index.html`

## Frontmatter -> head config
`resolveHeadConfig()` inspects frontmatter keys:
- `title`: page title
- `description`: meta description
- `head`: object merged into the base head config

If `siteTitle` is set, the page title is composed as `"<title> | <siteTitle>"`,
or falls back to `siteTitle` when no page title is provided.

The base head config is defined in `src/head.ts` and includes charset, viewport,
Open Graph defaults, and a generator meta tag.

## Page templates (layouts)
Pages can select a template via frontmatter:

```md
---
title: API Reference
template: api
---
```

Built-in templates: `doc` (default) and `splash`.

You can provide custom templates when building:

```ts
import { buildSite, type PageTemplate } from '@purestack/ts-ssg'
import { h } from '@purestack/ts-html'

const apiTemplate: PageTemplate = ({ head, bodyHtml }) =>
  h('html').push(
    head,
    h('body').push(h('main').attr({ class: 'api' }).raw(bodyHtml)),
  )

await buildSite({
  templates: {
    api: apiTemplate,
  },
})
```

## Navigation menus
`@purestack/ts-ssg` can build navigation trees from your content folders and/or
custom menu files. Navigation data is exposed to page templates (but not
rendered by default), letting you decide the final UI.

Quick start (auto menus):

```ts
import { buildSite } from '@purestack/ts-ssg'

await buildSite({
  navigation: { mode: 'auto', maxDepth: 2 },
})
```

Custom per-folder menus:

```
content/
  _nav.json
  guide/
    _nav.json
    index.mdx
    intro.mdx
```

See `NAVIGATION.md` for the full spec.

## Regor components in MDX
Custom components are registered via `componentRegistry` and rendered by `renderApp()`.

```ts
import { componentRegistry } from '@purestack/ts-ssg'
import { createComponent, html } from 'regor'

componentRegistry.register(
  'banner',
  createComponent(() => ({ title: 'Hello' }), html`<div>Banner</div>`),
)
```

Built-in components are registered automatically:
- `cardGrid`
- `card`

Notes:
- MDX `import`/`export` lines are stripped during compilation.
- Components must be available in the registry at build time.

You can also pass components directly to `buildSite()`:

```ts
import { buildSite } from '@purestack/ts-ssg'
import { createComponent, html } from 'regor'

await buildSite({
  components: {
    banner: createComponent(html`<div>Banner</div>`, []),
  },
})
```

## Styles
Use `styleBuilder` to register CSS at build time. `writeStyles()` emits a CSS file for each
named style builder, plus the default stylesheet.

```ts
import { styleBuilder } from '@purestack/ts-ssg'

styleBuilder.select('body').set('font-family', 'system-ui')
```

## Build hooks
`buildSite()` accepts a `hooks` object for extending the pipeline.

```ts
import { buildSite, type BuildHooks } from '@purestack/ts-ssg'

const hooks: BuildHooks = {
  onPageRendered(_context, page) {
    console.log('rendered', page.urlPath)
  },
}

await buildSite({ hooks })
```

## Development notes
- Tests: `yarn workspace @purestack/ts-ssg test`
- Build: `yarn workspace @purestack/ts-ssg build`
