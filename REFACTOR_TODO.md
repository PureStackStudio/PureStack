# ts-components Refactor TODO

This list captures reuse candidates found in `packages/ts-components`. The goal is to process these one by one, replacing duplicated local logic with small shared utilities or shared constants where the codebase clearly wants one.

## 1. Extract Shared Chart Value Utilities

**Where:** `standard/barChart/barChart.ts`, `standard/lineChart/lineChart.ts`, `standard/doughnutChart/doughnutChart.ts`

**Status:** Done.

The chart components each carry local helpers for resolving common prop shapes:

- `readNumber`
- `resolveText`
- `resolveSize`
- `formatValue`
- coordinate/number formatting such as `fmt`, `formatCoordinate`, and `formatPoint`
- CSS size normalization for numeric values

These helpers solve the same problem with slightly different names or precision rules. A shared chart utility module could make behavior consistent while still allowing per-chart precision where needed.

Suggested direction:

- Add a local shared module such as `standard/chart/chartUtils.ts`.
- Move generic parsing helpers there first: number, text, boolean, CSS size.
- Keep formatting precision configurable instead of baking one precision into every helper.

## 2. Extract Shared Chart Constants

**Where:** `standard/barChart/barChart.ts`, `standard/lineChart/lineChart.ts`, `standard/doughnutChart/doughnutChart.ts`

**Status:** Done.

Several constants are repeated or conceptually shared:

- default chart width/height/size
- `DEFAULT_EMPTY_LABEL`
- default grid line count
- default semantic color cycle
- plot box constants used by bar and line charts: `PLOT_X`, `PLOT_Y`, `PLOT_WIDTH`, `PLOT_HEIGHT`

The default color arrays in bar, line, and doughnut charts are identical semantic palette var lists. That should become one exported constant.

Suggested direction:

- Add `standard/chart/chartDefaults.ts`.
- Export `DEFAULT_CHART_EMPTY_LABEL`, `DEFAULT_CARTESIAN_CHART_SIZE`, `DEFAULT_CHART_COLORS`, and shared plot layout constants.
- Keep doughnut-only geometry constants local to doughnut until another radial chart needs them.

## 3. Extract Cartesian Chart Domain/Grid Math

**Where:** `standard/barChart/barChart.ts`, `standard/lineChart/lineChart.ts`

**Status:** Done.

Bar and line charts both define:

- `ChartDomain`
- domain min/max resolution
- grid line generation
- value-to-Y coordinate mapping
- zero-line Y calculation

The implementations are nearly the same. This is a high-value extraction because it reduces repeated correctness-sensitive math.

Suggested direction:

- Add a `standard/chart/cartesianChart.ts` helper.
- Export `ChartDomain`, `resolveChartDomain`, `resolveChartGridLines`, `valueToPlotY`, and possibly `pointIndexToPlotX`.
- Pass in plot dimensions and formatter functions so the helper stays reusable without knowing component-specific types.

## 4. Share Link Resolution

**Where:** `standard/btn/btn.ts`, `standard/form/form.ts`, partially `standard/login/login.ts`

`BtnLink` and `FormAssistLink` both normalize hrefs with `urlNormalizer.normalizeHref` and both resolve `_blank` links to `noopener noreferrer` when no explicit `rel` is provided.

Suggested direction:

- Add a small helper such as `standard/link.ts`.
- Export `resolveHref` and `resolveLinkRel`, or a single `resolveLinkProps`.
- Continue using `urlNormalizer`; do not duplicate URL normalization.

## 5. Share Auto-ID Generation

**Where:** `standard/form/formInputField.ts`, `standard/form/formSelectField.ts`, `standard/tabs/tabs.ts`, `standard/doughnutChart/doughnutChart.ts`

**Status:** Done.

Several components use local module counters:

- `form-input-*`
- `form-select-*`
- `tabs-default-*`
- `tab-*`
- `doughnut-chart-mask-*`

The pattern is identical: accept an explicit id when provided, otherwise generate a stable sequential id.

Suggested direction:

- Add a helper like `createAutoId(prefix)` or `resolveAutoId(value, nextId)`.
- Prefer a factory that owns its counter per prefix.
- Keep explicit id trimming behavior consistent across users of the helper.

## 6. Introduce Shared Form Field Resolution

**Where:** `standard/form/formInputField.ts`, `standard/form/formSelectField.ts`, `standard/form/form.ts`

Input and select fields share a lot of field-shell behavior:

- id resolution
- default model creation
- label/name/required/autocomplete/placeholder/disabled props
- start/end icon props
- `surfaceAlt` variant class resolution
- the same outer label and shell structure

The current duplication is manageable, but it will grow as more form fields appear.

Suggested direction:

- Start with shared resolver utilities, not a large base class.
- Candidate helpers: `resolveFormControlId`, `createDefaultModel`, `resolveFormControlClasses`.
- Consider a shared field prop interface only after one or two small helper extractions prove useful.

## 7. Centralize Common Variant Presets

**Where:** many components using `resolveComponentClasses`

`resolveComponentClasses` is already the core abstraction, but default variants are repeated inline:

- chart components use `defaultVariant: 'none'` and `defaultVariantMode: 'stateless'`
- form fields use `defaultVariant: 'surfaceAlt'`
- badges/panels/modals/footer/status often use `surface`
- buttons/icons define local defaults for `solid`/`stateless`

