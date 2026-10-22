import { globSync, readFileSync } from 'node:fs'
import path from 'node:path'

/** Discover package manifests from the repository's declared workspace roots. */
export function workspaceManifestPaths(root = process.cwd()) {
  const manifest: unknown = JSON.parse(
    readFileSync(path.join(root, 'package.json'), 'utf8'),
  )
  if (
    !manifest ||
    typeof manifest !== 'object' ||
    !('workspaces' in manifest) ||
    !Array.isArray(manifest.workspaces) ||
    !manifest.workspaces.every(
      (pattern): pattern is string => typeof pattern === 'string',
    )
  )
    throw new Error('Expected workspace patterns in the root package.json.')
  return globSync(
    manifest.workspaces.map((pattern) => `${pattern}/package.json`),
    { cwd: root },
  ).sort()
}
