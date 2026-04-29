import { createRequire } from 'node:module'
import * as path from 'node:path'
import type * as TypeScript from 'typescript'

type TypeScriptRuntime = typeof TypeScript

let workspaceRoots = [process.cwd()]
let cachedRuntime: TypeScriptRuntime | undefined
let cachedRuntimePath: string | undefined

export function setTypescriptWorkspaceRoots(roots: string[]) {
  const normalizedRoots = roots
    .filter(Boolean)
    .map((root) => path.resolve(root))

  workspaceRoots =
    normalizedRoots.length > 0 ? Array.from(new Set(normalizedRoots)) : []
  cachedRuntime = undefined
  cachedRuntimePath = undefined
}

export function resolveWorkspaceTypescriptPath() {
  for (const workspaceRoot of workspaceRoots) {
    const workspaceRequire = createRequire(
      path.join(workspaceRoot, 'package.json'),
    )

    try {
      return workspaceRequire.resolve('typescript')
    } catch {
      // Keep looking through the opened workspace folders.
    }
  }

  return undefined
}

export function getTypescriptRuntimePath() {
  loadTypescriptRuntime()
  return cachedRuntimePath
}

function loadTypescriptRuntime(): TypeScriptRuntime {
  if (cachedRuntime) return cachedRuntime

  const runtimePath = resolveWorkspaceTypescriptPath()
  if (!runtimePath) {
    throw new Error(
      [
        'Cannot resolve TypeScript from the current workspace.',
        'Install typescript in the opened workspace before using PureStack Component Tools.',
        `Workspace roots: ${workspaceRoots.length > 0 ? workspaceRoots.join(', ') : '(none)'}`,
      ].join(' '),
    )
  }

  const workspaceRequire = createRequire(runtimePath)
  cachedRuntime = workspaceRequire(runtimePath) as TypeScriptRuntime
  cachedRuntimePath = runtimePath
  return cachedRuntime
}

const ts = new Proxy({} as TypeScriptRuntime, {
  get(_target, property) {
    return loadTypescriptRuntime()[property as keyof TypeScriptRuntime]
  },
})

export default ts
