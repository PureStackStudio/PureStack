Regor Component Creation Rules

These rules apply to any new or modified Regor component under `packages/ts-ssg/src/regor/components`.

Principles

- Components must feel native to the Regor system: predictable templates, explicit props, and theme-aware styling.
- Prefer clarity over cleverness. If a reader cannot infer behavior from the template and styles, revise.
- Every component ships with light and dark theme support and uses the shared design tokens.

Architecture & Registration

- Define components with `defineComponent` and `html` from `regor`.
- Every component must expose a `defineX()` factory that registers styles and returns components in a map.
- New components must be registered in `initBuiltinComponents` using `componentRegistry.registerMany`.
- If a component needs shared styles (layout or global), add a `registerXStyles` function rather than inline or ad-hoc styles.

File Organization

- One file per component set. If multiple components are tightly coupled, colocate them and export a single `createXComponents`.
- Follow the naming pattern: `createThingComponent`, `createThingComponents`, `registerThingStyles`.
- Keep the template near the top, styles in the middle, and component factories near the bottom.

Template Rules

- Templates use the `html` tagged template literal.
- Use BEM-style class names: `block`, `block__element`, `block__element--modifier`.
- Prefer semantic HTML (`nav`, `header`, `button`, `details`, `summary`, `ul`, `li`) with correct ARIA where needed.
- Use `slot` and named slots instead of hard-coding child content.
- Avoid inline styles and inline SVG attributes that can be expressed via CSS, unless the SVG requires fixed attributes.
- Keep templates free of business logic; compute data in `context` or helper functions.

Props & Context

- The generic in `defineComponent<T>` is the template context type (`T`), not the props type and context callback provides calculated values to the component context.
- List props in `defineComponent` via `props: [...]` when they are used.
- Use `context` to derive computed values, and keep it pure (no mutations or side-effects).
- Treat the `context` callback return as runtime handoff to Regor; TypeScript guidance ends at that boundary.
- Do not read from `window` or rely on runtime globals during render.

Styling Rules (styleBuilder)

- All component styling must go through `styleBuilder` with theme-aware selectors.
- Every selector must be defined for both `light` and `dark` themes.
- Use `getThemeOptions()` and `getThemePalette()` for tokens (radii, typography, colors).
- Prefer composing base style blocks and then customizing per theme.
- Use `:focus-visible` for focus states and provide a visible focus ring from palette tokens.
- Include responsive rules using `.media(...)` when the layout or behavior changes on smaller screens.
- Avoid global element selectors; scope to component classes.

Accessibility

- If you emit interactive elements (`button`, `a`, `summary`), ensure they are semantically correct and keyboard accessible by default.
- Provide `aria-label` for icon-only controls.
- Emit static ARIA states (`aria-current="page"`, `aria-expanded`) only when they are known at build time.

Static Rendering Constraints (Critical)

- Regor components here are rendered by the static site generator. DOM is not available at render time.
- Do not use component state, event handlers, or runtime click behavior. They will not run.
- Regor is only used to bind static variables into HTML once; after rendering, no component state exists.
- Any interactivity must be implemented outside Regor (build-time transforms or separate runtime scripts).

Performance & Robustness

- Avoid duplicate styles or repeated selector chains; prefer helper functions for shared style blocks.
- Avoid unnecessary re-computation in `context`; compute once and reuse.
- Guard against empty/undefined props with sensible fallbacks.

Testing & Verification

- If behavior changes, add or update tests where the project already tests similar behavior.
- For layout or visual changes, capture a quick screenshot or local visual check if running the dev server.

Checklist Before Finishing

- New component registered in `initBuiltinComponents`.
- Light and dark styles implemented.
- Focus-visible and ARIA covered for interactive elements.
- Class names follow BEM and are scoped to the component.
