---
name: purestack-development
description: Build, redesign, or extend websites exclusively with PureStack and Regor. Use for every user request to create or modify a PureStack site, including its pages, components, styling, themes, layouts, and browser interactivity. Enforces TypeScript-first implementation, MDX, customized ThemePalette-based skins derived from PureStack's standard generator, fluent style APIs, reusable built-in components, and maintainable Regor components.
---

# PureStack Website Development

Build high-quality, visually distinctive, maintainable websites **exclusively with PureStack and Regor**. Follow the rules below as implementation constraints, not optional preferences.

## Non-negotiable rules

1. **PureStack + Regor only.** Do not introduce React, Vue, Angular, Svelte, Next.js, Astro, Tailwind, Bootstrap, third-party UI kits, other styling systems, or alternative rendering/routing frameworks. Use PureStack, Regor, their official packages, and their existing facilities. Use native browser APIs from TypeScript only when PureStack/Regor provide no suitable capability.
2. **Use the PureStack source model.** Author site behavior, components, templates, and styles in **TypeScript**; pages and shared page fragments in **MDX** (`.mdx`/`.rmdx`, or `.md` for content-only prose); and site settings in `siteConfig.json` and, where needed, `purestack.config.ts`. Static image, font, and other media assets are fine. Do not add handwritten `.css`, `.scss`, `.sass`, `.less`, `.js`, `.jsx`, `.tsx`, standalone HTML, or inline JavaScript/CSS workarounds. Generated CSS/JS output from PureStack is expected and permitted.
3. **No redundant implementations.** Before writing any component, utility, interaction, style, or infrastructure code, check whether PureStack already provides it. If it does, **reuse it rather than reimplementing it**. Never replace a framework feature with custom code merely for convenience.
4. **Use native PureStack building blocks first.** Prefer the built-in primitives and higher-level components where appropriate, including `Flex`, `Grid`, `Panel`, `SectionHeader`, `BtnLink`, `Icon`, `IconFrame`, `Tabs`, `TabPane`, `ExpandablePanel`, `TopBar`, `SiteFooter`, `ThemeToggle`, and other catalog components. Build site-specific Regor compositions on top of them to achieve a recognizable, visually rich identity. Reuse must not result in a generic-looking site.
5. **Standard skin as a foundation, not a finished design.** Use `themeSkins.standard.create(...)` to generate complete, internally consistent light/dark palettes, then **customize the returned `ThemePalette` values in TypeScript to establish a distinctive site identity**. Site-specific palette customization is an expected part of professional site design, not an exceptional last resort. Adjust the visual system as appropriate: semantic tones and surfaces, typography, radii, shadows/effects, backgrounds, and interaction states. A site must not retain the stock appearance merely because the standard skin already works. Prefer cohesive palette overrides over scattering hardcoded colors or component-level visual fixes throughout the codebase.
6. **Typed, fluent styling only.** Use PureStack's typed style builder and property-specific fluent methods such as `.color(...)`, `.backgroundImage(...)`, `.borderRadius(...)`, `.opacity(...)`, etc. **Never use `.css({...})` or a `css()` function** in site code, even if an older example does. Never hand-author a stylesheet or inject CSS strings. Organize custom rules into small functions grouped by section or concern.
7. **Use utilities before custom rules.** Check PureStack's generated spacing, typography, layout, responsive, border, shadow, motion, and semantic-tone utility classes. If a built-in utility accomplishes the task, use it. Create custom classes, reusable TypeScript helpers, selectors, or keyframe animations only for behavior or styling not supplied by those utilities.
8. **Light and dark are mandatory.** Every site must support at least `light` and `dark`, with an actual, accessible `<ThemeToggle/>` in the shared interface. Check both themes across all components, custom effects, and interaction states. Do not make a static theme-only design.
9. **Use MDX headers and footers.** PureStack supports shared `header.mdx` and `footer.mdx` files. Reuse them for global navigation, branding, the theme toggle, and shared footer content instead of duplicating the same markup on each page. Prefer native header/footer components whenever suitable.
10. **Choose build-time versus browser-time intentionally.** PureStack/Regor components can render during site generation or execute in the browser. Render static content at build time; opt into browser execution only for stateful interaction and capabilities that actually require it. Use `RegorApp` for browser-mounted Regor apps and `PageScript` for browser-side TypeScript when applicable. Do not turn an otherwise static site into a client-rendered application.
11. **Export Regor component contexts from the defining file.** Every custom Regor component must use an **exported interface or exported class** as its context type and define the component as `defineComponent<MyComponent>(...)`. **Declare that interface or class in the same file that calls `defineComponent<>`**; the PureStack VS Code extension finds local components this way. Do not import the context type from another module, re-export it, or alias it. This is essential for programmatic discovery from MDX and Regor `html` templates, and for VS Code navigation. Avoid anonymous, private, or inferred context types for component definitions.
12. **Divide and conquer with components. Never write a very long template in a single `html` block.** A page or dashboard component must compose focused child components rather than contain every section, form, navigation area, and conditional view inline. Extract substantial sections even when they are used only once; reuse is not a prerequisite for a component. Give each nontrivial component its own TypeScript module. Do not evade this rule by minifying markup, concatenating template strings, or moving fragments into string-returning helpers. Keep component registration explicit and easy to inspect.
13. **Maintain production quality.** Use clear names, strong types, small focused modules, semantic HTML/MDX, accessibility, responsive behavior, consistent visual language, minimal runtime work, and robust error handling. No placeholder implementations, dead code, unnecessary abstractions, or quick fixes that undermine the architecture.

