# PureStack Forge

Build, customize, and maintain your PureStack website.

PureStack is the ecosystem. PureStack CLI (`purestack`) is its command-line tool;
PureStack Forge is its website builder. `purestack init` launches Forge's
interactive project creation experience. PureStack Packages (`@purestack/*`)
provide the reusable framework capabilities.

Run `yarn purestack init` from `sites/` to serve Forge locally. The CLI calls
PureStack's existing `startDevServer` with `packages/purestack/forge` as its
content directory. Open the complete printed URL, including its session token.
Forge binds to `127.0.0.1` on an available port by default. Override Forge's
listener with `yarn purestack init --host 0.0.0.0 --port 4700`; `--port 0` selects
an available port. These flags affect Forge; generated-site previews keep their
own loopback listener and automatically assigned port. The Forge and preview servers
log warnings and errors while creation progress remains visible.

The CLI builds the Forge app before printing its URL, then serves the
generated site with file watching and live reload disabled. Its WebSocket
connection remains available for configuration, creation progress, and shutdown.

Forge is ordinary PureStack content:
- `forge/index.mdx`: static introduction and native `RegorApp` mount.
- `forge/header.mdx` and `footer.mdx`: shared native `TopBar`, `ThemeToggle`,
  and `SiteFooter`.
- `forge/siteConfig.json`: site settings.
- `forge/modules/purestack.config.ts`: plugin configuration selected by the CLI.
- `forge/modules/plugin.ts`: generates a branded light/dark pair through the
  standard skin generator and registers fluent TypeScript styles.
- `forge/modules/skin.ts`: refines both returned palettes for surfaces, readable
  text, borders, typography, radii, shadows, and accent interaction states.
- `forge/modules/styles/`: custom shell and dashboard rules using semantic palettes;
  ordinary layout and spacing use native components and generated utilities.
- `forge/modules/model.ts`: shared reactive configuration, validation, and navigation.
- `forge/modules/connection.ts`: native browser WebSocket transport and reconnection.
- `forge/modules/shared/protocol.ts`: typed commands, snapshots, progress, and results.
- `forge/modules/components/dashboard.ts`: dashboard layout composing the navigation
  and individual site, template, options, setup, and review steps.
- `forge/modules/components/`: focused, typed Regor components, including reusable
  step layouts, Back/Next actions, and template cards built from native primitives.
- `forge/modules/app.ts`: mounts the browser app with explicit component registration.
- `src/cli/forge/run.ts`: starts PureStack and prints the setup URL.
- `src/cli/forge/session.ts`: validates commands, owns creation and progress,
  retains state across reconnects, and rejects duplicate creation requests.
- `src/cli/forge/preview.ts` and `preview-process.ts`: launch an isolated child
  process using the same CLI and PureStack server, with IPC readiness and cleanup.

The Regor app connects to a WebSocket endpoint on the existing PureStack HTTP
listener. The session validates the request origin, host, and a random token
before upgrading. Browser commands configure templates, create a project, retry
the live server, or finish the session. Server snapshots carry authoritative
state and task progress. Reconnecting observes the same operation without
resubmitting creation. No third-party WebSocket library is used.

After creation, **Browse live site** opens the generated project on a separate
loopback port. A child process isolates its theme and build registries from
Forge; source edits are watched and reloaded by PureStack. A failed preview can
be retried without regenerating the project. Forge remains open until
**Finish Forge** or Ctrl+C, which closes both servers and cleans their temporary
build directories. Generated project files are preserved. The terminal prints
copyable commands for continuing independently.

The live site uses the generated project's `dev` script (`purestack serve ...`),
including its content directory, host, port, and watch/reload options. For example,
`--port 5000` opens the live site on port 5000. Forge keeps its own listener and
stores preview build output in a temporary directory.

## Retained generation services

Direct creation continues to work:

```sh
yarn purestack init my-site --template starter --yes
yarn purestack init my-site --template starter --set palette=mint --install --yes
```

Template fetching, archive validation, compatibility checks, typed settings,
project generation, optional installation/Git setup, and terminal progress and
completion output remain independent of Forge. See
[Project creation](template-scaffolding.md) for the package contract.

Template categories, nested categories, fields, choices, defaults, and configuration
bindings are defined by `template.ui.json` and rendered with native PureStack
controls. CLI arguments prefill Forge, including custom template sources and
`--set` values. The live site is started after creation; template-specific optional
previews and custom template setup code remain separate future capabilities.
