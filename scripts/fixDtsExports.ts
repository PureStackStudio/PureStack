import { globSync } from 'node:fs'
import fs, { unlink } from 'node:fs/promises'
import path from 'node:path'

/**
 * Removes .d.cts files.
 * Fixes `.d.ts` files in a directory tree by:
 * - remove $1 type aliases
 * - append imports as exports to the end.
 * - Removing combined export blocks
 * - Adding `export` to all top-level declarations
 * - Stripping `//#region` and mapping comments
 * - Disabling Biome's unused-vars rule for generated declarations
 */
export async function fixDtsExports(directory: string): Promise<void> {
  const dctsFiles = globSync(path.join(directory, '/*.d.cts'))
  dctsFiles.map((x) => unlink(x).catch(console.error))
  const dtsFiles = globSync(path.join(directory, '/*.d.ts'))

  await Promise.all(
    dtsFiles.map(async (filePath) => {
      let content = await fs.readFile(filePath, 'utf8')

      // remove any ", Foo as Foo$1"
      content = content.replace(/,\s*([A-Za-z_]\w*)\s+as\s+\1\$1/g, '')

      //strip all remaining "$1" suffixes
      content = content.replace(/\$1/g, '')

      // Regex breakdown:
      //  1) import\s+           → the "import" keyword
      //  2) (type\s+)?          → optional "type " qualifier
      //  3) \{\s*([^}]+)\s*\}   → capture everything inside { … }
      //  4) \s*from\s*          → the "from" keyword
      //  5) (['"][^'"]+['"])    → capture the quoted module specifier
      //  6) \s*;?               → optional trailing semicolon
      const importRegex =
        /import\s+(type\s+)?\{\s*([^}]+)\s*\}\s*from\s*(["'][^"']+["'])\s*;?/g

      const exportLines: string[] = []
      let m: RegExpExecArray | null
      // biome-ignore lint/suspicious/noAssignInExpressions: 'n/a'
      while ((m = importRegex.exec(content)) !== null) {
        const isType = m[1]?.trim() ? 'type ' : ''
        const names = m[2].trim()
        const modulePath = m[3]
        if (modulePath === '"worker_threads"') continue
        exportLines.push(`export ${isType}{ ${names} } from ${modulePath};`)
      }

      // 🗑 Remove combined export { ... } block at the end
      content = content.trim().replace(/export\s*\{[\s\S]*?\}\s*;?\s*$/m, '')

      // 🔄 Replace all top-level `declare` with `export`
      content = content.replace(/^\s*declare\s+/gm, 'export ')

      // 🏷 Add `export` to any top-level declarations missing it
      content = content.replace(
        /^\s*(interface|type|enum|class|function|const)\s+/gm,
        'export $1 ',
      )

      content = content.replace('#private;', '')

      // 🧹 Remove //#region and //#endregion comments
      content = content.replace(/\/\/#(region|endregion)[^\n]*\n/g, '')

      // 🧹 Remove //# sourceMappingURL= comments
      content = content.replace(/\/\/# sourceMappingURL=.*$/gm, '')

      // add export lines
      content += `\n${exportLines.join('\n')}\n`

      // 💅 Clean up extra newlines
      content = content.replace(/\n{3,}/g, '\n\n')

      // 🚫 Disable noUnusedVariables for generated declaration files.
      content =
        '/* biome-ignore-all lint/suspicious/noUnusedVariables: generated declaration file */\n' +
        content

      await fs.writeFile(filePath, content, 'utf8')
    }),
  )
}
