# PureStack Feature Inventory

This inventory summarizes the capabilities currently visible in the repository. It is based on source files, route tables, package exports, README files, and runtime/admin code.

## Repository Shape

- TypeScript-first PureStack package monorepo.
- PureGate .NET gateway, mail, deploy, watchdog, and admin system.
- Handwritten composition root and runtime wiring.
- Static-site/admin frontends built with the local `ts-ssg`, `ts-components`, `ts-style`, and Regor stack.
- Local generated icon system.
- Local storage layer based on ZoneTree.
- Local JSON file gateway configuration.
- HMAC-secured deploy tooling.
- Watchdog-managed production process lifecycle.

## PureGate Gateway

### HTTP Gateway

- Kestrel-based HTTP server.
- HTTP listener on port 80.
- HTTPS listener on port 443.
- HTTP/1, HTTP/2, and HTTP/3 on HTTPS.
- Server header disabled.
- Configurable forwarded header trust.
- Loopback forwarded header trust by default.
- Trusted forwarded proxy support through IP and CIDR values.
- HSTS enabled in production.
- Request body size limit for normal web requests.
- Request headers timeout.
- Keep-alive timeout.
- High max concurrent connection limit.
- Graceful shutdown with a five minute default window.
- Custom host lifetime integration.
- Health endpoint at `/_puregate/health`.
- Global rate limiter.
- Separate rate limits for auth routes and admin routes.
- Public routes exempt from the global limiter.
- Retry-After header on rate limit rejection.
- Same-origin guard for browser admin/auth/mail mutations.

### Host Routing

- Multi-host gateway configuration.
- Enabled and disabled host buckets.
- Hostname normalization.
- Per-host static routes.
- Static route prefix matching with longest prefix first.
- Host route release switching.
- Static route physical path normalization.
- Static content directory overlap validation.
- Protection against unsafe route content directories.
- Unknown host rejection.
- Canonical `www` host redirect support.
- HTTPS enforcement for configured hosts.
- ACME challenge path exception for HTTP.
- Per-host read-only flag.
- Per-host Lego certificate automation flag.
- Per-host auth realm ID.
- Per-host host ID.
- Per-host mail configuration.
- Per-host Google auth configuration.
- Per-host auth configuration.
- Gateway router snapshot refresh after host changes.

### Static File Serving

- Static file serving from configured host route directories.
- Versioned release serving through current release IDs.
- Live content fallback through route directories.
- Content type detection.
- HTTP compression support.
- ETag support.
- File response helper with cache and compression options.
- Static path safety helpers.

### Gateway Configuration

- Runtime config stored as JSON.
- Atomic save through temporary file replacement.
- Normalized config snapshot on load.
- Volatile snapshot publication for live readers.
- Host upsert and removal.
- Static route release update.
- Lego config update.
- Mail config update.
- ZoneTree config update.
- Log config update.
- Duplicate host ID validation.
- Mail domain uniqueness validation.
- Auth cookie domain validation.
- First-run startup setup for initial admin host and superadmin.

## PureGate Admin API

### Admin Routing and Authorization

- Admin base path under `/_puregate/config`.
- Route-level permission model.
- Manage-gateway permission for gateway configuration.
- Operate-server permission for operational controls.
- HMAC permission for HMAC key creation.
- Host-config permission for host-specific management.
- Superadmin-only gateway management.
- Realm-aware host configuration authorization.
- Browser same-origin guard.

### Gateway Config Admin

- Full gateway config read endpoint.
- Host listing including enabled and disabled hosts.
- Host create/update/delete.
- Host local certificate upload/download/status.
- Host certificate status checks.
- Host Lego flag update.
- Host Lego run trigger.
- Global Lego config management.
- Global mail config management.
- Mail spam config management.
- Mail DKIM key management.
- Global log config management.

### Certificate and Lego Admin

- Global Lego binary path configuration.
- Lego account email configuration.
- Certificate renewal lead time configuration.
- Certificate sync interval configuration.
- ACME challenge directory support.
- Lego certificate sync requests after host changes.
- Host-level Lego enable/disable.
- Host-level manual Lego run.
- Local bootstrap certificate support.
- Runtime live certificate store.
- SNI certificate selection for HTTPS.
- SNI certificate selection for SMTP STARTTLS.

### Mail Admin

