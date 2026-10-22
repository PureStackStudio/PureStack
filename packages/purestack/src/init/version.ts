// Template contracts and package-manager pins use plain major.minor.patch releases.
export function parseVersion(value: string) {
  const match = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(value)
  if (!match || match[0] !== value) return undefined
  const major = Number(match[1])
  const minor = Number(match[2])
  const patch = Number(match[3])
  if (![major, minor, patch].every(Number.isSafeInteger)) return undefined
  return { major, minor, patch }
}

export function isCompatibleVersion(current: string, minimum: string) {
  const version = parseVersion(current)
  const required = parseVersion(minimum)
  return (
    version !== undefined &&
    required !== undefined &&
    version.major === required.major &&
    (version.minor > required.minor ||
      (version.minor === required.minor && version.patch >= required.patch))
  )
}
