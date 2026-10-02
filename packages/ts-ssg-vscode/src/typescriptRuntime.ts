import { createRequire } from 'node:module'
import * as path from 'node:path'
import bundledTs from 'typescript'
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
  if (runtimePath) {
    const workspaceRequire = createRequire(runtimePath)
    const workspaceRuntime = workspaceRequire(runtimePath) as TypeScriptRuntime
    if (hasCompilerApi(workspaceRuntime)) {
      cachedRuntime = workspaceRuntime
      cachedRuntimePath = runtimePath
      return cachedRuntime
    }
  }

  cachedRuntime = bundledTs
  cachedRuntimePath = 'bundled TypeScript 6'
  return cachedRuntime
}

function hasCompilerApi(runtime: TypeScriptRuntime) {
  return (
    typeof runtime.createSourceFile === 'function' &&
    typeof runtime.createLanguageService === 'function' &&
    typeof runtime.sys?.fileExists === 'function'
  )
}

const ts = new Proxy({} as TypeScriptRuntime, {
  get(_target, property) {
    return loadTypescriptRuntime()[property as keyof TypeScriptRuntime]
  },
})

export default ts
