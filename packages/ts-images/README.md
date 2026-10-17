# `@purestack/ts-images`

Optional, build-time image optimization for PureStack. Ordinary Markdown and
rendered HTML images gain responsive variants without a browser runtime or a
special component. This package is **not** part of the default plugin set.

Install it alongside PureStack, then add it in `purestack.config.ts`:

```ts
import { defineConfig } from '@purestack/ts-ssg'
import { imagesPlugin } from '@purestack/ts-images'

export default defineConfig({
  plugins: [imagesPlugin({ widths: [480, 960, 1440], formats: ['avif', 'webp'] })],
})
```

```md
![Dashboard overview](./images/dashboard.png)
```

The plugin produces `<picture>` sources for the configured modern formats and
an `<img>` with a JPEG/PNG fallback, `srcset`, `sizes`, and missing dimensions.
Generated URLs live under `/_assets/images/`, with the site's base path applied
by PureStack. Filenames contain the hash of the **encoded output bytes**.
Widths are deduplicated, sorted, and capped at the source's oriented dimensions.
If `formats: []` is selected, only the responsive fallback is emitted, without a
`<picture>` wrapper.

Original assets are always retained for links, downloads, CSS backgrounds,
posters, and preview metadata. Source files are never edited. Only generated
files whose last referencing page disappears or changes are removed.

## Configuration

Factory options supply defaults that `siteConfig.json` and programmatic input
can override. Settings are also available under typed `extensions.images`:

```json
{
  "extensions": {
    "images": {
      "widths": [480, 960, 1440],
      "formats": ["avif", "webp"],
      "sizes": "(max-width: 960px) 100vw, 960px",
      "exclude": ["downloads/**"],
      "quality": { "avif": 50, "webp": 80, "jpeg": 82 }
    }
  }
}
```

| Setting | Default / behavior |
| --- | --- |
| `enabled` | `true`; `false` leaves image output untouched |
| `widths` | `[480, 960, 1440]`; 1–16 widths, each an integer from 1 to 16384; no upscaling |
| `formats` | `['avif', 'webp']`; order determines `<source>` preference; JPEG/PNG fallback is automatic |
| `quality` | AVIF 50, WebP 80, JPEG 82; each 1–100 |
| `sizes` | `100vw`; configure it for the image's actual layout slot |
| `loading` | `lazy`; may be `eager` or `false` to omit the default |
| `decoding` | `async`; may be `sync`, `auto`, or `false` |
| `priority` | `false`; fills missing `loading="eager"` and `fetchpriority="high"` when enabled |
| `lossless` | `false`; `true` enables lossless modern encoders and a PNG fallback |
| `metadata` | `strip`; auto-orient first, convert to sRGB, then omit metadata; `preserve` retains metadata with orientation normalized |
| `include` / `exclude` | `['**/*']` / `[]`; glob patterns on content-root-relative paths using `/` |
| `cacheDir` | OS temporary cache, namespaced by content root; custom paths resolve from `rootDir` and must be outside content and output directories |
| `concurrency` | `2`; per-site limit from 1–16, including encoding and output emission |
| `maxInputPixels` | 40 million |
| `maxSourceBytes` | 50 MiB |
| `onError` | `error`; `warn` retains the original image when optimization fails; invalid content URLs still obey core URL validation |
| `presets` | Named per-image settings, inheriting the resolved global image settings |

The plugin owns normalization in the configuration pipeline. All resolver
overrides finish before normalization and processor creation. Omitting the
plugin leaves its input available to other plugins without validating it.

## Per-image choices

```html
<img src="./hero.jpg" alt="The workshop" data-image-preset="hero">
<img src="./screen.png" alt="Editor settings" data-image-preset="screenshot">
<img src="./small.jpg" alt="A portrait" data-image-preset="thumbnail">
<img src="./diagram.png" alt="Source diagram" data-image-optimize="false">
<img src="./cover.jpg" alt="Cover" data-image-priority>
```

Built-in presets are `content` (global settings), `hero` (960/1440/1920 widths
and eager/high priority), `thumbnail` (160/320/640 widths and a thumbnail
`sizes` value), and `screenshot` (lossless WebP plus PNG fallback). Override or
add presets with `presets: { name: { widths, formats, quality, sizes, loading,
decoding, priority, lossless, metadata } }`.

Existing `alt`, IDs, classes, styles, links, dimensions, `sizes`, loading,
decoding, and fetch priority are preserved. If only one dimension is supplied,
the other is derived from the oriented aspect ratio. Author-supplied loading
and priority attributes take precedence over defaults. The plugin cannot
infer which images are above the fold; mark important images explicitly.

Existing `<picture>` and `srcset` markup is left alone, as are external/data/blob
URLs, SVG, animated GIF/WebP/AVIF, and APNG. Local JPEG, PNG, WebP, AVIF,
single-frame GIF, and TIFF references are supported. CSS backgrounds, posters,
social metadata images, and arbitrary string URLs inside client JavaScript
are not rewritten. The `<picture>` wrapper changes the image's parent element;
use the opt-out where direct-child CSS selectors require the original structure.

## Builds and development

Sharp is loaded only when a selected local raster image is processed. The
package requires Node 22.20+ and uses Sharp's platform-specific native codecs.
No image dependency is added to PureStack's standard installation.

The plugin processes the rendered document after document hooks and before URL
resolution, including server-rendered components, shared headers/footers, and
template content. It uses core's content URL and locale fallback rules rather
than resolving paths independently.

Full builds process referenced images. Lazy development processes only requested
pages, and generated image files exist before the page is served. Core records
image dependencies separately from content imports, so optimization does not
suppress original asset copies. Image edits invalidate dependent pages; changes
to the discovered route/asset inventory may also invalidate other pages under
the normal URL-resolution rules. Dependencies survive manifest reuse and missing
images remain tracked for error-page recovery.

The persistent cache survives cleaned output directories. Keys include input
bytes, pixel settings, and codec versions; markup-only choices such as `alt`,
loading, and `sizes` reuse encoded files. Cache contents are verified by hash,
and incomplete or corrupted entries are rebuilt. Concurrent identical work is
shared within a site; writes use atomic replacement.

Optimization emits diagnostics with the referring page, source, cache result,
input bytes, total generated bytes, variant count, and duration. Generated bytes
are the total of all variants, not the bytes a particular browser downloads.
Small images and lossless variants can be larger than the input; tune formats,
quality, presets, or exclusions using these measurements. Encoding deliberately
prioritizes the configured quality/fidelity rather than promising a fixed saving.

For custom reporting, pass `onDiagnostic(diagnostic)` to `imagesPlugin()`.
Remote downloads, SVG optimization, animated transcoding, placeholders, and
automatic cropping are outside this release's scope.
