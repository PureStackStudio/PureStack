# Component Navigation

This VS Code extension adds `Go to Definition` and prop IntelliSense support for component tags inside `.md`, `.mdx`, and Regor `html` tagged templates in `.ts` files.

Examples:

- `Ctrl+Click` on `<Flex>` opens the `.ts` file that exports `Flex`
- `Ctrl+Click` on `<Grid>` opens the `.ts` file that exports `Grid`
- `Ctrl+Click` on `<TabPane>` opens the shared `.ts` file that exports `TabPane`
- inside `<Btn ...>` it suggests only public Regor props declared in `defineComponent(..., { props: [...] })`
- inside `<Btn size="...">` it suggests literal values like `sm`, `md`, and `lg`

## Local testing

1. Open the PureStack repo in VS Code.
2. Run the `PureStack VSCode: Build Extension` task.
3. Start the `PureStack VSCode: Launch Extension` launch configuration.
4. In the Extension Development Host window, open any `.md`, `.mdx`, or `.ts` file in this repo.
5. Hold `Ctrl` and click a component tag such as `<Flex>` or press `F12` on it.
6. Trigger completion inside a component tag to see prop and value suggestions.

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

