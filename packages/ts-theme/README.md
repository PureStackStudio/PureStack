# `@purestack/ts-theme`

PureStack's `doc` and `splash` templates, layout and Markdown styles, theme CSS output, stylesheet links, critical colors, and theme switching, and generated favicons.

```ts
import { themePlugin } from '@purestack/ts-theme'

const plugin = themePlugin()
```

Enabled automatically by `@purestack/ts-ssg`. Supplies default page templates, a head template, and a stylesheet provider. The provider initializes before component factories, regardless of plugin name or position. The head template runs before the selected page template so custom layouts can modify its markup. It honors `style`, `docLayout`, and highlighting settings; the build engine invokes its writer for full builds and lazy development assets. `defaultTemplates` is also exported for custom layouts.

To choose plugins explicitly, set `defaultPlugins: false` in `purestack.config.ts` or build options. Without this plugin, provide page templates and any desired CSS through your own plugin.

Favicon generation runs through `onContentDiscovered`, after output-directory preparation, in both full builds and lazy development sessions. It uses the configured icon and theme accent color.

Markdown presentation also belongs to this plugin. Its final rehype transform
wraps tables in `div.table-scroll`, after ordinary custom rehype transforms and
before outline collection and highlighting. Existing wrappers are preserved.
Without the theme plugin, Markdown tables retain their original markup. This
applies to Markdown, MDX, and shared Markdown partials.
