export const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d?)$/

export function bumpVersion(version: string, delta = '1') {
  const increment = Number(delta)
  if (!/^\+?[1-9]\d*$/.test(delta) || !Number.isSafeInteger(increment)) {
    throw new Error(`Expected a positive integer delta, received ${delta}.`)
  }

  const current = versionPattern.exec(version)
  if (!current) {
    throw new Error(
      `Expected a major.minor.patch version with patch 0–99, received ${version}.`,
    )
  }

  const [, major, minor, patch] = current
  const totalPatch = Number(patch) + increment
  const nextMinor = Number(minor) + Math.floor(totalPatch / 100)
  if (!Number.isSafeInteger(totalPatch) || !Number.isSafeInteger(nextMinor)) {
    throw new Error('The resulting version exceeds the safe integer range.')
  }
  return `${major}.${nextMinor}.${totalPatch % 100}`
}
