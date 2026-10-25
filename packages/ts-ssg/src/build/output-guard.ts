import type { BigIntStats } from 'node:fs'
import fs from 'node:fs/promises'
import path from 'node:path'

/** Whether `candidate` lies strictly inside `parent`. */
export function isInside(parent: string, candidate: string) {
  const relative = path.relative(parent, candidate)
  return (
    relative !== '' &&
    relative !== '..' &&
    !relative.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relative)
  )
}

/**
 * Returns the lstat of `output` once it is known to lie inside `outDir` with
 * no symlink on the way, so neither a recorded path nor a linked folder can
 * redirect a write or delete outside the output.
 */
export async function statOutputPath(
  outDir: string,
  output: string,
): Promise<BigIntStats | undefined> {
  const root = path.resolve(outDir)
  if (!isInside(root, output))
    throw new Error(`"${output}" lies outside the output directory "${root}".`)
  // Walking down from the root stops at the first missing part and never
  // depends on the two paths sharing their casing.
  let current = root
  let stat: BigIntStats | undefined
  for (const part of path.relative(root, output).split(path.sep)) {
    current = path.join(current, part)
    stat = await lstatOutput(current)
    if (!stat) return undefined
    if (stat.isSymbolicLink())
      throw new Error(`Output path contains a symlink: ${current}`)
  }
  return stat
}

export function lstatOutput(file: string) {
  return fs.lstat(file, { bigint: true }).catch((error) => {
    if (error.code !== 'ENOENT') throw error
    return undefined
  })
}
