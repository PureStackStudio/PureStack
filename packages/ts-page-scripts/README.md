# @purestack/ts-page-scripts

Browser behavior for PureStack's generated pages. The exported builders return
inline JavaScript for theme switching, consent, navigation, menus, tabs,
dialogs, search, and other page features.

The site generator uses these builders when it adds interactive components to
static HTML. The package also exports TypeScript types for the browser APIs
exposed by those scripts, such as `TsSsgTabsApi` and `TsSsgModalApi`.
