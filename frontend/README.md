# purestack.studio

The PureStack launch site, built with PureStack's SSG, MDX, typed HTML/CSS
builders, components, and Regor.

## Develop

From the repository root:

```sh
yarn frontend
```

Open **http://127.0.0.1:4700**. The content watcher updates MDX and browser
TypeScript; the process watcher reloads changes to the runner, components, and theme.

```sh
yarn frontend:build
yarn frontend:publish
```

- `frontend:build` writes `frontend/out/purestack.studio/web-dev`.
- `frontend:publish` creates a clean, minified production artifact in
  `frontend/out/purestack.studio/web`. This is a local build, not a deployment.
- Serve the production folder as a static website at `https://purestack.studio`.
- Use the site runner rather than invoking the generic CLI directly: the runner
  registers the `studio` skin, composition components, template, and typed styles.

## Source map

| File | Purpose |
| --- | --- |
| `studio.ts` | Build/dev entry point and semantic HTML document template |
| `demoStyle.ts` | Typed CSS for the real Style API workbench preview |
| `purestack.studio/index.mdx` | Landing page, source examples, and static component previews |
| `purestack.studio/header.mdx`, `footer.mdx` | Shared navigation and footer |
| `purestack.studio/studio.ts` | Keyboard enhancement for native Tabs, clipboard feedback, mobile menu, and live Regor counter |
| `components/studioComponents.ts` | Typed compositions of Panel, Tabs, TabPane, Btn, BtnLink, SectionHeader, IconFrame, ExpandablePanel, and BarChart |
| `theme/studioSkin.ts` | Dark studio skin using the standard semantic palette contract |
| `theme/studioStyles.ts` | Registers the page's typed style extensions in PureStack's generated theme stylesheets |
| `theme/*Styles.ts` | Layout, typography, responsive rules, and component composition spacing |
| `purestack.studio/siteConfig.json` | SEO, social preview, assets, and output paths |
| `designs/social-preview.svg` | Editable source for the 1200×630 social preview PNG |
| `purestack.studio/_designs/_newspaper.mdx` | Earlier design reference |

## Components and theme

The MDX page uses `Grid` and `Flex` for responsive layouts, `BtnLink` for actions,
and typed `Studio*` compositions for repeated sections. The workbench uses the
framework's `Tabs` and `TabPane`, including its existing bundled runtime and
native radio fallback. FAQ items use `ExpandablePanel`.

Colors, component states, fonts, and radii come from the registered `studio` skin.
Both system modes use the dark launch identity. Buttons, panels, badges, and icon
frames use standard semantic tones and variants; chart colors reference the same
palette variables. Page-specific layout and decorative styles use `styleBuilder`
and `themes.forEach`, with framework breakpoint tokens. They are emitted into
`site.css` and `site.dark.css`; there is no separate handwritten CSS asset.

To change the identity, edit `theme/studioSkin.ts`. To add a reusable section,
compose existing primitives in `components/studioComponents.ts` and register only
the extra layout styles it needs. `demoStyle.ts` intentionally remains a small,
self-contained example matching the workbench's displayed Style API source.

The page deliberately describes the framework as pre-release and uses the
repository workflow instead of assuming an npm release already exists. Update
the release announcement, quick start, and availability FAQ when publishing.
GitHub links target `PureStackStudio/PureStack` and the `main` branch.

## Component documentation pilot

Open `/components/`, `/components/buttons/`, `/components/tabs/`, and
`/components/modal/`. These pages use `template: doc` directly, the directory's
standard `TopBar` header, and the built-in `NavMenu` and `PageToc`.

Author guidance, examples, code fences, and API tables in the MDX files under
`purestack.studio/components/`. Static examples use standard components directly.
Put the matching source in a fenced `html` block inside a native `details`
element; ts-ssg handles highlighting and its standard code-copy control.

Examples requiring application state live in their component's module:
`docs/buttons.ts`, `docs/tabs.ts`, and `docs/modal.ts`.
Each module follows the standard `ts-components` pattern: exported context
interfaces, individually named template strings, typed context factories, and
explicit `defineComponent<Interface>` calls. `docs/docsComponents.ts` only merges
the registrations for server rendering.
Each MDX page loads its own matching browser entry (`components/buttons.ts`,
`tabs.ts`, or `modal.ts`) through `PageScript`. Each entry registers its own
components and mounts them with direct `createApp` calls and explicit templates.
There is no shared example contract, lookup table, or mounting helper.
Tabs and Modal use their existing runtimes.
There is no custom documentation template, stylesheet, or highlighter.

To document another component, add its example module and matching browser
entry, define its preview components in that example module, merge its exported
registrations in `docs/docsComponents.ts`, and reference the
entry from its MDX page. Pass derived component props as `computed` refs so
they keep updating after mount; the Buttons playground demonstrates this for
icon selection and icon-only state.

The pilot covers button variants, tones, sizes, icons, links, events and forms;
tab composition, disabled panes, overflow, independent groups and controlled
selection; and modal sizes, motion, slots, nesting, browser events and ModalStore.

Browser checks cover desktop/mobile layout, the examples' state changes, source
highlighting, and dialog dismissal/focus restoration. Shared framework
accessibility and no-JavaScript findings are recorded in `IMPLEMENTATION.md`;
these require attention before treating the documentation as release-ready.

## Type checking

```sh
yarn tsgo -p frontend/tsconfig.json --noEmit
```

Landing-page verification covered all workbench tabs, arrow/Home/End keys, counter
state, all copy controls and denied clipboard access, mobile menu and FAQ,
320–1920px widths, no-JavaScript rendering with a light system preference,
internal anchors, metadata, and WCAG A/AA automated checks. Browser tooling and
screenshots are under the ignored `.tmp` directory; they are not shipped.

No generated page-script embeds need regeneration for this site.
