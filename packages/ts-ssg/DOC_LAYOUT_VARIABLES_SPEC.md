# Doc Layout Active Variable Contract Spec

## Problem

The first variable pass removed duplicated literals, but it still treats layout
values as static tokens. That is not enough for the real docs shell contract:

- nav width can change through future user resizing
- TOC width can change through future user resizing
- shell left/right padding can change by viewport, full-main mode, collapsed
  sidebars, and future user preferences
- runtime scripts also need the same dimensions for edge-open behavior
- other styles need the value that is active *right now*, not the default value

The important distinction is:

- **default value**: the framework's starting value
- **preferred value**: default after user/site/runtime preferences are applied
- **active value**: the currently reserved layout value after viewport and layout
  state are applied

Other styles should consume active values. Resizing and preferences should update
preferred values. CSS mode rules should resolve preferred values into active
values.

## Goal

Create a stable docs layout contract with active custom properties for:

- inline-start shell padding, left in LTR
- inline-end shell padding, right in LTR
- nav sidebar width
- TOC sidebar width

The contract must support:

- desktop, tablet, and phone breakpoints
- nav sidebar, nav drawer, nav collapsed, and nav open states
- TOC visible, responsive overlay, forced collapsed, and open states
- persisted nav and TOC resizing
- runtime scripts reading the same dimensions used by CSS

This framework is pre-release, so replace the current variable names outright if
that produces a cleaner contract. Do not add compatibility aliases.

## Non-Goals

- Do not add public frontmatter/config APIs for layout sizing yet.
- Do not implement drag handles in this spec change.
- Do not preserve old variable names as shims.
- Do not make components outside the docs shell depend on docs layout variables.

## Required Template Shape

Add a body class for TOC presence:

```ts
template-doc--has-toc
```

Rationale: active values live on `.template-doc`, and the body already owns nav,
drawer, full-main, and collapsed-state classes. Without `template-doc--has-toc`,
CSS cannot resolve active TOC width on the shared ancestor.

## Variable Layers

Define all variables on `.template-doc`. Runtime scripts may update preference
variables as inline styles on `document.body`.

### Defaults

Defaults are framework factory values. They are not consumed directly by layout
styles except when building preferred values.

```css
.template-doc {
  --ps-doc-layout-default-nav-width: 260px;
  --ps-doc-layout-default-toc-width: 240px;
  --ps-doc-layout-default-rail-width: 26px;
  --ps-doc-layout-default-shell-padding-inline-start: 32px;
  --ps-doc-layout-default-shell-padding-inline-end: 32px;
  --ps-doc-layout-default-shell-padding-block: 32px;
  --ps-doc-layout-compact-shell-padding-inline-start: 16px;
  --ps-doc-layout-compact-shell-padding-inline-end: 16px;
  --ps-doc-layout-compact-shell-padding-block: 16px;
  --ps-doc-layout-full-shell-padding-inline-start: 1em;
  --ps-doc-layout-full-shell-padding-inline-end: 1em;
  --ps-doc-layout-full-shell-padding-block: 1em;
}
```

### Preference Inputs

Preference variables are the only variables resize/persistence code writes.
They are optional and should be absent unless user/site preferences exist.

```css
.template-doc {
  --ps-doc-layout-user-nav-width: ;
  --ps-doc-layout-user-toc-width: ;
  --ps-doc-layout-user-shell-padding-inline-start: ;
  --ps-doc-layout-user-shell-padding-inline-end: ;
}
```

Do not emit empty declarations. The snippet above is conceptual. In actual CSS,
use fallbacks from preferred variables.

### Bounds

Resizable values need first-class bounds so CSS, pointer math, and future UI can
agree:

```css
.template-doc {
  --ps-doc-layout-min-nav-width: 220px;
  --ps-doc-layout-max-nav-width: 420px;
  --ps-doc-layout-min-toc-width: 180px;
  --ps-doc-layout-max-toc-width: 360px;
}
```

