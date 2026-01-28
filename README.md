# PureStack

PureStack is a TypeScript-first, framework-agnostic UI tooling stack for building static HTML, CSS, and head metadata with code. It is organized as a Yarn workspaces monorepo and ships a small set of focused packages that work together:

- `@purestack/ts-html`: an immutable, chainable HTML builder with type-safe tags and attributes.
- `@purestack/ts-css`: a typed CSS builder with fluent APIs for selectors, media queries, and CSS variables.
- `@purestack/ts-ssg`: a minimal static-site generator layer built on top of `ts-html` and `ts-css`.
- `@purestack/utils`: shared utilities (HTML escaping and type guards).

The project emphasizes:

- a pure TypeScript authoring experience (no runtime DOM required)
- deterministic HTML/CSS output that can be prettified with Prettier
- composable, library-style building blocks rather than a large framework

## Packages

### `@purestack/ts-html`

Provides a tree builder for HTML using immutable `TSNode` instances. You create nodes with `h('tag')`, chain methods to set attributes or push children, and then serialize to HTML.

Key features:

- Immutable chaining: each call returns a new `TSNode`, preserving a functional style.
- Type-safe tags and attributes driven by `html.d.ts`.
- Text and raw HTML helpers (`text`, `raw`) with built-in escaping.
- `select(tag, replacer)` to replace a tag within a subtree.
- `toHtml()` and `toPrettyHtml()` for serialization (Prettier-backed).
- `createHead` + `getHeadConfig` to generate `<head>` content from a high-level `BasicHeadConfig`.

### `@purestack/ts-css`

Fluent CSS builder that keeps selectors and declarations in TypeScript. You create a `Style` with `s()` and then build rules using `.select()` and `.css()` calls.

Key features:

- Typed CSS properties via `CSSProps`, covering a large portion of the CSS spec.
- Selector composition with child selectors and combinators.
- Media query nesting via `.media(...)`.
- Automatic CSS variable expansion via `autoVar` (e.g. `$primary` -> `var(--primary)`).
- Utilities for color conversion and gradients (`getColors`, `getGradient`).
- Serialization to CSS with optional Prettier formatting.

### `@purestack/ts-ssg`

A thin static-site generator layer that ties `ts-html` and `ts-css` together. It provides:

- default head presets (`getHtml` / `getHead`) for common meta tags
- component-style helpers that receive a `Style` instance
- example compositions in `src/index.ts` and `src/content` that show how to build full pages

### `@purestack/utils`

Common utilities used by the stack:

- `escapeHtml` for safe HTML serialization
- runtime type guards (`isString`, `isFunction`, `isPlainObject`, etc.)

## Repository Layout

- `packages/ts-html`: HTML builder and head/meta helpers
- `packages/ts-css`: CSS builder and color utilities
- `packages/ts-ssg`: minimal SSG wiring and examples
- `packages/utils`: shared utilities
- `scripts/`: build tooling (bundle + type export fixes)

## Tooling

- TypeScript (ESM), Yarn 4 workspaces
- ESLint + TypeScript ESLint
- Vitest for tests
- `tsdown` for bundling
- Prettier as a formatting engine for HTML/CSS output

## Common Scripts

From the repo root:

- `yarn dev`: run the `ts-ssg` entry in watch mode
- `yarn build`: build all non-private workspaces
- `yarn lint`: lint all workspaces
- `yarn bundle`: build bundles + fix `.d.ts` exports
- `yarn test`: run tests via Vitest
- `yarn package`: create tarballs for all workspaces

## Goals and Scope

PureStack is intentionally small and modular. It focuses on:

- generating static, predictable HTML/CSS via TypeScript
- composing UI with functions and builders rather than templates
- shipping reusable packages that can be used independently

It is not a full framework, and it does not require a browser or DOM at runtime.

## License

MIT
