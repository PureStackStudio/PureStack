# PureStack README Writing Checklist

This checklist is the writing machinery for the root `README.md`.

The current docs are not authoritative. Treat existing Markdown files as hints
only. The root README must be built from facts visible in code, package
manifests, source exports, tests, schemas, samples, and scripts.

## Goal

Create a README that is inspiring, accurate, and robust:

- explains PureStack as a TypeScript-native frontend ecosystem for the AI age
- makes the sustained AI generation thesis clear
- describes what this repository contains
- maps the packages without hallucinating features
- shows only syntax and commands that are verified in this repo
- avoids coupling PureStack to independent projects

## Non-Negotiables

- Do not use `FEATURES.md`, package README files, or old docs as factual
  authority.
- Do not claim a capability unless it is verified in source, tests, schema, or
  package metadata.
- Do not present future plans as current features.
- Do not position PureStack as a TypeScript backend/server ideology.
- Do not couple PureStack to PureGate or any independent downstream project.
- Do not imply an open-source/pro split before the product strategy is decided.
- Do not include install or publish commands unless they are true for the public
  release state.
- Do not use icon names in examples unless they are verified in
  `packages/ts-svg-icons`.

## Authoritative Evidence Sources

Use these as truth sources, in this order:

1. `package.json` at the repo root
2. `packages/*/package.json`
3. `packages/*/src/index.ts`
4. package source files under `packages/*/src`
5. tests under `packages/**/*.test.ts`
6. schemas under `packages/**/schema`
7. real sample content under `packages/ts-ssg/sample-content`
8. build and generation scripts under `scripts`
9. current root tooling configuration such as `vite.config.ts`, `tsconfig.json`,
   and `biome.json`

Existing docs may be used only to find places to verify in code.

## Evidence Ledger

Every meaningful README claim should fit this table before it is written.

| Claim | Evidence | Confidence | README wording |
| --- | --- | --- | --- |
| PureStack has Yarn workspaces under `packages/*` | root `package.json` workspaces | high | "This repository contains the PureStack package workspace." |
| `@purestack/ts-ssg` exports `buildSite` and `startDevServer` | `packages/ts-ssg/src/index.ts` | high | "`ts-ssg` provides build and dev-server APIs." |
| `.mdx` and `.rmdx` are supported content extensions | `contentExtensions.ts` and related tests | pending | pending |

Rules:

- `Confidence` must be `high` for anything in the final README.
- `pending` claims stay out of the README.
- If wording requires two facts, list both evidence sources.

## Phase 1: Inventory The Public Surface

Checklist:

- Read root `package.json`.
- List workspace package names from `packages/*/package.json`.
- For each package, capture:
  - package name
  - private/public status
  - module/types/bin fields
  - export map
  - files included in package
  - dependencies that define its role
  - scripts that reveal how it is built or tested
- Read each `packages/*/src/index.ts`.
- Record only exported APIs, types, and registration functions visible from
  package entry points.
- Mark internal packages or private tools clearly.

Output:

- a verified package map
- a list of public entry points
- a list of packages that should not be marketed as public if still private

## Phase 2: Verify Core Capabilities

For each capability, find direct code/test evidence.

### SSG Pipeline

Verify before claiming:

- build API
- dev server API
- CLI bin
- content discovery
- `.md`, `.mdx`, `.rmdx` support
- frontmatter parsing
- Markdown and Regor MDX compilation
- static assets
- script bundling
- template tag transform
- navigation generation
- sitemap/robots/Pagefind/consent/GA4 only if source confirms current support
- i18n only if source confirms current support
- sample content shape

### Regor MDX And Components

Verify before claiming:

- Regor component syntax in MDX
- component registration path
- built-in component initialization
- app/script embedding through real samples
- `.mdx` as primary extension and `.rmdx` as explicit Regor MDX alternative

### Components And Styles

Verify before claiming:

- exported component definition functions
- exported style registration functions
- `regorComponents` package metadata
- source condition in `@purestack/ts-components`
- included `src/**/*.ts` package files, excluding tests
- semantic tones and theme APIs from `ts-style`
- component names only from actual exports or package metadata

### Typed HTML/CSS Builders

Verify before claiming:

