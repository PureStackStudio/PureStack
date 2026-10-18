# @purestack/ts-pagefind

Pagefind indexing and the default PureStack search provider.

```ts
import { pagefindPlugin } from '@purestack/ts-pagefind'

const plugin = pagefindPlugin()
```

Included automatically by `ts-ssg`. The `search(config)` contribution supplies
a `SiteSearch` provider. The builder coordinates full builds and lazy requests,
serializes concurrent indexing requests, and invalidates search when pages are
rendered or removed. Pagefind owns its indexing implementation and generated
`/pagefind/` assets.

The provider preserves `pagefind.enabled`, `excludePaths`, `index: false`,
generated pages, base paths, stale-output cleanup, and warning behavior. Lazy
development indexes only pages rendered in the current session. Full builds
also include eligible static HTML files, as before. The browser search runtime
belongs to `ts-page-scripts` and follows the same site configuration.

`buildPagefindIndex` is exported for standalone use. To use a different search
engine, replace `purestack:pagefind` by name or disable automatic plugins and
supply a `search(config)` contribution. Its provider implements
`ownsPath(pathname)` and `write({ outDir, excludeFiles, onlyFiles })`; no new
lifecycle hook is required.

The plugin owns `pagefind` defaults, exclusion-path normalization, and validation. Omitting it leaves `config.pagefind` absent unless another plugin contributes it; the standard browser scripts then omit Pagefind search initialization.
