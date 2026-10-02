# PureStack

**Build content sites and interactive pages with Markdown, components, and TypeScript.**

PureStack turns a content directory into a static website. Write pages in
Markdown or Regor MDX, use built-in components where they help, and add
browser-side TypeScript only where a page needs behavior. The CLI handles
routes, styles, assets, development preview, and release builds.

[Documentation](https://purestack.studio/guides/) | [Component catalog](https://purestack.studio/components/) | [npm package](https://www.npmjs.com/package/purestack)

## What you can build

- **Content and documentation sites:** file-based routes, frontmatter, navigation,
  page outlines, and optional search.
- **Interactive pages:** server-rendered Regor components, page-specific
  TypeScript through `PageScript`, and mounted apps through `RegorApp`.
- **Sites with a consistent visual system:** themes, semantic tones, typed
  styles, and a component library shared across pages.
- **Static output:** generated HTML, CSS, JavaScript, and assets that can be
  served by a static host.

`.mdx` and `.rmdx` pages use Regor components and expressions. Plain `.md`
files work for prose pages. See the [Regor guide](https://purestack.studio/guides/regor/)
for the markup and browser app model.

## Quick start

Create a project and install the CLI:

```sh
mkdir my-site
cd my-site
npm init -y
npm install purestack
mkdir content
```

Create `content/siteConfig.json`:

```json
{
  "siteTitle": "My Site",
  "logo": { "brand": "My Site", "href": "/" },
  "outDir": "../dist/site",
  "publishDir": "../dist/publish"
}
```

Create `content/index.mdx`:

```mdx
---
title: Welcome
description: My first PureStack site.
template: doc
---

# Welcome

This page is built from MDX.

<Panel tone="info" variant="surface">
  <p>Edit this file and see the page update.</p>
</Panel>
```

Start the development server:

```sh
npx purestack serve --content ./content
```

Open <http://127.0.0.1:4173/>. Add `content/about.mdx` to create `/about/`.
The server watches your files and reloads the browser as you edit.

When the site is ready:

```sh
npx purestack build --content ./content
npx purestack publish --content ./content
```

`build` writes to `dist/site`. `publish` creates a clean, minified artifact in
`dist/publish`; it prepares files for deployment but does not upload them.
Both paths come from `siteConfig.json` and are resolved relative to `content`.

For browser behavior, add a TypeScript file beside a page and load it with
`<PageScript src="./example.ts" />`. The [purestack package README](packages/purestack/README.md)
has a complete example.

## How PureStack fits together

| Source | What PureStack does |
| --- | --- |
| `siteConfig.json` | Defines output paths, site identity, themes, navigation, and optional features. |
| `.md`, `.mdx`, `.rmdx` | Turn content files into routes and HTML pages. |
| Regor components | Render UI into pages at build time. |
| `PageScript` and `RegorApp` | Bundle TypeScript and add browser behavior where requested. |
| Static assets | Copies files from the content directory into the site output. |

The [CLI guide](https://purestack.studio/guides/purestack-cli/) covers the
commands and options. [Site configuration](https://purestack.studio/guides/site-config/)
covers navigation, themes, search, sitemap, localization, and output paths.

## Repository map

| Path | Purpose |
| --- | --- |
| [`packages/purestack`](packages/purestack) | Public `purestack` package, CLI, and TypeScript API. |
| [`packages/ts-ssg`](packages/ts-ssg) | Content discovery, rendering, routing, builds, and development server. |
| [`packages/ts-components`](packages/ts-components) | Built-in UI components and component metadata. |
| [`packages/ts-style`](packages/ts-style) | Themes, skins, typography, and style generation. |
| [`packages/ts-css`](packages/ts-css) and [`packages/ts-html`](packages/ts-html) | Typed CSS and HTML builders. |
| [`packages/ts-page-scripts`](packages/ts-page-scripts) | Browser-side behavior used by site components. |
| [`packages/ts-svg-icons`](packages/ts-svg-icons) | SVG icon providers and lookup. |
| [`packages/ts-ssg-vscode`](packages/ts-ssg-vscode) | VS Code support for PureStack content and components. |
| [`frontend`](frontend) | Source for purestack.studio, built with PureStack. |
| [`packages/ts-ssg/sample-content`](packages/ts-ssg/sample-content) | A larger example site with content, components, and browser scripts. |

The remaining workspace packages provide shared types, utilities, rendering,
and DOM support.

## Develop this repository

See [Contributing](CONTRIBUTING.md) for the branch, pull request, CI, and publishing workflow.

This is a Yarn 4 workspace. Run commands from the repository root:

```sh
yarn install
yarn build
yarn dev
```

`yarn dev` serves the included sample site. To work on the PureStack website,
run `yarn frontend`; its development server opens at
<http://127.0.0.1:4700/>. See the [frontend README](frontend/README.md) for
the site-specific workflow.

Useful checks and build commands:

```sh
yarn test run
yarn bundle
yarn package
```

`yarn bundle` creates distributable package builds. `yarn package` packs the
non-private workspace packages into local tarballs.

## License

[MIT](LICENSE). Bugs and feature requests: [GitHub issues](https://github.com/PureStackStudio/PureStack/issues).
