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

The default Shiki backend caches highlighted HTML in the OS temporary
directory (`purestack-cache/shiki`), keyed by Shiki's version, the themes, the loaded languages, and the
code. Repeat builds reuse it, and Shiki loads only when a block is not cached.
Builds run with `--no-cache` skip it. Output from a custom `createShiki`
factory is never cached, because its grammars are unknown.

Storage uses `PersistentCache` from `@purestack/ts-util-node`: 32 lazy JSON shards,
buffered writes merged under shard locks, bounded memory, and cleanup of entries
unused for 30 days. Large entries stay in separate files. PureStack flushes after
build and development render batches. Standalone users should await
`highlighter.flush?.()` after rendering their batch; the periodic flush timer
does not keep Node alive.
Other build-time plugins and components can use the same utility with their own
namespace, version, and input keys.

`createMdxHighlighter(themes?, langs?, { create?, cache? })`,
`createHljsHighlighter`, `DEFAULT_MDX_CODE_LANGS`, and
`DEFAULT_MDX_CODE_THEMES` are exported for standalone use. The shared
`MdxCodeHighlighter` contract is exported by `ts-common` and `ts-ssg`.

To replace the backend entirely, supply `markdown.createHighlighter(config)`
from an ordinary plugin. It takes precedence over the default provider, which
is not initialized. Per-language `markdown.resolveHighlighter` callbacks take
precedence over either provider and remain available when default highlighting
is disabled. Disable automatic plugins to omit this provider altogether.
