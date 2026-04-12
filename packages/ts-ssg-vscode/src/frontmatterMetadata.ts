import * as fs from 'node:fs'
import * as path from 'node:path'
import ts from 'typescript'

export type FrontmatterPropertyMetadata = {
  allowUnknownKeys: boolean
  declarationFilePath: string
  declarationLine: number
  description?: string
  fullPath: string[]
  kind: 'boolean' | 'enum' | 'number' | 'object' | 'string' | 'unknown'
  name: string
  nestedProperties?: FrontmatterPropertyMetadata[]
  optional: boolean
  signature: string
  values?: string[]
}

type FrontmatterMetadataRoot = {
  declarationFilePath: string
  declarationLine: number
  description?: string
  properties: FrontmatterPropertyMetadata[]
  signature: string
}

type BuildContext = {
  declarationLookup: Map<string, ts.Declaration>
  sourceFile: ts.SourceFile
}

const NODE_MODULES_FRONTMATTER_TYPES_FILE = path.join(
  'node_modules',
  '@purestack',
  'ts-common',
  'src',
  'frontmatter-types.ts',
)
const WORKSPACE_FRONTMATTER_TYPES_FILE = path.join(
  'packages',
  'ts-common',
  'src',
  'frontmatter-types.ts',
)

const frontmatterMetadataCache = new Map<string, FrontmatterMetadataRoot>()

export function clearFrontmatterMetadataCache() {
  frontmatterMetadataCache.clear()
}

export function getPageFrontmatterMetadata(workspaceRoot: string) {
  const frontmatterFilePath = resolveFrontmatterTypesFile(workspaceRoot)
  if (!frontmatterFilePath) return undefined

  const cacheKey = `${frontmatterFilePath}:${getFileVersion(frontmatterFilePath)}`
  const cached = frontmatterMetadataCache.get(cacheKey)
  if (cached) return cached

  clearStaleFrontmatterMetadata(frontmatterFilePath)
  const metadata = buildPageFrontmatterMetadata(frontmatterFilePath)
  if (!metadata) return undefined

  frontmatterMetadataCache.set(cacheKey, metadata)
  return metadata
}

function resolveFrontmatterTypesFile(workspaceRoot: string) {
  const workspacePath = path.join(
    workspaceRoot,
    WORKSPACE_FRONTMATTER_TYPES_FILE,
  )
  if (fs.existsSync(workspacePath)) return workspacePath

  const nodeModulesPath = path.join(
    workspaceRoot,
    NODE_MODULES_FRONTMATTER_TYPES_FILE,
  )
  if (fs.existsSync(nodeModulesPath)) return nodeModulesPath

  return undefined
}

function clearStaleFrontmatterMetadata(frontmatterFilePath: string) {
  for (const cacheKey of frontmatterMetadataCache.keys()) {
    if (!cacheKey.startsWith(`${frontmatterFilePath}:`)) continue
    frontmatterMetadataCache.delete(cacheKey)
  }
}

