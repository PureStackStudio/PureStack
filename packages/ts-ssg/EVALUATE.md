# Technical Evaluation: @purestack/ts-ssg

This document evaluates the current technical architecture, strengths, and limitations
of the `@purestack/ts-ssg` package based on the implementation in `src/`.

## Architecture overview
- **Pipeline**: `buildSite()` discovers content, builds each page, then writes CSS.
- **Content model**: Minimal (`ContentFile` with `absPath`, `relPath`, `ext`).
- **Rendering**: Markdown/MDX is compiled to HTML, then fed through Regor component
  rendering, then wrapped in a basic HTML shell.
- **Styling**: CSS is generated via `@purestack/ts-css` and emitted as static files.
- **Runtime**: Server-side DOM emulation via LinkeDOM to support Regor rendering.

## Technical strengths
- **Clear, linear build pipeline**: The flow is easy to follow and easy to extend
  with additional steps (assets, nav, TOC, sitemap).
- **Safe defaults**: `resolveConfig()` provides sensible paths and output structure,
  enabling zero-config execution.
- **Deterministic output paths**: The out-path algorithm yields stable, nested
  `index.html` routes, making clean URLs possible.
- **Component rendering at build time**: Regor runs in LinkeDOM, enabling reusable
  UI components without client-side runtime.
- **Decent separation of concerns**: content discovery, frontmatter parsing,
  MDX compilation, HTML shell rendering, and IO are reasonably isolated.

## Technical risks and limitations
- **Global DOM mutation**: `registerDomGlobals()` writes to `globalThis` and is also
  invoked at module load time. This can create side effects for consumers or tests
  running in the same process, especially if multiple DOM shims or different renderers
  are used. It also complicates parallel builds.
- **No teardown for globals**: A cleanup function is returned but not used in `renderApp()`,
  so globals persist beyond a single render.
- **MDX import/export stripping**: `stripMdxImports()` removes `import`/`export` lines,
  which prevents runtime MDX module semantics and may be surprising for users expecting
  component imports inside MDX. This also drops any non-component exports (metadata, constants).
- **Component availability is implicit**: There is no per-page or per-doc component
  registry; all components must be registered globally before rendering.
- **HTML safety**: `allowDangerousHtml: true` is enabled for remark/rehype, which means
  raw HTML and MDX can inject arbitrary markup. There is no sanitization layer.
- **Frontmatter handling is shallow**: `resolveHeadConfig()` only extracts title,
  description, and optionally merges a `head` object. Other metadata (canonical, OG,
  theme, etc.) requires manual frontmatter shaping.
- **No incremental build**: The pipeline renders all pages each run and does not
  cache ASTs or compiled results.
- **Limited content modeling**: The lack of a richer content schema makes it harder
  to implement collections, navigation, or sidebar ordering without additional passes.
- **CSS emission order**: `writeStyles()` emits one file per builder name, but it does
  not enforce deterministic ordering beyond set iteration. If style builders are
  created in non-deterministic order, CSS output order can vary.

## Component rendering details
- `compileMdxToHtml()` converts MDX to HTML, then `renderApp()` parses the HTML into a DOM,
  mounts Regor components on `document.body`, and serializes the DOM back to HTML.
- Root-level MDX JSX nodes are converted to raw HTML via `processMdxComponent()`, which
  currently acts as a passthrough.
- If a component is not registered, Regor behavior depends on its default behavior;
  there is no explicit error handling for missing components.

## File system and IO behavior
- `discoverContent()` walks the directory recursively using `fs.readdir` with
  `withFileTypes`, filtering to `.md` and `.mdx`.
- Output writes rely on `ensureDir()` to create parent directories before write.
- Output paths support clean URLs by nesting non-index pages under a folder containing
  `index.html`.

## Test coverage
- Tests exist only for `compileMdxToHtml()` and focus on JSX handling.
- No tests validate the build pipeline end-to-end, output paths, frontmatter behavior,
  or CSS emission.
- No tests cover linkedom globals or potential cross-test contamination.

## Performance considerations
- Parsing and rendering are done per file, with no shared AST or cache.
- LinkeDOM parsing and Regor rendering run for each page, which is likely the main cost.
- There is no concurrency; `buildSite()` is fully sequential.

## Extensibility
Good starting points for extension:
- `buildSite()` could accept hooks before/after page render and after styles.
- `build/page.ts` could accept a renderer override to swap HTML shell or theme.
- `mdx.ts` already defines hooks for JSX handling and could be extended with plugins.

## Security considerations
- HTML is rendered with `allowDangerousHtml`; if user-supplied content is not trusted,
  output could include script or unsafe elements.
- There is no content sanitization or escaping beyond Markdown/MDX parsing.

## Recommended next steps
1. Add optional teardown for DOM globals in `renderApp()` to reduce process-wide side effects.
2. Provide an explicit component registration API tied to a build config or per-page context.
3. Introduce a content model layer (collections, ordering, metadata normalization).
4. Consider a sanitizer or "safe HTML" mode for untrusted content.
5. Add end-to-end tests for build output, out-paths, and style emission.
6. Add a minimal caching or parallelization option for large content sets.
