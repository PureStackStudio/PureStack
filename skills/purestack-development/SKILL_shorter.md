---

# PureStack Development

## Core Rules

1. **PureStack + Regor only.** Never introduce React, Vue, Tailwind, other UI frameworks, or redundant dependencies.

2. **TypeScript + MDX.** Write components, behavior, and styles in TypeScript; pages in MDX; configuration in `siteConfig.json` and `purestack.config.ts`. No handwritten CSS, JavaScript, JSX, TSX, or HTML files.

3. **Reuse PureStack.** Inspect existing APIs, components, utilities, and plugins before implementing anything. Prefer built-in components such as `Flex`, `Grid`, `Panel`, `BtnLink`, `Tabs`, `Icon`, and others. Build custom components when needed for distinctive designs.

4. **Custom themes.** Always start with `themeSkins.standard.create()`, then customize the returned light/dark `ThemePalette` values in TypeScript. Leverage TypeScript to programmatically generate sophisticated palettes using calculated colors and transformations. Avoid generic, stock-looking sites.

5. **Fluent styling only.** Use PureStack's typed style builder with property-specific methods such as `.color()`, `.backgroundImage()`, and `.borderRadius()`. Never use `.css()`, `css()`, injected CSS, or handwritten stylesheets. Prefer built-in utility classes before custom rules.

6. **Light and dark modes.** Both are mandatory, with an accessible `<ThemeToggle/>`. Customize and verify both palettes.

7. **Shared layouts.** Use `header.mdx` and `footer.mdx` for shared navigation, branding, and footer content.

8. **Small components.** Divide complex interfaces into focused Regor components. Never create giant `html` templates. Organize modules by feature, with explicit registration and typed contracts.

9. **Exported Regor contexts.** Every custom component must have an exported interface/class and use `defineComponent<ExportedContext>(...)` for MDX discovery and editor navigation.

10. **Rendering strategy.** Prefer static generation. Use `RegorApp` for reactive browser interfaces and `PageScript` for small browser enhancements. Avoid unnecessary client-side execution.

11. **Strict type safety.** Avoid `as any`, double assertions, suppression comments, and unsafe workarounds. When framework limitations block correct typing, report the issue instead of bypassing it.

12. **Icons.** Use `@purestack/ts-svg-icons`: `getSvgIcon` for server/build-time usage, named SVG imports for browser code. Verify identifiers against installed exports.

13. **Production quality.** Maintain responsive layouts, accessibility, semantic markup, strong typing, clear architecture, and minimal runtime overhead.

14. **Colocate MDX dependencies.** When an MDX file has imports or scripts, create a folder with the same name and move the MDX file and its page-specific dependencies into it. Prefer a `modules/` folder at the content root for shared application code. Update affected references and preserve the page's route.

15. **Share substantial context with `requireContext`.** When several components need a lot of shared context, use a common ancestor's class context and access it with `head.requireContext(SharedContext)`. Avoid dozens of forwarded prop bindings or large per-screen prop maps.

## Workflow

1. Inspect the existing project, installed PureStack/Regor APIs, documentation, and source before coding.&#x20;
2. Design the site using native components, focused Regor compositions, and a distinct customized `ThemePalette`.
3. Implement styles through fluent TypeScript APIs, grouped into focused functions.
4. Verify builds, type checking, responsive layouts, both themes, accessibility, and adherence to all rules.

## References

- [PureStack Documentation](https://purestack.studio/)
- [Component Catalog](https://purestack.studio/components/)
- [Themes](https://purestack.studio/guides/styling/themes/)
- [Utility Classes](https://purestack.studio/guides/styling/utility-css-classes/)
- [GitHub Repository](https://github.com/PureStackStudio/PureStack)
- [Regor](https://regor.purestack.studio/)

**Always verify implementation details against the installed framework version.**
