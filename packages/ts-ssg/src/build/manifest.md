<!--
  This document explains manifest.ts for maintainers.
  Keep it close to the implementation to reduce drift.
-->

# Build manifest (manifest.ts)

## Purpose

`manifest.ts` defines the build manifest contract and the I/O helpers that
persist it under the output directory. The manifest acts as the build system's
memory: it records what was generated, when, and which inputs/config produced
those outputs so subsequent runs can decide what is still valid.

## Where it lives

The manifest is written to:

```
{outDir}/.ts-ssg/manifest.json
```

The path is derived by `manifestPath(outDir)` using:

- `MANIFEST_DIRNAME = ".ts-ssg"`
- `MANIFEST_FILENAME = "manifest.json"`

This keeps the file colocated with the build output while isolating it from
static assets.

## Data model

`BuildManifest` is a normalized snapshot:

- `version`: schema version (`MANIFEST_VERSION`, currently `1`).
- `generatedAt`: epoch millis updated on every write.
- `config`: the build-relevant subset of `SiteConfig`.
- `content`: map of content source key ➜ `ContentManifestEntry`.
- `assets`: map of asset source key ➜ `AssetManifestEntry`.
- `styles`: `StylesManifestEntry` with a stable `signature` and output files.

### File signatures

`FileSignature` (`mtimeMs`, `size`) is a minimal, cheap change detector that
avoids hashing file contents. `signatureEqual` is the canonical comparator used
by build logic to decide if a file needs to be reprocessed.

### Config snapshot

`ManifestConfig` is intentionally limited to settings that affect output
correctness:

- `contentDir`, `outDir`, `siteTitle`
- `style.fileName`, `style.href`, `style.themes`, `style.pretty`

This means unrelated config changes do not invalidate the manifest.

## Key functions and their roles

### `manifestConfigFromSiteConfig(config)`

Creates the exact config snapshot stored in the manifest. This is the single
source of truth for what configuration dimensions are considered part of build
compatibility.

### `createEmptyManifest(config)`

Used to bootstrap a build when no manifest exists. It stamps the schema version,
captures the config snapshot, and initializes empty maps for content and assets.

### `isCompatibleManifest(manifest, config)`

Guards incremental builds. It returns `false` when:

- the manifest version differs from `MANIFEST_VERSION`, or
- any of the config fields in the snapshot differ, or
- the shape of `style.themes` is not an array or differs by value order.

This function is the compatibility gate that forces a full rebuild when the
output would be incorrect.

### `readManifest(outDir)`

Loads `{outDir}/.ts-ssg/manifest.json` and performs lightweight shape checks. It
returns:

- `BuildManifest` when the JSON parses and has the expected object shape.
- `null` when the file does not exist (`ENOENT`) or fails basic validation.

Errors other than `ENOENT` are rethrown to surface I/O or corruption problems.

### `writeManifest(outDir, manifest)`

Ensures the parent directory exists via `ensureDir`, refreshes `generatedAt`,
then writes a pretty-printed JSON file. Call this after a successful build to
persist the latest snapshot.

### `readSignature(absPath)`

Reads the on-disk file stat and returns `FileSignature` when the path is a file.
Returns `null` when the file is missing or is not a file. This allows the build
pipeline to compare current disk state with the manifest.

## Implementation usage patterns

Typical build flow (conceptual):

1. `readManifest(outDir)`
2. If `null`, call `createEmptyManifest(config)` and perform a full build.
3. If present, call `isCompatibleManifest(manifest, config)`:
   - `false` ➜ discard and rebuild from scratch.
   - `true` ➜ use `signatureEqual` and `readSignature` to detect which inputs
     changed and regenerate only those outputs.
4. Update `content`, `assets`, and `styles` entries as outputs are produced.
5. `writeManifest(outDir, nextManifest)`

The manifest is intentionally immutable at rest (JSON), and the code encourages
deterministic regeneration from source + config, with `generatedAt` being the
only volatile field.

## Extension points

If you add build features that affect output validity, extend:

- `ManifestConfig` and `manifestConfigFromSiteConfig`
- `isCompatibleManifest` checks
- `BuildManifest` fields (prefer version bump when changing schema)

Changing the schema should be accompanied by `MANIFEST_VERSION` bump and
migration strategy (or a forced rebuild if migration is not needed).
