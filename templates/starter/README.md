# PureStack starter template

Create a site with `npx purestack@latest init my-site --template starter --yes`.
This package distributes complete project source. It is copied by the CLI and
does not become a dependency of the generated project.

Generated projects use pinned Yarn 4, Vite-powered Vitest app tests, and Biome
for linting, formatting, and import organization. See the generated
[README](template/README.md) for commands and requirements.

To test unpublished changes, pass this folder or its packed `.tgz` to
`purestack init --template`. See [the template contract](../../docs/template-scaffolding.md).
