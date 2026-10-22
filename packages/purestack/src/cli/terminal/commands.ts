export type Shell = 'windows' | 'posix'

/** Quote paths for a Windows prompt (cmd quoting rules) or a POSIX shell. */
export function changeDirectoryCommand(directory: string, shell: Shell) {
  const target =
    shell === 'posix' && directory.startsWith('-')
      ? `./${directory}`
      : directory
  const quoted = /^[\w./-]+$/.test(target)
    ? target
    : shell === 'windows'
      ? // cmd expands percent variables inside quotes; escape each percent outside them.
        `"${target.replaceAll('%', '"^%"')}"`
      : `'${target.replaceAll("'", "'\\''")}'`
  // Only cmd needs /d, and only across drives; PowerShell rejects it.
  const switchDrive = shell === 'windows' && /^[a-z]:/i.test(target)
  return `${switchDrive ? 'cd /d' : 'cd'} ${quoted}`
}
