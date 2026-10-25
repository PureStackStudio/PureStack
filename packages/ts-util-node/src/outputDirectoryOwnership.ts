import fs from 'node:fs/promises'
import path from 'node:path'

/** Marks a directory PureStack created, so PureStack alone may empty it. */
export const OUTPUT_MARKER_FILENAME = '.purestack-output'

/**
 * Claims `directory` as a PureStack output: creates it, marks it while empty,
 * or accepts its existing marker. A directory holding other files and no
 * marker belongs to someone else, so a mistyped output path fails here
 * instead of being written into or emptied.
 */
export async function claimOutputDirectory(directory: string): Promise<void> {
  await claim(directory)
}

/** Deletes everything in `directory` except its marker, after claiming it. */
export async function emptyOutputDirectory(directory: string): Promise<void> {
  const entries = await claim(directory)
  await Promise.all(
    entries.map((entry) =>
      fs.rm(path.join(directory, entry), { recursive: true, force: true }),
    ),
  )
}

/** Returns the claimed directory's entries other than its marker. */
async function claim(directory: string): Promise<string[]> {
  await fs.mkdir(directory, { recursive: true })
  const entries = await fs.readdir(directory)
  if (entries.includes(OUTPUT_MARKER_FILENAME))
    return entries.filter((entry) => entry !== OUTPUT_MARKER_FILENAME)
  if (entries.length > 0) {
    throw new Error(
      `"${path.resolve(directory)}" is not a PureStack output directory: it holds files but no ${OUTPUT_MARKER_FILENAME} marker. To protect your files from accidental overwrites and deletion, PureStack writes into and cleans only directories it created. Choose a new or empty output directory, or delete this one yourself if it is an old output.`,
    )
  }
  await fs.writeFile(
    path.join(directory, OUTPUT_MARKER_FILENAME),
    'PureStack generates this directory and may delete everything in it.\n',
  )
  return []
}
