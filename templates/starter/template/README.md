# My PureStack site

Use Node.js 22.12+ (22 LTS), 24 LTS, or 26+ and Yarn 4.18.1, pinned in
`package.json`. When dependency installation is selected in Studio or with
`--install`, the CLI installs missing Corepack, enables Yarn, and prepares the
project-pinned Yarn version automatically. If you skipped installation, follow
<https://yarnpkg.com/getting-started/install> if Yarn is not already available.

Run `yarn install` if dependencies were not installed during creation, then
`yarn dev`. Open the address printed by the server. Edit
`content/index.mdx` to change your home page; the preview reloads as you work.

## Customize

- Set your title and brand in `content/siteConfig.json`.
- Add `.md`, `.mdx`, or `.rmdx` files under `content/` to create routes.
- Edit `content/about.mdx` for your about page.
- `content/hello.ts` demonstrates browser behavior loaded with `PageScript`.
- Add plugins to `content/purestack.config.ts` for custom components and themes.

Run `yarn build` to generate `dist/site`. Run `yarn publish` to create
a clean, minified release in `dist/publish`. These commands write local files;
deploy the release folder with your static hosting provider.

## Tests and code quality

- `yarn test`: run app tests in watch mode with Vitest, powered by Vite.
- `yarn test:ci`: run tests once, suitable for CI.
- `yarn lint`: check code with Biome's linter.
- `yarn format`: format supported source files with Biome.
- `yarn check`: check lint, formatting, and import organization together.
- `yarn check:fix`: apply Biome's safe fixes and formatting.

Add automated app tests under `tests/` as `*.test.ts`. The greeting example
tests the browser entry in PureStack's DOM utilities without a browser server.
Keep tests outside `content/` so they are not published as site assets. PureStack
still builds and serves the site; Vite is used by Vitest for tests only.

The CLI creates an empty `yarn.lock` so this site is independent even when created
inside another Yarn workspace. `yarn install` fills it with dependency resolutions;
commit the resulting lockfile. The project uses Yarn's `node-modules` linker.
Biome checks supported code and JSON; edit MDX content separately.

Read `AGENTS.md` before making automated changes. Framework documentation:
<https://purestack.studio/guides/>.