- Enable/disable SMTP listener.
- SMTP listen IP and port configuration.
- STARTTLS enable/disable.
- Primary mail hostname.
- Additional mail certificate hostnames.
- Max message size configuration.
- SMTP session timeout configuration.
- Max recipients per session.
- Max concurrent sessions.
- Max concurrent sessions per IP.
- Per-IP connection rate window.
- Per-IP block duration after rate violation.
- Max commands per session.
- Max bad commands per session.
- Spam settings: enabled, move-to-spam, threshold.

### DKIM Admin

- DKIM key listing.
- DKIM key provisioning per configured mail domain.
- DKIM DNS record name/value exposure.
- DKIM key activation.
- DKIM DNS verification before activation.
- Verification override through query flag.
- DKIM key retirement.
- Active/retired key state tracking.

### Spam Admin

- Spam overview endpoint.
- Training status.
- Active training status.
- Training cancellation.
- Quality analysis start/status/cancel.
- Model reload.
- Model listing.
- Model activation.
- Model deletion.
- Dataset listing.
- Dataset import from uploaded JSONL-like content.
- Dataset rename.
- Dataset deletion.
- Corpus stats.
- Imported spam/ham sample counts.
- User-action spam/ham sample counts.
- Training profile listing.
- Model metadata: trained time, spam sample count, ham sample count, active flag.

### Logs Admin

- Query app logs.
- Query access logs.
- Query inbound mail logs.
- Query outbound mail logs.
- Query watchdog logs.
- Search and exclude filters.
- Level filtering.
- Timestamp range filtering.
- Cursor-based log reads.
- Ascending/descending sort.
- Incremental/live query mode.
- Rotated/compressed log file awareness.
- Log entry detail modal data.
- Live log level settings.
- Per-channel minimum log levels.
- Channels: app, access, inbound mail, outbound mail.
- Access log default action: log or omit.
- Access log status rules by exact status or status range.
- Access status rule limit.
- Access log policy evaluated before log write.
- Runtime log config stored in gateway config.

### Observability Admin

- Health snapshot.
- Machine name.
- OS description.
- .NET framework description.
- Processor count.
- Process architecture.
- CPU model details.
- Current/max CPU MHz where available.
- Process CPU percent sampling.
- System CPU percent sampling.
- System memory totals.
- Available/used memory and percentage.
- Process ID/name/start time/uptime.
- Thread count.
- Handle count where available.
- Process memory: working set, private, paged, virtual.
- GC allocated bytes.
- GC total memory.
- GC heap size.
- GC fragmentation.
- GC available memory.
- GC collection counts.
- Host/site counts.
- Static route count.
- Lego-enabled host count.
- Disk usage for app, config, content, releases, data, and certificates.
- Linux and Windows platform support paths.

### Operations Admin

- Watchdog status read.
- Watchdog freshness check.
- App restart command queueing.
- Restart audit logging with user, host, remote IP, and command path.

### ZoneTree Admin

- ZoneTree status endpoint.
- Startup config update.
- Maintainer config update.
- Save metadata action.
- Evict-to-disk action.
- Start merge action.
- Start bottom-segment merge by index range.
- Cancel merge action.
- Cancel bottom-segment merge action.
- Release caches action.
- ZoneTree operation audit logging.

### HMAC Admin

- HMAC key creation.
- HMAC key listing.
- HMAC key retrieval by key ID.
- Secret protection for stored keys.
- HMAC API permission split from general gateway management.
- HMAC deploy authentication integration.

### Artifacts Admin

- Artifact listing.
- Artifact release listing.
- Artifact metadata exposed to admin UI.
- Integration with deploy artifact releases.
- Integration with watchdog upgrade apply.

## PureGate Authentication

### Auth Scope

- Host-aware auth scope resolution.
- Auth realm ID resolution from host config.
- Host ID and hostname included in auth scope.
- Host auth access policy.
- Required permissions per host.
- Host allow list and deny list.
- Host signup enable/disable.
- Host auth cookie domain support.

### Password Auth

- Email/password registration.
- Signup disabled rejection.
- Email normalization.
- Password login.
- Password login denial logging.
- Password change.
- Logout.
- Password reset request.
- Password reset completion.
- Outbound auth email sender.
- Password hashing.
- Password validation.
- Auth flow storage.
- Password reset payload storage.

### Sessions and Profile

