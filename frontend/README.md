# purestack.studio

The PureStack launch site, built with PureStack's SSG, MDX, typed HTML/CSS
builders, components, and Regor.

## Develop

From the repository root:

```sh
yarn frontend
```

Open **http://127.0.0.1:4700**. The content watcher updates MDX, CSS, and browser
TypeScript; the process watcher reloads changes to the site runner/template.

```sh
yarn frontend:build
yarn frontend:publish
```

- `frontend:build` writes `frontend/out/purestack.studio/web-dev`.
- `frontend:publish` creates a clean, minified production artifact in
  `frontend/out/purestack.studio/web`. This is a local build, not a deployment.
- Serve the production folder as a static website at `https://purestack.studio`.
- Use the site runner rather than invoking the generic CLI directly: the runner
  registers the site's custom `studio` template and typed preview stylesheet.

## Source map

| File | Purpose |
| --- | --- |
| `studio.ts` | Build/dev entry point and semantic HTML document template |
| `demoStyle.ts` | Typed CSS for the real Style API workbench preview |
| `purestack.studio/index.mdx` | Landing page, source examples, and static component previews |
| `purestack.studio/header.mdx`, `footer.mdx` | Shared navigation and footer |
| `purestack.studio/studio.ts` | Tabs, clipboard feedback, mobile menu, and live Regor counter |
| `purestack.studio/assets/studio.css` | Responsive dark visual design |
| `purestack.studio/siteConfig.json` | SEO, social preview, assets, and output paths |
| `designs/social-preview.svg` | Editable source for the 1200×630 social preview PNG |
| `designs/newspaper.mdx` | Preserved earlier design, outside published content |

The page deliberately describes the framework as pre-release and uses the
repository workflow instead of assuming an npm release already exists. Update
the release announcement, quick start, and availability FAQ when publishing.
GitHub links target `PureStackStudio/PureStack` and the `main` branch.

## Validation

```sh
yarn tsgo -p frontend/tsconfig.json --noEmit
```

Browser verification covered all workbench tabs, arrow/Home/End keys, counter
state, all copy controls and denied clipboard access, mobile menu and FAQ,
320–1920px widths, no-JavaScript rendering with a light system preference,
internal anchors, metadata, and WCAG A/AA automated checks. Browser tooling and
screenshots are under the ignored `.tmp` directory; they are not shipped.

No generated page-script embeds need regeneration for this site.
