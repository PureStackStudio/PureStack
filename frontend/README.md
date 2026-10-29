# PureStack website

The PureStack launch site, built with PureStack's SSG, MDX, typed HTML/CSS
builders, components, and Regor.

## Develop

From the repository root:

```sh
yarn frontend
```

Open **http://127.0.0.1:4700**. The content watcher updates MDX and browser
TypeScript, and reloads the website plugin when it, a component, or the theme
changes; the process watcher restarts the server when PureStack's own sources change.

```sh
yarn frontend:build
yarn frontend:publish
```

- `frontend:build` writes `frontend/out/purestack.studio/web-dev`.
- `frontend:publish` creates a clean, minified production artifact in
  `frontend/out/purestack.studio/web`. This is a local build, not a deployment.
- Serve the production folder as a static website at `https://purestack.studio`.
- Each command runs the `purestack` CLI. It loads `purestack.studio/purestack.config.ts`,
  whose plugin registers the `purestack` skin, composition components, templates, and typed styles.

## Legal pages

Imprint and Privacy Policy content lives in Git-ignored MDX files. Missing files
are created automatically with placeholders; fill them before publishing.
See [Private legal content](legal-content.md) for paths and setup.

## Error pages

Preview the missing-page design at `/error/404/` and the general-error design at
`/error/`. Their MDX files and compact shared header/footer live in
`purestack.studio/error/`; `components/recovery/` supplies their shared content and
two decorative SVG illustrations. Layout and presentation use native `Flex`,
`Grid`, buttons, icon frames, and generated utilities. `styles/recovery.ts` only
adds viewport layout, a content width limit, and fluid heading sizing.

Both pages use `index: false`, which keeps them out of navigation, Pagefind, and
the sitemap, and emits `noindex`. The general-error page enables a retry button through
`modules/recovery.ts`; it reloads the current URL, including when a host serves
the page for a different failing URL.

The development server automatically serves `error/404/index.html` for missing
pages and falls back to `error/index.html` for other errors without a specific
status page. It preserves the requested URL and HTTP error status, with
`Cache-Control: no-store`. Direct preview requests return 200. Configure the
production static host to use the same error-page convention.

## Source map

| Location                                                    | Responsibility                                                                 |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `plugin.ts`                                                 | Connects the skin, components, templates, styles, and generated previews       |
| `purestack.studio/purestack.config.ts`                      | Registers the frontend plugin                                                  |
| `templates/landing.ts`                                      | Landing layout with shared header, footer, and skip link                       |
| `purestack.studio/index.mdx`                                | Landing content, source examples, and component previews                       |
| `purestack.studio/header.mdx`, `footer.mdx`                 | Shared navigation and footer content                                           |
| `components/index.ts`                                       | Explicit component registration                                                |
| `components/shell/`                                         | Brand and palette picker                                                       |
| `components/shared/`                                        | Copy button shared by other compositions                                       |
| `components/landing/`                                       | Feature showcases, source workbench, package links, and other landing sections |
| `components/getting-started/`                               | Command blocks and Forge overview                                              |
| `theme/skin.ts`, `theme/palette/`                           | Light/dark skin, palette generation, and shared tokens                         |
| `theme/presets.ts`, `theme/surfaces.ts`                     | Selectable color families and their surface profiles                           |
| `theme/head.ts`, `theme/colors.ts`                          | Restore the selected palette before paint and emit palette overrides           |
| `styles/landing/`, `styles/documentation/`, `styles/shell/` | Layout and presentation rules grouped by purpose                               |
| `purestack.studio/modules/`                                 | Browser enhancements and palette selection                                     |
| `demoStyle.ts`                                              | Typed styles for the workbench's Style API example                             |
| `purestack.studio/siteConfig.json`                          | SEO, social preview, assets, and output paths                                  |
| `designs/social-preview.svg`                                | Editable source for the social preview image                                   |

## Components and theme

The MDX page uses `Grid` and `Flex` for responsive layouts, `BtnLink` for actions,
and focused compositions such as `FeatureShowcase`, `SourceWorkbench`, and
`CommandBlock`. The workbench uses the
framework's `Tabs` and `TabPane`, including its existing bundled runtime and
native radio fallback. FAQ items use `ExpandablePanel`.

Colors, component states, fonts, and radii come from the registered `purestack` skin.
The identity is a cobalt accent over blue-slate neutrals, with indigo and
violet companions. Each role is one OKLCH hue in `theme/palette/shared.ts`;
light mode paints it as paper tints with saturated fills, dark mode as deep ink
fields with luminous fills. The standard theme switcher respects the
saved choice or system preference. Buttons, panels, badges, and icon
frames use standard semantic tones and variants; chart colors reference the same
palette variables. Page-specific layout and decorative styles use `styleBuilder`
and `themes.forEach`, with framework breakpoint tokens. They are emitted into
`site.css` and `site.dark.css`; there is no separate handwritten CSS asset.

