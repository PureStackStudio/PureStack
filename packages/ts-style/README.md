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

Define keyframe animations on the existing theme style builder:

```ts
import { styleBuilder } from '@purestack/ts-style'

const theme = 'light'
const root = styleBuilder.get(theme)
const frames = root.keyframes('zt-memory-cycle')
frames.select('0%, 4%, 40%, 100%').transform('translateY(0)')
frames.select('12%, 28%').transform('translateY(-8px)')
root
  .select('.zt-slab-memory')
  .animation('zt-memory-cycle 8s ease-in-out infinite')
root
  .select('.zt-slab-memory')
  .media('prefers-reduced-motion: reduce')
  .animation('none !important')
```

Definitions use the same context, revision tracking, and reset lifecycle as
ordinary styles. Frame selectors also accept `from` and `to`; declarations use
the existing fluent methods, `.css()`, or `.set()`.

Keyframe names remain global inside `@scope` and are emitted without rewriting.
Animations with identical definitions can use the same name across themes.
When definitions differ between themes, use distinct names such as
`notice-fade-light` and `notice-fade-dark` in both the definition and reference.
