# Component Navigation

This VS Code extension adds `Go to Definition` support for component tags inside `.md`, `.mdx`, and Regor `html\`...\`` templates in `.ts` files.

Examples:

- `Ctrl+Click` on `<Flex>` opens the `.ts` file that exports `Flex`
- `Ctrl+Click` on `<Grid>` opens the `.ts` file that exports `Grid`
- `Ctrl+Click` on `<TabPane>` opens the shared `.ts` file that exports `TabPane`

## Local testing

1. Open the PureStack repo in VS Code.
2. Run the `PureStack VSCode: Build Extension` task.
3. Start the `PureStack VSCode: Launch Extension` launch configuration.
4. In the Extension Development Host window, open any `.md`, `.mdx`, or `.ts` file in this repo.
5. Hold `Ctrl` and click a component tag such as `<Flex>` or press `F12` on it.

## Build a VSIX

1. Run `yarn --cwd packages/ts-ssg-vscode build`.
2. Run `yarn --cwd packages/ts-ssg-vscode package`.
3. Install the generated `.vsix` from VS Code with `Extensions: Install from VSIX...`.

## How it resolves components

This version is intentionally simple and generic:

- it handles JSX-like component tags in Markdown and MDX
- it handles component tags inside `html\`...\`` tagged templates in TypeScript files
- it scans workspace `.ts` files for `defineComponent`
- it keeps only files that contain `defineComponent`
- when you click a component name, it only accepts files that also export an exact `interface`, `type`, or `class` with that component name
- it navigates to the exported definition line in that file

It does not depend on PureStack exports, barrel files, or naming conventions.