The palette icon before the theme toggle offers Cobalt, Violet, Teal, Emerald,
Amber, and Rose. Edit `theme/presets.ts` to adjust each complete color
family: neutrals, accents, companion colors, and semantic roles. Each preset
coordinates page backgrounds, reading surfaces, text, borders, controls, shadows,
and highlights in both modes. Status colors retain their familiar meanings.
`theme/surfaces.ts` defines each preset's lightness steps for the
page, cards, inset surfaces, and controls, plus border strength, saturation, and
shadow density. Dark presets range from crisp slate to a brighter warm neutral palette.
Documentation derives its colors from these same roles, so its code panels and
copy controls keep their own layers instead of sharing one flat reading surface.
`theme/palette/landing.ts` keeps the landing page's original light-paper and
deep-slate brightness while applying the selected color family's hues. Its
palette overrides stay within the landing template; documentation retains each
preset's distinct layer contrast. The initial background style uses the same
template-specific palette before the full stylesheets load.
`theme/colors.ts` emits changed palette variables; `styles/documentation/colors.ts`
defines documentation color roles. A tiny inline startup script before the
stylesheet links restores `purestack-site-color` from local storage. The picker
uses the normal `PageScript` asset pipeline for its separately bundled runtime,
supports native radio keyboard controls, and follows changes from other tabs.
If storage is unavailable, the choice still applies for the current visit.

To change a selectable identity, edit its preset; `theme/palette/shared.ts`
defines the skin's baseline hues and shared typography. To add a
reusable section,
compose existing primitives in its own file under `components/`, register its
definition in `components/index.ts`, and register only the extra layout styles
it needs. `demoStyle.ts` intentionally remains a small,
self-contained example matching the workbench's displayed Style API source.

The page presents the published npm package and links to the CLI guide for new
projects. Its quick start launches PureStack Forge through the CLI to configure
and create a site. GitHub links target `PureStackStudio/PureStack` and the `main` branch.

## Component documentation

The component catalog is organized into seven category folders, each with an
`index.mdx` overview and a matching group in the generated navigation:
- `actions/`: buttons, grouped actions, badges, alerts and notifications.
- `layout/`: layout primitives, content surfaces, icons, tabs and dialogs.
- `forms/`: forms, fields, autocomplete, rich text and files.
- `data/`: charts and virtualized lists and tables.
- `landing/`: product sections, metrics, comparisons and pricing.
- `site/`: branding, navigation, search, themes, accounts and consent.
- `runtime/`: RegorApp and PageScript browser entry points.

Keep each component's MDX page and sample TypeScript files together under its
category, for example `components/forms/app-form/app-form.mdx`. URLs follow
the same hierarchy: `/components/forms/app-form/`.

Open `/components/`, `/components/actions/buttons/`, `/components/actions/btn-link/`,
`/components/actions/btn-group/`, `/components/actions/btn-group-drop-down/`, `/components/actions/badge/`, `/components/layout/tabs/`, and
`/components/layout/modal/`. These pages use `template: doc` directly, the directory's
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

The Buttons page lives in `components/actions/buttons/buttons.mdx`, alongside
`button-playground.ts`, `collection.ts`, and `project-form.ts`.
The folder's matching page name keeps its URL at `/components/actions/buttons/`.
The previews run these neighboring TypeScript files directly.
Their source tabs contain those same
files; keep each fenced source block identical to its browser entry when editing.
Static variant markup is formatted identically in its preview and source tab.
BtnLink, BtnGroup, BtnGroupDropDown, and Badge follow this same folder structure and source-tab
contract, with one standalone TypeScript file per interactive sample. Their
playgrounds cover all public props; formatting controls, a release checklist,
a selection toolbar, and split publishing actions demonstrate stateful composition.
The contextual action panels build on `button-group-sample.mdx` in the SSG's sample guide.
These pages reuse the shared API property rows
and the default documentation navigation and TOC.
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
yarn tsc -p frontend/tsconfig.json --noEmit
```

Landing-page verification covered all workbench tabs, arrow/Home/End keys, counter
state, all copy controls and denied clipboard access, mobile menu and FAQ,
320–1920px widths, no-JavaScript rendering with a light system preference,
internal anchors, metadata, and WCAG A/AA automated checks. Browser tooling and
screenshots are under the ignored `.tmp` directory; they are not shipped.

No generated page-script embeds need regeneration for this site.
