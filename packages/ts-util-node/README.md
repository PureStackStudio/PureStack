# @purestack/ts-util-node

Caching and file path helpers for PureStack's Node.js build tools. `ensureDir(filePath)`
creates the parent directory for a file, and `replaceExt(filePath, newExt)`
returns the path with a different extension.

Use this package in build scripts and other Node.js code. Browser-safe helpers
live in `@purestack/ts-util`.

## Persistent build cache

`PersistentCache<T>` reuses expensive computations across builds. Small text/JSON
values live in 32 lazily loaded JSON shards. Writes accumulate in memory; a flush
merges each dirty shard once under an inter-process lock and publishes it
atomically. Clean shards are untouched. Binary values and text over 64 KiB live
in separate files, with references in the shards. Neither is base64-encoded into
JSON. Bounded LRU caches hold decoded values and loaded shards.

Concurrent `getOrSetAsync` calls for one key share a lookup and computation within
an instance. Separate processes may compute the same key independently; shard
merges preserve their unrelated additions and deletions.

Create the cache once in your plugin or build-time component factory:

```ts
import { PersistentCache } from '@purestack/ts-util-node'

function createSnippetRenderer(config: { cache: boolean; locale: string }) {
  const cache = new PersistentCache<string>({
    namespace: 'snippet-html',
    version: 'renderer-v1',
    enabled: config.cache,
  })

  return {
    render: (source: string) =>
      cache.getOrSetAsync(JSON.stringify([config.locale, source]), async () => {
        return renderSnippet(source, config.locale)
      }),
    flush: () => cache.flush(),
  }
}

const renderer = createSnippetRenderer({ cache: true, locale: 'en' })
try {
  const html = await renderer.render('example source')
  // Use html in your output.
} finally {
  await renderer.flush()
}
```

`renderSnippet` represents your expensive rendering function. Cache only results
that can be reused without repeating side effects. Component registration,
dependency tracking, style registration, and asset emission must still run on a
cache hit. Cached values are shared by reference in memory; treat them as immutable.

The namespace identifies the owner and accepts lowercase letters, digits,
underscores, and hyphens. **Include every output-affecting input in the key**:
source, component props, locale, configuration, and relevant dependency versions.
Change `version` when the implementation or serialized format changes. There is
no automatic source-file invalidation. Namespaces are shared across sites by
default; include site identity in keys when the result depends on the site.

Values default to JSON serialization. For raw strings or binary data, supply a
codec (and change the cache version if changing an existing codec):

```ts
const htmlCache = new PersistentCache<string>({
  namespace: 'rendered-html',
  version: '1',
  codec: {
    encode: (html) => html,
    decode: (bytes) => bytes.toString('utf8'),
  },
})
```

`get(key)` returns a value or `undefined`. `set(key, value)` and `delete(key)`
buffer mutations that are immediately visible to that instance. Other instances
see persisted changes after `flush()`. Await producers before flushing, and await
outstanding operations on a key before deleting or replacing it. Computation
errors propagate and can be retried. Unavailable storage and codec errors skip
persistence or become misses; they do not fail the computation. Failed writes
remain buffered for another flush, subject to the buffer limits.

**Always await `flush()` at the end of a batch, including on failure.** A
best-effort timer flushes during long-running use every 2 seconds after writes
begin. It does not keep Node alive, and there is no process exit handler. Buffer
pressure may flush early; if storage remains unavailable, failed mutations are
discarded to keep memory bounded. `enabled: false` bypasses memory, disk, timers,
and cleanup. Passing `enabled: config.cache` honors PureStack's `--no-cache`.

For highlighters, return an optional `flush()` alongside `codeToHtml()`. PureStack
awaits it after full builds, change batches, and lazy development renders, also
when a batch fails. Standalone highlighter users must await it themselves.
Other plugin caches can use existing lifecycle hooks or explicit `try/finally`
around their computation batches.

| Option             | Default                       | Purpose                                                                                                                                  |
| ------------------ | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `directory`        | `os.tmpdir()/purestack-cache` | Parent of the namespace directory                                                                                                        |
| `maxMemoryEntries` | `4096`                        | Maximum decoded values and buffered mutations per instance                                                                               |
| `maxMemoryBytes`   | `16777216` (16 MiB)           | Approximate budget split across decoded values, loaded shards, and buffered writes; encoding and in-flight flushes need temporary memory |
| `maxAgeDays`       | `30`                          | Disk retention for unused entries; `0` disables cleanup                                                                                  |
| `flushIntervalMs`  | `2000`                        | Best-effort periodic persistence; `0` disables the timer                                                                                 |

Files live under `<directory>/<namespace>/00.json` through `1f.json`, with
larger values in `blobs/<hash>.cache`. The key hash covers the version and input
key. Each entry records its own last-used day: reading one entry does not retain
every other entry in its shard. Retention updates are buffered too. Housekeeping
runs at most hourly during flushing and removes idle entries, orphan blobs, and
abandoned temporary files under the same shard locks used by writers. `prune()`
flushes then requests cleanup explicitly. Retention is storage housekeeping,
not a freshness guarantee or a total disk-size limit.

This cache stores independent values. Use specialized storage when a result
requires publishing a group of files together, as image variants do. Browser
components should use `Cache` from `@purestack/ts-util` instead.