- `@purestack/ts-html` exported builders and node types
- `@purestack/ts-css` exported style helpers
- tests that demonstrate serialization, escaping, selectors, or CSS variable
  behavior

### Runtime Scripts

Verify before claiming:

- exported page script builders
- runtime globals
- generated embed files exist, but do not edit them
- any script named in README exists in `src/index.ts`

### Icons

Verify before claiming:

- exported icon providers
- `getSvgIcon` behavior
- direct icon exports
- icon names used in README examples exist in generated source

### VS Code Extension

Verify before claiming:

- extension package metadata
- contributed languages and file extensions
- syntax grammars
- activation events
- commands
- source features such as formatting, diagnostics, linked editing, component
  metadata, and navigation only if implemented in source

## Phase 3: Verify Examples

Every example in the README must come from a working pattern.

Checklist:

- Prefer examples adapted from `packages/ts-ssg/sample-content`.
- Use `.mdx` as the primary docs/example extension.
- Mention `.rmdx` as the explicit Regor MDX alternative.
- If showing `RegorApp`, verify the pattern in sample content or code.
- If showing TypeScript component/app code, verify imports exist.
- If showing component tags, verify the component exists in `regorComponents` or
  package exports.
- If showing config, verify fields in `siteConfig.schema.json` or config types.
- Keep examples small enough to be readable.
- Do not invent quick-start commands that have not been verified.

## Phase 4: README Claim Gates

Before a section is accepted, answer these questions.

### Hero

- Does it match the organization profile hero, replacing `PureStack Studio` with
  `PureStack`?
- Does it say frontend/product source, not web stack?
- Does it avoid unsupported business model claims?

### AI Thesis

- Does it distinguish one-shot generation from sustained product evolution?
- Does it say PureStack gives AI a better source world, not perfect magic?
- Does it explain why coherent TypeScript helps generation, inspection,
  refactoring, and maintenance?

### Repository Contents

- Does every package in the map exist?
- Is every one-line package description backed by `package.json` and
  `src/index.ts`?
- Are private or not-yet-public pieces labeled carefully?

### Feature Summary

- Is it compact?
- Are all claims verified?
- Does it avoid duplicating `FEATURES.md`?
- Does it avoid naming independent downstream projects?

### Commands

- Do commands exist in root or package `package.json`?
- Do commands avoid running generated embed scripts as a reader prerequisite?
- Is `tsgo` used instead of `tsc` for TypeScript package build/typecheck
  language, except where a package script explicitly uses another tool?

### Status

- Does status say built and production-used without overclaiming public
  readiness?
- Does it leave room for public release shaping?
- Does it avoid "stable", "1.0-ready", or "drop-in replacement" unless
  explicitly decided?

## Phase 5: Recommended README Outline

Use this outline unless a better code-derived structure appears.

1. Centered hero matching the organization profile
2. "Why PureStack Exists"
   - AI can one-shot in any framework
   - PureStack targets sustained AI generation and maintenance
   - coherent typed source is the architectural bet
3. "What This Repository Contains"
   - one paragraph
   - compact package table
4. "How The Pieces Fit"
   - Markdown/MDX for prose/content
   - Regor MDX for component-rich content
   - TypeScript for components, styles, scripts, and product behavior
   - one SSG/build pipeline
5. "A Tiny Shape Of PureStack"
   - verified `.mdx` page snippet
   - verified TypeScript app/component snippet if compact enough
6. "Package Map"
   - package
   - role
   - evidence-backed one-liner
7. "Current Status"
   - built
   - production-used
   - public release preparation
8. "Development"
   - verified commands only
9. "License"
   - verify from root and package manifests

## Phase 6: Final Review

Run this before accepting the README.

- No claim depends only on docs.
- No PureGate coupling.
- No TypeScript-server ideology.
- No invented examples.
- No unverified commands.
- No package feature described from memory.
- No feature inventory dump.
- No competitor dunking.
- No AI hype without architectural explanation.
- The README is skimmable in two minutes.
- The README still feels alive and worth entering.

## Working Notes For The Next Step

When writing the README, first build the evidence ledger from source. Then draft
the README from the ledger, not from memory.

Good README language should be:

- precise enough for engineers
- confident enough for the vision
- short enough to be read
- concrete enough to be trusted
