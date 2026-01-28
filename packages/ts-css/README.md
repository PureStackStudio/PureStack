# @purestack/ts-css

Type-safe CSS builder for TypeScript. `ts-css` lets you define selectors, declarations, media queries, and CSS variables with a fluent API, then serialize to CSS (optionally via Prettier). It is designed for generating styles in build tools or server-side environments with no DOM dependency.

## Why this package exists

- Author CSS as TypeScript instead of strings.
- Use typed properties via `CSSProps` for safer style authoring.
- Compose selectors and media queries programmatically.
- Produce deterministic CSS output you can prettify.

## Install

```bash
npm install @purestack/ts-css
```

```bash
yarn add @purestack/ts-css
```

```bash
pnpm add @purestack/ts-css
```

## Quick Example

```ts
import { s } from '@purestack/ts-css'

const style = s()

style
  .select('body')
  .css({
    margin: '0',
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  })

style
  .select('.button')
  .css({
    background: '#1e90ff',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
  })

const css = style.toPrettyCSS()
console.log(await css)
```

## Core Concepts

### `s(selector?)`

Creates a root `Style` instance. If you pass a selector, it becomes the root selector; otherwise it starts empty.

```ts
const root = s()
const button = root.select('.button')
```

### Fluent Rule Building

Rules are created via `.select()` and values are set by `.css()` or `.set()`.

```ts
const style = s()
style.select('.card').css({
  padding: '1rem',
  border: '1px solid #ddd',
})
```

### Selector Composition

`.select()` automatically inserts a space unless you use a combinator or a leading pseudo selector.

```ts
const root = s('.card')
root.select('> .title')     // ".card > .title"
root.select(':hover')       // ".card:hover"
root.select('.icon')        // ".card .icon"
```

### Media Queries

Use `.media()` to scope rules under `@media`.

```ts
const style = s('.layout')
style.css({ display: 'grid', gap: '1rem' })
style.media('max-width: 720px').css({ display: 'block' })
```

### CSS Variables via `autoVar`

Values beginning with `$name` or `--name` are automatically converted to `var(...)`.

```ts
const style = s('.btn').css({
  color: '$text',
  background: '--brand, #ff44aa',
})
// => color: var(--text); background: var(--brand, #ff44aa);
```

### Reuse Styles

Use `.use()` to merge declarations from another style into the current one.

```ts
const base = s().css({ fontSize: '14px', lineHeight: '1.4' })
const item = s('.item').use(base).css({ color: '#333' })
```

## Extended Examples

### Nested Selectors + Components

```ts
import { s } from '@purestack/ts-css'

const style = s('.card')
style.css({
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  padding: '1rem',
})

style.select('> .title').css({
  fontWeight: '600',
  marginBottom: '0.5rem',
})

style.select('.actions').css({
  display: 'flex',
  gap: '0.5rem',
})

style.select('.actions > .btn').css({
  borderRadius: '999px',
  padding: '0.4rem 0.9rem',
})
```

### Media Queries + Reuse

```ts
import { s } from '@purestack/ts-css'

const baseText = s().css({
  fontSize: '16px',
  lineHeight: '1.5',
})

const layout = s('.layout').use(baseText).css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem',
})

layout.media('max-width: 800px').css({
  gridTemplateColumns: '1fr',
})
```

### Theming with CSS Variables

```ts
import { s } from '@purestack/ts-css'

const theme = s(':root').css({
  '--brand': '#ff44aa',
  '--bg': '#111827',
  '--fg': '#f9fafb',
})

const button = s('.button').css({
  background: '$brand',
  color: '$fg',
  border: '1px solid --brand, #ff44aa',
})
```

## How It Works

- `Style` extends `BaseStyle` and stores declarations in a map and nested selectors as children.
- `.select()` creates a child style using the parent selector + the new selector (with automatic spacing unless a combinator or `:` is used).
- `.media()` creates a sibling style under `@media(...)` and targets the current selector inside that media block.
- `.toCSS()` serializes rules in a deterministic order: normal selectors first, then `@media` blocks, preserving creation order via internal IDs.
- `.toPrettyCSS()` runs the output through Prettier (`parser: css`) with default formatting options.

## API Reference

### `s(selector?) -> Style`

Creates a `Style` instance. If a selector is provided, it becomes the root selector.

### `Style` / `BaseStyle` methods

- `set(name, value)` - set a single property (camelCase or kebab-case).
- `css(object)` - set many properties at once using `CSSProps`.
- `select(selector)` - create or access a nested selector.
- `media(query)` - create or access a `@media(...)` block scoped to this selector.
- `use(style)` - shallow-merge declarations from another style into this one.
- `toCSS()` - serialize to CSS string.
- `toPrettyCSS(options?)` - serialize and format using Prettier.

## Gotchas / Notes

- `use()` merges only property declarations, not child selectors.
- `select()` preserves insertion order; repeated calls to the same selector return the same node.
- `media()` uses `@media(${query})` if you pass a bare query (without `@media`).
- `autoVar()` converts `$name` and `--name` values to `var(...)`; other values are untouched.
- Output uses Windows-style CRLF in some internal joins; `toPrettyCSS()` normalizes to `lf`.

## Integration with ts-html / ts-ssg

`ts-css` is designed to pair with `ts-html` and `ts-ssg`:

```ts
import { s } from '@purestack/ts-css'
import { h } from '@purestack/ts-html'

const style = s()
style.select('.hero').css({
  fontSize: '32px',
  fontWeight: '700',
})

const page = h('html')
  .push(
    h('head').push(h('style').raw(style.toCSS())),
    h('body').push(h('div').class('hero').text('Hello')),
  )

console.log(page.toHtml())
```

## Output

### `toCSS()`

Returns raw CSS as a string.

### `toPrettyCSS(options?)`

Formats output using Prettier (parser: `css`) with defaults:

- `tabWidth: 2`
- `endOfLine: 'lf'`

## API Overview

Exports:

- `s(selector?)` -> `Style`
- `Style` (extends `BaseStyle`)
- `getColors`, `getGradient` (color utilities)

Key `BaseStyle` methods:

- `set(name, value)`
- `css({...})`
- `select(selector)`
- `media(query)`
- `use(style)`
- `toCSS()`
- `toPrettyCSS(options?)`

## Color Utilities

`ts-css` provides helpers for color conversions and gradients:

```ts
import { getColors, getGradient } from '@purestack/ts-css'

const shades = getColors('#1e90ff', 30, 20, 5)
const stops = getGradient('#21a8c3', '#a50d60', 6, 'hsl')
```

## Type Safety

`CSSProps` is a large type union of CSS properties used by `.css()` and property-specific methods on `Style`. It provides autocomplete and helps catch invalid property names or values.

## Tests

```bash
yarn workspace @purestack/ts-css test
```

## Related Packages

- `@purestack/ts-html` for type-safe HTML generation
- `@purestack/ts-ssg` for a minimal static-site composition layer

## License

MIT
