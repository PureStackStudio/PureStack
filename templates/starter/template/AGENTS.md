# Working on this PureStack site

## Commands and validation

- Use the Yarn version pinned in `package.json`; install with `yarn install`.
- Preview: `yarn dev` (local server with live reload).
- Verify content and configuration: `yarn build`.
- Test app code: `yarn test` (watch) or `yarn test:ci` (once).
- Code quality: `yarn check`; safe fixes: `yarn check:fix`.
- Formatting: `yarn format`; lint only: `yarn lint`.
- Verify the release: `yarn publish`; inspect `dist/publish` before deployment.
- `publish` creates local output. Deployment is a separate action.

## Source map

- `content/siteConfig.json`: title, logo, theme, navigation, and output paths.
- `content/index.mdx`: home page; `content/about.mdx`: about page.
- `content/modules/content/landing.ts`: editable landing page copy and destinations.
- `content/modules/components/landing/`: build-time landing components grouped by responsibility.
- `content/modules/components/shell/footer/`: footer brand, navigation, and guide card.
- `content/header.mdx`, `content/footer.mdx`: shared navigation and footer.
- `content/guide/index.mdx`: a customization guide; keep its file map accurate.
- `content/purestack.config.ts`: plugin registration.
- `content/modules/starter-plugin.ts`: the site's theme and style plugin.
- `content/modules/theme/palette.ts`: custom light/dark palettes built from
  `themeSkins.standard.create()`; preserve selectable color presets.
- `content/modules/styles/`: fluent style rules grouped by shell, footer, and landing sections.
- `content/guide/checklist/`: colocated MDX and Regor TypeScript interaction example.
- `tests/`: Vitest app tests; keep tests outside the published content directory.
- `vitest.config.ts`: Vite-powered test configuration, not the site server.
- `biome.json`: code quality, formatting, and import organization.
- `skills/purestack-development/SKILL.md`: PureStack and Regor development rules.
  PureStack manages this file; refresh it with `yarn purestack skills update`
  after upgrading PureStack instead of editing it.
- Other files in `content/`, including images, are copied as public assets.
- `dist/` and `node_modules/` are generated. Change source instead of output.
- Commit `yarn.lock` after installing. Keep Yarn's `node-modules` linker enabled.
- PureStack dependencies use `latest`; installation resolves current releases and
  the lockfile records their exact versions. Preserve the lockfile for repeatable installs.

## Customization rules

Follow `skills/purestack-development/SKILL.md` for every change to pages,
components, styling, themes, layouts, and browser behavior. The rules below add
what is specific to this site.

Routes follow filenames: `about.mdx` becomes `/about/` and `index.mdx` becomes
`/`. Pages support frontmatter such as `title`, `description`, `template`, and
`nav.order`. Both `.mdx` and `.rmdx` use PureStack's Regor MDX pipeline; use
PureStack components and supported markup, rather than assuming React semantics.

Keep imports on published package APIs. Declare every directly imported package
in this project's package.json. Do not refer to a PureStack monorepo checkout or
introduce workspace dependencies. Browser behavior belongs in a TypeScript file
loaded through `RegorApp` or `PageScript`; register shared components through the
site plugin. Keep `.mdx` for pages with frontmatter, imports, or scripts.
Colocate page-specific code with its page; keep shared code under
`content/modules/`.

Before changing content, establish the owner's purpose, audience, tone, and real
facts. Ask for missing information. Replace prompts with useful content; do not
add invented testimonials, customer counts, prices, or achievements. Update links
when removing starter pages. Keep the home page focused on a clear message and
next action. Support both themes, keyboard interaction, and small screens.

After changes, run the build and inspect affected routes in the preview. Before
deployment, verify page titles, descriptions, navigation, links, and release
output. Consult <https://purestack.studio/guides/> for APIs; verify component
properties and icon names before using them.
