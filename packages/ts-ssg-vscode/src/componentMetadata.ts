import * as fs from 'node:fs'
import * as path from 'node:path'
import type * as TypeScript from 'typescript'
import runtimeTs from './typescriptRuntime'

const ts = runtimeTs

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
  languageService: TypeScript.LanguageService
}

type AnalyzedTypeInfo = {
  valueKind: 'string' | 'boolean' | 'number' | 'union' | 'unknown'
  literalValues?: string[]
}

type ComponentMetadataDebugLogger = (message: string) => void

const ENABLE_COMPONENT_METADATA_DIAGNOSTICS = false

const projectServiceCache = new Map<string, CachedProjectService>()
let debugLogger: ComponentMetadataDebugLogger | undefined

export function setComponentMetadataDebugLogger(
  logger: ComponentMetadataDebugLogger | undefined,
) {
  debugLogger = logger
}

export function clearComponentMetadataCache(filePath?: string) {
  if (!filePath) {
    for (const cachedService of projectServiceCache.values()) {
      cachedService.languageService.dispose()
    }
    projectServiceCache.clear()
    return
  }

  const configPath = ts.findConfigFile(
    path.dirname(filePath),
    ts.sys.fileExists,
  )
  const cacheKey = configPath ?? `__single__:${filePath}`
  const cachedService = projectServiceCache.get(cacheKey)
  if (!cachedService) return

  cachedService.languageService.dispose()
  projectServiceCache.delete(cacheKey)
}

export function getComponentMetadata(
  filePath: string,
  componentName: string,
): ComponentMetadata | undefined {
  logMetadataRequest(filePath, componentName)
  const languageService = getProjectLanguageService(filePath)
  const program = languageService.getProgram()
  if (!program) return undefined

  const sourceFile = program.getSourceFile(filePath)
  if (!sourceFile) return undefined
  logSourceFileDiagnostics(program, sourceFile)
  logModuleResolution(program, sourceFile, '@purestack/ts-css')
  logImportedSymbolResolution(
    program,
    program.getTypeChecker(),
    sourceFile,
    '@purestack/ts-css',
    'CSSProps',
  )

  const metadataByNormalizedName = extractComponentMetadata(
    sourceFile,
    program.getTypeChecker(),
  )

  return metadataByNormalizedName.get(normalizeComponentName(componentName))
}

function logMetadataRequest(filePath: string, componentName: string) {
  if (!ENABLE_COMPONENT_METADATA_DIAGNOSTICS || !debugLogger) return

  const configPath = ts.findConfigFile(
    path.dirname(filePath),
    ts.sys.fileExists,
  )

  debugLogger(
    [
      `[componentMetadata] request ${componentName}`,
      `  filePath: ${filePath}`,
      `  realPath: ${resolveRealPath(filePath)}`,
      `  configPath: ${configPath ?? '(none)'}`,
      `  configRealPath: ${configPath ? resolveRealPath(configPath) : '(none)'}`,
    ].join('\n'),
  )
}

