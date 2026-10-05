<!--
  This document explains incremental.ts for maintainers.
  Keep it close to the implementation to reduce drift.
-->

# Incremental build engine (incremental.ts)

## Purpose

`incremental.ts` provides the incremental build engine for `ts-ssg`. It owns:

- The incremental builder API (`createIncrementalBuilder`).
- The file-change application logic (`applyChange`).
- Full rebuild orchestration (`buildAll`).
- Manifest refresh and style signature computation.

The module is intentionally self-contained so the build system has one place to
reason about “what changed?” vs “what must be rebuilt?”.

## Key types

- `IncrementalBuildResult`: describes what happened for a single change
  (full rebuild flag, counts for changed/deleted pages/assets, and a reason).
- `IncrementalBuilder`: exposes `buildAll` (full rebuild) and `applyChange`
  (single-file incremental change).

## Lifecycle overview

1. `createIncrementalBuilder` resolves the config, plugins, and build context.
   It reads no content: discovery, page generation, navigation, and headers
   and footers are prepared once, by `prepareContent` (see below).
2. It loads the existing manifest, keeping it only if compatible with current
   config (`isCompatibleManifest`); otherwise it starts from
   `createEmptyManifest`.
3. It returns `{ buildAll, applyChange, renderIfDirtyByOutPath,
   renderByUrlPath }` for the caller to use in dev servers or watch mode.

The content is prepared once per full build. `buildAll` prepares it as part of
the build. `applyChange` and the two render calls first await
`ensureContentReady`: they wait for a build that is preparing, or, when no build
has run, as when resuming from an earlier build's manifest, prepare the content
from the manifest themselves. A failed preparation is tried again by the next
call.

## `buildAll(reason)`

This is the canonical full build path:

- Resolves user hooks from `input.hooks`.
- Prepares output directory and copies static assets.
- Discovers content, runs page generators, and rebuilds navigation, once
  (`prepareContent`). Discovered pages join the URL index right away, so a
  request during the build finds a new page.
- Renders all pages sequentially.
- Writes styles and captures style outputs/signature.
- Discovers assets to build an authoritative manifest snapshot.
- Writes the manifest to disk with `writeManifest`.
- Emits `onBuildComplete` with the final result (including content/asset counts)
  after manifest state is refreshed.

The output is deterministic with `generatedAt` being the only volatile field.

## `applyChange(filePath)`

Handles a single filesystem change event. The changed page renders right
away; other affected pages are marked dirty and render on their next request
(`renderIfDirtyByOutPath`). `IncrementalBuildResult.markedPages` counts them,
so the dev server can reload the browser.

1. **Ignore changes outside `contentDir`**: relative path starting with `..`.
2. **`siteConfig.json`** ➜ `fullRebuild = true`. Config shapes every output.
3. **Header or footer partial** (edit, add, or delete) ➜ compile the partials
   again and mark only the pages whose nearest header or footer HTML changed.
4. **`_nav.json`** ➜ rebuild navigation; mark every page only if it changed.
5. **Content change**: no signature change ➜ no-op. Otherwise render the page,
   refresh the content index and navigation, and mark pages as below.
6. **Content deletion**: remove the output and manifest entry, then refresh.
7. **Asset change**: copy the asset and update its manifest entry. A `.ts`
   change rebuilds the script bundles that import it.

## What marks other pages

- **Navigation changed** ➜ every page, since every page shows navigation.
  Navigation is compared as data, so an edit that leaves titles, order, and
  structure alone marks nothing.
- **A page or asset was added or removed** ➜ every page, since any content URL
  may now resolve differently or fail.
- **A header or footer changed** ➜ the pages that show it.
- **A script bundle's hashed name changed** ➜ the pages that load it, rendered
  right away.

## Generated pages

Plugin `pages` generators run inside `discoverSiteContent`, so every discovery,
full or incremental, sees the same content list. A generated page is a
`ContentFile` whose `source` is its text, or a function that returns it; its
`absPath` names no file. `readContentSource` reads either, or a real file.

- `readContentSignature` signs a generated page by its source size (0 for a
  source function) and the time it was generated, so the manifest keeps an
  entry and an `outPath` for it like any page. No file event names a generated
  page, so nothing compares it.
- `refreshContent` regenerates pages. A page whose source text changed, or
  whose source is a function, is marked dirty, and a page no longer generated
  loses its output and manifest entry.
- An asset change calls `refreshGeneratedPages`, since generators may read data
  files. It does nothing when no plugin generates pages.

## Manifest assembly

`buildManifest` composes a fresh `BuildManifest` from:

- Current signatures for content files (`resolveOutPath`).
- Current signatures for assets (`resolveStaticOutPath`).
- A styles signature, computed via `computeStylesSignature`.

This is used after full builds to ensure the manifest reflects the actual disk
state.

## Styles signature

`computeStylesSignature`:

- Orders themes deterministically (`orderThemes`).
- Ensures themes are registered (`styleBuilder.ensureThemes`).
- Reads each generated CSS file, hashes contents (SHA-256), and records outputs.

This signature is part of the manifest to detect whether style outputs changed,
even when the build inputs are the same.

## Utilities and decisions

- `collectAffectedFolders` computes folder scopes based on
  `navigationConfig.maxDepth` to decide what pages must be rebuilt.
- `readSignature` + `signatureEqual` provide the cheap change detector for both
  content and assets.

## Extension points

If you add new build outputs or config that affect correctness:

- Extend `BuildManifest` and `manifestConfigFromSiteConfig`.
- Update `isCompatibleManifest` and bump `MANIFEST_VERSION`.
- Consider how `applyChange` should classify and process the new file type.
