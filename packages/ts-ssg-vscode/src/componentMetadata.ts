import * as fs from 'node:fs'
import ts from 'typescript'

export type ComponentPropInfo = {
  propName: string
  attributeName: string
  documentation?: string
  valueKind: 'string' | 'boolean' | 'number' | 'union' | 'unknown'
  literalValues?: string[]
}

export type ComponentMetadata = {
  componentName: string
  documentation?: string
  props: ComponentPropInfo[]
}

type TypeDeclaration =
  | ts.InterfaceDeclaration
  | ts.TypeAliasDeclaration
  | ts.ClassDeclaration

type CachedComponentMetadata = {
  metadataByNormalizedName: Map<string, ComponentMetadata>
  mtimeMs: number
}

const componentMetadataCache = new Map<string, CachedComponentMetadata>()

export function getComponentMetadata(
  filePath: string,
  componentName: string,
): ComponentMetadata | undefined {
  const normalizedComponentName = normalizeComponentName(componentName)
  const cachedMetadata = readCachedComponentMetadata(filePath)

  return cachedMetadata.metadataByNormalizedName.get(normalizedComponentName)
}

function readCachedComponentMetadata(filePath: string) {
  const fileStat = fs.statSync(filePath)
  const cachedMetadata = componentMetadataCache.get(filePath)
  if (cachedMetadata && cachedMetadata.mtimeMs === fileStat.mtimeMs) {
    return cachedMetadata
  }

  const source = fs.readFileSync(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(
    filePath,
    source,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )
  const metadataByNormalizedName = extractComponentMetadata(sourceFile)
  const nextCachedMetadata = {
    metadataByNormalizedName,
    mtimeMs: fileStat.mtimeMs,
  }
  componentMetadataCache.set(filePath, nextCachedMetadata)

  return nextCachedMetadata
}

function extractComponentMetadata(sourceFile: ts.SourceFile) {
  const metadataByNormalizedName = new Map<string, ComponentMetadata>()
  const typeDeclarations = collectTypeDeclarations(sourceFile)

  visitNode(sourceFile)
  return metadataByNormalizedName

  function visitNode(node: ts.Node) {
    if (ts.isCallExpression(node) && isDefineComponentCall(node)) {
      const componentMetadata = createComponentMetadata(
        node,
        typeDeclarations,
        sourceFile,
      )
      if (componentMetadata) {
        metadataByNormalizedName.set(
          normalizeComponentName(componentMetadata.componentName),
          componentMetadata,
        )
      }
    }

    ts.forEachChild(node, visitNode)
  }
}

function collectTypeDeclarations(sourceFile: ts.SourceFile) {
  const declarations = new Map<string, TypeDeclaration>()

  sourceFile.forEachChild((node) => {
    if (
      (ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node) ||
        ts.isClassDeclaration(node)) &&
      node.name &&
      hasExportModifier(node)
    ) {
      declarations.set(node.name.text, node)
    }

    if (ts.isTypeAliasDeclaration(node) && node.name) {
      declarations.set(node.name.text, node)
    }
  })

  return declarations
}

function createComponentMetadata(
  defineComponentCall: ts.CallExpression,
  typeDeclarations: Map<string, TypeDeclaration>,
  sourceFile: ts.SourceFile,
): ComponentMetadata | undefined {
  const componentTypeName = getDefineComponentTypeName(defineComponentCall)
  if (!componentTypeName) return undefined

  const propNames = getDefineComponentPropNames(defineComponentCall)
  if (propNames.length === 0) return undefined

  const typeDeclaration = typeDeclarations.get(componentTypeName)
  if (!typeDeclaration) return undefined

  return {
    componentName: componentTypeName,
    documentation: getJsDocText(typeDeclaration, sourceFile),
    props: propNames.map((propName) =>
      createComponentPropInfo(
        propName,
        typeDeclaration,
        typeDeclarations,
        sourceFile,
      ),
    ),
  }
}

function isDefineComponentCall(node: ts.CallExpression) {
  return ts.isIdentifier(node.expression) && node.expression.text === 'defineComponent'
}

