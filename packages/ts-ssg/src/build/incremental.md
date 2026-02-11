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

1. `createIncrementalBuilder` resolves config, navigation config, and initial
   navigation tree.
2. It loads the existing manifest, keeping it only if compatible with current
   config (`isCompatibleManifest`); otherwise it starts from
   `createEmptyManifest`.
3. It returns `{ buildAll, applyChange }` for the caller to use in dev servers
   or watch mode.

## `buildAll(reason)`

This is the canonical full build path:

- Resolves user hooks from `input.hooks`.
- Prepares output directory and copies static assets.
- Discovers content and rebuilds navigation.
- Renders all pages with configured concurrency.
- Writes styles and captures style outputs/signature.
- Discovers assets to build an authoritative manifest snapshot.
- Writes the manifest to disk with `writeManifest`.
- Emits `onBuildComplete` with the final result (including content/asset counts)
  after manifest state is refreshed.

The output is deterministic with `generatedAt` being the only volatile field.

## `applyChange(filePath)`

Handles a single filesystem change event. It is structured as a fast path with
early exits:

1. **Ignore changes outside `contentDir`**: relative path starting with `..`.
2. **Config file change**: if `isSiteConfigFile` ➜ mark `fullRebuild = true`.
3. **Missing file (deletion)**:
   - If a content entry exists and navigation is enabled ➜ rebuild navigation
     for the affected subtree, update manifest, return.
   - Otherwise delete the output(s), remove manifest entries, update counters.
4. **Content change**:
   - If the file is content (or was previously treated as content):
     - No signature change ➜ no-op.
     - With navigation enabled ➜ rebuild navigation subtree.
     - Otherwise rebuild the single page and update its manifest entry.
5. **Asset change**:
   - If signature unchanged ➜ no-op.
   - Otherwise copy static asset, update manifest entry.

The intent is to keep work proportional to the change while preserving
navigation correctness when navigation is derived from content.

## Navigation-sensitive rebuilds

When navigation is enabled, a single content change can affect:

- The changed page.
- Its ancestor folders (navigation nodes).
- Any siblings within the affected folder scope.

`rebuildNavigationForChange` therefore:

1. Re-discovers content and rebuilds the full navigation tree.
2. Computes affected folders up to `navigationConfig.maxDepth`.
3. Rebuilds all pages in those folders.
4. Deletes pages in those folders that no longer exist.

This favors correctness over minimal work whenever navigation structure is
content-derived.

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

- `normalizeConcurrency` and `runWithConcurrency` keep full builds parallel but
  bounded.
- `collectAffectedFolders` computes folder scopes based on
  `navigationConfig.maxDepth` to decide what pages must be rebuilt.
- `readSignature` + `signatureEqual` provide the cheap change detector for both
  content and assets.

## Extension points

If you add new build outputs or config that affect correctness:

- Extend `BuildManifest` and `manifestConfigFromSiteConfig`.
- Update `isCompatibleManifest` and bump `MANIFEST_VERSION`.
- Consider how `applyChange` should classify and process the new file type.
