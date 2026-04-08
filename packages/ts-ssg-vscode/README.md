# PureStack MDX Component Navigation

This VS Code extension adds `Go to Definition` support for PureStack component tags inside `.md` and `.mdx` files.

Examples:

- `Ctrl+Click` on `<Flex>` opens `packages/ts-components/src/standard/flex/flex.ts`
- `Ctrl+Click` on `<Grid>` opens `packages/ts-components/src/standard/grid/grid.ts`
- `Ctrl+Click` on `<FormField>` opens `packages/ts-components/src/standard/form/form.ts`

## Local testing

1. Open the PureStack repo in VS Code.
2. Run the `PureStack VSCode: Build Extension` task.
3. Start the `PureStack VSCode: Launch Extension` launch configuration.
4. In the Extension Development Host window, open any `.md` or `.mdx` file in this repo.
5. Hold `Ctrl` and click a component tag such as `<Flex>` or press `F12` on it.

## Scope

This first version is intentionally simple:

- it only handles JSX-like component tags in Markdown and MDX
- it resolves component names from `packages/ts-components/src/index.ts`
- it falls back to matching standard component file names when needed

It does not attempt full MDX parsing or symbol resolution.