- Login session issuing.
- Session cookies.
- Session store.
- Current user endpoint.
- Profile read/update endpoint.
- Session listing.
- Session deletion.
- Logout clears session.

### Abuse Protection

- Configurable abuse protection enable flag.
- Abuse presets.
- Per-action abuse buckets.
- Password login rate limiting.
- Passkey login start rate limiting.
- Forgot password rate limiting.
- Reset password rate limiting.
- Registration rate limiting.
- IP, subject, and pair bucket support.
- Window seconds and block seconds per bucket.
- Auth abuse store.

### Google Auth

- Per-host Google client ID.
- Per-host Google client secret.
- Per-host Google scopes.
- Google login start endpoint.
- Google callback endpoint.
- Google state store.
- External login store.
- Access guard integration.

### Passkeys and 2FA

- WebAuthn/passkey registration start.
- WebAuthn/passkey registration finish.
- WebAuthn/passkey login start.
- WebAuthn/passkey login finish.
- Passkey challenge store.
- Security device store.
- Security device listing.
- Security device management.
- Password login can require passkey second factor.
- `X-PureGate-2FA` response hint for required passkey flow.

### Realm Users

- Realm user listing.
- Realm user detail.
- Realm user creation/update/delete support through handlers.
- Realm-aware authorization for user management.
- Protection against deleting the last superadmin.
- Global and realm references cleaned up during user deletion.

### RBAC

- Global superadmins.
- Realm admins.
- Realm subroles.
- User role assignments.
- Permission aggregation for current user.
- Built-in permissions:
  - `gateway.admin`
  - `host.config.manage`
  - `auth.realm.manage`
  - `app.admin.access`
  - `mail.realm.use`
  - `mail.system.alias.manage`
- Superadmins imply all major permissions.
- Realm admins imply realm management permissions.
- Custom realm subroles with permission arrays.
- Role deletion removes role display names and assignments.
- Principal normalization.
- Role name validation.

## PureGate Mail

### User Mail API

- Mail scope authorization.
- Inbox listing.
- Outbox listing.
- Cursor/limit pagination.
- Folder filtering.
- Newer-than inbox querying.
- Inbox message read.
- Outbox message read.
- Raw message download as `message/rfc822`.
- Attachment download.
- Inbox batch update.
- Inbox batch delete.
- Outbox batch update.
- Outbox batch delete.
- Single message delete.
- Soft delete to trash.
- Permanent delete from trash.
- Read/unread state updates.
- Folder moves.
- Spam training sample recording on folder moves.
- DKIM reverify endpoint for inbox message.
- Mail settings read/update.
- Alias list/create/update/delete.
- System alias management permission.
- Mail image proxy grant.
- Mail image proxy authorization.

### Mail Folders

- Inbox.
- Sent.
- Spam.
- Trash.
- Folder normalization.
- Separate inbound and outbox folder rules.
- Queued sent messages protected from trash/delete.

### Mail Composition and Sending

- Send API.
- HTML and plain body support.
- To/Cc recipients.
- Subject support.
- Attachment support.
- Attachment decode and size checks.
- MIME message composition.
- Outbox copy creation.
- Queue response with outbox message ID and queued delivery IDs.
- Sender ownership validation.
- Alias sender support.
- Recipient normalization and deduplication.
- Per-message size enforcement.

### Inbound SMTP

- TCP SMTP listener.
- Configurable listen IP and port.
- Disabled listener mode.
- Concurrent session limit.
- Per-IP concurrent session limit.
- Per-IP connection rate limit.
- Temporary rejection for connection limit violations.
- SMTP commands: EHLO, HELO, MAIL, RCPT, DATA, STARTTLS, RSET, NOOP, QUIT.
- EHLO capability advertisement.
- `SIZE` capability.
- `8BITMIME` capability.
- STARTTLS capability when configured and certificate exists.
- STARTTLS SNI support.
- STARTTLS fallback certificate selection.
- STARTTLS failure logging and graceful session close.
- Command line length limit.
- Session timeout.
- Max command count.
- Max bad command count.
- Max recipients.
- Max message bytes.
- Dot-stuffed DATA handling.
- Multi-recipient delivery grouping.
- Rollback on partial local delivery failure.
- Local mailbox delivery.
- Remote endpoint recording.
- TLS protocol and cipher recording.

