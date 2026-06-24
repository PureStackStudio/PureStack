<div align="center">

# PureStack

**Pure frontend infrastructure for the AI age.**

Coherent source for real products: content, interfaces, styles, scripts,
workflows, and tooling designed to belong together.

</div>

---

PureStack is a TypeScript-native frontend ecosystem for building content sites,
documentation, product frontends, admin surfaces, dashboards, and operational
tools from one coherent source model.

It is designed for a world where AI is not an assistant on the side, but part of
the everyday act of building software.

## Why PureStack Exists

AI can one-shot code in any framework.

PureStack is built for what happens after the first shot: the long life of a
real product as features change, screens multiply, styles evolve, and the source
needs to stay understandable.

Most frontend stacks spread intent across too many layers: framework rules,
template syntax, CSS conventions, utility classes, build plugins, runtime
hydration, and editor-specific knowledge. AI can work there, but it has to keep
guessing across boundaries.

PureStack takes a different bet:

**sustained AI generation is better when the product frontend is coherent,
typed, inspectable, and mostly TypeScript.**

Markdown belongs where prose belongs. Everything else should be high-quality
source that humans can reason about and AI can inspect, compose, refactor, and
extend with confidence.

## What This Repository Contains

This repository contains the PureStack package workspace: the SSG pipeline,
Regor component system, typed style and HTML/CSS builders, runtime page scripts,
icon tooling, rendering foundation, shared types, and editor support.

## Install

```sh
yarn add purestack
```

The public package provides the `purestack` CLI and the TypeScript API for custom
projects:

```ts
import { buildSite, startDevServer } from 'purestack'
```

## The Core Packages

PureStack has many packages, but three of them define the day-to-day experience.

### `@purestack/ts-ssg`

`ts-ssg` is the product frontend pipeline.

It builds Markdown, MDX, and Regor MDX into a site or app surface, serves it in
development, watches content changes, and bundles TypeScript browser assets. It
is where content, templates, navigation, styles, scripts, and static assets meet
in one workflow.

Feature shape:

- Markdown, `.mdx`, and `.rmdx` content
- frontmatter-driven pages
- custom template maps
- file-based navigation
- page outline and table-of-contents support
- dev server with watch mode and live reload
- TypeScript browser asset bundling
- optional sitemap, robots, Pagefind, consent, and GA4 configuration
- build hooks for projects that need to observe or extend the pipeline

### `@purestack/ts-components`

`ts-components` is the product UI vocabulary.

It provides Regor components for real product surfaces: forms, buttons, panels,
navigation, tabs, modals, toasts, charts, landing sections, pricing tables,
search, theme switching, virtual lists, and more.

The package keeps component registration and style registration separate. That
lets the SSG pipeline generate site styles while browser-side TypeScript can
reuse the same component vocabulary. It also ships TypeScript source files for
better package-aware tooling and editor metadata.

### `@purestack/ts-style`

`ts-style` is the design coherence layer.

It keeps themes, skins, semantic tones, breakpoints, utility styles, typography,
palette variables, and document layout styles in TypeScript. Components can use
shared tones like `neutral`, `accent`, `info`, `success`, `warning`, and
`danger` without scattering visual decisions across unrelated CSS conventions.

## Using PureStack

A PureStack content folder is centered around `siteConfig.json` and content
files:

```txt
content/
  siteConfig.json
  index.mdx
  dashboard.ts
```

Minimal config:

```json
{
  "siteTitle": "My Product",
  "outDir": "../dist/site"
}
```

Content can stay mostly Markdown while mounting TypeScript where behavior is
needed:

```mdx
---
title: Dashboard
template: doc
layout:
  fullWidth: true
---

# Dashboard

<RegorApp src="./dashboard.ts" id="dashboard-app" />
```

The TypeScript asset is bundled for the browser:

```ts
import {
  defineBadgeComponents,
  definePanelComponents,
} from '@purestack/ts-components'
import { createApp, html } from 'regor'

const mount = document.querySelector('app#dashboard-app')

if (mount instanceof HTMLElement) {
  createApp(
    {
      components: {
        ...defineBadgeComponents(),
        ...definePanelComponents(),
      },
    },
    {
      element: mount,
      template: html`<Panel tone="info">
        <Badge tone="success">Ready</Badge>
      </Panel>`,
    },
  )
}
```

