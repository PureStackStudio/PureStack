# @purestack/ts-html

Type-safe HTML builder for TypeScript. `ts-html` provides an immutable, chainable API for creating HTML trees, setting attributes, and serializing to HTML with optional Prettier formatting. It is framework-agnostic and can be used on the server or in build tools (no DOM required).

## Why this package exists

- Build HTML with TypeScript instead of template strings.
- Get type-checked tags and attributes (including ARIA and event attrs).
- Compose HTML with functional, immutable builders.
- Generate predictable HTML output that can be prettified.

## Install

```bash
npm install @purestack/ts-html
```

```bash
yarn add @purestack/ts-html
```

```bash
pnpm add @purestack/ts-html
```

## Quick Example

```ts
import { h } from '@purestack/ts-html'

const html = h('html')
  .push(
    h('head').push(
      h('title').text('Hello'),
      h('meta').attr({ charset: 'utf-8' }),
    ),
    h('body').push(
      h('main').push(h('h1').text('Hello world')),
      h('script').raw('console.log("hello")'),
    ),
  )

const out = await html.toPrettyHtml()
console.log(out)
```

## Core Concepts

### `h(tag)`

Creates a `TSNode` for the given tag. If `tag` is omitted or an empty string, it creates a fragment node (used for grouping).

```ts
const fragment = h('').text('a').raw('<b>b</b>')
```

### Immutable, Chainable Nodes

Every method returns a new node. This allows functional composition and avoids mutation.

```ts
const base = h('input')
const typed = base.attr({ type: 'text' })

base.toHtml()  // <input/>
typed.toHtml() // <input type="text"/>
```

### Text vs Raw HTML

- `text()` escapes HTML special characters.
- `raw()` injects HTML without escaping.

```ts
const safe = h('p').text('<b>safe</b>')
const raw = h('p').raw('<b>raw</b>')
```

### Attributes

`ts-html` exposes multiple attribute helpers to help with type safety:

- `attr(...)` for tag-specific attributes
- `attrAll(...)` for all attributes
- `attrGlobal(...)` for global HTML attributes
- `attrAria(...)` for ARIA attributes
- `attrEvents(...)` for event-handler attributes

```ts
const button = h('button')
  .attr({ type: 'button' })
  .attrAria({ 'aria-label': 'Close' })
  .attrEvents({ onclick: 'close()' })
```

### Selecting and Replacing Nodes

Use `select(tag, replacer)` to find the first matching tag in the subtree and replace it.

```ts
const page = h('html')
  .push(h('body').push(h('main')))
  .select('main', (node) => node.attr({ id: 'app' }))
```

### Serialization

- `toHtml()` returns HTML as a string.
- `toPrettyHtml()` formats output using Prettier with sensible defaults.

```ts
const html = h('div').push(h('span').text('hi'))
console.log(html.toHtml())
```

## Head Helpers

`ts-html` includes a small head metadata layer that turns a high-level config into `<head>` content:

```ts
import { createHead, getHeadConfig, h } from '@purestack/ts-html'

const head = createHead(
  getHeadConfig({
    title: 'My Site',
    description: 'Example',
    canonicalUrl: 'https://example.com',
    openGraph: { title: 'My Site', url: 'https://example.com' },
  }),
)

const doc = h('html').push(head, h('body'))
```

Relevant types:

- `BasicHeadConfig` (high-level SEO config)
- `HeadConfig` (low-level, explicit head element lists)

## Type Safety and Metadata

Attribute and tag unions are generated into `src/html.d.ts` from datasets in `src/meta/data`. This gives you type-checked attributes for standard tags while still allowing custom elements.

## API Overview

- `h(tag?)`
- `TSNode#text(text, replace?)`
- `TSNode#raw(html, replace?)`
- `TSNode#push(...children)`
- `TSNode#attr(...)`, `attrAll(...)`, `attrGlobal(...)`, `attrAria(...)`, `attrEvents(...)`
- `TSNode#id(...)`, `TSNode#class(...)`
- `TSNode#select(tag, replacer)`
- `TSNode#toHtml()`, `TSNode#toPrettyHtml(options?)`

## Tests

```bash
yarn workspace @purestack/ts-html test
```

## Related Packages

- `@purestack/ts-css` for typed CSS generation
- `@purestack/ts-ssg` for a minimal static-site composition layer

## License

MIT