### Inbound Mail Authentication

- SPF verification.
- DKIM verification.
- DMARC verification.
- Authentication result stored with inbound message metadata.
- Header From and envelope sender handling.
- DKIM reverify from mail UI/API.
- DMARC alignment detail.
- Local trusted delivery authentication result for local fast-path mail.

### Inbound Filtering

- Recipient domain policy.
- Mail identity resolution.
- Primary user address resolution.
- Mail alias resolution.
- System alias provisioning.
- Accept-incoming alias flag.
- User block policy.
- Sender/header/body facts for block matching.
- Spam prediction before inbox placement.
- Move-to-spam support.
- Spam verdict stored in metadata.

### Mail Storage

- Inbound message store.
- User outbox message store.
- Message metadata files.
- Raw message files.
- Inbox and outbox indexes.
- Preview records.
- Message ID generation.
- Pending message files with commit/rollback.
- Hard-delete support.
- Temp file cleanup logging.
- ZoneTree-backed indexes.

### Outbound Mail

- Outbound queue.
- Outbound queue persistence.
- Outbound sender background worker.
- Queue notification.
- Per-recipient queued delivery items.
- Sender address policy.
- Trusted raw enqueue path.
- Trusted sender domain validation.
- From header enforcement for trusted messages.
- Primary HELO host support.
- MX DNS lookup.
- MX address iteration.
- SMTP client delivery.
- SMTP greeting/EHLO/HELO handling.
- Outbound STARTTLS when advertised.
- SMTP DATA dot escaping.
- Permanent/transient failure classification.
- Retry policy.
- Delivery status tracking.
- Local recipient fast path.
- Local mailbox delivery without remote SMTP.
- Local route rejection for hosted but invalid recipients.
- DKIM signing before remote delivery.

### DKIM Implementation

- DKIM canonicalization.
- DKIM header selection.
- DKIM signature building.
- DKIM message reading.
- Outbound signing identity resolution.
- Outbound DKIM key store.
- DNS verification of DKIM keys.
- Active signing key selection.
- Key provisioning, activation, retirement.

### MIME and Mail Safety

- MIME reader.
- MIME composer.
- MIME part classifier.
- Attachment reader.
- Header reader.
- Encoded header handling.
- Message text reader.
- HTML remote image extractor.
- Mail content safety helpers.
- Composer email HTML policy.
- Gmail-compatible email tag/CSS constraints in TS components.
- Remote image proxy and grant signing.

### Spam Detection

- TF-IDF logistic regression spam trainer.
- Body TF-IDF logistic regression trainer.
- Spam classifier.
- File-backed spam model store.
- Active model loading/reloading.
- Training profiles.
- Training progress.
- Training result metadata.
- Model metadata.
- Spam input and prediction types.
- Dataset importer.
- Dataset store.
- Dataset file set tracking.
- JSONL training sample records.
- Corpus stats.
- User-action training samples.
- Quality analysis over stored mail.

## PureGate Deployment

### Deploy API

- HMAC-authenticated deploy endpoints.
- Host release deploy endpoint.
- Host release listing.
- Host rollback endpoint.
- Live host content upload endpoint.
- Artifact deploy endpoint.
- Artifact release listing.
- Artifact apply endpoint.
- Large deploy request body allowance.
- Release retention count.
- Route metadata file support.
- Artifact apply queue.

### Deploy CLI

- `deploy` for versioned static-site host releases.
- `releases` for host route releases.
- `rollback` for host route rollback.
- `content upload` for direct live content upload.
- `artifact deploy`.
- `artifact releases`.
- `artifact apply`.
- `artifact validate`.
- HMAC key ID and secret from flags.
- HMAC key ID and secret from environment variables.
- Directory package support.
- Prebuilt `.tar.br` package support.
- Brotli-compressed tar packaging.
- Upload progress logging.
- Package hashing.
- Strict package validation.
- Static web extension allow list.
- Extra allowed extensions.
- Extra allowed archive paths.
- Skip path patterns.
- Dot file/directory rejection by default.
- Unsafe path segment rejection.
- `.test.js` and `.test.mjs` rejection by default.
- Manifest requirement for artifact packages.
- Merge vs replace live content mode.

### Deploy Package Policy

