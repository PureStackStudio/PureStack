# @purestack/ts-page-scripts

Browser behavior for PureStack's generated pages. The exported builders return
inline JavaScript for theme switching, consent, navigation, menus, tabs,
dialogs, search, and other page features.

The site generator uses these builders when it adds interactive components to
static HTML. The package also exports TypeScript types for the browser APIs
exposed by those scripts, such as `TsSsgTabsApi` and `TsSsgModalApi`.

`pageScriptsPlugin()` supplies a head template that adds page runtimes before
the selected page template runs. It is enabled by default by `@purestack/ts-ssg` and can
also be imported from this package:

```ts
import { pageScriptsPlugin } from '@purestack/ts-page-scripts'
```

It preserves site configuration, page layout gates, consent-aware analytics,
and the site's base path. Theme startup belongs to `@purestack/ts-theme`;
component-specific Tabs/Modal embeds remain managed by the renderer.

To omit the page runtimes, set `defaultPlugins: false` in `purestack.config.ts`
or build options and list the other plugins you need.
