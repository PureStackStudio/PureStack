import * as fs from 'node:fs'
import * as path from 'node:path'
import ts from 'typescript'

export type ComponentPropInfo = {
  propName: string
  attributeName: string
  declarationFilePath: string
  declarationLine: number
  documentation?: string
  signature?: string
  valueKind: 'string' | 'boolean' | 'number' | 'union' | 'unknown'
  literalValues?: string[]
}

export type ComponentMetadata = {
  componentName: string
  declarationFilePath: string
  declarationLine: number
  documentation?: string
  signature: string
  props: ComponentPropInfo[]
}

type CachedProjectService = {
  configMtimeMs: number
  languageService: ts.LanguageService
}

type AnalyzedTypeInfo = {
  valueKind: 'string' | 'boolean' | 'number' | 'union' | 'unknown'
  literalValues?: string[]
}

const projectServiceCache = new Map<string, CachedProjectService>()

export function getComponentMetadata(
  filePath: string,
  componentName: string,
): ComponentMetadata | undefined {
  const languageService = getProjectLanguageService(filePath)
  const program = languageService.getProgram()
  if (!program) return undefined

  const sourceFile = program.getSourceFile(filePath)
  if (!sourceFile) return undefined

  const metadataByNormalizedName = extractComponentMetadata(
    sourceFile,
    program.getTypeChecker(),
  )

  return metadataByNormalizedName.get(normalizeComponentName(componentName))
}

function getProjectLanguageService(filePath: string) {
  const configPath = ts.findConfigFile(
    path.dirname(filePath),
    ts.sys.fileExists,
  )
  const cacheKey = configPath ?? `__single__:${filePath}`
  const configMtimeMs = configPath ? fs.statSync(configPath).mtimeMs : -1
  const cachedService = projectServiceCache.get(cacheKey)

  if (cachedService && cachedService.configMtimeMs === configMtimeMs) {
    return cachedService.languageService
  }

  const languageService = createProjectLanguageService(filePath, configPath)
  cachedService?.languageService.dispose()
  projectServiceCache.set(cacheKey, {
    configMtimeMs,
    languageService,
  })

  return languageService
}

function createProjectLanguageService(filePath: string, configPath?: string) {
  const { compilerOptions, fileNames, currentDirectory } = configPath
    ? readProjectConfiguration(filePath, configPath)
    : createSingleFileProject(filePath)

  const host: ts.LanguageServiceHost = {
    directoryExists: ts.sys.directoryExists?.bind(ts.sys),
    fileExists: ts.sys.fileExists,
    getCompilationSettings: () => compilerOptions,
    getCurrentDirectory: () => currentDirectory,
    getDefaultLibFileName: (options) => ts.getDefaultLibFilePath(options),
    getDirectories: ts.sys.getDirectories?.bind(ts.sys),
    getScriptFileNames: () => fileNames,
    getScriptSnapshot: (scriptFileName) => {
      if (!ts.sys.fileExists(scriptFileName)) return undefined

      const text = ts.sys.readFile(scriptFileName)
      if (text === undefined) return undefined

      return ts.ScriptSnapshot.fromString(text)
    },
    getScriptVersion: (scriptFileName) => {
      try {
        return fs.statSync(scriptFileName).mtimeMs.toString()
      } catch {
        return '0'
      }
    },
    readDirectory: ts.sys.readDirectory,
    readFile: ts.sys.readFile,
    useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
  }

  return ts.createLanguageService(host)
}

function readProjectConfiguration(filePath: string, configPath: string) {
  const configDirectory = path.dirname(configPath)
  const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
  if (configFile.error) {
    return createSingleFileProject(filePath)
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    configDirectory,
  )

  const fileNames = parsedConfig.fileNames.includes(filePath)
    ? parsedConfig.fileNames
    : [...parsedConfig.fileNames, filePath]

  return {
    compilerOptions: parsedConfig.options,
    currentDirectory: configDirectory,
    fileNames,
  }
}

function createSingleFileProject(filePath: string) {
  return {
    compilerOptions: {
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      module: ts.ModuleKind.NodeNext,
      moduleResolution: ts.ModuleResolutionKind.NodeNext,
      target: ts.ScriptTarget.ESNext,
    },
    currentDirectory: path.dirname(filePath),
    fileNames: [filePath],
  }
}

