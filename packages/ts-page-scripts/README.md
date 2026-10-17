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

It preserves site configuration, page layout gates,
and the site's base path. Theme startup belongs to `@purestack/ts-theme`;
the plugin adds component-specific Tabs/Modal embeds through `onPageDocument`. Recorded component placement overrides frontmatter, and Tabs remains before Modal when both target the same parent.

To omit the page runtimes, set `defaultPlugins: false` in `purestack.config.ts`
or build options and list the other plugins you need.

Three separate plugins from this package are also enabled by default:

| Factory | Plugin name | Responsibility |
| --- | --- | --- |
| `authStateHintPlugin()` | `purestack:auth-state-hint` | Apply the signed-in hint before stylesheets load, when auth is enabled |
| `consentPlugin()` | `purestack:consent` | Initialize the consent browser runtime when consent is enabled |
| `analyticsPlugin()` | `purestack:analytics` | Add direct GA4 scripts without consent, or register the consent-managed GA4 service during `onConfigResolved` |

Each factory can be selected independently of `pageScriptsPlugin()`. Omitting
analytics removes automatic GA4 service registration as well as direct scripts;
explicit user-defined consent services are preserved. When consent is enabled,
analytics never bypasses it, including when the consent runtime plugin is omitted.
The raw `resolveSiteConfig` result contains only explicitly configured consent
services; automatic GA4 registration occurs when the analytics plugin initializes,
before later config hooks and page rendering.

For standalone `renderApp` calls, use `appendRuntimeScripts(document, runtimeEmbeds, frontmatter.embed)` from the renderer's `onRendered(document, runtimeEmbeds)` callback. The renderer itself has no knowledge of individual runtimes.