## Type safety and framework limitations

Always create type-safe TypeScript code. Prefer inference, explicit contracts, correct generics, `satisfies`, and runtime validation with type narrowing. Avoid type casts/assertions; never hide a typing problem with `as any`, double assertions such as `as unknown as T`, unchecked non-null assertions, or TypeScript suppression comments.

When types do not fit, inspect the installed PureStack/Regor APIs and source for a supported, type-safe approach. If no such approach exists because of a PureStack or Regor limitation, explain which framework is responsible, show the concrete typing problem and a minimal example, and ask the user for a workaround and to report the issue for a framework fix. Pause the affected implementation instead of silently bypassing the type system; continue independent work where possible.

## Icons

PureStack provides more than **11,000 icons**. Use them where they improve navigation, actions, status, or content clarity. PureStack components support icons; use their supported icon props instead of rebuilding icon markup.
- **Server-side rendering and static generation:** use `getSvgIcon` from `@purestack/ts-svg-icons`.
- **Client-side code:** import only the required SVG constants as named, tree-shake-friendly exports from `@purestack/ts-svg-icons`. Avoid `getSvgIcon`, namespace imports, or dynamic whole-catalog lookups in browser bundles.
- Verify icon names and exported identifiers against the installed generated icon lists before using them; never guess names. For example, a verified `lucide:check` lookup corresponds to the `lucide_check` SVG export.

## Required workflow

### 1. Inspect before implementing

- Read the site's existing `siteConfig.json`, `purestack.config.ts`, plugins, theme files, components, shared MDX layout files, and nearby examples.
- Consult the actual installed PureStack/Regor version, the official component catalog, and source definitions before choosing APIs, props, icons, utilities, or behavior. **Do not invent framework APIs or utility classes.**
- Look for existing components and generated features covering the request: forms, navigation, dialogs, tabs, data display, theming, consent, search, browser runtime, animations, etc.
- **Read the built-in components' source.** The installed package ships its TypeScript source in `node_modules/@purestack/ts-components/src/`, with one folder per component under `standard/`; for example, `standard/btn/btn.ts` defines the component and `standard/btn/btnStyle.ts` registers its fluent styles. Read it to confirm a component's props, slots, tones, variants, events, and generated classes, and to discover capabilities worth reusing instead of rebuilding. Treat it as read-only reference: never edit `node_modules` or copy a component to alter it; configure, compose, or wrap it instead.
- Preserve established patterns unless they conflict with this skill's explicit rules; modernize noncompliant code when touching it where reasonably scoped.

