# Component documentation implementation plan

## Standard for every guide

- Keep the default doc template, generated navigation and page TOC.
- Give every public markup component its own route and colocated samples.
- Start with a useful, component-specific example; add examples for its distinct capabilities and states.
- Put the exact preview markup and each associated TypeScript file in separate, filename-labelled source tabs. Let MDX handle highlighting.
- Define browser examples explicitly: exported interfaces, named templates, typed context factories, component definitions and RegorApp entry points. No central example factory.
- Document registered public props, defaults, accepted values, slots, events, composition dependencies and accessibility. Separate data types and internal implementation fields from component props.
- Use existing theme styles and native components in both skins. Verify narrow screens, keyboard operation and source fidelity.

## Delivery sequence

| Area | Individual guides | Examples and verification |
| --- | --- | --- |
| Layout and content | Panel, Flex, Grid, SectionHeader, AlertBox, ExpandablePanel, Icon, IconFrame | Responsive composition, semantic containers, slots, disclosure keyboard behavior, meaningful icon labels |
| Landing sections | LandingBand, LandingSection, FeatureCard, MetricStrip, MetricItem, CodeShowcase, ComparisonTable, ComparisonColumn, ComparisonFeature, CtaSection | Complete sections, responsive tracks, slot composition, full-bleed geometry, valid action destinations |
| Pricing | PricingTable, PricingPlan, PricingFeature | Complete plan comparison, emphasis, feature lists and real documentation destinations |
| Forms | AppForm, FormInputField, FormSelectField, FormCheck, FormMeta, FormAssistLink, FormSubmit, FormDivider, FormStatus, ContactForm | Editable values, validation, submission without network side effects, disabled states, form serialization and status feedback |
| Advanced input | AutoCompleteInput, AutoCompleteOptionRow, MultiAutoCompleteInput, MultiAutoCompleteOptionRow, Composer, DropFiles | Keyboard selection, custom rows, loading/empty states, token creation, editing/source mode, file acceptance/removal |
| Charts | BarChart, LineChart, DoughnutChart | Reactive data, presentation controls, empty data, accessible values, series/segment contracts |
| Large data | VirtualList, VariableVirtualList, VirtualTable, VariableVirtualTable | Real scrolling, typed row components, fixed versus measured heights, table headers, empty states |
| Interaction helpers | TabPane, ModalTrigger, ToastHost | Parent composition, keyboard interactions, actual dialogs, timed and persistent notifications |
| Site integration | SiteLogo, SiteFooter, TopBar, NavMenu, NavList, PageLinks, PageToc, SearchBox, ThemeToggle, SignIn, Consent | Real site context, scoped previews where global runtime requires isolation, configuration and runtime prerequisites |
| Browser entry points | RegorApp, PageScript | Working local entry points, automatic relative source resolution, module loading and lifecycle boundaries |

The existing Btn, BtnLink, BtnGroup, BtnGroupDropDown, Badge, Tabs and Modal guides remain the reference standard. NavItem and ModalStore are internal registered implementation components; document their contracts with NavList and Modal rather than presenting them as independent public markup APIs.

## Catalog and quality gates

1. Replace the first-collection catalog with grouped, complete links and concise descriptions.
2. Verify every public registered component has a guide and every registered prop has an API entry.
3. Format and type-check all sample entry points with Biome and TypeScript 7.
4. Build the complete site; verify all routes, fragments, sample bundles and source tabs.
5. Exercise interactive samples in a browser, including empty/disabled states and keyboard controls.
6. Review representative desktop/mobile screenshots in light and dark, then resolve overflow or hierarchy problems.

## Category organization

Group guides into `actions`, `layout`, `forms`, `data`, `landing`, `site` and `runtime`, matching the catalog's seven sections. Each category has a standard documentation overview page; each component retains its own folder with its MDX and associated sample files. Nested navigation follows the source folders automatically. Update cross-links, preview output paths and imports together, then verify generated navigation, page routes, local assets and source tabs with an isolated build.

## Status

- Source inventory and contract review: complete. The catalog covers 67 public components and browser entry points.
- Guide implementation: complete, with 60 new individual guides and colocated source files.
- Type checking with TypeScript and Biome checks: passed.
- Isolated SSG build after categorization: passed for 76 content pages; all 39 generated script references resolve to files.
- Browser review: all 60 new guides checked in light and dark at 1440px and 390px. No horizontal page overflow, duplicate IDs, broken local fragments or runtime exceptions were found by the checks.
- Source fidelity after categorization: 177 sample source tabs across all component guides match their rendered code and associated TypeScript files.
- Interaction verification: 30 checks passed, including forms, keyboard autocomplete, file selection, charts, virtualized collections, dialogs, search, theme switching and isolated site-component previews.
- Representative desktop and mobile screenshots reviewed in both skins. The isolated build avoids interference with the shared development output during verification.
- Category organization: complete. All 67 guides and seven category overviews load with the expected navigation group and active-page state. Browser checks found no missing app mounts, asset errors or runtime exceptions. Generated-page checks found no stale component routes or broken component destinations; category overviews and representative guides also passed desktop/mobile overflow checks.
