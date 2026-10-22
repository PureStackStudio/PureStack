# Site Studio wizard

Run `yarn purestack init` from `sites/` to serve the wizard locally. The CLI calls
PureStack's existing `startDevServer` with `packages/purestack/wizard` as its
content directory. Open the complete printed URL, including its session token.
Studio binds to `127.0.0.1` on an available port by default. Override the wizard
listener with `yarn purestack init --host 0.0.0.0 --port 4700`; `--port 0` selects
an available port. These flags affect Studio; generated-site previews keep their
own loopback listener and automatically assigned port. Studio and preview servers
log warnings and errors while creation progress remains visible.

Studio builds the complete wizard before printing its URL, then serves the
generated site with file watching and live reload disabled. Its WebSocket
connection remains available for configuration, creation progress, and shutdown.

The wizard is ordinary PureStack content:
- `wizard/index.mdx`: static introduction and native `RegorApp` mount.
- `wizard/header.mdx` and `footer.mdx`: shared native `TopBar`, `ThemeToggle`,
  and `SiteFooter`.
- `wizard/siteConfig.json`: site settings.
- `wizard/modules/purestack.config.ts`: plugin configuration selected by the CLI.
- `wizard/modules/wizardPlugin.ts`: generates a branded light/dark pair through the
  standard skin generator and registers fluent TypeScript styles.
- `wizard/modules/skin.ts`: refines both returned palettes for surfaces, readable
  text, borders, typography, radii, shadows, and accent interaction states.
- `wizard/modules/styles/`: custom shell and dashboard rules using semantic palettes;
  ordinary layout and spacing use native components and generated utilities.
- `wizard/modules/model.ts`: shared reactive configuration, validation, and navigation.
- `wizard/modules/connection.ts`: native browser WebSocket transport and reconnection.
- `wizard/modules/shared/protocol.ts`: typed commands, snapshots, progress, and results.
- `wizard/modules/components/dashboard.ts`: dashboard layout composing the navigation
  and individual site, template, options, setup, and review steps.
- `wizard/modules/components/`: focused, typed Regor components, including reusable
  step layouts, Back/Next actions, and template cards built from native primitives.
- `wizard/modules/wizard.ts`: mounts the browser app with explicit component registration.
- `src/cli/wizard/run.ts`: starts PureStack and prints the setup URL.
- `src/cli/wizard/session.ts`: validates commands, owns creation and progress,
  retains state across reconnects, and rejects duplicate creation requests.
- `src/cli/wizard/preview.ts` and `preview-process.ts`: launch an isolated child
  process using the same CLI and PureStack server, with IPC readiness and cleanup.

The Regor app connects to a WebSocket endpoint on the existing PureStack HTTP
listener. The session validates the request origin, host, and a random token
before upgrading. Browser commands configure templates, create a project, retry
the live server, or finish the session. Server snapshots carry authoritative
state and task progress. Reconnecting observes the same operation without
resubmitting creation. No third-party WebSocket library is used.

After creation, **Browse live site** opens the generated project on a separate
loopback port. A child process isolates its theme and build registries from the
wizard; source edits are watched and reloaded by PureStack. A failed preview can
be retried without regenerating the project. The wizard remains open until
**Finish Studio** or Ctrl+C, which closes both servers and cleans their temporary
build directories. Generated project files are preserved. The terminal prints
copyable commands for continuing independently.

The live site uses the generated project's `dev` script (`purestack serve ...`),
including its content directory, host, port, and watch/reload options. For example,
`--port 5000` opens the live site on port 5000. Studio keeps its own listener and
stores preview build output in a temporary directory.

## Retained generation services

Direct creation continues to work:

```sh
yarn purestack init my-site --template starter --yes
yarn purestack init my-site --template starter --set palette=mint --install --yes
```

Template fetching, archive validation, compatibility checks, typed settings,
project generation, optional installation/Git setup, and terminal progress and
completion output remain independent of the wizard. See
[Project creation](template-scaffolding.md) for the package contract.

Template categories, nested categories, fields, choices, defaults, and configuration
bindings are defined by `template.ui.json` and rendered with native PureStack
controls. CLI arguments prefill the wizard, including custom template sources and
`--set` values. The live site is started after creation; template-specific optional
previews and custom template setup code remain separate future capabilities.
