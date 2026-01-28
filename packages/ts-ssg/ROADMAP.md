# ts-ssg Roadmap

This roadmap is staged to build a minimal but extensible SSG with MD/MDX support and a PureStack-based rendering pipeline.

## Phase 0: Alignment (now)
- [x] Draft architecture and roadmap.
- [ ] Decide on config file name and default content root.
- [ ] Confirm MDX compiler choice and bridging strategy to PureStack nodes.

## Phase 1: Foundations
- [ ] Create `config/` loader with validated schema.
- [ ] Implement content discovery and frontmatter parsing.
- [ ] Define content model types: `ContentEntry`, `Collection`, `Route`.
- [ ] Build a minimal renderer that writes HTML for a single page.

## Phase 2: Markdown Rendering
- [ ] Integrate Markdown parser (remark/rehype).
- [ ] Render Markdown into PureStack nodes or HTML fragments.
- [ ] Implement basic layouts: `doc` and `splash`.
- [ ] Add a basic theme shell (header, footer, nav).

## Phase 3: MDX Support
- [ ] Integrate MDX compiler.
- [ ] Build adapter to PureStack HTML nodes.
- [ ] Support MDX component imports in content.
- [ ] Validate sample content rendering end-to-end.

## Phase 4: Navigation + Sidebar
- [ ] Build sidebar tree from frontmatter and file structure.
- [ ] Implement breadcrumbs and prev/next.
- [ ] Add auto-generated TOC for headings.

## Phase 5: Build System
- [ ] Output directory structure with clean/write.
- [ ] Asset copying and URL handling.
- [ ] Emit sitemap and RSS (optional flag).
- [ ] Emit search index JSON (basic).

## Phase 6: Dev Experience
- [ ] `dev` server with file watch and partial rebuild.
- [ ] CLI progress reporting and errors.
- [ ] `preview` server for built output.

## Phase 7: Extensibility
- [ ] Plugin hooks for build pipeline stages.
- [ ] Theme package interface and starter theme.
- [ ] Content collections API for multiple doc sets.

## Immediate Next Steps (suggested)
- Finalize config shape and minimal content model.
- Prototype MD -> HTML rendering using PureStack nodes.
- Render `packages/ts-ssg/sample-content/index.mdx` with a basic layout.

