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
| `components/studioComponents.ts` | Explicit registration of the Studio components |
| `components/studio*.ts` | One file per component, with its exported interface, named template, and typed definition |
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
compose existing primitives in its own file under `components/`, register its
definition in `studioComponents.ts`, and register only the extra layout styles
it needs. `demoStyle.ts` intentionally remains a small,
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
The Buttons page pairs previews with source tabs using native `Tabs` and
`TabPane`. Each file has its own source tab; ts-ssg handles fenced-code
highlighting and its standard code-copy control.

The Buttons API uses `docs/apiProperty.ts` for anchored property panels with a
consistent type/default header. Property descriptions and fenced examples stay
in MDX; native `ExpandablePanel` components list accepted tones and variants.
The default page outline links to the API groups, slots, events, and attributes.

The Buttons page lives in `components/buttons/buttons.mdx`, alongside
`button-playground.ts`, `collection.ts`, and `project-form.ts`.
The folder's matching page name keeps its URL at `/components/buttons/`.
The previews run these neighboring TypeScript files directly.
Their source tabs contain those same
files; keep each fenced source block identical to its browser entry when editing.
Static variant markup is formatted identically in its preview and source tab.
The other pilot examples live in `docs/tabs.ts` and `docs/modal.ts`.
Each module follows the standard `ts-components` pattern: exported context
interfaces, individually named template strings, typed context factories, and
explicit `defineComponent<Interface>` calls. `docs/docsComponents.ts` only merges
the registrations for server rendering.
Buttons uses `RegorApp` for each interactive mount; each standalone example
targets its generated `app` element by id. Tabs and Modal
currently load their entries with `PageScript`. Each entry registers its own
components and mounts them with direct `createApp` calls and explicit templates.
There is no shared example contract, lookup table, or mounting helper.
Tabs and Modal use their existing runtimes.
There is no custom documentation template, stylesheet, or highlighter.

To document another component, add its example module and matching browser
entry and define its preview components in that example module. Use `RegorApp`
to declare each browser mount in MDX; register components in
`docs/docsComponents.ts` only when the MDX renders them on the server.
Pass derived component props as `computed` refs so
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
