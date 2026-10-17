# @purestack/ts-render

Server-side rendering for PureStack's Regor components. `renderApp` takes HTML,
a component set, and a `PageContext`, and resolves to the rendered HTML.

Each render gets a document of its own. With an async DOM scope installed, as
the site builder does, renders can run at the same time; see `useDomScope` in
`@purestack/ts-minidom`.

`onRendered(document, runtimeEmbeds)` runs on the rendered document before it becomes HTML.
It may be async, and the document stays that render's own while it runs.

`componentRegistry` lets custom build pipelines register components by name.
The components passed to `renderApp` apply on top of them, for that render only.
The site generator uses this package to turn page markup into static output.

The renderer records runtime requests without choosing or injecting scripts. In
standalone rendering, attach the runtimes supplied by `ts-page-scripts`:

```ts
import type { PageContext } from '@purestack/ts-common'
import { appendRuntimeScripts } from '@purestack/ts-page-scripts'
import { renderApp } from '@purestack/ts-render'

export function renderStandalone(html: string, components: object, context: PageContext) {
  return renderApp(html, {
    components,
    context,
    onRendered: (document, runtimeEmbeds) =>
      appendRuntimeScripts(document, runtimeEmbeds, context.pageInfo.frontmatter.embed),
  })
}
```

The SSG's default page scripts plugin performs this step through its existing
document hook before site-defined document hooks run.
