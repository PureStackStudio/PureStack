# PureStack Component Tools

This VS Code extension adds component-aware `Go to Definition`, prop IntelliSense, `lit-html` syntax highlighting, and save-time template formatting for PureStack authoring.

It supports:

- component tags inside `.md` and `.mdx`
- Regor `html`, `raw`, and `svg` tagged templates in `.ts` files
- embedded HTML, CSS, SVG, and `${...}` TypeScript expressions inside those templates

Examples:

- `Ctrl+Click` on `<Flex>` opens the `.ts` file that exports `Flex`
- `Ctrl+Click` on `<Grid>` opens the `.ts` file that exports `Grid`
- `Ctrl+Click` on `<TabPane>` opens the shared `.ts` file that exports `TabPane`
- inside `<Btn ...>` it suggests only public Regor props declared in `defineComponent(..., { props: [...] })`
- inside `<Btn size="...">` it suggests literal values like `sm`, `md`, and `lg`
- inside ``html`...``` it highlights HTML tags, component tags, CSS property values, and embedded TypeScript expressions
- when `editor.formatOnSave` is enabled, it formats supported tagged template markup on save
- it adds `PureStack: Format HTML Templates` and `PureStack: Format Document With HTML Templates` commands

## Local testing

1. Open the PureStack repo in VS Code.
2. Run the `PureStack VSCode: Build Extension` task.
3. Start the `PureStack VSCode: Launch Extension` launch configuration.
4. In the Extension Development Host window, open any `.md`, `.mdx`, or `.ts` file in this repo.
5. Hold `Ctrl` and click a component tag such as `<Flex>` or press `F12` on it.
6. Trigger completion inside a component tag to see prop and value suggestions.
7. Open a TypeScript file containing an `html`, `raw`, or `svg` tagged template and confirm syntax highlighting is applied inside the template body.
8. Enable `editor.formatOnSave`, save the file, and confirm the template markup is reformatted.
9. Run `PureStack: Format HTML Templates` or `PureStack: Format Document With HTML Templates` from the command palette.

## Build a VSIX

1. Run `yarn --cwd packages/ts-ssg-vscode build`.
2. Run `yarn --cwd packages/ts-ssg-vscode package`.
3. Install the generated `.vsix` from VS Code with `Extensions: Install from VSIX...`.

## How it resolves components

This version is intentionally simple and generic:

- it handles JSX-like component tags in Markdown and MDX
- it handles component markup inside `html` tagged templates in TypeScript files
- it scans workspace `.ts` files for `defineComponent`
- it keeps only files that contain `defineComponent`
- when you click a component name, it only accepts files that also export an exact `interface`, `type`, or `class` with that component name
- it normalizes PascalCase, kebab-case, and case-insensitive tag names the same way Regor does

## How prop IntelliSense works

- prop names come from the Regor `props` declaration on `defineComponent`
- both `props: ['name']` and the shorthand `defineComponent(..., ['name'])` are supported
- prop value types come from the `defineComponent<TContext>` generic type
- only props listed in `props` are suggested; context-only fields are ignored
- `RefOrValue<T>` and simple exported type aliases are unwrapped for completion
- literal union values and booleans are suggested when they can be resolved

## How syntax highlighting works

- `html` and `raw` tagged templates are highlighted as embedded HTML inside TypeScript files
- `svg` tagged templates are highlighted as embedded SVG
- component tags beginning with an uppercase letter receive a dedicated component tag scope
- `${...}` expressions inside template content and CSS property values are tokenized as TypeScript
- the grammar currently targets TypeScript templates, not JavaScript files

## How formatting works

- on TypeScript saves, the extension formats `html`, `raw`, and `svg` tagged template bodies when `editor.formatOnSave` is enabled
- it also exposes document formatting, range formatting, and dedicated VS Code commands for template formatting
- template boundaries are detected with the TypeScript AST, so only embedded markup is rewritten
- the formatter currently uses Prettier's HTML parser inside the extension bundle
- `${...}` expressions are preserved while the surrounding markup is reformatted
