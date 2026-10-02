# @purestack/ts-render

Server-side rendering for PureStack's Regor components. `renderApp` takes HTML,
a component set, and a `TsSsgContext`, then returns rendered HTML with any
required component scripts attached.

`componentRegistry` lets custom build pipelines register components by name.
The site generator uses this package to turn page markup into static output.