- Archive-relative path validation.
- Wildcard path matching through text search.
- Safe extension normalization.
- Directory and archive validation.
- Directory measuring before packaging.
- Empty package rejection.
- Unsupported tar entry rejection.

## PureGate Watchdog

### Process Supervision

- Starts `PureGateApp`.
- Restarts app if child process exits.
- Health probe based restart support.
- App start command.
- App stop command.
- App restart command.
- App status command.
- Command file queue.
- Active runtime path persisted in `active.json`.
- Selected artifact release application.
- Shutdown and stop timeout coordination.
- Systemd integration.

### Service Management

- `puregate run`.
- `puregate service install`.
- `puregate service uninstall`.
- `puregate service start`.
- `puregate service stop`.
- `puregate service restart`.
- `puregate service status`.
- System user creation.
- Runtime directory creation.
- Systemd unit writing.
- Systemd enable/start support.
- `CAP_NET_BIND_SERVICE` grant for unprivileged low-port binding.
- Environment file support at `/etc/puregate/puregate.env`.

### Watchdog Logs

- Watchdog JSON log.
- App JSON log.
- Access JSON log.
- Inbound mail JSON log.
- Outbound mail JSON log.
- App stderr fallback log.
- Tail commands for each log stream.
- Minimum-level filtering for tail commands.
- Colored compact output through `jq`.
- Log clear commands.
- Hard clear mode.
- Archive-before-clear mode.
- Logrotate config installation.
- Logrotate reset/debug commands.
- Daily/size-based rotation policy.
- Long retention default.

### Bootstrap and Upgrade

- Linux x64 self-contained app packaging.
- Bootstrap archive creation scripts for Bash and PowerShell.
- Installer script included in archive.
- Bundled watchdog.
- Bundled deploy CLI.
- Bundled app release.
- Bundled admin panel.
- First-run production config creation.
- Environment/prompted initial setup:
  - `LEGO_URL`
  - `PUREGATE_ADMIN_HOSTNAME`
  - `PUREGATE_LEGO_ENABLED`
  - `PUREGATE_LEGO_EMAIL`
  - `PUREGATE_SUPERADMIN_EMAIL`
  - `PUREGATE_SUPERADMIN_PASSWORD`
- Optional Lego binary install.
- Bootstrap self-signed certificate when Lego is disabled.
- Initial admin host content publishing.
- `puregate upgrade apply`.
- `puregate upgrade status`.

## PureGate Core Libraries

### Logging

- Custom JSON file logger provider.
- Newline-delimited JSON output.
- Bounded channel queue.
- Drop-write behavior under pressure.
- Dropped log count warning entries.
- Entry object pooling.
- Timestamp formatting.
- EventId and structured state output.
- Exception string output.
- Dynamic minimum level hook.
- App/access/inbound/outbound log channel separation.

### HMAC

- HMAC signing utilities.
- Stream hashing.
- Deploy request authentication.
- HMAC key records.
- HMAC key secret protection.

### Text and Path Safety

- Safe text helpers.
- ASCII character utilities.
- Wildcard text search.
- Safe file name helper.
- Media type safety helper.

### Archive Support

- `.tar.br` archive creation.
- `.tar.br` extraction/use in deploy workflows.
- Brotli compression.
- Tar entry validation.

### Time

- Unix timestamp value type.
- Unix timestamp JSON converter.
- Date/time conversion helpers.

### Collections

- Lock-free ring buffer.

### Command Line

- Shared command-line option parser.
- Option aliases and repeated option handling.
- Boolean/truthy option helpers.

## PureGate Admin Panel Frontend

### Admin Pages

- Dashboard.
- Hosts.
- Mail.
- Logs.
- HMAC.
- Artifacts.
- Observability.
- Operations.
- ZoneTree.
- Account.
- Identity/users/RBAC.
- Sign in.
- Sign up.
- Sign out.
- Recovery.

### Host Management UI

- Host table.
- Host editor.
- Host identity settings.
- Static route editor.
- Google auth settings.
- Auth settings.
- Auth allow/deny route fields.
- Required permissions field.
- Auth abuse settings.
- Mail domain settings.
- TLS/certificate settings.
- Lego settings tab.
- Spam settings tab.
- DKIM settings tab.
- Mail settings tab.
- Logging settings tab.
- Host enable/disable.
- Host read-only display.
- Host Lego toggle.

### Mail UI

