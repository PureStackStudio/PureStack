import * as fs from 'node:fs'
import * as path from 'node:path'
import type * as TypeScript from 'typescript'
import runtimeTs from './typescriptRuntime'

const ts = runtimeTs

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

type CachedProjectService = {
  configMtimeMs: number
  languageService: TypeScript.LanguageService
  metadataVersion: string
  root: FrontmatterMetadataRoot
}

type AnalyzedFrontmatterType = Pick<
  FrontmatterPropertyMetadata,
  'allowUnknownKeys' | 'kind' | 'nestedProperties' | 'values'
>

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

const frontmatterMetadataCache = new Map<string, CachedProjectService>()

export function clearFrontmatterMetadataCache(filePath?: string) {
  if (!filePath) {
    for (const cachedService of frontmatterMetadataCache.values()) {
      cachedService.languageService.dispose()
    }
    frontmatterMetadataCache.clear()
    return
  }

  const configPath = ts.findConfigFile(
    path.dirname(filePath),
    ts.sys.fileExists,
  )
  const cacheKey = configPath ?? `__single__:${filePath}`
  const cachedService = frontmatterMetadataCache.get(cacheKey)
  if (!cachedService) return

  cachedService.languageService.dispose()
  frontmatterMetadataCache.delete(cacheKey)
}