function logImportedSymbolResolution(
  program: TypeScript.Program,
  checker: TypeScript.TypeChecker,
  sourceFile: TypeScript.SourceFile,
  moduleName: string,
  importedName: string,
) {
  if (!ENABLE_COMPONENT_METADATA_DIAGNOSTICS || !debugLogger) return

  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    if (!ts.isStringLiteral(statement.moduleSpecifier)) continue
    if (statement.moduleSpecifier.text !== moduleName) continue

    const namedBindings = statement.importClause?.namedBindings
    if (!namedBindings || !ts.isNamedImports(namedBindings)) continue

    for (const element of namedBindings.elements) {
      if (element.name.text !== importedName) continue

      const symbol = checker.getSymbolAtLocation(element.name)
      const aliasedSymbol = resolveAliasedSymbol(checker, symbol)
      const declarations = aliasedSymbol?.declarations ?? []
      const declaredType = aliasedSymbol
        ? checker.getDeclaredTypeOfSymbol(aliasedSymbol)
        : undefined
      const aliasDeclaration = declarations.find(ts.isTypeAliasDeclaration)
      const aliasTypeNodeType = aliasDeclaration
        ? checker.getTypeFromTypeNode(aliasDeclaration.type)
        : undefined

      debugLogger(
        [
          `[componentMetadata] import symbol ${importedName} from ${moduleName}`,
          `  symbol: ${symbol?.getName() ?? '(none)'}`,
          `  symbolFlags: ${symbol?.flags ?? '(none)'}`,
          `  aliasedSymbol: ${aliasedSymbol?.getName() ?? '(none)'}`,
          `  aliasedFlags: ${aliasedSymbol?.flags ?? '(none)'}`,
          `  declaredType: ${declaredType ? checker.typeToString(declaredType) : '(none)'}`,
          `  declaredTypeFlags: ${declaredType?.flags ?? '(none)'}`,
          `  aliasTypeNodeType: ${aliasTypeNodeType ? checker.typeToString(aliasTypeNodeType) : '(none)'}`,
          `  aliasTypeNodeFlags: ${aliasTypeNodeType?.flags ?? '(none)'}`,
          `  declarationCount: ${declarations.length}`,
          ...declarations.map(
            (declaration) =>
              `  declaration: ${declaration.getSourceFile().fileName} | ${ts.SyntaxKind[declaration.kind]}`,
          ),
        ].join('\n'),
      )

      if (aliasDeclaration) {
        logSourceFileAllDiagnostics(
          program,
          aliasDeclaration.getSourceFile(),
        )
      }
    }
  }
}

function logSourceFileAllDiagnostics(
  program: TypeScript.Program,
  sourceFile: TypeScript.SourceFile,
) {
  if (!ENABLE_COMPONENT_METADATA_DIAGNOSTICS || !debugLogger) return

  const diagnostics = [
    ...program.getSyntacticDiagnostics(sourceFile),
    ...program.getSemanticDiagnostics(sourceFile),
  ]
  if (diagnostics.length === 0) {
    debugLogger(`[componentMetadata] diagnostics ${sourceFile.fileName}: (none)`)
    return
  }

  debugLogger(
    [
      `[componentMetadata] diagnostics ${sourceFile.fileName}`,
      ...diagnostics.slice(0, 20).map((diagnostic) => {
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n',
        )
        return `  TS${diagnostic.code}: ${message}`
      }),
      diagnostics.length > 20
        ? `  ... ${diagnostics.length - 20} more diagnostics`
        : '',
    ]
      .filter(Boolean)
      .join('\n'),
  )
}

function logSourceFileDiagnostics(
  program: TypeScript.Program,
  sourceFile: TypeScript.SourceFile,
) {
  if (!ENABLE_COMPONENT_METADATA_DIAGNOSTICS || !debugLogger) return

  const diagnostics = program.getSemanticDiagnostics(sourceFile)
  const relevantDiagnostics = diagnostics.filter((diagnostic) =>
    diagnostic.messageText.toString().includes('@purestack/ts-css') ||
    diagnostic.messageText.toString().includes('CSSProps'),
  )
  if (relevantDiagnostics.length === 0) return

  debugLogger(
    [
      `[componentMetadata] diagnostics ${sourceFile.fileName}`,
      ...relevantDiagnostics.map((diagnostic) => {
        const message = ts.flattenDiagnosticMessageText(
          diagnostic.messageText,
          '\n',
        )
        return `  TS${diagnostic.code}: ${message}`
      }),
    ].join('\n'),
  )
}