function getDefineComponentTypeName(node: ts.CallExpression) {
  const typeArgument = node.typeArguments?.[0]
  if (!typeArgument) return undefined

  if (ts.isTypeReferenceNode(typeArgument)) {
    return getEntityNameText(typeArgument.typeName)
  }

  return undefined
}

function getDefineComponentPropNames(node: ts.CallExpression) {
  const optionsArgument = node.arguments[1]
  if (!optionsArgument) return []

  if (ts.isArrayLiteralExpression(optionsArgument)) {
    return getStringLiteralValues(optionsArgument)
  }

  if (!ts.isObjectLiteralExpression(optionsArgument)) return []

  for (const property of optionsArgument.properties) {
    if (!ts.isPropertyAssignment(property)) continue
    if (!isNamedProperty(property.name, 'props')) continue
    if (!ts.isArrayLiteralExpression(property.initializer)) return []

    return getStringLiteralValues(property.initializer)
  }

  return []
}

function createComponentPropInfo(
  propName: string,
  typeDeclaration: TypeDeclaration,
  typeDeclarations: Map<string, TypeDeclaration>,
  sourceFile: ts.SourceFile,
): ComponentPropInfo {
  const propDeclaration = findPropDeclaration(typeDeclaration, propName)
  const typeNode = getPropTypeNode(propDeclaration)
  const typeInfo = analyzeTypeNode(typeNode, typeDeclarations, new Set())

  return {
    propName,
    attributeName: toKebabCase(propName),
    documentation: propDeclaration
      ? getJsDocText(propDeclaration, sourceFile)
      : undefined,
    valueKind: typeInfo.valueKind,
    literalValues: typeInfo.literalValues,
  }
}

function findPropDeclaration(typeDeclaration: TypeDeclaration, propName: string) {
  if (ts.isInterfaceDeclaration(typeDeclaration)) {
    for (const member of typeDeclaration.members) {
      if (!ts.isPropertySignature(member)) continue
      if (!isNamedProperty(member.name, propName)) continue
      return member
    }
  }

  if (ts.isClassDeclaration(typeDeclaration)) {
    for (const member of typeDeclaration.members) {
      if (!ts.isPropertyDeclaration(member)) continue
      if (!member.name) continue
      if (!isNamedProperty(member.name, propName)) continue
      return member
    }
  }

  if (ts.isTypeAliasDeclaration(typeDeclaration)) {
    if (!ts.isTypeLiteralNode(typeDeclaration.type)) return undefined

    for (const member of typeDeclaration.type.members) {
      if (!ts.isPropertySignature(member)) continue
      if (!isNamedProperty(member.name, propName)) continue
      return member
    }
  }

  return undefined
}

function getPropTypeNode(
  propDeclaration:
    | ts.PropertySignature
    | ts.PropertyDeclaration
    | undefined,
): ts.TypeNode | undefined {
  return propDeclaration?.type
}

type AnalyzedTypeInfo = {
  valueKind: 'string' | 'boolean' | 'number' | 'union' | 'unknown'
  literalValues?: string[]
}

