<div align="center">

# PureStack

**TypeScript-native frontend infrastructure for the AI age.**

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

| Package | Role |
| --- | --- |
| [`@purestack/ts-ssg`](packages/ts-ssg) | Builds and serves Markdown, MDX, and Regor MDX content sites. Exports `buildSite`, `startDevServer`, navigation, frontmatter, template, and highlighting APIs. |
| [`@purestack/ts-components`](packages/ts-components) | Regor component library with component definition and style registration exports for forms, navigation, panels, charts, modals, tabs, virtual lists, and product UI primitives. |
| [`@purestack/ts-style`](packages/ts-style) | Theme, skin, semantic tone, breakpoint, utility, typography, and document layout style infrastructure. |
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

## A Tiny Shape Of PureStack

A page can be ordinary Markdown plus Regor components:

```mdx
---
title: Status
layout:
  fullWidth: true
---

# Status

<Panel tone="info">
  <Badge tone="success">Ready</Badge>
  <p>The product surface stays close to the content.</p>
</Panel>
```

A page can also mount a TypeScript app as a browser asset:

```mdx
<RegorApp src="./status.ts" id="status-app" />
```

```ts
import { defineBadgeComponents } from '@purestack/ts-components'
import { createApp, html } from 'regor'

const mount = document.querySelector('app#status-app')

if (mount instanceof HTMLElement) {
  createApp(
    {
      components: {
        ...defineBadgeComponents(),
      },
    },
    {
      element: mount,
      template: html`<Badge tone="success">Ready</Badge>`,
    },
  )
}
```

The point is not that AI cannot generate React or Vue. It can. The point is
that PureStack gives AI a smaller, stronger, typed source world for sustained
generation and maintenance.

## Current Status

PureStack is built, working, and already used in production.

The public release is being prepared step by step: docs, examples, packaging,
site, and presentation are still being shaped. Some APIs may change before the
public release is finalized.

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