- Mail app shell.
- Inbox panel.
- Outbox/sent panel.
- Message tab store.
- Sent message tab store.
- Message detail panel.
- HTML mail frame.
- HTML preview safety helpers.
- Inline image handling.
- Remote image policy store.
- Compose panel.
- Compose draft model.
- Body parser.
- Inbox/outbox row components.
- Inbox/outbox headers.
- Inbox/outbox column groups.
- Mail settings panel.

### Logs UI

- Log query app.
- Filters panel.
- Time presets.
- Entry table.
- Entry details modal.
- Log entry formatting.
- Live/incremental query state.
- Separate host-management log settings panel.

### Auth and RBAC UI

- Sign-in app.
- Sign-up app.
- Recovery app.
- Account app.
- Settings app.
- Sign-out app.
- Users/RBAC app.
- User directory panel.
- Role designer panel.
- Access grants panel.
- Passkey client.
- Host permission helpers.

### Admin Utility Stores

- Admin API wrapper.
- Dashboard store.
- Host config store.
- Mail stores.
- Mail spam store.
- Mail DKIM store.
- Log store.
- HMAC store.
- Artifact store.
- Data store.
- Operations store.
- Observability store.
- ZoneTree store.
- Date formatting helpers.
- Release formatting helpers.

## TypeScript Packages

### `@purestack/ts-html`

- Immutable HTML node builder.
- Type-safe HTML tags.
- Type-safe attributes.
- Global attributes.
- ARIA attributes.
- Event attributes.
- Text escaping.
- Raw HTML injection.
- Fragment nodes.
- Child composition.
- Tag selection and replacement.
- HTML serialization.
- Pretty HTML serialization.
- Head metadata helpers.
- Basic head config.
- Open Graph/canonical/meta support.
- Generated HTML metadata types.

### `@purestack/ts-css`

- Type-safe CSS builder.
- Fluent selectors.
- Typed CSS properties.
- Selector composition.
- Child selectors and combinators.
- Pseudo selector handling.
- Media query nesting.
- CSS variable auto expansion.
- Style reuse through `.use`.
- Deterministic CSS serialization.
- Pretty CSS serialization.
- Color utilities.
- Gradient utilities.
- CSS property metadata generation.

### `@purestack/ts-ssg`

- Markdown/MDX static site generation.
- Deterministic file-based routing.
- `index.html` folder routes.
- Static asset copying.
- Site config resolution.
- JSON schema for site config.
- CLI build mode.
- CLI dev/serve mode.
- Watch mode.
- Live reload over SSE.
- Lazy route render in dev server.
- Incremental rebuilds.
- Manifest tracking.
- Clean builds.
- Publish builds.
- Markdown support.
- MDX support.
- GFM support.
- Frontmatter parsing.
- Draft page hiding.
- Hidden nav items.
- Navigation generation.
- Custom nav files.
- Hybrid nav mode.
- Navigation override/merge modes.
- Built-in `doc` template.
- Built-in `splash` template.
- Custom template map.
- Page outline extraction.
- Page TOC support.
- Optional Shiki highlighting.
- Built-in component initialization.
- Built-in skins.
- Light/dark/additional theme CSS output.
- HTML minification option.
- CSS pretty output option.
- Sitemap generation.
- Robots.txt generation.
- Pagefind indexing.
- Pagefind exclusion paths.
- Consent manager integration.
- GA4 integration.
- Consent-gated analytics.
- Build hooks.
- Error page writing in dev.

### `@purestack/ts-components`

- Regor component definitions.
- Central component registration.
- Central style registration.
- Alert box.
- Badge.
- Button and button links.
- Bar chart.
- Doughnut chart.
- Line chart.
- Composer/email editor.
- Email HTML safety policy.
- Consent component.
- Contact form.
- Drop files.
- Expandable panel.
- Flex layout.
- Grid layout.
- Form shell.
- Form input field.
- Form select field.
- Autocomplete input.
- Multi-autocomplete input.
- Icon component.
- Landing page sections.
- Logo.
- Modal.
- Modal store.
- Navigation menu/list/item.
- Page TOC.
- Panel.
- Pricing table/plan/feature.
- Search box.
- Section header.
- Sign-in component.
- Tabs.
- Theme switcher.
- Toast host/store.
- Top bar.
- Virtual list.
- Variable virtual list.
- Virtual table.
- Variable virtual table.
- Component variant and tone support.

