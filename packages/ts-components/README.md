# @purestack/ts-components

PureStack's built-in Regor components for pages and app interfaces. The library
includes layout, navigation, forms, charts, dialogs, and content components used
by the static site generator and available to custom renderers.

`defineComponents(getSvgIcon)` assembles the component set, and
`registerStyles()` adds its styles to PureStack's theme builder. Individual
component definitions and style registration functions are also exported when
you need a smaller selection.

`componentsPlugin()` integrates these components, SVG icons, and their styles
as default contributions scoped to each build. It is enabled by default by
`@purestack/ts-ssg` and can also be imported from this package:

```ts
import { componentsPlugin } from '@purestack/ts-components'
```

Extension component factories and config hooks can override standard components
through `context.components` and register styles. When choosing plugins explicitly with `defaultPlugins: false`,
include `@purestack/ts-theme` to emit CSS, or supply your own style writer through
`context.styles`.

The components plugin owns the site `logo` defaults and normalization. Without it, a custom plugin may contribute `logo`; components also accept an absent site logo config.