export function getPageFrontmatterMetadata(workspaceRoot: string) {
  const frontmatterFilePath = resolveFrontmatterTypesFile(workspaceRoot)
  if (!frontmatterFilePath) return undefined

  const languageService = getProjectLanguageService(frontmatterFilePath)
  const program = languageService.getProgram()
  if (!program) return undefined

  const sourceFile = program.getSourceFile(frontmatterFilePath)
  if (!sourceFile) return undefined

  const cacheKey = getProjectCacheKey(frontmatterFilePath)
  const metadataVersion = getMetadataVersion(frontmatterFilePath)
  const cachedService = frontmatterMetadataCache.get(cacheKey)
  if (cachedService && cachedService.metadataVersion === metadataVersion) {
    return cachedService.root
  }

  const root = buildPageFrontmatterMetadata(
    sourceFile,
    program.getTypeChecker(),
  )
  if (!root) return undefined

  if (cachedService) {
    cachedService.root = root
    cachedService.metadataVersion = metadataVersion
    return root
  }

  return root
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

function getProjectLanguageService(filePath: string) {
  const configPath = ts.findConfigFile(
    path.dirname(filePath),
    ts.sys.fileExists,
  )
  const cacheKey = configPath ?? `__single__:${filePath}`
  const configMtimeMs = configPath ? fs.statSync(configPath).mtimeMs : -1
  const cachedService = frontmatterMetadataCache.get(cacheKey)

  if (cachedService && cachedService.configMtimeMs === configMtimeMs) {
    return cachedService.languageService
  }

  const languageService = createProjectLanguageService(filePath, configPath)
  if (cachedService) {
    cachedService.languageService.dispose()
  }
  frontmatterMetadataCache.set(cacheKey, {
    configMtimeMs,
    languageService,
    metadataVersion: '',
    root: {
      declarationFilePath: filePath,
      declarationLine: 0,
      properties: [],
      signature: 'interface PageFrontmatter',
    },
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

function buildPageFrontmatterMetadata(
  sourceFile: TypeScript.SourceFile,
  checker: TypeScript.TypeChecker,
) {
  const declaration = findNamedTypeDeclaration(sourceFile, 'PageFrontmatter')
  if (!declaration) return undefined

  const declarationName = declaration.name
  if (!declarationName) return undefined

  const declarationSymbol = checker.getSymbolAtLocation(declarationName)
  const resolvedSymbol = resolveAliasedSymbol(checker, declarationSymbol)
  if (!resolvedSymbol) return undefined

  const type = checker.getTypeAtLocation(declarationName)

  return {
    declarationFilePath: declaration.getSourceFile().fileName,
    declarationLine: getLineNumber(declaration),
    description: getSymbolDocumentation(checker, resolvedSymbol),
    properties: buildTypeProperties(
      type,
      ['PageFrontmatter'],
      checker,
      new Set<string>(),
    ),
    signature: getTypeSignature(checker, resolvedSymbol, type, declaration),
  }
}

function buildTypeProperties(
  type: TypeScript.Type,
  parentPath: string[],
  checker: TypeScript.TypeChecker,
  visitedTypes: Set<string>,
) {
  const apparentType = checker.getApparentType(type)
  const properties: FrontmatterPropertyMetadata[] = []
  const allowUnknownKeys = hasStringIndexSignature(apparentType, checker)

  for (const propertySymbol of checker.getPropertiesOfType(apparentType)) {
    const propertyName = propertySymbol.getName()
    const declaration = getPreferredPropertyDeclaration(propertySymbol)
    if (!declaration) continue

    const propertyType = checker.getTypeOfSymbolAtLocation(
      propertySymbol,
      declaration,
    )
    const propertyPath = [...parentPath, propertyName]
    const typeInfo = analyzeType(
      checker,
      propertyType,
      propertyPath,
      visitedTypes,
    )

    properties.push({
      allowUnknownKeys:
        typeInfo.kind === 'object'
          ? typeInfo.allowUnknownKeys
          : allowUnknownKeys,
      declarationFilePath: declaration.getSourceFile().fileName,
      declarationLine: getLineNumber(declaration),
      description: getSymbolDocumentation(checker, propertySymbol),
      fullPath: propertyPath,
      kind: typeInfo.kind,
      name: propertyName,
      nestedProperties: typeInfo.nestedProperties,
      optional: isOptionalPropertySymbol(propertySymbol),
      signature: getPropertySignature(
        checker,
        propertyName,
        propertySymbol,
        declaration,
      ),
      values: typeInfo.values,
    })
  }

  return properties
}

function analyzeType(
  checker: TypeScript.TypeChecker,
  type: TypeScript.Type,
  propertyPath: string[],
  visitedTypes: Set<string>,
): AnalyzedFrontmatterType {
  const normalizedType = checker.getNonNullableType(type)

  if (normalizedType.isUnion()) {
    const literalValues: string[] = []
    let includesBoolean = false
    let includesBroadString = false
    let includesBroadNumber = false
    const objectMembers: TypeScript.Type[] = []

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
      if (literalValue !== undefined) {
        if (literalValue === 'true' || literalValue === 'false') {
          includesBoolean = true
          continue
        }

        literalValues.push(literalValue)
        continue
      }

      if (isObjectLikeType(memberType)) {
        objectMembers.push(memberType)
        continue
      }

      return { allowUnknownKeys: false, kind: 'unknown' }
    }

    if (literalValues.length > 0) {
      return {
        allowUnknownKeys: false,
        kind: 'enum',
        values: Array.from(
          new Set(
            includesBoolean
              ? [...literalValues, 'true', 'false']
              : literalValues,
          ),
        ),
      }
    }

    if (
      includesBoolean &&
      !includesBroadString &&
      !includesBroadNumber &&
      objectMembers.length === 0
    ) {
      return {
        allowUnknownKeys: false,
        kind: 'boolean',
        values: ['true', 'false'],
      }
    }

    if (
      objectMembers.length > 0 &&
      !includesBroadString &&
      !includesBroadNumber &&
      !includesBoolean
    ) {
      const objectMember = objectMembers[0]
      return analyzeObjectType(
        checker,
        objectMember,
        propertyPath,
        visitedTypes,
      )
    }

    if (includesBroadString) return { allowUnknownKeys: false, kind: 'string' }
    if (includesBroadNumber) return { allowUnknownKeys: false, kind: 'number' }

    return { allowUnknownKeys: false, kind: 'unknown' }
  }

  if (isBooleanType(normalizedType)) {
    return {
      allowUnknownKeys: false,
      kind: 'boolean',
      values: ['true', 'false'],
    }
  }

  if (isStringType(normalizedType)) {
    return { allowUnknownKeys: false, kind: 'string' }
  }

  if (isNumberType(normalizedType)) {
    return { allowUnknownKeys: false, kind: 'number' }
  }

  const literalValue = getLiteralCompletionValue(normalizedType, checker)
  if (literalValue === 'true' || literalValue === 'false') {
    return {
      allowUnknownKeys: false,
      kind: 'boolean',
      values: ['true', 'false'],
    }
  }

  if (literalValue !== undefined) {
    return {
      allowUnknownKeys: false,
      kind: 'enum',
      values: [literalValue],
    }
  }

  if (isObjectLikeType(normalizedType)) {
    return analyzeObjectType(
      checker,
      normalizedType,
      propertyPath,
      visitedTypes,
    )
  }

  return { allowUnknownKeys: false, kind: 'unknown' }
}

function analyzeObjectType(
  checker: TypeScript.TypeChecker,
  type: TypeScript.Type,
  propertyPath: string[],
  visitedTypes: Set<string>,
): AnalyzedFrontmatterType {
  const typeKey = checker.typeToString(type)
  if (visitedTypes.has(typeKey)) {
    return {
      allowUnknownKeys: hasStringIndexSignature(type, checker),
      kind: 'object',
      nestedProperties: [],
    }
  }

  const nextVisitedTypes = new Set(visitedTypes)
  nextVisitedTypes.add(typeKey)

  return {
    allowUnknownKeys: hasStringIndexSignature(type, checker),
    kind: 'object',
    nestedProperties: buildTypeProperties(
      type,
      propertyPath,
      checker,
      nextVisitedTypes,
    ),
  }
}

function findNamedTypeDeclaration(
  sourceFile: TypeScript.SourceFile,
  typeName: string,
) {
  for (const statement of sourceFile.statements) {
    if (
      (ts.isInterfaceDeclaration(statement) ||
        ts.isTypeAliasDeclaration(statement) ||
        ts.isClassDeclaration(statement)) &&
      statement.name?.text === typeName
    ) {
      return statement
    }
  }

  return undefined
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

function getTypeSignature(
  checker: TypeScript.TypeChecker,
  symbol: TypeScript.Symbol,
  type: TypeScript.Type,
  declaration?: TypeScript.Declaration,
) {
  if (declaration && ts.isInterfaceDeclaration(declaration)) {
    return `interface ${declaration.name.text}`
  }

  if (declaration && ts.isTypeAliasDeclaration(declaration)) {
    return `type ${declaration.name.text} = ${declaration.type.getText(declaration.getSourceFile())}`
  }

  if (declaration && ts.isClassDeclaration(declaration)) {
    return `class ${declaration.name?.text ?? symbol.getName()}`
  }

  return `type ${symbol.getName()} = ${checker.typeToString(type)}`
}

function getPropertySignature(
  checker: TypeScript.TypeChecker,
  propertyName: string,
  propertySymbol: TypeScript.Symbol,
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

  const location =
    declaration ??
    propertySymbol.valueDeclaration ??
    propertySymbol.declarations?.[0]
  if (!location) return propertyName

  const propertyType = checker.getTypeOfSymbolAtLocation(
    propertySymbol,
    location,
  )
  return `${propertyName}: ${checker.typeToString(propertyType)}`
}

function getSymbolDocumentation(
  checker: TypeScript.TypeChecker,
  symbol?: TypeScript.Symbol,
) {
  const resolvedSymbol = resolveAliasedSymbol(checker, symbol) ?? symbol
  if (!resolvedSymbol) return undefined

  const documentation = ts.displayPartsToString(
    resolvedSymbol.getDocumentationComment(checker),
  )

  return documentation || undefined
}

function resolveAliasedSymbol(
  checker: TypeScript.TypeChecker,
  symbol?: TypeScript.Symbol,
) {
  if (!symbol) return undefined
  if ((symbol.flags & ts.SymbolFlags.Alias) === 0) return symbol

  try {
    return checker.getAliasedSymbol(symbol)
  } catch {
    return symbol
  }
}

function isOptionalPropertySymbol(symbol: TypeScript.Symbol) {
  return (symbol.flags & ts.SymbolFlags.Optional) !== 0
}

function hasStringIndexSignature(
  type: TypeScript.Type,
  checker: TypeScript.TypeChecker,
) {
  return checker.getIndexTypeOfType(type, ts.IndexKind.String) !== undefined
}

function isObjectLikeType(type: TypeScript.Type) {
  return (
    (type.flags & ts.TypeFlags.Object) !== 0 ||
    (type.flags & ts.TypeFlags.NonPrimitive) !== 0
  )
}

function isBooleanType(type: TypeScript.Type) {
  return (type.flags & ts.TypeFlags.Boolean) !== 0
}

function isStringType(type: TypeScript.Type) {
  return (type.flags & ts.TypeFlags.String) !== 0
}

function isNumberType(type: TypeScript.Type) {
  return (type.flags & ts.TypeFlags.Number) !== 0
}

function getLiteralCompletionValue(
  type: TypeScript.Type,
  checker: TypeScript.TypeChecker,
) {
  if ((type.flags & ts.TypeFlags.StringLiteral) !== 0) {
    return (type as TypeScript.StringLiteralType).value
  }

  if ((type.flags & ts.TypeFlags.BooleanLiteral) !== 0) {
    const typeText = checker.typeToString(type)
    return typeText === 'true' || typeText === 'false' ? typeText : undefined
  }

  return undefined
}

function getLineNumber(node: TypeScript.Node) {
  const sourceFile = node.getSourceFile()
  return sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
    .line
}

function getProjectCacheKey(filePath: string) {
  const configPath = ts.findConfigFile(
    path.dirname(filePath),
    ts.sys.fileExists,
  )
  return configPath ?? `__single__:${filePath}`
}

function getMetadataVersion(filePath: string) {
  return getFileVersion(filePath)
}

function getFileVersion(filePath: string) {
  try {
    return fs.statSync(filePath).mtimeMs.toString()
  } catch {
    return '0'
  }
}