### 2. Design the site as a composition

- Identify page hierarchy, shared shell, reusable visual patterns, and the few distinctive design elements that give the site its identity.
- Compose with PureStack primitives and their semantic tones/variants first. Add site-specific exported Regor components where reuse or design complexity justifies them.
- Define a coherent spacing system, visual hierarchy, typography, color roles, responsive behavior, and accessible interaction states. Translate the site's visual identity into deliberate `ThemePalette` customizations in both light and dark modes; do not rely on layout tweaks alone to differentiate the design.
- Prefer simple MDX markup for content and native components; use TypeScript components for meaningful behavior or recurring complex compositions.

**Colocate MDX pages with their dependencies.** When an MDX file has imports or scripts, create a folder with the same name and move the MDX file and its page-specific dependencies into it. Prefer a `modules/` folder at the content root for shared application code. Update affected references and preserve the page's route.

### 3. Build a site-specific skin from the standard generator

**Always begin with** `themeSkins.standard.create(...)`, which returns a complete `light`/`dark` `ThemePalette` pair. **Then customize those palettes in TypeScript.** The generator provides consistent component defaults; the tailored palettes provide the site's unique design language. Do not treat `themeSkins.standard.create()` as the final appearance for a branded website.

A high-quality site should have deliberate choices about its typography, scale, corner shapes, elevation, surface hierarchy, semantic colors, accents, and contrast. Override the relevant `ThemePalette` properties with `merge` (or another type-safe approach compatible with the installed version), rather than rebuilding all component styles or adding ad hoc component overrides. Customize each theme independently where necessary, while keeping the same recognizable identity and preserving accessibility.

Leverage TypeScript to programmatically generate custom theme palettes using calculated colors, color transformations, and reusable algorithms, creating rich, cohesive, and distinctive visual identities instead of manually defining every color.

**Example: derive and tailor the standard skin in a site plugin.** The example values illustrate the technique; choose values for the actual site's art direction.

```ts
import { definePlugin } from '@purestack/ts-ssg'
import { themeSkins, type ThemePalette } from '@purestack/ts-style'
import { merge, type DeepPartial } from '@purestack/ts-util'

const sharedIdentity = {
  font: {
    family: { base: "'Manrope', system-ui, sans-serif" },
    size: { body: '1rem', display: '4.75rem' },
  },
  radii: { sm: '5px', md: '12px', lg: '20px' },
} satisfies DeepPartial<ThemePalette>

export const siteThemePlugin = definePlugin({
  name: 'site-identity',
  skins: {
    editorial: {
      create: () => {
        const standard = themeSkins.standard.create({
          accent: '#6253d8',
          neutral: '#293248',
          secondary: '#168f83',
          feature: '#cb598a',
        })

        return {
          light: merge(standard.light, {
            ...sharedIdentity,
            effect: { panelShadow: '0 10px 30px rgb(35 43 66 / 0.10)' },
          }),
          dark: merge(standard.dark, {
            ...sharedIdentity,
            effect: { panelShadow: '0 14px 38px rgb(0 0 0 / 0.36)' },
          }),
        }
      },
    },
  },
})
```

This is only a starting example. For stronger differentiation, customize other supported `ThemePalette` fields, including semantic tone surfaces and component state colors, when the site calls for it. Inspect the installed types before choosing fields. When changing a semantic tone, keep its background/text/border states coordinated and check focus and hover contrast in both themes. Let PureStack's built-in components consume the customized palette instead of restyling each component manually.

Select the registered site-specific skin and enable both themes in `siteConfig.json`:

```json
{
  "style": {
    "fileName": "site.css",
    "href": "/assets/site.css",
    "themes": ["light", "dark"],
    "theme": { "skin": "editorial" }
  }
}
```

Register the plugin in `purestack.config.ts`. Include `<ThemeToggle/>` in the shared UI. Do not build a parallel theme state system. A direct `"skin": "standard"` configuration is appropriate only when an intentionally unbranded starter/default appearance is requested, not as the habitual endpoint of a finished branded site.

