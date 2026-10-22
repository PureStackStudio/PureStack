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
- `content/purestack.config.ts`: site plugins for components, styles, and templates.
- `content/hello.ts`: browser code loaded with `<PageScript src="./hello.ts" />`.
- `tests/`: Vitest app tests; keep tests outside the published content directory.
- `vitest.config.ts`: Vite-powered test configuration, not the site server.
- `biome.json`: code quality, formatting, and import organization.
- Other files in `content/`, including images, are copied as public assets.
- `dist/` and `node_modules/` are generated. Change source instead of output.
- Commit `yarn.lock` after installing. Keep Yarn's `node-modules` linker enabled.

## Customization rules

Routes follow filenames: `about.mdx` becomes `/about/` and `index.mdx` becomes
`/`. Pages support frontmatter such as `title`, `description`, `template`, and
`nav.order`. Both `.mdx` and `.rmdx` use PureStack's Regor MDX pipeline; use
PureStack components and supported markup, rather than assuming React semantics.

Keep imports on published package APIs. Declare every directly imported package
in this project's package.json. Do not refer to a PureStack monorepo checkout or
introduce workspace dependencies. Browser behavior belongs in a TypeScript file
loaded through `PageScript`; register shared components through a site plugin.

After changes, run the build and inspect affected routes in the preview. Before
deployment, verify page titles, descriptions, navigation, links, and release
output. Consult <https://purestack.studio/guides/> for APIs; verify component
properties and icon names before using them.
