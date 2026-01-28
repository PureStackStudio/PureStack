# ts-ssg Architecture

## Goals
- Build a Starlight-like static site generator for docs using only PureStack libraries for core HTML/CSS/runtime.
- Support Markdown and MDX (MDX compilation may use third-party tooling).
- Provide a clean, composable API for layouts/components built with `@purestack/ts-html` and styles via `@purestack/ts-css`.
- Ship a simple CLI for build/dev and a library API for programmatic usage.

## Non-Goals (for now)
- Full Astro compatibility or universal JSX runtime.
- A complete theme marketplace or plug-and-play UI kits on day one.
- SSR or dynamic runtime routes.

## Constraints
- Prefer PureStack libs for HTML rendering, styling, utilities, and logging.
- MDX compilation can use a third-party compiler (e.g. `@mdx-js/mdx`) but the output must bridge into PureStack render nodes.
- Keep output deterministic and file-based.

## High-Level Data Flow
1) Discover content (filesystem -> collections).
2) Parse frontmatter + body (MD/MDX).
3) Compile MD/MDX to renderable nodes.
4) Resolve layout + theme components.
5) Render to HTML via `@purestack/ts-html`.
6) Emit assets + HTML + metadata (sitemap, RSS, search index).

## Core Modules
### 1) Config
- `ts-ssg.config.ts` (or `ts-ssg.config.mjs`) at repo root.
- Defines: site metadata, content roots, theme, routing rules, output dir.

### 2) Content Pipeline
- File discovery: glob over content roots.
- Frontmatter parsing: YAML -> typed metadata.
- Collection model: `Collection`, `ContentEntry`, `ContentNode`.
- Content index: resolved routes, slug, order, sidebar, prev/next.

### 3) Markdown / MDX Compiler
- Markdown: remark/rehype pipeline for MD -> HTML or AST -> PureStack nodes.
- MDX: compile to JS module or AST, then wrap in PureStack renderer.
- Component binding: map MDX imports to PureStack components.

### 4) Renderer
- PureStack HTML builder (`@purestack/ts-html`) to produce HTML pages.
- Layouts: `Layout` interface consumes `ContentEntry` + compiled body.
- Theme: `Theme` interface defines page chrome components.
- Head builder: use `@purestack/ts-html` head helpers; generate meta tags.

### 5) Assets
- Static assets copy with hashing (optional) and URL prefixing.
- Bundle CSS: collect from `@purestack/ts-css` and emit per-page or global.

### 6) CLI + Dev Server
- Commands: `dev`, `build`, `preview`, `clean`.
- Dev server watches content and rebuilds affected pages.

### 7) Extensibility
- Plugin hooks: `onConfig`, `onContentLoaded`, `onPageRender`, `onBuildComplete`.
- Theme packages: provide layout + component set.

## Content Model (initial)
### Frontmatter fields (draft)
- `title` (required)
- `template` (optional; e.g. `splash`, `doc`)
- `sidebar` (optional): `{ order?: number; label?: string; hidden?: boolean }`
- `hero` (optional): `{ title, tagline, image, actions[] }`
- `description` (optional)

### Route Resolution
- Path from file system relative to content root.
- `index.mdx` maps to `/`.
- Keep a stable slug algorithm (kebab-case).

## Rendering Contracts
### Layout Interface (draft)
- Input: `ContentEntry`, compiled body nodes, site config, navigation.
- Output: PureStack HTML tree.

### Theme Interface (draft)
- `Header`, `Footer`, `Sidebar`, `Breadcrumbs`, `TableOfContents`.

## Package Layout (proposed)
- `packages/ts-ssg/src`
  - `cli/`
  - `config/`
  - `content/`
  - `compiler/markdown/`
  - `compiler/mdx/`
  - `renderer/`
  - `theme/`
  - `dev/`
  - `utils/`

## Compatibility Notes
- MDX compiler output should be adapted to PureStack nodes.
- If MDX emits JSX, create a minimal adapter that converts JSX runtime calls to `@purestack/ts-html` nodes.