### Preferred Values

Preferred values resolve defaults plus optional user inputs. They represent the
expanded, user-desired size before viewport/collapse state is applied.

```css
.template-doc {
  --ps-doc-layout-preferred-nav-width: clamp(
    var(--ps-doc-layout-min-nav-width),
    var(--ps-doc-layout-user-nav-width, var(--ps-doc-layout-default-nav-width)),
    var(--ps-doc-layout-max-nav-width)
  );
  --ps-doc-layout-preferred-toc-width: clamp(
    var(--ps-doc-layout-min-toc-width),
    var(--ps-doc-layout-user-toc-width, var(--ps-doc-layout-default-toc-width)),
    var(--ps-doc-layout-max-toc-width)
  );
  --ps-doc-layout-preferred-shell-padding-inline-start: var(
    --ps-doc-layout-user-shell-padding-inline-start,
    var(--ps-doc-layout-default-shell-padding-inline-start)
  );
  --ps-doc-layout-preferred-shell-padding-inline-end: var(
    --ps-doc-layout-user-shell-padding-inline-end,
    var(--ps-doc-layout-default-shell-padding-inline-end)
  );
}
```

### Active Values

Active values are the public contract for layout consumers. They must always be
valid CSS lengths.

```css
.template-doc {
  --ps-doc-layout-active-nav-width: 0px;
  --ps-doc-layout-active-toc-width: 0px;
  --ps-doc-layout-active-shell-padding-inline-start: var(
    --ps-doc-layout-preferred-shell-padding-inline-start
  );
  --ps-doc-layout-active-shell-padding-inline-end: var(
    --ps-doc-layout-preferred-shell-padding-inline-end
  );
  --ps-doc-layout-active-shell-padding-block: var(
    --ps-doc-layout-default-shell-padding-block
  );
  --ps-doc-layout-active-rail-width: var(--ps-doc-layout-default-rail-width);
}
```

Every doc style that needs current geometry should read active variables, not
defaults or preferred values.

## Active State Resolution

### Desktop Sidebar Mode

When nav is present, desktop, and not drawer/collapsed:

```css
.template-doc--has-nav:not(.template-doc--nav-drawer):not(
    .template-doc--nav-collapsed
  ) {
  --ps-doc-layout-active-nav-width: var(
    --ps-doc-layout-preferred-nav-width
  );
}
```

When TOC is present, desktop, above the TOC overlay breakpoint, and not forced
collapsed:

```css
.template-doc--has-toc:not(.template-doc--toc-collapsed) {
  --ps-doc-layout-active-toc-width: var(
    --ps-doc-layout-preferred-toc-width
  );
}
```

At or below the TOC breakpoint, active TOC width becomes `0px` because the TOC is
an overlay rail, not a reserved grid column.

### Drawer, Collapsed, and Overlay Modes

In these modes active sidebar widths represent reserved shell space, not visual
overlay panel width:

- nav drawer: `--ps-doc-layout-active-nav-width: 0px`
- nav collapsed: `--ps-doc-layout-active-nav-width: 0px`
- TOC forced collapsed: `--ps-doc-layout-active-toc-width: 0px`
- TOC responsive overlay: `--ps-doc-layout-active-toc-width: 0px`

The visible collapsed handle uses:

```css
var(--ps-doc-layout-active-rail-width)
```

### Responsive Padding

At `lg` below:

```css
.template-doc {
  --ps-doc-layout-active-shell-padding-inline-start: var(
    --ps-doc-layout-compact-shell-padding-inline-start
  );
  --ps-doc-layout-active-shell-padding-inline-end: var(
    --ps-doc-layout-compact-shell-padding-inline-end
  );
  --ps-doc-layout-active-shell-padding-block: var(
    --ps-doc-layout-compact-shell-padding-block
  );
}
```

For full-main mode:

```css
.template-doc--full-main {
  --ps-doc-layout-active-shell-padding-inline-start: var(
    --ps-doc-layout-full-shell-padding-inline-start
  );
  --ps-doc-layout-active-shell-padding-inline-end: var(
    --ps-doc-layout-full-shell-padding-inline-end
  );
  --ps-doc-layout-active-shell-padding-block: var(
    --ps-doc-layout-full-shell-padding-block
  );
}

Collapsed rails do not add shell padding. They are fixed overlays and are
covered by the standard active shell padding for the current layout mode.
```

## Grid Contract

Grid templates should use active variables but continue to choose the correct
number of tracks per layout state. Do not keep zero-width sidebar tracks in the
grid just to use a single template, because grid gaps would still reserve space.
The docs shell grid must always use `gap: 0`; column spacing belongs in active
padding, side panel internals, or explicit column sizing rather than the layout
grid itself.

Examples:

```css
.template-doc--has-nav:not(.template-doc--nav-drawer) .doc-shell {
  grid-template-columns:
    var(--ps-doc-layout-active-nav-width)
    minmax(0, 1fr);
}

.template-doc--has-nav.template-doc--has-toc:not(.template-doc--nav-drawer):not(
    .template-doc--nav-collapsed
  ):not(.template-doc--toc-collapsed) .doc-shell--toc {
  grid-template-columns:
    var(--ps-doc-layout-active-nav-width)
    minmax(0, 1fr)
    var(--ps-doc-layout-active-toc-width);
}

.template-doc--nav-collapsed.template-doc--has-toc:not(
    .template-doc--toc-collapsed
  ) .doc-shell--toc {
  grid-template-columns:
    minmax(0, 1fr)
    var(--ps-doc-layout-active-toc-width);
}
```

If selectors become too hard to reason about, introduce explicit layout-state
classes in `page-templates.ts` rather than encoding hidden state in descendant
selectors. This is a good trade because the project is pre-release.

## Runtime Contract

Runtime scripts must read the same active variables as CSS:

- nav edge-open threshold reads `--ps-doc-layout-active-rail-width`
- TOC edge-open threshold reads `--ps-doc-layout-active-rail-width`
- resize handles write only preference variables:
  - `--ps-doc-layout-user-nav-width`
  - `--ps-doc-layout-user-toc-width`
  - optionally the user padding variables later

Add a tiny shared helper in `ts-page-scripts`, for example:

```ts
function readCssPxVar(element: Element, name: string, fallback: number) {
  const raw = getComputedStyle(element).getPropertyValue(name).trim()
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : fallback
}
```

Do not duplicate `26` in `navMenu.ts` or `pageToc.ts`.

## Persistence Contract

Persist resized widths in localStorage with explicit versioned keys:

```ts
ts-ssg:doc-layout:nav-width
ts-ssg:doc-layout:toc-width
```

Stored values should be pixel numbers, not raw CSS strings. On load:

1. read the number
2. clamp in script to the same min/max read from computed CSS variables
3. write `${value}px` to the matching user preference variable on
   `document.body.style`

CSS still clamps preferred values, so invalid or stale storage cannot break the
layout.

## TypeScript Token Shape

Replace the current flat token set with names that make the layers explicit:

```ts
export const docLayoutVars = {
  defaultNavWidth: '--ps-doc-layout-default-nav-width',
  defaultTocWidth: '--ps-doc-layout-default-toc-width',
  defaultRailWidth: '--ps-doc-layout-default-rail-width',
  defaultShellPaddingInlineStart:
    '--ps-doc-layout-default-shell-padding-inline-start',
  defaultShellPaddingInlineEnd:
    '--ps-doc-layout-default-shell-padding-inline-end',
  defaultShellPaddingBlock: '--ps-doc-layout-default-shell-padding-block',
  compactShellPaddingInlineStart:
    '--ps-doc-layout-compact-shell-padding-inline-start',
  compactShellPaddingInlineEnd:
    '--ps-doc-layout-compact-shell-padding-inline-end',
  compactShellPaddingBlock: '--ps-doc-layout-compact-shell-padding-block',
  userNavWidth: '--ps-doc-layout-user-nav-width',
  userTocWidth: '--ps-doc-layout-user-toc-width',
  userShellPaddingInlineStart:
    '--ps-doc-layout-user-shell-padding-inline-start',
  userShellPaddingInlineEnd: '--ps-doc-layout-user-shell-padding-inline-end',
  minNavWidth: '--ps-doc-layout-min-nav-width',
  maxNavWidth: '--ps-doc-layout-max-nav-width',
  minTocWidth: '--ps-doc-layout-min-toc-width',
  maxTocWidth: '--ps-doc-layout-max-toc-width',
  preferredNavWidth: '--ps-doc-layout-preferred-nav-width',
  preferredTocWidth: '--ps-doc-layout-preferred-toc-width',
  preferredShellPaddingInlineStart:
    '--ps-doc-layout-preferred-shell-padding-inline-start',
  preferredShellPaddingInlineEnd:
    '--ps-doc-layout-preferred-shell-padding-inline-end',
  activeNavWidth: '--ps-doc-layout-active-nav-width',
  activeTocWidth: '--ps-doc-layout-active-toc-width',
  activeRailWidth: '--ps-doc-layout-active-rail-width',
  activeShellPaddingInlineStart:
    '--ps-doc-layout-active-shell-padding-inline-start',
  activeShellPaddingInlineEnd:
    '--ps-doc-layout-active-shell-padding-inline-end',
  activeShellPaddingBlock: '--ps-doc-layout-active-shell-padding-block',
} as const
```

Keep `docLayoutVar(name)` as the helper for `var(...)` references.

## Implementation Plan

1. Add `template-doc--has-toc` in `page-templates.ts`.
2. Replace `docLayoutVars` with explicit default/preferred/active names.
3. Define defaults, bounds, preferred values, and initial active values on
   `.template-doc`.
4. Add mode selectors that resolve active nav/TOC widths from layout state and
   breakpoints.
5. Change `.doc-shell` padding to consume active inline-start, inline-end, and
   block padding variables.
6. Change grid templates in `docLayoutStyles.ts`, `pageTocStyle.ts`, and
   `navMenuStyle.ts` to consume active widths.
7. Change collapsed rail widths and transforms to consume
   `activeRailWidth`.
8. Update `navMenu.ts` and `pageToc.ts` to read `activeRailWidth` from computed
   CSS instead of using local numeric constants.
9. When resize handles are added, write only `userNavWidth` and `userTocWidth`;
   do not mutate active variables from script.

## Acceptance Criteria

- `docLayoutStyles.ts`, `pageTocStyle.ts`, `navMenuStyle.ts`, `navMenu.ts`, and
  `pageToc.ts` consume active variables for current geometry.
- Other styles can align to the current doc content area using:
  - `--ps-doc-layout-active-shell-padding-inline-start`
  - `--ps-doc-layout-active-shell-padding-inline-end`
  - `--ps-doc-layout-active-nav-width`
  - `--ps-doc-layout-active-toc-width`
- User-resized widths can be persisted by writing preference variables without
  changing style-module code.
- Active nav/TOC widths become `0px` when their sidebars are overlays or
  collapsed out of document flow.
- No old static `navWidth`/`tocWidth` variables remain as compatibility aliases.
- No runtime script keeps a duplicated `26` rail threshold.

## Verification

- Run TypeScript after the token rename.
- Search affected CSS and script files for old static literals and old variable
  names.
- Render a docs page with nav and TOC and inspect computed values on `body`.
- Verify these states:
  - desktop nav + TOC visible
  - desktop nav collapsed + TOC visible
  - desktop nav drawer + TOC visible
  - desktop forced-collapsed TOC
  - `lg` below
  - `toc` below
- When resizing is implemented, refresh the page and confirm persisted widths
  become preferred widths and active widths only when the layout state reserves
  sidebar space.