### 4. Place global chrome in MDX

Use shared `header.mdx` and `footer.mdx`, or their appropriate directory-level counterparts, rather than page-by-page duplication. Include `<ThemeToggle/>` in the visible, accessible header/navigation UI even if using a custom header composition. Put the site's canonical brand, navigation, social links, and footer structure there.

### 5. Implement typed, discoverable Regor components

Divide the interface into components **before** writing its templates:
- Keep the root template focused on layout and composition. Extract navigation, substantial content sections, form steps, review panels, and complex repeated items into named components with one clear responsibility each.
- Give each child an explicit, typed context and use props for its local inputs. Keep shared state in the appropriate ancestor context, and local behavior with the component that owns it. Do not duplicate state merely to split the markup.
- Keep each `html` block short enough to understand as one cohesive piece. If it grows to contain several distinct sections or conditional screens, split it into components before adding more markup. A wizard's steps belong in separate components, not a growing chain of inline `r-if` sections in one template.
- Extract meaningful UI responsibilities rather than wrapping every trivial element. When extending an existing oversized template, extract the affected sections instead of making the monolith larger.

Use a dedicated file per nontrivial component, but **organize component folders logically rather than accumulating every component in one flat directory**. Group related components by feature or responsibility, for example `components/shell/`, `components/templates/`, `components/options/`, and `components/creation/`. Keep feature-specific helpers and child components with their owning feature; reserve `components/shared/` for components actually reused across features. Add subfolders as responsibilities grow, using meaningful names rather than arbitrary file-count limits or a folder for every trivial component. Keep imports and component registration explicit when reorganizing.

**Learn from the built-in components.** Before writing a custom component, read a comparable one in `node_modules/@purestack/ts-components/src/standard/`. Its context type, `defineComponent` options, prop handling, and style module show the conventions custom components should follow.

**Share substantial context with Regor's `requireContext`.** When several components need a lot of shared context, use a common ancestor's class context and access it with `head.requireContext(SharedContext)`. Avoid dozens of forwarded prop bindings or large per-screen prop maps.

The **exported context type** and the generic argument to `defineComponent` must be the same, and both must live in the same file. A context class shared through `requireContext` may come from another module, but the component's own interface or class stays beside its `defineComponent<>` call:

```ts
import { defineComponent, html, type RefOrValue } from 'regor'

export interface FeatureSpotlight {
  title?: RefOrValue<string>
  summary?: RefOrValue<string>
}

const featureSpotlightTemplate = html`<Panel tone="accent" variant="surface">
  <h3>{{ title }}</h3>
  <p>{{ summary }}</p>
</Panel>`

export function defineFeatureSpotlightComponent() {
  return defineComponent<FeatureSpotlight>(featureSpotlightTemplate, {
    props: ['title', 'summary'],
  })
}
```

Register site-specific components explicitly in the site's PureStack plugin so MDX and nested Regor `html` templates can resolve them. Export context interfaces/classes, definition factories, and only the helpers that other modules require. Use reactive Regor primitives for browser state; avoid manually rewriting the DOM when the framework already supports the interaction.

### 6. Implement styles in TypeScript, with fluent methods

Register styles through the PureStack theme style builder, typically from the plugin's `onConfigResolved` hook. Use `themes.forEach((theme, palette) => ...)` so the same rules receive the correct light/dark semantic values. **Split style registration by feature or responsibility.**

```ts
import type { Style } from '@purestack/ts-css'
import {
  BREAKPOINTS,
  mediaBelow,
  styleBuilder,
  themes,
  type ThemePalette,
} from '@purestack/ts-style'

export function registerSiteStyles() {
  themes.forEach((theme, palette) => {
    const root = styleBuilder.get(theme)
    registerHeroEffects(root, palette)
    registerResponsiveEffects(root)
  })
}

function registerHeroEffects(root: Style, palette: ThemePalette) {
  root
    .select('.site .hero-glow')
    .backgroundImage(
      `radial-gradient(circle, ${palette.semanticTone.accent.tone}, transparent 70%)`,
    )
    .pointerEvents('none')
}

function registerResponsiveEffects(root: Style) {
  root
    .media(mediaBelow(BREAKPOINTS.md))
    .select('.site .hero-glow')
    .opacity('0.35')
}
```

