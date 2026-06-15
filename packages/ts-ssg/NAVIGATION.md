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
  id?: string
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
  root: string
  items: NavItem[]
  global: NavItem[]
}
```

`folder` is the page's physical content folder. `root` is the configured
navigation root selected for that page. `items` is the selected menu for the
page; `global` maps to the content root menu.

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
    roots: ['docs'],
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
    "sortBy": "order",
    "roots": ["docs"]
  }
}
```

Defaults:
- `mode`: `auto`
- `navFileName`: `_nav.json`
- `maxDepth`: `1`
- `includeIndex`: `true`
- `sortBy`: `order`
- `roots`: `[]`

`roots` marks folders that act as navigation roots for descendant pages. With
`roots: ["docs"]`, both `docs/index.md` and `docs/usage/transactions.md` use
the `docs` menu as their page navigation. Without a matching root, the page's
navigation uses the content root menu.

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
The file can be either an array of items or an object with `mode`, `items`, and
`sequence`.

```json
[
  { "title": "Getting Started", "url": "/guide/start/" },
  { "title": "API", "url": "/api/" }
]
```

```json
{
  "mode": "merge",
  "pageLinks": true,
  "sequence": [
    "index.md",
    "github",
    "usage/",
    "usage/opening-a-tree.md",
    "usage/transactions.md"
  ],
  "icons": {
    "index.md": "iconoir:home",
    "github": "iconoir:github",
    "usage/": "iconoir:book",
    "usage/transactions.md": "iconoir:database"
  },
  "items": [
    {
      "id": "github",
      "title": "GitHub",
      "url": "https://github.com/example/project"
    }
  ]
}
```

`mode` values:
- `override`: ignore auto items and use only custom items
- `merge`: merge auto + custom and then sort

`sequence` is a lightweight ordering overlay for the final mixed menu. Entries
are resolved relative to the folder containing the nav file. The builder first
combines auto items and custom `items` according to `mode`, then moves sequence
matches to the front in the listed order. Unmatched items are appended using
normal `navigation.sortBy`.

Sequence is hierarchical. A `docs/_nav.json` entry such as
`usage/transactions.md` helps place the `Usage` group in the `docs` menu and is
also inherited by `docs/usage`, where it orders the `Transactions` page among
that group's children. A nested `docs/usage/_nav.json` can still refine the
`usage` folder by defining its own `sequence`.

Sequence entries can match:

- auto pages by source path, route, basename, or extensionless name, such as
  `getting-started.md`, `getting-started`, or `/docs/getting-started/`
- auto folders by folder path or route, such as `usage/` or `/docs/usage/`
- custom items by `id`, URL, title, or title slug

Unknown sequence entries are ignored, so a stale entry does not break the build.

`pageLinks: true` enables previous/next page links for pages covered by that
nav file. Links are derived from the final visible navigation order, skip
external URLs and grouping items without URLs, and inherit into child folders.
The built-in `doc` template renders those links as `BtnLink` controls after the
page content.

`icons` is a lightweight presentation overlay for auto and custom items. Keys
use the same matching rules as `sequence`; values are icon names rendered by the
navigation component. This lets a folder-level `_nav.json` add selected icons
without requiring frontmatter in every Markdown file:

```json
{
  "icons": {
    "index.md": "iconoir:home",
    "usage/": "iconoir:book",
    "usage/transactions.md": "iconoir:database",
    "github": "iconoir:github"
  }
}
```

Icon overlays are inherited by child folders. A child folder's `_nav.json` can
override inherited icons by defining a matching key in its own `icons` map.
Unknown icon keys are ignored.

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