function resolveRealPath(filePath: string) {
  try {
    return fs.realpathSync.native(filePath)
  } catch {
    return filePath
  }
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

  const host: TypeScript.LanguageServiceHost = {
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
  logParsedProjectConfiguration(configPath, parsedConfig)

  const fileNames = parsedConfig.fileNames.includes(filePath)
    ? parsedConfig.fileNames
    : [...parsedConfig.fileNames, filePath]

  return {
    compilerOptions: parsedConfig.options,
    currentDirectory: configDirectory,
    fileNames,
  }
}

function logParsedProjectConfiguration(
  configPath: string,
  parsedConfig: TypeScript.ParsedCommandLine,
) {
  if (!ENABLE_COMPONENT_METADATA_DIAGNOSTICS || !debugLogger) return

  const diagnostics = parsedConfig.errors.map((diagnostic) => {
    const message = ts.flattenDiagnosticMessageText(
      diagnostic.messageText,
      '\n',
    )
    return `  TS${diagnostic.code}: ${message}`
  })

  debugLogger(
    [
      `[componentMetadata] parsed config ${configPath}`,
      `  baseUrl: ${parsedConfig.options.baseUrl ?? '(none)'}`,
      `  pathsBasePath: ${(parsedConfig.options as { pathsBasePath?: string }).pathsBasePath ?? '(none)'}`,
      `  paths: ${JSON.stringify(parsedConfig.options.paths ?? null)}`,
      `  moduleResolution: ${parsedConfig.options.moduleResolution ?? '(none)'}`,
      `  fileCount: ${parsedConfig.fileNames.length}`,
      diagnostics.length > 0 ? '  errors:' : '  errors: (none)',
      ...diagnostics,
    ].join('\n'),
  )
}

function logModuleResolution(
  program: TypeScript.Program,
  sourceFile: TypeScript.SourceFile,
  moduleName: string,
) {
  if (!ENABLE_COMPONENT_METADATA_DIAGNOSTICS || !debugLogger) return

  const compilerOptions = program.getCompilerOptions()
  const resolvedModule = ts.resolveModuleName(
    moduleName,
    sourceFile.fileName,
    compilerOptions,
    ts.sys,
  ).resolvedModule

  debugLogger(
    [
      `[componentMetadata] module resolution ${moduleName}`,
      `  containingFile: ${sourceFile.fileName}`,
      `  resolvedFileName: ${resolvedModule?.resolvedFileName ?? '(none)'}`,
      `  extension: ${resolvedModule?.extension ?? '(none)'}`,
      `  isExternalLibraryImport: ${resolvedModule?.isExternalLibraryImport ?? '(none)'}`,
    ].join('\n'),
  )
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
  sourceFile: TypeScript.SourceFile,
  checker: TypeScript.TypeChecker,
) {
  const metadataByNormalizedName = new Map<string, ComponentMetadata>()

  visitNode(sourceFile)
  return metadataByNormalizedName

  function visitNode(node: TypeScript.Node) {
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
  defineComponentCall: TypeScript.CallExpression,
  checker: TypeScript.TypeChecker,
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
  componentType: TypeScript.Type,
  checker: TypeScript.TypeChecker,
): ComponentPropInfo {
  const apparentComponentType = checker.getApparentType(componentType)
  const propSymbol =
    checker.getPropertyOfType(apparentComponentType, propName) ??
    checker.getPropertyOfType(componentType, propName)
  const declaration = getPreferredPropertyDeclaration(propSymbol)
  const propType = getPropValueType(checker, propSymbol, declaration)
  const typeInfo = analyzeType(checker, propType)
  logPropTypeResolution(
    checker,
    propName,
    declaration,
    propType,
    typeInfo,
  )

  return {
    propName,
    attributeName: propName,
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

function logPropTypeResolution(
  checker: TypeScript.TypeChecker,
  propName: string,
  declaration: TypeScript.Declaration | undefined,
  propType: TypeScript.Type | undefined,
  typeInfo: AnalyzedTypeInfo,
) {
  if (!ENABLE_COMPONENT_METADATA_DIAGNOSTICS || !debugLogger) return

  const signature = getDebugDeclarationSignature(declaration)
  const shouldLog =
    signature.includes('CSSProps[') || typeInfo.valueKind === 'unknown'
  if (!shouldLog) return

  const lines = [
    `[componentMetadata] prop ${propName}`,
    `  signature: ${signature || '(none)'}`,
    `  resolvedType: ${propType ? checker.typeToString(propType) : '(none)'}`,
    `  flags: ${propType?.flags ?? '(none)'}`,
    `  valueKind: ${typeInfo.valueKind}`,
    `  literalValues: ${typeInfo.literalValues?.join(', ') ?? '(none)'}`,
  ]

  if (propType?.isUnion()) {
    lines.push('  unionMembers:')
    for (const member of propType.types) {
      lines.push(
        `    - ${checker.typeToString(member)} | flags=${member.flags}`,
      )
    }
  }

  lines.push(...getIndexedAccessDebugLines(checker, declaration))
  debugLogger(lines.join('\n'))
}

function getIndexedAccessDebugLines(
  checker: TypeScript.TypeChecker,
  declaration: TypeScript.Declaration | undefined,
) {
  if (
    !declaration ||
    (!ts.isPropertySignature(declaration) &&
      !ts.isPropertyDeclaration(declaration)) ||
    !declaration.type
  ) {
    return []
  }

  const sourceFile = declaration.getSourceFile()
  const unwrappedTypeNode = unwrapComponentPropTypeNode(declaration.type)
  if (!ts.isIndexedAccessTypeNode(unwrappedTypeNode)) return []

  const objectType = checker.getTypeFromTypeNode(unwrappedTypeNode.objectType)
  const indexType = checker.getTypeFromTypeNode(unwrappedTypeNode.indexType)
  const propertyName = ts.isLiteralTypeNode(unwrappedTypeNode.indexType)
    ? getIndexedAccessLiteralName(unwrappedTypeNode.indexType.literal)
    : undefined
  const propertySymbol = propertyName
    ? checker.getPropertyOfType(objectType, propertyName)
    : undefined
  const propertyType = propertySymbol
    ? checker.getTypeOfSymbolAtLocation(propertySymbol, declaration)
    : undefined

  return [
    '  indexedAccess:',
    `    objectNode: ${unwrappedTypeNode.objectType.getText(sourceFile)}`,
    `    objectType: ${checker.typeToString(objectType)} | flags=${objectType.flags}`,
    `    indexNode: ${unwrappedTypeNode.indexType.getText(sourceFile)}`,
    `    indexType: ${checker.typeToString(indexType)} | flags=${indexType.flags}`,
    `    propertyName: ${propertyName ?? '(none)'}`,
    `    propertySymbol: ${propertySymbol?.getName() ?? '(none)'}`,
    `    propertyType: ${propertyType ? checker.typeToString(propertyType) : '(none)'}`,
  ]
}

function getIndexedAccessLiteralName(literal: TypeScript.LiteralTypeNode['literal']) {
  if (
    ts.isStringLiteral(literal) ||
    ts.isNoSubstitutionTemplateLiteral(literal)
  ) {
    return literal.text
  }

  return undefined
}

function getDebugDeclarationSignature(declaration: TypeScript.Declaration | undefined) {
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

  return ''
}

function isDefineComponentCall(node: TypeScript.CallExpression) {
  return (
    ts.isIdentifier(node.expression) &&
    node.expression.text === 'defineComponent'
  )
}

function getDefineComponentTypeArgument(node: TypeScript.CallExpression) {
  const typeArgument = node.typeArguments?.[0]
  if (!typeArgument || !ts.isTypeReferenceNode(typeArgument)) return undefined
  return typeArgument
}

function getDefineComponentTypeName(typeArgument: TypeScript.TypeReferenceNode) {
  return getEntityNameText(typeArgument.typeName)
}

function getDefineComponentPropNames(node: TypeScript.CallExpression) {
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
  checker: TypeScript.TypeChecker,
  typeNode: TypeScript.TypeReferenceNode,
  type: TypeScript.Type,
) {
  const symbolFromNode = checker.getSymbolAtLocation(typeNode.typeName)
  const resolvedNodeSymbol = resolveAliasedSymbol(checker, symbolFromNode)
  if (resolvedNodeSymbol) return resolvedNodeSymbol

  return resolveAliasedSymbol(checker, type.aliasSymbol) ?? type.symbol
}

function getPreferredDeclaration(symbol?: TypeScript.Symbol) {
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

function getPreferredPropertyDeclaration(symbol?: TypeScript.Symbol) {
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
  checker: TypeScript.TypeChecker,
  propSymbol: TypeScript.Symbol | undefined,
  declaration?: TypeScript.Declaration,
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

function unwrapComponentPropTypeNode(typeNode: TypeScript.TypeNode): TypeScript.TypeNode {
  if (ts.isParenthesizedTypeNode(typeNode)) {
    return unwrapComponentPropTypeNode(typeNode.type)
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    if (typeNode.typeArguments?.[0]) {
      return unwrapComponentPropTypeNode(typeNode.typeArguments[0])
    }
  }

  return typeNode
}

function analyzeType(
  checker: TypeScript.TypeChecker,
  type: TypeScript.Type | undefined,
): AnalyzedTypeInfo {
  if (!type) return { valueKind: 'unknown' }

  const normalizedType = checker.getNonNullableType(type)

  if (normalizedType.isUnion()) {
    const literalValues: string[] = []
    let includesBoolean = false
    let includesBroadString = false
    let includesBroadNumber = false
    let includesUnknown = false

    for (const member of normalizedType.types) {
      const memberType = checker.getNonNullableType(member)

      if (isBooleanType(memberType)) {
        includesBoolean = true
        continue
      }

      if (isStringLikeType(memberType)) {
        includesBroadString = true
        continue
      }

      if (isNumberType(memberType)) {
        includesBroadNumber = true
        continue
      }

      const literalValue = getLiteralCompletionValue(memberType, checker)
      if (literalValue === undefined) {
        includesUnknown = true
        continue
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
    if (includesUnknown) return { valueKind: 'unknown' }

    return { valueKind: 'unknown' }
  }

  if (isBooleanType(normalizedType)) {
    return {
      valueKind: 'boolean',
      literalValues: ['true', 'false'],
    }
  }

  if (isStringLikeType(normalizedType)) {
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

function isBooleanType(type: TypeScript.Type) {
  return (type.flags & ts.TypeFlags.Boolean) !== 0
}

function isStringType(type: TypeScript.Type) {
  return (type.flags & ts.TypeFlags.String) !== 0
}

function isStringLikeType(type: TypeScript.Type): boolean {
  if (isStringType(type)) return true

  if ((type.flags & ts.TypeFlags.Intersection) === 0) return false

  return (type as TypeScript.IntersectionType).types.some(isStringType)
}

function isNumberType(type: TypeScript.Type) {
  return (type.flags & ts.TypeFlags.Number) !== 0
}

function getLiteralCompletionValue(type: TypeScript.Type, checker: TypeScript.TypeChecker) {
  if ((type.flags & ts.TypeFlags.StringLiteral) !== 0) {
    return (type as TypeScript.StringLiteralType).value
  }

  if ((type.flags & ts.TypeFlags.BooleanLiteral) !== 0) {
    const typeText = checker.typeToString(type)
    return typeText === 'true' || typeText === 'false' ? typeText : undefined
  }

  return undefined
}

function getComponentSignature(
  checker: TypeScript.TypeChecker,
  componentName: string,
  componentType: TypeScript.Type,
  declaration?: TypeScript.Declaration,
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
  checker: TypeScript.TypeChecker,
  propName: string,
  propSymbol: TypeScript.Symbol | undefined,
  declaration?: TypeScript.Declaration,
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

function getSymbolDocumentation(checker: TypeScript.TypeChecker, symbol?: TypeScript.Symbol) {
  const resolvedSymbol = resolveAliasedSymbol(checker, symbol) ?? symbol
  if (!resolvedSymbol) return undefined

  const documentation = ts.displayPartsToString(
    resolvedSymbol.getDocumentationComment(checker),
  )

  return documentation || undefined
}

function resolveAliasedSymbol(checker: TypeScript.TypeChecker, symbol?: TypeScript.Symbol) {
  if (!symbol) return undefined
  if ((symbol.flags & ts.SymbolFlags.Alias) === 0) return symbol

  try {
    return checker.getAliasedSymbol(symbol)
  } catch {
    return symbol
  }
}

function getStringLiteralValues(node: TypeScript.ArrayLiteralExpression) {
  return node.elements.filter(ts.isStringLiteral).map((element) => element.text)
}

function isNamedProperty(name: TypeScript.PropertyName, expectedName: string) {
  return (
    (ts.isIdentifier(name) ||
      ts.isStringLiteral(name) ||
      ts.isNoSubstitutionTemplateLiteral(name)) &&
    name.text === expectedName
  )
}

function getEntityNameText(name: TypeScript.EntityName): string {
  if (ts.isIdentifier(name)) return name.text
  return name.right.text
}

function getLineNumber(node: TypeScript.Node) {
  return node.getSourceFile().getLineAndCharacterOfPosition(node.getStart())
    .line
}

function normalizeComponentName(value: string) {
  return value.replace(/[-_\s]+/g, '').toLowerCase()
}
