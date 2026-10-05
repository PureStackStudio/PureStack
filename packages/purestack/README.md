# PureStack

Build a static site from Markdown, MDX, and TypeScript. PureStack provides a CLI
for local development and release builds, plus a TypeScript API for custom build
workflows.

Pages become routes based on their filenames. PureStack renders the HTML,
generates theme styles, copies assets, and bundles browser-side TypeScript when
a page needs it.

## Build your first site

Create a Node project and install PureStack:

```sh
mkdir my-site
cd my-site
npm init -y
npm install purestack
mkdir content
```

Add `content/siteConfig.json`:

```json
{
  "siteTitle": "My Site",
  "logo": { "brand": "My Site", "href": "/" },
  "outDir": "../dist/site",
  "publishDir": "../dist/publish"
}
```

Add `content/index.mdx`:

```mdx
---
title: Welcome
description: My first PureStack site.
template: doc
---

# Welcome

This page is written in MDX and served by PureStack.

<Panel tone="info" variant="surface">
  <p>Edit this file and see the page update.</p>
</Panel>
```

Start the development server:

```sh
npx purestack serve --content ./content --host 127.0.0.1 --port 5000
```

Open <http://127.0.0.1:5000/>. The server watches the content directory and
reloads the page when you edit it.

The two files above are enough for a working site. Add `content/about.mdx` for
an `/about/` route, or `content/guides/install.mdx` for `/guides/install/`.
Images and other static files inside `content` are copied to the output with
their relative paths intact.

## Add browser behavior

Pages can load a local TypeScript file with `PageScript`. Add this to
`content/index.mdx`:

```mdx
<button id="hello-button" type="button">Say hello</button>
<output id="hello-output" aria-live="polite"></output>

<PageScript src="./hello.ts" />
```

Then create `content/hello.ts`:

```ts
const button = document.querySelector<HTMLButtonElement>('#hello-button')
const output = document.querySelector<HTMLOutputElement>('#hello-output')

button?.addEventListener('click', () => {
  if (output) output.textContent = 'Hello from TypeScript!'
})
```

PureStack bundles the script and serves it with the generated page. The same
content directory can contain ordinary Markdown (`.md`), MDX (`.mdx`), and
Regor MDX (`.rmdx`) pages. MDX pages can also use PureStack's built-in
components, as the `Panel` example above does.

## Build and publish

Run these commands from the project root:

| Command | Result |
| --- | --- |
| `npx purestack serve --content ./content` | Build, serve, watch, and reload locally. Default port: `4173`. |
| `npx purestack build --content ./content` | Write the static site to `outDir` (`dist/site` in the example). |
| `npx purestack publish --content ./content` | Clean and build a minified release artifact in `publishDir` (`dist/publish` in the example). |

`publish` prepares files for a static host; it does not upload them. Use
`--clean` with `build` or `serve` to clear the output directory before a build.
Use `--host` and `--port` with `serve` to choose its address. Every command
needs `--content` pointing to a directory with `siteConfig.json`.

For the full option list, run `npx purestack --help`.

## Add plugins

Plugins add a site's own skins, components, templates, generated pages, and
build steps. List them in `content/purestack.config.ts`; every command loads it,
and `serve` reloads it when it or a file it imports changes:

```ts
import { defineConfig, definePlugin } from 'purestack'

const releaseNotes = definePlugin({
  name: 'release-notes',
  pages: () => [{ path: 'releases.mdx', source: '# Releases' }],
})

export default defineConfig({ plugins: [releaseNotes] })
```

The [Plugins guide](https://purestack.studio/guides/extending/plugins/) covers each kind
of extension.

## TypeScript API

The package also re-exports the `@purestack/ts-ssg` API. For example, a custom
build script can run the same pipeline as the CLI:

```ts
import path from 'node:path'
import { buildSite } from 'purestack'

const result = await buildSite({
  siteConfig: { contentDir: path.resolve('content') },
})

console.log(`Built ${result.pages} pages in ${result.outDir}`)
```

`startDevServer` is available too. Neither function looks for
`purestack.config.ts`; pass plugins through `options.plugins`.

## Learn more

- [CLI guide](https://purestack.studio/guides/getting-started/purestack-cli/)
- [Site configuration](https://purestack.studio/guides/getting-started/site-config/)
- [Regor MDX guide](https://purestack.studio/guides/extending/regor/)
- [Plugins guide](https://purestack.studio/guides/extending/plugins/)
- [Working sample site](https://github.com/PureStackStudio/PureStack/tree/main/packages/ts-ssg/sample-content)

MIT licensed. Source and issues: [PureStack on GitHub](https://github.com/PureStackStudio/PureStack).
