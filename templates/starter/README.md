# PureStack starter template

Create a site with `npx purestack@latest init` and choose **Starter** in
PureStack Forge. This package distributes complete project source. It is copied
into your project and does not become a dependency of it.

The starter includes a responsive home page, About page, customization guide,
shared navigation/footer, and an interactive launch checklist. Its custom skin
refines the standard PureStack palette for both light and dark, while preserving
Forge's color choices. Starter copy explains what to replace; it makes no
fictional business claims.

Generated projects use pinned Yarn 4, Vite-powered Vitest app tests, Biome
for code quality, and PureStack's markup formatter for MDX components and
TypeScript templates. PureStack dependencies use
`latest`, with exact installed versions recorded in the project's lockfile. See the generated
[README](template/README.md) for commands and requirements.

To test unpublished changes, pass this folder or its packed `.tgz` to
`purestack init --template`. See [the template contract](../../docs/template-scaffolding.md).
