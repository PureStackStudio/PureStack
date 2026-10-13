# @purestack/ts-common

Shared TypeScript contracts for PureStack's site generator, components, and page
scripts. This package defines site configuration, page frontmatter, navigation,
logos, templates, and the rendering context so those packages agree on the same
shapes.

Import types such as `SiteConfig`, `PageFrontmatter`, and `PageContext` when
building a custom integration. The runtime exports `resolvePageContext` and
`tryResolvePageContext` find the site context in a Regor component.