function analyzeTypeNode(
  typeNode: ts.TypeNode | undefined,
  typeDeclarations: Map<string, TypeDeclaration>,
  seenTypeNames: Set<string>,
): AnalyzedTypeInfo {
  if (!typeNode) return { valueKind: 'unknown' }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return analyzeTypeNode(typeNode.type, typeDeclarations, seenTypeNames)
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = getEntityNameText(typeNode.typeName)

    if (typeName === 'RefOrValue' || typeName === 'ComputedRef') {
      return analyzeTypeNode(
        typeNode.typeArguments?.[0],
        typeDeclarations,
        seenTypeNames,
      )
    }

    if (seenTypeNames.has(typeName)) return { valueKind: 'unknown' }

    const declaration = typeDeclarations.get(typeName)
    if (!declaration || !ts.isTypeAliasDeclaration(declaration)) {
      return { valueKind: 'unknown' }
    }

    const nextSeenTypeNames = new Set(seenTypeNames)
    nextSeenTypeNames.add(typeName)
    return analyzeTypeNode(declaration.type, typeDeclarations, nextSeenTypeNames)
  }

  if (ts.isUnionTypeNode(typeNode)) {
    const normalizedTypeNodes = typeNode.types.filter(
      (member) =>
        member.kind !== ts.SyntaxKind.UndefinedKeyword &&
        member.kind !== ts.SyntaxKind.NullKeyword,
    )

    if (normalizedTypeNodes.length === 1) {
      return analyzeTypeNode(
        normalizedTypeNodes[0],
        typeDeclarations,
        seenTypeNames,
      )
    }

    const literalValues: string[] = []
    let includesBoolean = false

    for (const member of normalizedTypeNodes) {
      if (member.kind === ts.SyntaxKind.BooleanKeyword) {
        includesBoolean = true
        continue
      }

      if (!ts.isLiteralTypeNode(member)) {
        return { valueKind: 'unknown' }
      }

      if (ts.isStringLiteral(member.literal)) {
        literalValues.push(member.literal.text)
        continue
      }

      if (
        member.literal.kind === ts.SyntaxKind.TrueKeyword ||
        member.literal.kind === ts.SyntaxKind.FalseKeyword
      ) {
        includesBoolean = true
        continue
      }

      return { valueKind: 'unknown' }
    }

    if (literalValues.length > 0 && !includesBoolean) {
      return {
        valueKind: 'union',
        literalValues,
      }
    }

    if (literalValues.length === 0 && includesBoolean) {
      return {
        valueKind: 'boolean',
        literalValues: ['true', 'false'],
      }
    }

    return { valueKind: 'unknown' }
  }

  if (typeNode.kind === ts.SyntaxKind.StringKeyword) {
    return { valueKind: 'string' }
  }

  if (typeNode.kind === ts.SyntaxKind.NumberKeyword) {
    return { valueKind: 'number' }
  }

  if (typeNode.kind === ts.SyntaxKind.BooleanKeyword) {
    return {
      valueKind: 'boolean',
      literalValues: ['true', 'false'],
    }
  }

  if (ts.isLiteralTypeNode(typeNode) && ts.isStringLiteral(typeNode.literal)) {
    return {
      valueKind: 'union',
      literalValues: [typeNode.literal.text],
    }
  }

  if (
    ts.isLiteralTypeNode(typeNode) &&
    (typeNode.literal.kind === ts.SyntaxKind.TrueKeyword ||
      typeNode.literal.kind === ts.SyntaxKind.FalseKeyword)
  ) {
    return {
      valueKind: 'boolean',
      literalValues: ['true', 'false'],
    }
  }

  return { valueKind: 'unknown' }
}

function getStringLiteralValues(node: ts.ArrayLiteralExpression) {
  return node.elements
    .filter(ts.isStringLiteral)
    .map((element) => element.text)
}

function isNamedProperty(name: ts.PropertyName, expectedName: string) {
  return (
    ts.isIdentifier(name) ||
    ts.isStringLiteral(name) ||
    ts.isNoSubstitutionTemplateLiteral(name)
  ) && name.text === expectedName
}

function hasExportModifier(node: ts.Node) {
  return ts.canHaveModifiers(node) && !!ts.getModifiers(node)?.some(
    (modifier: ts.ModifierLike) =>
      modifier.kind === ts.SyntaxKind.ExportKeyword,
  )
}

function getEntityNameText(name: ts.EntityName): string {
  if (ts.isIdentifier(name)) return name.text
  return name.right.text
}

function getJsDocText(node: ts.Node, sourceFile: ts.SourceFile) {
  const leadingText = sourceFile.text.slice(node.getFullStart(), node.getStart())
  const matches = leadingText.match(/\/\*\*([\s\S]*?)\*\//g)
  if (!matches || matches.length === 0) return undefined

  const lastComment = matches[matches.length - 1]
  const normalized = lastComment
    .replace(/^\/\*\*/, '')
    .replace(/\*\/$/, '')
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*\*\s?/, '').trimEnd())
    .join('\n')
    .trim()

  return normalized || undefined
}

function toKebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function normalizeComponentName(value: string) {
  return value.replace(/[-_\s]+/g, '').toLowerCase()
}