Run the pipeline with a content directory:

```sh
yarn purestack build --content ./content
yarn purestack serve --content ./content --port 4173
yarn purestack publish --content ./content

Usage:
  purestack build --content <dir> [--clean]
  purestack serve --content <dir> [--host <host>] [--port <port>] [--clean] [--no-watch] [--no-reload]
  purestack publish --content <dir>

Commands:
  build     Build a content directory into its configured outDir.
  serve     Start the dev server for a content directory.
  publish   Clean and build a publish artifact using the configured publishDir.
```

## Package Map

| Package | Role |
| --- | --- |
| [`purestack`](packages/purestack) | Public package and CLI. Re-exports the TypeScript API from `@purestack/ts-ssg`. |
| [`@purestack/ts-ssg`](packages/ts-ssg) | Build and dev-server pipeline for Markdown, MDX, Regor MDX, templates, navigation, styles, scripts, and browser assets. |
| [`@purestack/ts-components`](packages/ts-components) | Regor component definitions, component metadata, and matching style registration for product frontend primitives. |
| [`@purestack/ts-style`](packages/ts-style) | Theme, skin, semantic tone, breakpoint, utility, typography, palette, and layout style infrastructure. |
| [`@purestack/ts-html`](packages/ts-html) | Typed HTML node and head helpers through `h`, `TSNode`, `createHead`, and head config utilities. |
| [`@purestack/ts-css`](packages/ts-css) | Typed CSS style builder exports including `Style`, `s`, `CSSProps`, color helpers, and gradient helpers. |
| [`@purestack/ts-page-scripts`](packages/ts-page-scripts) | Runtime script builders for theme switching, consent, auth state hints, code copy, menus, modals, nav menus, Pagefind search, page TOC, and tabs. |
| [`@purestack/ts-svg-icons`](packages/ts-svg-icons) | Tree-shakeable SVG icon access through provider exports and `getSvgIcon`. |
| [`@purestack/ts-render`](packages/ts-render) | Regor/static rendering support through `renderApp` and a component registry. |
| [`@purestack/ts-minidom`](packages/ts-minidom) | Minimal DOM implementation and DOM globals for rendering and tests. |
| [`@purestack/ts-common`](packages/ts-common) | Shared site config, frontmatter, navigation, template, consent, analytics, and SSG context types. |
| [`@purestack/ts-util`](packages/ts-util) | Browser-safe utility helpers for paths, public paths, escaping, merging, caching, logging, and type checks. |
| [`@purestack/ts-util-node`](packages/ts-util-node) | Node-only filesystem helpers. |
| [`ts-ssg-vscode`](packages/ts-ssg-vscode) | VS Code extension workspace for Regor MDX, template syntax, formatting, linked editing, diagnostics, and component metadata tooling. |

## How The Pieces Fit

PureStack keeps prose, product UI, styling, scripts, and build behavior close to
the source that defines them.

- `.md` is for Markdown.
- `.mdx` is the familiar extension for Markdown with Regor components.
- `.rmdx` is the explicit Regor MDX extension when a project wants the dialect
  to be visible in the filename.
- TypeScript assets are bundled for the browser by the SSG pipeline.
- Static Regor `html` and `svg` template tags are stripped during the SSG
  browser bundling path so template syntax remains useful to tooling without
  becoming a tree-shaking blocker.
- `@purestack/ts-components` ships source files for better package-aware
  tooling and component metadata.

PureStack does not require the backend to be TypeScript. It focuses on the
product frontend source: content, UI, state, styles, scripts, and tooling.

## Development

This repository uses Yarn workspaces and TypeScript 7 through `tsgo`.

```sh
yarn install
yarn build
yarn test
```

Useful workspace commands:

```sh
yarn dev
yarn bundle
yarn lint
```

`yarn dev` runs the `@purestack/ts-ssg` sample-content workflow. `yarn build`
runs package builds across the workspace. `yarn test` runs Vitest.

## License

MIT.
