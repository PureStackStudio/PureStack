# PureStack Feature Inventory

This inventory summarizes the package capabilities currently visible in the repository.

## TypeScript Packages

### `@purestack/ts-html`

- Immutable HTML node builder.
- Type-safe HTML tags.
- Type-safe attributes.
- Global attributes.
- ARIA attributes.
- Event attributes.
- Text escaping.
- Raw HTML injection.
- Fragment nodes.
- Child composition.
- Tag selection and replacement.
- HTML serialization.
- Pretty HTML serialization.
- Head metadata helpers.
- Basic head config.
- Open Graph/canonical/meta support.
- Generated HTML metadata types.

### `@purestack/ts-css`

- Type-safe CSS builder.
- Fluent selectors.
- Typed CSS properties.
- Selector composition.
- Child selectors and combinators.
- Pseudo selector handling.
- Media query nesting.
- CSS variable auto expansion.
- Style reuse through `.use`.
- Deterministic CSS serialization.
- Pretty CSS serialization.
- Color utilities.
- Gradient utilities.
- CSS property metadata generation.

### `@purestack/ts-ssg`

- Markdown/MDX static site generation.
- Deterministic file-based routing.
- `index.html` folder routes.
- Static asset copying.
- Site config resolution.
- JSON schema for site config.
- CLI build mode.
- CLI dev/serve mode.
- Watch mode.
- Live reload over SSE.
- Lazy route render in dev server.
- Incremental rebuilds.
- Manifest tracking.
- Clean builds.
- Publish builds.
- Markdown support.
- MDX support.
- GFM support.
- Frontmatter parsing.
- Draft page hiding.
- Hidden nav items.
- Navigation generation.
- Custom nav files.
- Hybrid nav mode.
- Navigation override/merge modes.
- Built-in `doc` template.
- Built-in `splash` template.
- Custom template map.
- Page outline extraction.
- Page TOC support.
- Optional Shiki highlighting.
- Built-in component initialization.
- Built-in skins.
- Light/dark/additional theme CSS output.
- HTML minification option.
- CSS pretty output option.
- Sitemap generation.
- Robots.txt generation.
- Pagefind indexing.
- Pagefind exclusion paths.
- Consent manager integration.
- GA4 integration.
- Consent-gated analytics.
- Build hooks.
- Error page writing in dev.

### `@purestack/ts-components`

- Regor component definitions.
- Central component registration.
- Central style registration.
- Alert box.
- Badge.
- Button and button links.
- Bar chart.
- Doughnut chart.
- Line chart.
- Composer/email editor.
- Email HTML safety policy.
- Consent component.
- Contact form.
- Drop files.
- Expandable panel.
- Flex layout.
- Grid layout.
- Form shell.
- Form input field.
- Form select field.
- Autocomplete input.
- Multi-autocomplete input.
- Icon component.
- Landing page sections.
- Logo.
- Modal.
- Modal store.
- Navigation menu/list/item.
- Page TOC.
- Panel.
- Pricing table/plan/feature.
- Search box.
- Section header.
- Sign-in component.
- Tabs.
- Theme switcher.
- Toast host/store.
- Top bar.
- Virtual list.
- Variable virtual list.
- Virtual table.
- Variable virtual table.
- Component variant and tone support.

### `@purestack/ts-style`

- Breakpoint definitions.
- Design token variables.
- Document layout variables.
- CSS normalize registration.
- Semantic tone system.
- Built-in skins.
- Theme asset helpers.
- Theme option resolution.
- Theme palette generation.
- Theme palette CSS variables.
- Typography normalization.
- Line-height helpers.
- Letter-spacing helpers.
- Utility class registration.
- Style builder helpers.

### `@purestack/ts-page-scripts`

- Theme switch runtime script.
- Consent runtime script.
- Auth state hint script.
- Code copy script.
- Menu runtime script.
- Modal runtime script.
- Navigation menu script.
- Pagefind search runtime script.
- Page TOC script.
- Tabs script.
- Embedded script builders.
- Runtime globals for tabs and modals.

### `@purestack/ts-svg-icons`

- Icon lookup by `provider:name`.
- Raw SVG passthrough.
- Iconoir generated icons.
- Lucide generated icons.
- Phosphor regular generated icons.
- Tabler outline and filled generated icons.
- Tree-shake friendly direct icon exports.
- Available icon name types.
- Generated provider maps.

### `@purestack/ts-common`

- Shared SSG context types.
- Site config types.
- Page template types.
- Frontmatter types.
- Navigation types.
- Consent types.
- Analytics/GA4 types.
- Auth config types.
- Pagefind config types.
- Sitemap/robots types.
- SSG context resolver.

### `@purestack/ts-render`

- Component registry.
- Render app helper.
- Regor/static rendering integration.
- SSG context-aware render options.

### `@purestack/ts-minidom`

- Minimal DOM implementation.
- HTML parsing.
- Fragment parsing.
- Mini document, element, text, comment, template, slot types.
- Mutation observer support.
- Event/custom event/mouse event support.
- Class list support.
- Style declaration support.
- Selector/query support.
- DOM globals setup for tests/server rendering.
- DOM cache reset.
- CSS escape helper.

### `@purestack/ts-util`

- Browser-safe shared helpers.
- HTML escaping.
- Type guards.
- Deep partial type.
- Object merge helper.
- Cache helper.
- Clamp helper.
- URL normalization.
- Asset path helpers.
- Logger-like error helper.

### `@purestack/ts-util-node`

- Node-only filesystem utilities.
- File extension replacement helper.

### `@purestack/ts-ssg-vscode`

- VS Code extension package.
- MDX syntax grammar.
- Lit HTML syntax injection.
- Lit SVG syntax injection.
- Lit style injection.
- Template diagnostics.
- Template formatting.
- Template autoclose.
- Linked editing.
- HTML formatting.
- Frontmatter support.
- Frontmatter metadata.
- Component metadata.
- Component resolver.
- MDX formatting.
- TypeScript runtime integration.
- Extension assets.

## Build and Tooling Scripts

- Stable TypeScript 7 compiler dependency.
- Yarn 4 workspaces.
- Vite config.
- Biome formatting and checking.
- Vitest tests.
- tsdown bundling.
- Bundle and cleanup scripts.
- Embed, icon, and Regor component generation scripts.
- Longest functions report script.
- DTS export fix script.

## Tests Visible In The Repo

- TypeScript package tests for builders, navigation, rendering, MDX, assets, sitemap, incremental builds, and components.