Suggested direction:

- Add named presets near `componentVariant.ts`, for example `COMPONENT_CLASS_PRESETS`.
- Keep this light: a few intent-revealing objects are enough.
- Avoid compatibility layers; replace inline defaults where the preset is obviously the same.

## 8. Share Flex/Grid Class Resolver Patterns

**Where:** `standard/flex/flex.ts`, `standard/grid/grid.ts`

Flex and grid both normalize prop values into utility class names:

- enum validation
- boolean-like class toggles
- responsive breakpoint suffixes
- alignment and justification classes

The exact class names differ, but the resolver shape repeats.

Suggested direction:

- Add generic helpers such as `resolveEnumClass`, `resolveBooleanClass`, and `resolveResponsiveEnumClass`.
- Keep component-specific mapping tables in the component files so the helper does not become a dumping ground.

## 9. Share Chart Style Registration Helpers

**Where:** `standard/barChart/barChartStyle.ts`, `standard/lineChart/lineChartStyle.ts`, partially `standard/doughnutChart/doughnutChartStyle.ts`

Bar and line chart styles share nearly identical paint rules:

- grid line strokes
- zero-line strokes
- value label fill/font
- axis label fill/font
- empty state text
- pointer-events disabling for labels

Doughnut has a different geometry but shares empty text and label paint concepts.

Suggested direction:

- Add helpers under `standard/chart/chartStyle.ts`.
- Export functions for grid lines, zero line, chart text paint, and empty state paint.
- Keep hover behavior local unless the selectors become standardized.

## 10. Centralize Verified Default Icon Names

**Where:** `standard/form/formSelectField.ts`, `standard/pricing/pricing.ts`, `standard/landing/landing.ts`, `standard/navMenu/navMenu.ts`, `standard/pageToc/pageToc.ts`, `standard/expandablePanel/expandablePanel.ts`

Several components embed default icon names directly:

- `lucide:chevron-down`
- `lucide:check`
- `iconoir:check`
- `iconoir:pin`
- `iconoir:pin-slash`
- `iconoir:nav-arrow-down`

Per project rule, icon names must be verified against the generated icon list in `packages/ts-svg-icons` before use. The scattered literals make this harder to audit.

Suggested direction:

- Add `standard/icons.ts` or `standard/defaultIcons.ts`.
- Move only verified names into named constants.
- Do not add guessed icon names.
- Do not run the embed script; ask the user to run it manually if a new icon is ever needed.

## 11. Reuse Existing `clamp`

**Where:** `standard/doughnutChart/doughnutChart.ts`, `standard/grid/grid.ts`, and numeric field logic

`@purestack/ts-util` already exports `clamp`. Some components hand-roll clamp behavior:

- doughnut `clampNumber`
- grid `clampColumns`
- form input min/step logic partially clamps manually

Suggested direction:

- Import `clamp` where direct numeric bounds are needed.
- Keep specialized parsing helpers separate from clamping.

## 12. Normalize Boolean-Like Prop Semantics

**Where:** `standard/barChart/barChart.ts`, `standard/lineChart/lineChart.ts`, `standard/doughnutChart/doughnutChart.ts`, `standard/flex/flex.ts`, `standard/grid/grid.ts`

Boolean-like props currently differ:

- chart booleans now use direct prop defaults on the original prop names
- flex/grid toggles mostly check `true` and `"true"`
- doughnut no longer needs a separate `isAnimated` alias

Suggested direction:

- Avoid introducing a chart boolean helper.
- Prefer assigning defaults in the resolved object, then spreading props, for example `{ animated: true, ...props }`.
- Decide separately whether flex/grid should keep their current narrower interpretation or move to direct defaulted props too.

## 13. Consolidate SVG Accessibility Defaults

**Where:** `standard/barChart/barChart.ts`, `standard/lineChart/lineChart.ts`, `standard/doughnutChart/doughnutChart.ts`

Charts all render SVGs with:

- `role="img"`
- computed `aria-label`
- optional `<title>`
- optional `<desc>`
- fallback component-specific label

Suggested direction:

- Add a helper for resolving chart aria labels.
- Keep the template attributes local unless a shared chart wrapper becomes worthwhile.

## 14. Audit Utility Class Ownership

**Where:** `standard/flex/flexStyle.ts`, `standard/grid/gridStyle.ts`, `packages/ts-style/src/utilities.ts`

`ts-style` explicitly notes that flex and grid utility classes currently live with component styles. That is intentional today, but the overlap between layout utilities and global utilities is worth revisiting.

Suggested direction:

- Decide whether layout utility registration belongs in `ts-style` or remains in `ts-components`.
- If moved, replace old local registration outright; this framework is pre-release, so avoid compatibility duplication.

## 15. Extract Repeated Theme Registration Shape Only If It Stays Small

**Where:** most `*Style.ts` files

Most style modules do:

```ts
themes.forEach((theme, palette, options) => {
  registerXStyles(theme, palette, options)
})
```

This is repeated but not especially harmful. A helper could reduce boilerplate, but it may hide useful local clarity.

Suggested direction:

- Defer until after higher-value extractions.
- Only extract if it remains a tiny helper with no cleverness.
