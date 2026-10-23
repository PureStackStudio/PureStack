# Project creation

`purestack init <directory> --yes` creates a standalone project from a versioned npm
template package. The CLI owns downloading, validation, substitution,
installation, and optional Git initialization. Templates contain files, not setup
code. Generated files belong to the user; templates are not project dependencies.

## First release

See [PureStack Forge](forge.md) for its PureStack content,
template-defined categories, configuration bindings, and extension points.
- Official alias: `starter`.
- `init` serves Forge content with PureStack; `--yes` creates directly.
- Install dependencies with the template's package manager only when `--install` is supplied or selected. The starter pins Yarn; templates without a `packageManager` field use npm.
- For Yarn projects, installation also sets up missing Corepack and enables Yarn
  through npm's global prefix, then prepares the project's pinned Yarn version.
  These stages appear in creation progress; failed setup preserves the project.
- Git initialization is opt-in with `--git`; never create an initial commit.
- Accept explicit npm package versions and local `.tgz` files or package folders.
- Require an absent or empty destination. Stage and validate before writing.
- Check template compatibility against the running CLI. Keep the template's dependency selectors; the starter uses `latest` for PureStack packages.
- Preserve generated files if installation or Git initialization fails, with retry
  instructions and a failing exit status.

## Package contract (version 1)

The starter template workspace lives in `templates/starter/`; future templates
can use `templates/<name>/`. Framework packages live in `packages/`.
Each template remains an npm package named `@purestack/template-<name>` and uses
the shared PureStack product version.

The outer `package.json` declares `purestackTemplate: true`, a name, a version,
and a `files` list containing `template.json`, `template/`, `README.md`, and
`LICENSE`, plus `template.ui.json` when it supplies interactive options. Official
template packages share the product version with all other PureStack packages.
There are no runtime exports.

`template.json` contains `formatVersion: 1`, a description, and a `purestack`
minimum version, such as `"1.1.19"`. The CLI must meet that minimum and have the
same major version. Versions use plain `major.minor.patch`; ranges, prereleases,
and build metadata are not supported. `template/` contains a complete standalone
project, including `package.json`, `README.md`, `AGENTS.md`, and
`content/siteConfig.json`. PureStack adds its development skill to every
generated site at `skills/purestack-development/SKILL.md`, copied from the
installed `purestack` package; templates must not include that file. Point the
template's `AGENTS.md` to it and keep `AGENTS.md` for site-specific guidance.
`purestack skills update` refreshes the copy after an upgrade.
Project dependencies must use registry versions, ranges, tags, or `npm:` aliases.
Workspace references, local paths, Git sources, and tarball URLs are rejected.

The generated package name, site title, and logo brand
are customized. Template-defined option bindings can configure appearance,
features, publishing, and plugin settings. Unspecified values use the template's
declared defaults. The starter declares `purestack` and its `@purestack/*`
dependencies as `latest`. The package manager resolves their current published
releases during installation and records the exact versions in the project's
lockfile. The CLI preserves template dependency selectors instead of pinning them
to its own version. Templates can also declare published versions, ranges, and tags.
Keep `.gitignore` and `.yarnrc.yml` under their real names and explicitly include
`template/.gitignore` and `template/.yarnrc.yml` in the package's `files` list.
`yarn package` and `yarn publish-package` use npm to pack templates, preserving
these files. The CLI copies source and binary files without renaming them.

The project's optional `packageManager` field pins a published Yarn or npm
version using plain `major.minor.patch`, such as `yarn@4.18.1`.
CLI installation, retry instructions, and next-step commands follow
this choice. The starter uses Yarn with the `node-modules` linker, Vitest app
tests outside `content/`, and a standalone `biome.json`.
For Yarn projects without a template-supplied lockfile, the CLI creates an empty
`yarn.lock` before installation to establish a separate project inside parent
workspaces. Existing template lockfiles are preserved.

Printed next-step commands target Command Prompt (`cmd.exe`) on Windows and a
POSIX shell on Linux/macOS, with platform-specific literal path quoting.

Archives must use npm's `package/` prefix. Absolute paths, traversal, Windows
special paths, links, duplicate paths, and non-file/non-directory entries are
rejected before extraction. Local folders go through `npm pack --ignore-scripts`
so testing exercises the files that will actually be published.

Generated projects must provide `dev`, `build`, and `publish` scripts. Installation
lifecycle hooks and project `.npmrc` files are rejected. Template acquisition and
extraction never execute template setup code.

## Releases

`yarn bump-version` updates all workspace packages, including official templates,
to the same product version. Release templates with the rest of PureStack.
Update its `purestack` minimum version when it needs newer APIs or when a new
framework major version is supported. An incompatible template is rejected before
any project files are written; select an older template or a compatible CLI.

Use `yarn publish-package template-starter --dry-run` to inspect a single release.
The same command without `--dry-run` publishes it. Templates also participate
in `yarn publish-new-packages`; data packages are packed without runtime bundling.
Publish the CLI and templates before advertising the new `npx` commands.

## Verification

For manual testing in this repository, run the workspace CLI directly and create
projects under `sites/`. Its README and ignore rules are shared repository files;
generated site directories are Git-ignored. See [the sites guide](../sites/README.md)
for direct CLI commands using local templates.

Focused tests cover parsing, archive validation, compatibility, customization,
and preservation of existing files. `yarn verify-templates` packs the current
workspace packages, creates projects outside the monorepo from their packed
templates, installs the packed framework dependencies using npm overrides or
Yarn resolutions, runs available code-quality checks and app tests, and builds
and publishes each site. It does not publish anything to npm or upload a website.
CI runs this after bundling distributable packages. To verify only the starter
after packing, run `yarn tsx scripts/verify-templates.ts starter`.

`yarn verify-toolchain` checks automatic Corepack installation, Yarn enablement,
the project-pinned Yarn version, dependency installation, and reuse on a second
run. It isolates Node, PATH, npm's global prefix, and tool caches in a temporary
directory. CI runs this check on Windows, Linux, and macOS.
