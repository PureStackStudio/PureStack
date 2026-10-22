# My PureStack site

Use Node.js 22.12+ (22 LTS), 24 LTS, or 26+ and Yarn 4.18.1, pinned in
`package.json`. When dependency installation is selected in Studio or with
`--install`, the CLI installs missing Corepack, enables Yarn, and prepares the
project-pinned Yarn version automatically. If you skipped installation, follow
<https://yarnpkg.com/getting-started/install> if Yarn is not already available.

Run `yarn install` if dependencies were not installed during creation, then
`yarn dev`. Open the address printed by the server. Edit
`content/modules/content/landing.ts` to change your home page copy; the preview reloads as you work.

## Customize

- Start with the headline, introduction, and primary button in `content/modules/content/landing.ts`.
- `content/index.mdx` composes the landing page. Its focused components live under
  `content/modules/components/landing/`, grouped into hero and foundation features.
- Replace the prompts in `content/about.mdx` with your own facts and story.
- Set your title, logo, and palette in `content/siteConfig.json`. The default is
  orange; `blue`, `mint`, `green`, `pink`, and `red` also work in light and dark.
- Set `favicon` in `content/siteConfig.json` to a verified PureStack icon name.
- Edit `content/header.mdx` for header navigation. The shared footer is composed in
  `content/footer.mdx`; its brand, navigation, and guide card components live under
  `content/modules/components/shell/footer/`.
- Add `.mdx` pages under `content/` to create routes. Use `.md` for plain prose
  without frontmatter. Keep code and scripts beside their MDX page; the checklist
  at `content/guide/checklist/` shows this structure.
- Refine colors, typography, and corners in `content/modules/theme/palette.ts`.
  This skin customizes PureStack's standard palette rather than replacing it.
- Keep custom fluent style rules in `content/modules/styles/`. Prefer native
  components and generated utilities for ordinary layout and spacing.
- Register additional plugins in `content/purestack.config.ts`.

Open `/guide/` for a file map and customization examples, and `/guide/checklist/`
for the small interactive Regor app. The checklist is a reminder for the current
visit; it does not automatically verify or change your files. Its component is
`content/guide/checklist/checklist-component.ts`.

The home page, About page, shared header, and footer contain deliberate starter
copy. Replace it with your own content before launch. Remove the guide and
checklist if they are no longer useful, updating links to them at the same time.
Keep real claims and destinations; do not invent testimonials or statistics.

Run `yarn build` to generate `dist/dev`. Run `yarn publish` to create
a clean, minified release in `dist/publish`. These commands write local files;
deploy the release folder with your static hosting provider.

## Tests and code quality

- `yarn test`: run app tests in watch mode with Vitest, powered by Vite.
- `yarn test:ci`: run tests once, suitable for CI.
- `yarn lint`: check code with Biome's linter.
- `yarn format`: format supported source files with Biome.
- `yarn check`: check lint, formatting, and import organization together.
- `yarn check:fix`: apply Biome's safe fixes and formatting.

Add automated app tests under `tests/` as `*.test.ts`. The checklist example
tests checkbox interaction, computed progress, completion, and reset in
PureStack's DOM utilities without a browser server.
Keep tests outside `content/` so they are not published as site assets. PureStack
still builds and serves the site; Vite is used by Vitest for tests only.

The CLI creates an empty `yarn.lock` so this site is independent even when created
inside another Yarn workspace. `yarn install` fills it with dependency resolutions;
commit the resulting lockfile. The project uses Yarn's `node-modules` linker.
Biome checks supported code and JSON; edit MDX content separately.

PureStack dependencies use `latest` to fetch current releases during installation.
The lockfile records the exact versions used by your project.

Read `AGENTS.md` before making automated changes. Framework documentation:
<https://purestack.studio/guides/>.
