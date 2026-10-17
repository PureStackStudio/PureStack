# @purestack/ts-style

Theme and style infrastructure for PureStack sites and components. It provides
light and dark palettes, CSS variables, theme skins, breakpoints, layout tokens,
and utilities for building scoped styles with `@purestack/ts-css`.

Use `themes` and `registerSkin` to configure a site's palette, or
`styleBuilder` to collect and render CSS for a theme. PureStack's component
library and site generator use these same exports.

Every SSG builder owns an independent style context. The generator propagates
that context across asynchronous factories, hooks, page rendering, and asset
writing, so concurrent sites cannot overwrite each other's palettes or CSS.
Stylesheet revisions track changes to that site's style trees only.

Standalone consumers can create a context with `createStyleContext()` and run
work inside `runWithStyleContext(context, callback)`. Without an installed async
scope, asynchronous standalone renders must run sequentially. Node integrations
can install `AsyncLocalStorage<StyleContext>` through `useStyleScope`; the style
package itself remains browser-safe. Nested contexts restore their parent even
when a render fails.