This is an example of a _custom_ visual effect; routine spacing, grid composition, typography, and hover effects should normally use framework components and generated utility classes in MDX/templates. Define animations with the fluent `.keyframes(name)` API and fluent frame declarations when the built-in motion utilities are insufficient. Honor `prefers-reduced-motion` for nonessential animation.

**Forbidden styling examples:** `.css({ ... })`, `css(...)`, manually maintained `.css` files, `<style>` elements containing handwritten rules, injected CSS text, and third-party utility frameworks. If a fluent method or utility is uncertain, inspect the installed API and confirm it rather than guessing.

### 7. Choose the correct rendering phase

| Requirement                                                          | Default approach                                                                                                      |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Static pages, navigation, headings, editorial content, feature cards | MDX and build-time Regor/PureStack components                                                                         |
| Shared headers, footers, site shell                                  | `header.mdx`, `footer.mdx`, native PureStack components                                                               |
| Repeated visually rich compositions                                  | Site-specific typed Regor components, rendered at build time when possible                                            |
| Reactive forms, interactive state, client-side widgets               | Browser-side Regor through `RegorApp`                                                                                 |
| Small browser enhancement not needing a Regor app                    | A TypeScript entry via `PageScript`, when needed                                                                      |
| Theming and styling                                                  | Standard generator **plus site-specific `ThemePalette` customization**, generated utilities, typed fluent style rules |

Do not add client-side execution for content that can be rendered during the build. Avoid unnecessary hydration, large bundles, duplicated runtime state, and client-side DOM work.

### 8. Verify the finished site

Before reporting completion, check:
- The project builds and the site renders through the PureStack CLI; TypeScript type checking passes.
- Every implemented behavior uses the PureStack/Regor API actually installed; there are no parallel third-party frontend or styling systems.
- No handwritten CSS/JavaScript and no `.css(...)`/`css(...)` calls appear in new site code.
- Components and utilities already available in PureStack were reused rather than recreated.
- A site-specific skin starts from `themeSkins.standard.create()` and meaningfully customizes the returned `ThemePalette` for the site's unique identity. Both light and dark modes are generated, visually coherent, accessible, and switchable through `<ThemeToggle/>`.
- Shared `header.mdx`/`footer.mdx` are used appropriately.
- Each custom Regor component has an exported interface/class declared in the same file as its `defineComponent<ExportedContext>()` call, clear registration, and a focused module.
- No very long, monolithic `html` blocks remain in the implemented interface. Root templates compose focused child components; substantial sections and conditional screens have their own components with explicit data/action contracts.
- Build-time and browser-time execution are deliberate; static content works without JavaScript where applicable.
- The site is responsive and visually coherent at mobile, tablet, and desktop widths in **both themes**.
- Keyboard navigation, focus visibility, labels, contrast, semantic landmarks/headings, and reduced-motion behavior are appropriate.
- Generated outputs, dependency changes, and source files contain no unnecessary artifacts or unused code.

## Authoritative references

Check these sources against the installed version, especially when a documented example uses an older or less-preferred convention:
- [PureStack documentation](https://purestack.studio/)
- [Component catalog](https://purestack.studio/components/)
- [Themes and standard skin](https://purestack.studio/guides/styling/themes/)
- [Generated utility classes](https://purestack.studio/guides/styling/utility-css-classes/)
- [PureStack repository](https://github.com/PureStackStudio/PureStack)
- [Reference website source](https://github.com/PureStackStudio/PureStack/tree/main/frontend)
- [Regor website](https://regor.purestack.studio/)

**Precedence:** These skill rules determine _how_ to implement a PureStack site. The installed framework's types and source determine which APIs exist. Standard skin examples demonstrate a _foundation_; always consider the returned `ThemePalette` the site-specific design surface. When examples use `.css({...})`, rewrite them using verified fluent property methods rather than copying that usage.
