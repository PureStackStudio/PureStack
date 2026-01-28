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
