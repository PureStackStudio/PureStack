# PureStack CLI development sites

Use this folder to exercise PureStack CLI and PureStack Forge and create any number
of test sites. This README and `.gitignore` are shared repository files. Generated site
directories are Git-ignored.

Run all commands below from inside `sites/`. The workspace launcher runs the
local CLI with `tsx` and preserves your current folder as the destination base.

```sh
yarn purestack init
```

Optionally choose Forge's address and port:

```sh
yarn purestack init --host 127.0.0.1 --port 4700
```

The defaults are `127.0.0.1` and an automatically assigned port. Server logging
starts at warning level; creation progress and next steps remain visible.

The CLI serves Forge's ordinary PureStack content at the URL printed in
your terminal. Open the complete link to configure site details, templates,
template-defined options, and project setup. Choices are kept while moving
between sections. **Create site** shows progress and starts the generated site;
**Browse live site** opens it in a new tab. Forge stays open while you explore,
and source edits reload the live site automatically.

Sites are created inside this folder, for example `sites/my-site`. **Finish Forge**
or Ctrl+C stops both local servers while preserving the generated
project. The terminal prints commands for continuing independently. Forge and
preview build output use system temporary folders rather than the repo root.

In this checkout, official template choices use local source automatically.
Choose a new destination for each site; existing nonempty folders are preserved.

Each generated Yarn site gets its own `yarn.lock` before installation, so Yarn
treats it as a separate project inside this repository. Keep the shared `sites/`
folder without a lockfile so `yarn purestack init` continues to use the repo launcher.

For creation without prompts:

```sh
yarn purestack init my-site --template starter --yes
yarn purestack init my-site --template starter --set palette=mint --set search=true --yes
```

Dependency installation and Git initialization are opt-in with `--install` and
`--git`. Leave these flags out to test with the existing workspace dependencies.
When installing a Yarn project, the CLI also installs missing Corepack, enables
Yarn, and prepares the version pinned by the generated project.
Use `--template ../templates/starter` or a local `.tgz` to test an
explicit template source.

Preview or build a site with the same CLI:

```sh
yarn purestack serve --content ./my-site/content
yarn purestack build --content ./my-site/content
yarn purestack publish --content ./my-site/content
```

To test additional creation options:

```sh
yarn purestack init --help
```

Template menus and settings come from each package's `template.ui.json`.
See [the PureStack Forge guide](../docs/forge.md) for the schema and architecture.

Generated files are the CLI's normal output. There are no site-specific wrapper
commands or modifications to the generated projects.
