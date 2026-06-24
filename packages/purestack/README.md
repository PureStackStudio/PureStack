# `purestack`

The public PureStack package.

It provides the `purestack` CLI and re-exports the TypeScript API from
`@purestack/ts-ssg`.

## Installation

```bash
yarn add purestack
```

## CLI

```bash
yarn purestack build --content ./content
yarn purestack serve --content ./content --port 4173
yarn purestack publish --content ./content

Usage:
  purestack build --content <dir> [--clean]
  purestack serve --content <dir> [--host <host>] [--port <port>] [--clean] [--no-watch] [--no-reload]
  purestack publish --content <dir>

Commands:
  build     Build a content directory into its configured outDir.
  serve     Start the dev server for a content directory.
  publish   Clean and build a publish artifact using the configured publishDir.
```

## Programmatic API

```ts
import { buildSite, startDevServer } from 'purestack'
```
