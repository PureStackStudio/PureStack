# @purestack/ts-seo

Default social preview metadata, canonical URLs, and translated alternate links.

```ts
import { seoPlugin } from '@purestack/ts-seo'

const plugin = seoPlugin()
```

Enabled automatically by `@purestack/ts-ssg`. Uses site and page `preview`
settings, page titles and descriptions, `sitemap.baseUrl`, `basePath`, and the
page's translations to generate Open Graph, Twitter, canonical, and hreflang
defaults. Relative preview images honor the site's base path; absolute image
URLs are preserved. Page-specific images use their own dimensions.

The plugin contributes `headConfig` before head markup and page templates run.
Explicit frontmatter `head` values override these defaults, including nested
Open Graph and Twitter fields. Templates receive the completed `headConfig`.

To omit automatic preview metadata, set `defaultPlugins: false` in
`purestack.config.ts` or build options and list the other plugins you need.
Basic titles, descriptions, explicit `head` settings, and `index: false`
enforcement remain available in core. Sitemap and robots.txt generation remain
in `@purestack/ts-ssg`.

`resolvePreviewConfig(frontmatter, options)` is also exported for custom metadata
plugins. It returns metadata defaults without applying explicit `head` overrides.

The plugin owns site `preview` defaults and normalization, including trimmed strings and positive integer image dimensions. Omitting it leaves `config.preview` absent unless another plugin contributes it.
