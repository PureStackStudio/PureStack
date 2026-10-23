# @purestack/ts-format

The shared PureStack formatter used by PureStack CLI and the VS Code extension.
Formats component markup in MDX/RMDX and `html`/`svg` tagged templates in TypeScript.
Markdown prose, frontmatter, code samples, expressions, and surrounding TypeScript
are preserved. Biome handles the rest of the project's formatting.

```ts
import { formatSource } from '@purestack/ts-format'

const result = await formatSource(source, { filePath: 'content/page.mdx' })
// result.code, result.changed, result.edits, result.diagnostics
```

Options include `printWidth` (80), `tabSize` (2), `useTabs` (false), and an optional
`onlyWithinRange` with UTF-16 source offsets. Edits refer to the original source.
Line endings are preserved. Diagnostics identify markup that could not be formatted.

For files and directories:

```ts
import { formatFiles } from '@purestack/ts-format/files'

const result = await formatFiles(['content'], { cwd: process.cwd(), write: true })
// result.checked, result.changed, result.errors
```

File operations default to checking without writing, honor Git ignores for directory
scans, skip symlinks and generated directories, and collect failures across files.
A file with formatting errors is never written. `exclude` accepts additional file
or directory paths relative to `cwd`. Without Git, directory scans still work and
skip known output, dependency, and cache directories.

From a PureStack project:

```sh
purestack format content --write
purestack format content --check
```

In this repository, `yarn format:markup --write` formats PureStack markup only.
`yarn format` runs Biome followed by this formatter; `yarn format:check` checks both.
