type Thenable<T> = PromiseLike<T>

declare module 'vscode' {
  export interface Disposable {
    dispose(): void
  }

  export interface ExtensionContext {
    subscriptions: Disposable[]
  }

  export class Position {
    constructor(line: number, character: number)
    readonly line: number
    readonly character: number
  }

  export class Range {
    constructor(start: Position, end: Position)
    readonly start: Position
    readonly end: Position
  }

  export class Uri {
    readonly fsPath: string
    static file(path: string): Uri
  }

  export class Location {
    constructor(uri: Uri, rangeOrPosition: Range | Position)
    readonly uri: Uri
    readonly range: Range
  }

  export interface TextLine {
    readonly text: string
  }

  export interface TextDocument {
    readonly uri: Uri
    readonly languageId: string
    getWordRangeAtPosition(
      position: Position,
      regex?: RegExp,
    ): Range | undefined
    getText(range?: Range): string
    lineAt(line: number): TextLine
    offsetAt(position: Position): number
  }

  export interface CancellationToken {}

  export interface DefinitionProvider {
    provideDefinition(
      document: TextDocument,
      position: Position,
      token: CancellationToken,
    ): ProviderResult<Location | Location[]>
  }

  export type DocumentSelector = ReadonlyArray<DocumentFilter | string>

  export interface DocumentFilter {
    readonly language?: string
    readonly scheme?: string
  }

  export type ProviderResult<T> =
    | T
    | undefined
    | null
    | Thenable<T | undefined | null>

  export namespace languages {
    function registerDefinitionProvider(
      selector: DocumentSelector,
      provider: DefinitionProvider,
    ): Disposable
  }

  export interface WorkspaceFolder {
    readonly uri: Uri
  }

  export namespace workspace {
    const workspaceFolders: readonly WorkspaceFolder[] | undefined
  }
}
