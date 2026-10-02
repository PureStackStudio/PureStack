import { readdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// TypeScript 7 supplies tsc; this generator needs the JavaScript AST API.
import ts from 'typescript-parser'

interface PackageJson extends Record<string, unknown> {
  regorComponents?: unknown
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const componentsPackageDir = path.join(projectRoot, 'packages', 'ts-components')
const componentsSourceDir = path.join(componentsPackageDir, 'src')
const packageJsonPath = path.join(componentsPackageDir, 'package.json')

async function getTypeScriptFiles(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const entryPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return getTypeScriptFiles(entryPath)
      if (!entry.isFile()) return []
      if (!/\.(ts|tsx)$/.test(entry.name)) return []
      return [entryPath]
    }),
  )
  return files.flat()
}

function getComponentName(typeNode: ts.TypeNode | undefined) {
  if (!typeNode || !ts.isTypeReferenceNode(typeNode)) return undefined
  if (typeNode.typeArguments?.length) return undefined
  const typeName = typeNode.typeName
  if (!ts.isIdentifier(typeName)) return undefined
  return typeName.text
}

function findComponents(sourceText: string, sourcePath: string) {
  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  )
  const components = new Set<string>()

  function visit(node: ts.Node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'defineComponent'
    ) {
      const componentName = getComponentName(node.typeArguments?.[0])
      if (componentName) components.add(componentName)
    }
    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  return components
}

async function collectRegorComponents() {
  const componentNames = new Set<string>()
  const files = await getTypeScriptFiles(componentsSourceDir)

  for (const file of files) {
    const sourceText = await readFile(file, 'utf8')
    for (const componentName of findComponents(sourceText, file)) {
      componentNames.add(componentName)
    }
  }

  return [...componentNames].sort((a, b) => a.localeCompare(b))
}

async function main() {
  const packageJson = JSON.parse(
    await readFile(packageJsonPath, 'utf8'),
  ) as PackageJson
  const regorComponents = await collectRegorComponents()
  packageJson.regorComponents = regorComponents
  await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`)
  console.log(
    `Updated ${path.relative(projectRoot, packageJsonPath)} with ${
      regorComponents.length
    } Regor components.`,
  )
}

main().catch((error) => {
  console.error('Regor component manifest update failed:', error)
  process.exit(1)
})