function buildPageFrontmatterMetadata(filePath: string) {
  const sourceText = fs.readFileSync(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(
    filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const declarationLookup = collectInterfaceDeclarations(sourceFile)
  const pageFrontmatterDeclaration = declarationLookup.get('PageFrontmatter')
  if (
    !pageFrontmatterDeclaration ||
    !ts.isInterfaceDeclaration(pageFrontmatterDeclaration)
  ) {
    return undefined
  }

  const context: BuildContext = {
    declarationLookup,
    sourceFile,
  }

  return {
    declarationFilePath: filePath,
    declarationLine: getLineNumber(pageFrontmatterDeclaration),
    description: getNodeDocumentation(pageFrontmatterDeclaration),
    properties: buildInterfaceProperties(
      pageFrontmatterDeclaration,
      ['PageFrontmatter'],
      context,
    ),
    signature: `interface ${pageFrontmatterDeclaration.name.text}`,
  }
}

function collectInterfaceDeclarations(sourceFile: ts.SourceFile) {
  const declarations = new Map<string, ts.Declaration>()

  for (const statement of sourceFile.statements) {
    if (!ts.isInterfaceDeclaration(statement)) continue
    declarations.set(statement.name.text, statement)
  }

  return declarations
}

function buildInterfaceProperties(
  declaration: ts.InterfaceDeclaration,
  parentPath: string[],
  context: BuildContext,
) {
  const allowUnknownKeys = declaration.members.some(
    ts.isIndexSignatureDeclaration,
  )
  const properties: FrontmatterPropertyMetadata[] = []

  for (const member of declaration.members) {
    if (!ts.isPropertySignature(member)) continue

    const propertyName = getPropertyName(member.name)
    if (!propertyName) continue

    const propertyMetadata = buildPropertyMetadata(
      propertyName,
      member,
      parentPath,
      allowUnknownKeys,
      context,
    )
    properties.push(propertyMetadata)
  }

  return properties
}

function buildPropertyMetadata(
  propertyName: string,
  declaration: ts.PropertySignature,
  parentPath: string[],
  inheritedUnknownKeys: boolean,
  context: BuildContext,
): FrontmatterPropertyMetadata {
  const typeNode = declaration.type
  const propertyPath = [...parentPath, propertyName]
  const propertyInfo = analyzeTypeNode(typeNode, propertyPath, context)

  return {
    allowUnknownKeys:
      propertyInfo.kind === 'object'
        ? propertyInfo.allowUnknownKeys
        : inheritedUnknownKeys,
    declarationFilePath: declaration.getSourceFile().fileName,
    declarationLine: getLineNumber(declaration),
    description: getNodeDocumentation(declaration),
    fullPath: propertyPath,
    kind: propertyInfo.kind,
    name: propertyName,
    nestedProperties: propertyInfo.nestedProperties,
    optional: Boolean(declaration.questionToken),
    signature: buildPropertySignature(declaration, context.sourceFile),
    values: propertyInfo.values,
  }
}

function analyzeTypeNode(
  typeNode: ts.TypeNode | undefined,
  propertyPath: string[],
  context: BuildContext,
): Pick<
  FrontmatterPropertyMetadata,
  'allowUnknownKeys' | 'kind' | 'nestedProperties' | 'values'
> {
  if (!typeNode) {
    return {
      allowUnknownKeys: false,
      kind: 'unknown',
    }
  }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return analyzeTypeNode(typeNode.type, propertyPath, context)
  }

  if (ts.isUnionTypeNode(typeNode)) {
    const literalValues = typeNode.types
      .map(getStringLiteralTypeValue)
      .filter((value): value is string => value !== undefined)

    if (
      literalValues.length === typeNode.types.length &&
      literalValues.length > 0
    ) {
      return {
        allowUnknownKeys: false,
        kind: 'enum',
        values: literalValues,
      }
    }

    const hasBooleanKeyword = typeNode.types.some(
      (member) => member.kind === ts.SyntaxKind.BooleanKeyword,
    )
    const booleanLiteralValues = typeNode.types
      .map(getBooleanLiteralTypeValue)
      .filter(
        (value): value is 'true' | 'false' =>
          value === 'true' || value === 'false',
      )

    if (
      hasBooleanKeyword ||
      booleanLiteralValues.length === typeNode.types.length
    ) {
      return {
        allowUnknownKeys: false,
        kind: 'boolean',
        values: ['true', 'false'],
      }
    }

    return {
      allowUnknownKeys: false,
      kind: 'unknown',
    }
  }

  if (typeNode.kind === ts.SyntaxKind.StringKeyword) {
    return {
      allowUnknownKeys: false,
      kind: 'string',
    }
  }

  if (typeNode.kind === ts.SyntaxKind.NumberKeyword) {
    return {
      allowUnknownKeys: false,
      kind: 'number',
    }
  }

  if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
    return {
      allowUnknownKeys: false,
      kind: 'boolean',
      values: ['true', 'false'],
    }
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return {
      allowUnknownKeys: typeNode.members.some(ts.isIndexSignatureDeclaration),
      kind: 'object',
      nestedProperties: buildTypeLiteralProperties(
        typeNode,
        propertyPath,
        context,
      ),
    }
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    if (isRecordTypeReference(typeNode)) {
      return {
        allowUnknownKeys: true,
        kind: 'object',
        nestedProperties: [],
      }
    }

    const referenceName = getEntityNameText(typeNode.typeName)
    const referencedDeclaration = context.declarationLookup.get(referenceName)
    if (
      referencedDeclaration &&
      ts.isInterfaceDeclaration(referencedDeclaration)
    ) {
      return {
        allowUnknownKeys: referencedDeclaration.members.some(
          ts.isIndexSignatureDeclaration,
        ),
        kind: 'object',
        nestedProperties: buildInterfaceProperties(
          referencedDeclaration,
          propertyPath,
          context,
        ),
      }
    }
  }

  return {
    allowUnknownKeys: false,
    kind: 'unknown',
  }
}

function buildTypeLiteralProperties(
  typeNode: ts.TypeLiteralNode,
  parentPath: string[],
  context: BuildContext,
) {
  const properties: FrontmatterPropertyMetadata[] = []

  for (const member of typeNode.members) {
    if (!ts.isPropertySignature(member)) continue

    const propertyName = getPropertyName(member.name)
    if (!propertyName) continue

    properties.push(
      buildPropertyMetadata(propertyName, member, parentPath, false, context),
    )
  }

  return properties
}

function buildPropertySignature(
  declaration: ts.PropertySignature,
  sourceFile: ts.SourceFile,
) {
  const name = declaration.name.getText(sourceFile)
  const optional = declaration.questionToken ? '?' : ''
  const typeText = declaration.type?.getText(sourceFile) ?? 'unknown'
  return `${name}${optional}: ${typeText}`
}

function getPropertyName(name: ts.PropertyName) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text
  }

  return undefined
}

function getNodeDocumentation(node: ts.Node) {
  const jsDoc = ts
    .getJSDocCommentsAndTags(node)
    .map((item) => item.getText())
    .join('\n')
    .trim()

  return jsDoc.length > 0 ? jsDoc : undefined
}

function getStringLiteralTypeValue(typeNode: ts.TypeNode) {
  return ts.isLiteralTypeNode(typeNode) && ts.isStringLiteral(typeNode.literal)
    ? typeNode.literal.text
    : undefined
}

function getBooleanLiteralTypeValue(typeNode: ts.TypeNode) {
  if (!ts.isLiteralTypeNode(typeNode)) return undefined
  if (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword) return 'true'
  if (typeNode.literal.kind === ts.SyntaxKind.FalseKeyword) return 'false'
  return undefined
}

function isRecordTypeReference(typeNode: ts.TypeReferenceNode) {
  if (getEntityNameText(typeNode.typeName) !== 'Record') return false
  if (!typeNode.typeArguments || typeNode.typeArguments.length !== 2)
    return false

  const [keyType] = typeNode.typeArguments
  return keyType.kind === ts.SyntaxKind.StringKeyword
}

function getEntityNameText(name: ts.EntityName): string {
  if (ts.isIdentifier(name)) return name.text
  return name.right.text
}

function getLineNumber(node: ts.Node) {
  return node.getSourceFile().getLineAndCharacterOfPosition(node.getStart())
    .line
}

function getFileVersion(filePath: string) {
  try {
    return fs.statSync(filePath).mtimeMs.toString()
  } catch {
    return '0'
  }
}
