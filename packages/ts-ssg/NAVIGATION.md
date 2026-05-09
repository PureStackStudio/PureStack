# Navigation System (Spec + Implementation Notes)

This document defines the navigation system for `@purestack/ts-ssg`, including
the data model, config surface, and how the build pipeline injects navigation
into page templates.

## Goals
- Support **dynamic menus** derived from folder content.
- Support **custom menus** defined per folder.
- Keep the system **predictable**, **mergeable**, and **easy to override**.
- Expose navigation data to templates without imposing layout or CSS.

## Data model

```ts
export interface NavItem {
  title: string
  url?: string
  children?: NavItem[]
  order?: number
  hidden?: boolean
  badge?: string
  icon?: string
}

export interface PageNavigation {
  mode: 'auto' | 'custom' | 'hybrid' | 'none'
  folder: string
  items: NavItem[]
  global: NavItem[]
}
```

`items` is the current folder’s menu. `global` maps to the root folder menu.

## Configuration

Config can be provided via `buildSite()` or `siteConfig.json`:

```ts
await buildSite({
  navigation: {
    mode: 'hybrid',
    navFileName: '_nav.json',
    maxDepth: 2,
    includeIndex: true,
    sortBy: 'order',
  },
})
```

```json
// content/siteConfig.json
{
  "navigation": {
    "mode": "hybrid",
    "navFileName": "_nav.json",
    "maxDepth": 2,
    "includeIndex": true,
    "sortBy": "order"
  }
}
```

Defaults:
- `mode`: `auto`
- `navFileName`: `_nav.json`
- `maxDepth`: `1`
- `includeIndex`: `true`
- `sortBy`: `order`

## Dynamic (auto) menus

Auto menus are built from the content tree:
- Pages with `frontmatter.hidden` or `frontmatter.draft` are excluded.
- Title resolution:
  1. `frontmatter.nav.title`
  2. `frontmatter.title`
  3. first Markdown `# Heading`
  4. filename (humanized)
- Order resolution:
  1. `frontmatter.nav.order`
  2. `frontmatter.order`
  3. alphabetical by title

`maxDepth` controls nested folder expansion. For `maxDepth > 1`, child folders
appear as grouped items with `children`. If a child folder has an `index` page,
that page becomes the group item and receives the remaining children.

## Custom menus

Custom menus are defined per folder using `_nav.json` (or a configured filename).
The file can be either an array of items or an object with `mode` and `items`.

```json
[
  { "title": "Getting Started", "url": "/guide/start/" },
  { "title": "API", "url": "/api/" }
]
```

```json
{
  "mode": "merge",
  "items": [
    { "title": "Home", "url": "/" },
    { "title": "External Docs", "url": "https://example.com" }
  ]
}
```

`mode` values:
- `override`: ignore auto items and use only custom items
- `merge`: merge auto + custom and then sort

Relative URLs inside `_nav.json` resolve from the folder that contains the file:

```json
[
  { "title": "Local Child", "url": "child/" }
]
```

In `content/guide/_nav.json`, that becomes `/guide/child/`.

## Frontmatter navigation flags

Per-page overrides are supported via `frontmatter.nav`:

```md
---
title: Intro
order: 2
nav:
  title: Start Here
  order: 1
  badge: New
  icon: iconoir:star
  hidden: false
---
```

## Template integration

`PageTemplateInput` now includes `navigation` and `page`:

```ts
export interface PageTemplatePage {
  relPath: string
  urlPath: string
  frontmatter: Record<string, unknown>
}

export interface PageTemplateInput {
  navigation?: PageNavigation
  page?: PageTemplatePage
}
```

This keeps menu rendering a template decision while making data available.

## Build hooks

New hook:

```ts
onNavigationBuilt?: (
  context: BuildContext,
  navigation: NavigationTree | undefined,
) => void | Promise<void>
```

Use this to enrich, transform, or log the navigation tree.

## Incremental build behavior

When navigation is enabled, changes in a folder will rebuild pages in that
folder and ancestor folders up to `maxDepth - 1`. This keeps menus consistent
without forcing a full rebuild.