### `@purestack/ts-style`

- Breakpoint definitions.
- Design token variables.
- Document layout variables.
- CSS normalize registration.
- Semantic tone system.
- Built-in skins.
- Theme asset helpers.
- Theme option resolution.
- Theme palette generation.
- Theme palette CSS variables.
- Typography normalization.
- Line-height helpers.
- Letter-spacing helpers.
- Utility class registration.
- Style builder helpers.

### `@purestack/ts-page-scripts`

- Theme switch runtime script.
- Consent runtime script.
- Auth state hint script.
- Code copy script.
- Menu runtime script.
- Modal runtime script.
- Navigation menu script.
- Pagefind search runtime script.
- Page TOC script.
- Tabs script.
- Embedded script builders.
- Runtime globals for tabs and modals.

### `@purestack/ts-svg-icons`

- Icon lookup by `provider:name`.
- Raw SVG passthrough.
- Iconoir generated icons.
- Lucide generated icons.
- Phosphor regular generated icons.
- Tabler outline and filled generated icons.
- Tree-shake friendly direct icon exports.
- Available icon name types.
- Generated provider maps.

### `@purestack/ts-common`

- Shared SSG context types.
- Site config types.
- Page template types.
- Frontmatter types.
- Navigation types.
- Consent types.
- Analytics/GA4 types.
- Auth config types.
- Pagefind config types.
- Sitemap/robots types.
- SSG context resolver.

### `@purestack/ts-render`

- Component registry.
- Render app helper.
- Regor/static rendering integration.
- SSG context-aware render options.

### `@purestack/ts-minidom`

- Minimal DOM implementation.
- HTML parsing.
- Fragment parsing.
- Mini document, element, text, comment, template, slot types.
- Mutation observer support.
- Event/custom event/mouse event support.
- Class list support.
- Style declaration support.
- Selector/query support.
- DOM globals setup for tests/server rendering.
- DOM cache reset.
- CSS escape helper.

### `@purestack/ts-util`

- Browser-safe shared helpers.
- HTML escaping.
- Type guards.
- Deep partial type.
- Object merge helper.
- Cache helper.
- Clamp helper.
- URL normalization.
- Asset path helpers.
- Logger-like error helper.

### `@purestack/ts-util-node`

- Node-only filesystem utilities.
- File extension replacement helper.

### `@purestack/ts-ssg-vscode`

- VS Code extension package.
- MDX syntax grammar.
- Lit HTML syntax injection.
- Lit SVG syntax injection.
- Lit style injection.
- Template diagnostics.
- Template formatting.
- Template autoclose.
- Linked editing.
- HTML formatting.
- Frontmatter support.
- Frontmatter metadata.
- Component metadata.
- Component resolver.
- MDX formatting.
- TypeScript runtime integration.
- Extension assets.

## Build and Tooling Scripts

- TypeScript 7 native preview dependency.
- Yarn 4 workspaces.
- Vite config.
- Biome formatting/checking.
- Vitest tests.
- tsdown bundling.
- Bundle script.
- Cleanup script.
- Embed generation script.
- Icon generation script.
- Regor component generation script.
- Longest functions report script.
- DTS export fix script.
- PureGate admin panel dev script.
- PureGate public frontend dev script.
- PureGate admin panel publish script.
- PureGate app bootstrap packaging script.
- PureGate deploy scripts for web, frontend, and app artifacts.

## Tests Visible In The Repo

- Static file handler tests.
- File response tests.
- DKIM tests.
- Mail message text reader tests.
- Mail HTML remote image extractor tests.
- Core text search tests.
- Command-line option tests.
- TypeScript package tests for builders, navigation, rendering, MDX, assets, sitemap, incremental builds, and components.

## Notable Architectural Features

- Explicit handwritten DI/composition root.
- Snapshot-based gateway configuration.
- No central database dependency for gateway config.
- ZoneTree-backed application data.
- Generated admin panel as static content.
- Server and admin UI built from repo-native tooling.
- Runtime logs are structured JSON files.
- Deploys are package-based and HMAC-authenticated.
- Watchdog owns process lifecycle and upgrades.
- Mail stack is first-party: SMTP listener, SMTP sender, DKIM, SPF/DKIM/DMARC verification, spam model, MIME handling, mail UI.
