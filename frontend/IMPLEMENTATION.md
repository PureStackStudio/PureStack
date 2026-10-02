# PureStack Studio launch site

## Component documentation pilot

The public `/components/` section establishes the format with Buttons, Tabs,
and Modal. It uses `template: doc` without a wrapper template or style overrides.
Its local `header.mdx` renders `TopBar`; navigation and page outlines are the
default `NavMenu` and `PageToc`. Markdown headings drive the outline, Markdown
tables describe the API, and ordinary fenced code goes through ts-ssg's normal
highlighting and copy pipeline.

Static previews are direct MDX component markup. Buttons uses `RegorApp` shells
and explicitly mounts its components in the browser. Its collection example
stores and renders a list of items; count, disabled states, and status derive
from that list. Tabs and Modal share their interactive component definitions
between server rendering and browser mounting. Native Tabs and Modal runtime
behavior is demonstrated as shipped.
No page-script source or generated embed was changed.

Buttons owns standalone example files beside its MDX page, with matching source
tabs. Tabs and Modal own modules in `frontend/docs` and matching browser entries.
Only the server registry combines
the modules' explicit component registrations; it does not generate components
or infer their names. Each example module owns exported context interfaces,
individual template variables, typed context factories, and explicit
`defineComponent<Interface>` calls, following `ts-components` conventions.
Browser pages register their components and mount them with direct `createApp`
calls. There is no shared example contract, lookup table, or mounting helper.

Browser verification found existing shared-framework accessibility issues:

- The default doc template emits no `lang` for a site without locale routing.
- Navigation and TOC header opacity gives insufficient text contrast in the
  studio skin.
- Generated Tabs controls have `aria-selected` on buttons without tab roles;
  the original tablist contains inputs and panels, and enhanced radios refer
  to hidden labels.
- Markdown table scroll containers are not keyboard focusable.
- Without JavaScript, the default template's theme bootstrap leaves the
  document hidden. The component markup is present, but the page is not visible.

These are recorded for a shared-component accessibility pass. The pilot does
not hide them behind page-specific replacements or runtime patches.

Verification passed: tsgo, the local production build, live button controls and
form reset, stateful tabs, ModalStore actions, dialog events/focus restoration,
all dialog sizes and motion directions, nested dialogs, native code copying,
TOC targets, 320–1920px layout checks, mobile navigation, and the existing
production landing-page regression checks. Accessibility and no-JavaScript
checks identified the limitations above; they did not pass.

## Direction

Build in the existing `purestack.studio` content directory with PureStack's own
SSG, MDX, components, and TypeScript browser bundling. The requested direction
is a dark developer aesthetic: charcoal, off-white type, green accents, fine
borders, generous spacing, and an interactive source/preview workbench.

## Source findings informing the page

This is an implementation-oriented architecture review of the package boundaries,
core rendering/build paths, and relevant component APIs. It is not an exhaustive
line-by-line audit of every source file or generated asset.

- The public `purestack` package exports the SSG API and CLI. Current build
  input is `{ siteConfig, options, publish }`; older README examples using
  top-level `contentDir` are not the implementation's current API.
- Markdown and Regor MDX compile through remark/HAST. Regor markup is preserved
  and rendered through `ts-render` using `ts-minidom` at build time.
- MDX component state is not automatically hydrated. `PageScript` and `RegorApp`
  record browser entry points; esbuild bundles their TypeScript and dependencies.
- Components and component styles have separate registration. Product primitives
  include forms, charts, modals, tabs, toasts, and virtual lists/tables.
- `ts-style` connects semantic tones, palettes, skins, typography, and responsive
  tokens. `ts-css` provides a typed, mutable fluent CSS builder; `ts-html` provides
  a typed, mutable HTML builder (despite some older immutable descriptions).
- The incremental builder tracks page entry points and their dependencies,
  regenerates assets, and writes a manifest. Development serves lazy routes and
  broadcasts live reload events; publish produces a clean local artifact.
- The SSG also implements navigation, outlines, localization, preview metadata,
  sitemap/robots, optional Pagefind, and consent-gated analytics.
- SVG icons are generated from named providers. Every icon used here must be
  checked against that generated registry.
- The VS Code extension provides component completion, definition lookup,
  metadata-aware hover, linked editing, formatting, and template diagnostics.

## Page plan

1. Compact navigation and an honest pre-release announcement.
2. Clear TypeScript-native positioning and source/get-started actions.
3. Source/preview tabs demonstrating static composition, explicit Regor state,
   and typed styles; working copy controls and keyboard navigation.
4. Source-grounded feature sections and a package map linking to implementation.
5. A local-source quick start that works before package publication, FAQ, and
   a closing call to explore the repository.

The landing page uses MDX and typed PureStack compositions for its content,
a registered studio skin for its identity, and typed style registrations for
its layout. One explicit TypeScript entry point provides progressive enhancement.
It does not require changes to generated embeds or framework APIs.

## Verification plan

Build the site through the project runner and SSG API, check the frontend with `tsgo`, inspect
desktop/mobile browser screenshots, and exercise navigation, copy controls,
tabs, and reactive examples. Check semantic accessibility, reduced motion,
JavaScript-disabled rendering, internal links, metadata, and publish output.
Keep build output and browser tooling under ignored directories.

## Implemented refinements

- A custom template uses the public `PageTemplateMap` API and `ts-html` to emit
  an English document with a skip link and semantic header/main/footer.
- The existing site command now uses that template; separate build and publish
  commands create local output artifacts.
- The workbench demonstrates real Panel/Badge output, a mounted Regor counter,
  and CSS generated by `Style`. The component showcase uses a real BarChart.
- The counter uses a named TypeScript event handler, verified against the
  installed Regor runtime in a browser.
- A matching 1200×630 social image has an editable SVG source.
- The launch page has no analytics configured; the unnecessary consent banner
  is disabled. Existing generated runtime scripts are unchanged.

## Framework-native frontend

- Register the studio skin before config resolution. Register custom compositions
  and styles in `onConfigResolved`, after the SSG initializes its DOM and builtins.
- Use native `Grid`/`Flex` layouts and `BtnLink` actions in MDX. Compose typed
  `StudioFeature`, `StudioPackage`, `StudioCopy`, `StudioFaq`, `StudioWorkbench`,
  `StudioBrand`, and `StudioActivityChart` components from framework primitives.
- Let component tone/variant classes own button, panel, badge, and icon-frame
  colors and states. Reuse the standard palette contract for page typography,
  semantic colors, radii, and effects. Keep site-specific styles scoped to `.studio`.
- Replace the handwritten stylesheet with typed `styleBuilder` registrations,
  emitted through the existing light/dark stylesheet pipeline. Both modes use
  the dark identity. The document supplies an initial theme for no-JavaScript use.
- Preserve the accepted content and composition, then compare browser screenshots
  and verify keyboard behavior, responsive layouts, clipboard handling, no-JavaScript
  fallbacks, accessibility, and propagation of theme variables.
