# Bugs and issues: incremental.ts + manifest.ts

## High/Medium impact

1) **Hard-coded manifest version in incremental builds**
- **Where:** `packages/ts-ssg/src/build/incremental.ts:397`
- **What:** `buildManifest` returns `version: 1` instead of `MANIFEST_VERSION`.
- **Why it matters:** When `MANIFEST_VERSION` is bumped, full builds will still
  write `1`, causing `isCompatibleManifest` to fail every time and forcing
  repeated rebuilds (or mismatching schema expectations).
- **Fix:** Use `MANIFEST_VERSION` from `manifest.ts`.

2) **Signature-based change detection can miss rapid edits**
- **Where:** `packages/ts-ssg/src/build/manifest.ts:124-143`
- **What:** `signatureEqual` relies only on `mtimeMs` and `size`.
- **Why it matters:** On file systems with coarse mtime resolution (common on
  Windows network drives, some filesystems, or very fast consecutive saves),
  content changes can occur without a detectable `mtimeMs` or size change,
  causing `applyChange` to no-op when it should rebuild.
- **Fix:** Consider adding a content hash for small files, or a monotonic build
  counter stored per file in the manifest.

## Low impact / robustness

3) **Manifest config stores a live array reference**
- **Where:** `packages/ts-ssg/src/build/manifest.ts:55-63`
- **What:** `styleThemes` is stored by reference from `SiteConfig`.
- **Why it matters:** If caller code mutates `config.styleThemes` after manifest
  creation, `manifest.config.styleThemes` mutates too. This can make
  `isCompatibleManifest` report “compatible” even though output expectations
  changed.
- **Fix:** Store a defensive copy (`styleThemes: [...config.styleThemes]`).

4) **Manifest validation is too shallow for corrupted files**
- **Where:** `packages/ts-ssg/src/build/manifest.ts:94-106`
- **What:** `readManifest` only checks for object presence, not field types.
- **Why it matters:** A corrupted or partially-written manifest (e.g., by a
  crash) can pass the current checks but later cause undefined behavior or
  skipped rebuilds.
- **Fix:** Validate required fields (`version`, `config`, `content`, `assets`,
  `styles`) and basic types before accepting.
