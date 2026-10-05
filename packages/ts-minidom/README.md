# @purestack/ts-minidom

A small DOM implementation used to render Regor components in Node.js. It
provides HTML parsing and the document and element APIs needed by PureStack's
server-side renderer and component tests.

Use `parseHtml` or `parseFragment` to work with a document directly.

`runInDom(html, render)` runs `render` with its own document. The DOM globals,
such as `document` and `window`, point at that document for `render` and
everything it awaits. It returns what `render` returns, a promise included.

The package stays browser-safe, so how a render keeps its document is up to the
host. By default the document stays current until the render finishes, and
renders must run one at a time. In Node, pass an `AsyncLocalStorage` to
`useDomScope`, and renders can overlap without seeing each other's documents:

```ts
import { AsyncLocalStorage } from 'node:async_hooks'
import { useDomScope } from '@purestack/ts-minidom'

useDomScope(new AsyncLocalStorage())
```

PureStack's site builder does this when it starts.

`createDom(html)` installs a document for the whole process instead, for code
that runs outside a render, such as component tests. It returns a function
that restores the previous globals.
