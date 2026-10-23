# PureStack templates

Each directory is a publishable npm workspace containing a complete site:

| Directory  | Package                       | CLI alias |
| ---------- | ----------------------------- | --------- |
| `starter/` | `@purestack/template-starter` | `starter` |

From `sites/`, run `yarn purestack init`. Official aliases use these local
templates automatically in this checkout. To select a folder explicitly:

```sh
yarn purestack init my-site --template ../templates/starter --yes
```

Templates share the product version with framework packages. The root
`templates/*` workspace pattern includes new folders in packing, dependency
checks, version bumps, and release discovery. Add a template's alias and catalog
entry in the CLI when making it an official Forge choice.

Keep `.gitignore` and `.yarnrc.yml` under their real names and explicitly list
them in the template package's `files` array. `yarn package` uses npm to pack
template packages so these files are preserved.

See [the template package contract](../docs/template-scaffolding.md) for required
files, configuration options, verification, and publishing.
