# @purestack/ts-highlight

Syntax-highlighting backends and the default PureStack highlighting plugin.

```ts
import { highlightPlugin } from '@purestack/ts-highlight'

const plugin = highlightPlugin()
```

Included automatically by `ts-ssg`. The plugin selects `mdx.highlighter`,
initializes the selected engine once per build/session, and respects
`mdx.disableHighlighter`. Fenced, inline, imported, and Regor markup examples
all use the same highlighter. Language aliases, inferred file extensions,
tagged TypeScript templates, and light/dark Shiki themes are preserved.

The plugin owns the `highlightjs` default and accepts `highlightjs` or `shiki`
when its factory is selected. Core treats `mdx.highlighter` as an optional,
provider-owned identifier. Omitting this plugin does not select or normalize an
engine. Custom providers can use their own identifiers; replacing the default
factory avoids initializing or validating the standard backends.

Pass `createShiki(options)` or `createHighlightJs()` to customize the native
backend. Both may return an instance synchronously or asynchronously; the
unused factory is never called. The Shiki options contain the default
languages and themes. For highlight.js, prefer a new instance with explicitly
registered grammars to avoid changing the shared registry.

`createMdxHighlighter`, `createHljsHighlighter`, `DEFAULT_MDX_CODE_LANGS`, and
`DEFAULT_MDX_CODE_THEMES` are exported for standalone use. The shared
`MdxCodeHighlighter` contract is exported by `ts-common` and `ts-ssg`.

To replace the backend entirely, supply `markdown.createHighlighter(config)`
from an ordinary plugin. It takes precedence over the default provider, which
is not initialized. Per-language `markdown.resolveHighlighter` callbacks take
precedence over either provider and remain available when default highlighting
is disabled. Disable automatic plugins to omit this provider altogether.
