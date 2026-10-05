# @purestack/ts-render

Server-side rendering for PureStack's Regor components. `renderApp` takes HTML,
a component set, and a `TsSsgContext`, and resolves to the rendered HTML with
any required component scripts attached.

Each render gets a document of its own. With an async DOM scope installed, as
the site builder does, renders can run at the same time; see `useDomScope` in
`@purestack/ts-minidom`.

`onRendered(document)` runs on the rendered document before it becomes HTML.
It may be async, and the document stays that render's own while it runs.

`componentRegistry` lets custom build pipelines register components by name.
The components passed to `renderApp` apply on top of them, for that render only.
The site generator uses this package to turn page markup into static output.