function extractComponentMetadata(
  sourceFile: ts.SourceFile,
  checker: ts.TypeChecker,
) {
  const metadataByNormalizedName = new Map<string, ComponentMetadata>()

  visitNode(sourceFile)
  return metadataByNormalizedName

  function visitNode(node: ts.Node) {
    if (ts.isCallExpression(node) && isDefineComponentCall(node)) {
      const componentMetadata = createComponentMetadata(node, checker)
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

function createComponentMetadata(
  defineComponentCall: ts.CallExpression,
  checker: ts.TypeChecker,
): ComponentMetadata | undefined {
  const typeArgument = getDefineComponentTypeArgument(defineComponentCall)
  if (!typeArgument) return undefined

  const componentTypeName = getDefineComponentTypeName(typeArgument)
  if (!componentTypeName) return undefined

  const propNames = getDefineComponentPropNames(defineComponentCall)
  if (propNames.length === 0) return undefined

  const componentType = checker.getTypeFromTypeNode(typeArgument)
  const componentSymbol = getPreferredTypeSymbol(
    checker,
    typeArgument,
    componentType,
  )
  const componentDeclaration = getPreferredDeclaration(componentSymbol)

  return {
    componentName: componentTypeName,
    declarationFilePath:
      componentDeclaration?.getSourceFile().fileName ??
      defineComponentCall.getSourceFile().fileName,
    declarationLine: componentDeclaration
      ? getLineNumber(componentDeclaration)
      : 0,
    documentation: getSymbolDocumentation(checker, componentSymbol),
    signature: getComponentSignature(
      checker,
      componentTypeName,
      componentType,
      componentDeclaration,
    ),
    props: propNames.map((propName) =>
      createComponentPropInfo(propName, componentType, checker),
    ),
  }
}

function createComponentPropInfo(
  propName: string,
  componentType: ts.Type,
  checker: ts.TypeChecker,
): ComponentPropInfo {
  const apparentComponentType = checker.getApparentType(componentType)
  const propSymbol =
    checker.getPropertyOfType(apparentComponentType, propName) ??
    checker.getPropertyOfType(componentType, propName)
  const declaration = getPreferredPropertyDeclaration(propSymbol)
  const propType = getPropValueType(checker, propSymbol, declaration)
  const typeInfo = analyzeType(checker, propType)

  return {
    propName,
    attributeName: toKebabCase(propName),
    declarationFilePath:
      declaration?.getSourceFile().fileName ??
      componentType.symbol?.declarations?.[0]?.getSourceFile().fileName ??
      '',
    declarationLine: declaration ? getLineNumber(declaration) : 0,
    documentation: getSymbolDocumentation(checker, propSymbol),
    signature: getPropSignature(checker, propName, propSymbol, declaration),
    valueKind: typeInfo.valueKind,
    literalValues: typeInfo.literalValues,
  }
}

function isDefineComponentCall(node: ts.CallExpression) {
  return (
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'defineComponent'
  )
}

function getDefineComponentTypeArgument(node: ts.CallExpression) {
  const typeArgument = node.typeArguments?.[0]
  if (!typeArgument || !ts.isTypeReferenceNode(typeArgument)) return undefined
  return typeArgument
}

function getDefineComponentTypeName(typeArgument: ts.TypeReferenceNode) {
  return getEntityNameText(typeArgument.typeName)
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

function getPreferredTypeSymbol(
  checker: ts.TypeChecker,
  typeNode: ts.TypeReferenceNode,
  type: ts.Type,
) {
  const symbolFromNode = checker.getSymbolAtLocation(typeNode.typeName)
  const resolvedNodeSymbol = resolveAliasedSymbol(checker, symbolFromNode)
  if (resolvedNodeSymbol) return resolvedNodeSymbol

  return resolveAliasedSymbol(checker, type.aliasSymbol) ?? type.symbol
}

function getPreferredDeclaration(symbol?: ts.Symbol) {
  if (!symbol?.declarations || symbol.declarations.length === 0) {
    return undefined
  }

  return (
    symbol.declarations.find(
      (declaration) =>
        ts.isInterfaceDeclaration(declaration) ||
        ts.isTypeAliasDeclaration(declaration) ||
        ts.isClassDeclaration(declaration),
    ) ?? symbol.declarations[0]
  )
}

function getPreferredPropertyDeclaration(symbol?: ts.Symbol) {
  if (!symbol?.declarations || symbol.declarations.length === 0) {
    return undefined
  }

  return (
    symbol.declarations.find(
      (declaration) =>
        ts.isPropertySignature(declaration) ||
        ts.isPropertyDeclaration(declaration),
    ) ?? symbol.declarations[0]
  )
}

function getPropValueType(
  checker: ts.TypeChecker,
  propSymbol: ts.Symbol | undefined,
  declaration?: ts.Declaration,
) {
  if (
    declaration &&
    (ts.isPropertySignature(declaration) ||
      ts.isPropertyDeclaration(declaration)) &&
    declaration.type
  ) {
    const unwrappedTypeNode = unwrapComponentPropTypeNode(declaration.type)
    return checker.getTypeFromTypeNode(unwrappedTypeNode)
  }

  if (!propSymbol) return undefined

  const location =
    declaration ?? propSymbol.valueDeclaration ?? propSymbol.declarations?.[0]
  if (!location) return undefined

  return checker.getTypeOfSymbolAtLocation(propSymbol, location)
}

function unwrapComponentPropTypeNode(typeNode: ts.TypeNode): ts.TypeNode {
  if (ts.isParenthesizedTypeNode(typeNode)) {
    return unwrapComponentPropTypeNode(typeNode.type)
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    const typeName = getEntityNameText(typeNode.typeName)
    if (
      (typeName === 'RefOrValue' || typeName === 'ComputedRef') &&
      typeNode.typeArguments?.[0]
    ) {
      return unwrapComponentPropTypeNode(typeNode.typeArguments[0])
    }
  }

  return typeNode
}

function analyzeType(
  checker: ts.TypeChecker,
  type: ts.Type | undefined,
): AnalyzedTypeInfo {
  if (!type) return { valueKind: 'unknown' }

  const normalizedType = checker.getNonNullableType(type)

  if (normalizedType.isUnion()) {
    const literalValues: string[] = []
    let includesBoolean = false
    let includesBroadString = false
    let includesBroadNumber = false

    for (const member of normalizedType.types) {
      const memberType = checker.getNonNullableType(member)

      if (isBooleanType(memberType)) {
        includesBoolean = true
        continue
      }

      if (isStringType(memberType)) {
        includesBroadString = true
        continue
      }

      if (isNumberType(memberType)) {
        includesBroadNumber = true
        continue
      }

      const literalValue = getLiteralCompletionValue(memberType, checker)
      if (literalValue === undefined) {
        return { valueKind: 'unknown' }
      }

      if (literalValue === 'true' || literalValue === 'false') {
        includesBoolean = true
        continue
      }

      literalValues.push(literalValue)
    }

    if (literalValues.length > 0) {
      const completionValues = includesBoolean
        ? [...literalValues, 'true', 'false']
        : literalValues

      return {
        valueKind: 'union',
        literalValues: Array.from(new Set(completionValues)),
      }
    }

    if (includesBoolean) {
      return {
        valueKind: 'boolean',
        literalValues: ['true', 'false'],
      }
    }

    if (includesBroadString) return { valueKind: 'string' }
    if (includesBroadNumber) return { valueKind: 'number' }

    return { valueKind: 'unknown' }
  }

  if (isBooleanType(normalizedType)) {
    return {
      valueKind: 'boolean',
      literalValues: ['true', 'false'],
    }
  }

  if (isStringType(normalizedType)) {
    return { valueKind: 'string' }
  }

  if (isNumberType(normalizedType)) {
    return { valueKind: 'number' }
  }

  const literalValue = getLiteralCompletionValue(normalizedType, checker)
  if (literalValue === 'true' || literalValue === 'false') {
    return {
      valueKind: 'boolean',
      literalValues: ['true', 'false'],
    }
  }

  if (literalValue !== undefined) {
    return {
      valueKind: 'union',
      literalValues: [literalValue],
    }
  }

  return { valueKind: 'unknown' }
}

function isBooleanType(type: ts.Type) {
  return (type.flags & ts.TypeFlags.Boolean) !== 0
}

function isStringType(type: ts.Type) {
  return (type.flags & ts.TypeFlags.String) !== 0
}

function isNumberType(type: ts.Type) {
  return (type.flags & ts.TypeFlags.Number) !== 0
}

function getLiteralCompletionValue(type: ts.Type, checker: ts.TypeChecker) {
  if ((type.flags & ts.TypeFlags.StringLiteral) !== 0) {
    return (type as ts.StringLiteralType).value
  }

  if ((type.flags & ts.TypeFlags.BooleanLiteral) !== 0) {
    const typeText = checker.typeToString(type)
    return typeText === 'true' || typeText === 'false' ? typeText : undefined
  }

  return undefined
}

function getComponentSignature(
  checker: ts.TypeChecker,
  componentName: string,
  componentType: ts.Type,
  declaration?: ts.Declaration,
) {
  if (declaration && ts.isInterfaceDeclaration(declaration)) {
    return `interface ${declaration.name.text}`
  }

  if (declaration && ts.isClassDeclaration(declaration)) {
    return `class ${declaration.name?.text ?? componentName}`
  }

  if (declaration && ts.isTypeAliasDeclaration(declaration)) {
    return `type ${declaration.name.text} = ${declaration.type.getText(declaration.getSourceFile())}`
  }

  return `type ${componentName} = ${checker.typeToString(componentType)}`
}

function getPropSignature(
  checker: ts.TypeChecker,
  propName: string,
  propSymbol: ts.Symbol | undefined,
  declaration?: ts.Declaration,
) {
  if (
    declaration &&
    (ts.isPropertySignature(declaration) ||
      ts.isPropertyDeclaration(declaration))
  ) {
    const sourceFile = declaration.getSourceFile()
    const name = declaration.name.getText(sourceFile)
    const optional = declaration.questionToken ? '?' : ''
    const typeText = declaration.type?.getText(sourceFile)

    if (!typeText) return `${name}${optional}`
    return `${name}${optional}: ${typeText}`
  }

  if (!propSymbol) return propName

  const location =
    declaration ?? propSymbol.valueDeclaration ?? propSymbol.declarations?.[0]
  if (!location) return propName

  const propType = checker.getTypeOfSymbolAtLocation(propSymbol, location)
  return `${propName}: ${checker.typeToString(propType)}`
}

function getSymbolDocumentation(checker: ts.TypeChecker, symbol?: ts.Symbol) {
  const resolvedSymbol = resolveAliasedSymbol(checker, symbol) ?? symbol
  if (!resolvedSymbol) return undefined

  const documentation = ts.displayPartsToString(
    resolvedSymbol.getDocumentationComment(checker),
  )

  return documentation || undefined
}

function resolveAliasedSymbol(checker: ts.TypeChecker, symbol?: ts.Symbol) {
  if (!symbol) return undefined
  if ((symbol.flags & ts.SymbolFlags.Alias) === 0) return symbol

  try {
    return checker.getAliasedSymbol(symbol)
  } catch {
    return symbol
  }
}

function getStringLiteralValues(node: ts.ArrayLiteralExpression) {
  return node.elements.filter(ts.isStringLiteral).map((element) => element.text)
}

function isNamedProperty(name: ts.PropertyName, expectedName: string) {
  return (
    (ts.isIdentifier(name) ||
      ts.isStringLiteral(name) ||
      ts.isNoSubstitutionTemplateLiteral(name)) &&
    name.text === expectedName
  )
}

function getEntityNameText(name: ts.EntityName): string {
  if (ts.isIdentifier(name)) return name.text
  return name.right.text
}

function getLineNumber(node: ts.Node) {
  return node.getSourceFile().getLineAndCharacterOfPosition(node.getStart())
    .line
}

function toKebabCase(value: string) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function normalizeComponentName(value: string) {
  return value.replace(/[-_\s]+/g, '').toLowerCase()
}
