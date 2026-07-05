import * as vscode from 'vscode'
import { formatHtmlFragment, getHtmlFormattingOptions } from './htmlFormatting'
import {
  getMdxMarkupBlocks,
  type MdxMarkupBlock,
  maskMdxExpressions,
} from './mdxFormatting'
import { maskMdxFencedRegions } from './mdxFenceFormatting'
import {
  getSupportedTaggedTemplates,
  type SupportedTaggedTemplate,
} from './templateFormatting'

const TEMPLATE_DIAGNOSTIC_SOURCE = 'PureStack HTML'

export function registerTemplateDiagnostics() {
  const collection = vscode.languages.createDiagnosticCollection(
    'purestack-html-templates',
  )

  const refreshDocumentDiagnostics = async (document: vscode.TextDocument) => {
    if (document.languageId !== 'typescript' && document.languageId !== 'mdx') {
      collection.delete(document.uri)
      return
    }

    collection.set(document.uri, await buildDocumentDiagnostics(document))
  }

  for (const document of vscode.workspace.textDocuments) {
    void refreshDocumentDiagnostics(document)
  }

  const changeSubscription = vscode.workspace.onDidChangeTextDocument(
    (event) => {
      void refreshDocumentDiagnostics(event.document)
    },
  )
  const openSubscription = vscode.workspace.onDidOpenTextDocument(
    (document) => {
      void refreshDocumentDiagnostics(document)
    },
  )
  const closeSubscription = vscode.workspace.onDidCloseTextDocument(
    (document) => {
      collection.delete(document.uri)
    },
  )

  return vscode.Disposable.from(
    collection,
    changeSubscription,
    openSubscription,
    closeSubscription,
  )
}

async function buildDocumentDiagnostics(document: vscode.TextDocument) {
  if (document.languageId === 'typescript') {
    return buildTemplateDiagnostics(document)
  }

  if (document.languageId === 'mdx') {
    return buildMdxDiagnostics(document)
  }

  return []
}

async function buildTemplateDiagnostics(document: vscode.TextDocument) {
  const templates = getSupportedTaggedTemplates(document)
  const diagnostics: vscode.Diagnostic[] = []

  for (const template of templates) {
    const diagnostic = await buildTemplateDiagnostic(document, template)
    if (diagnostic) diagnostics.push(diagnostic)
  }

  return diagnostics
}

async function buildMdxDiagnostics(document: vscode.TextDocument) {
  const blocks = getMdxMarkupBlocks(document, { includeIncomplete: true })
  const diagnostics: vscode.Diagnostic[] = []

  for (const block of blocks) {
    const diagnostic = await buildMdxDiagnostic(document, block)
    if (diagnostic) diagnostics.push(diagnostic)
  }

  return diagnostics
}

async function buildTemplateDiagnostic(
  document: vscode.TextDocument,
  template: SupportedTaggedTemplate,
) {
  const source = sanitizeTemplateForDiagnostics(template)
  if (!source.includes('<')) return undefined

  try {
    await formatHtmlFragment(source, getHtmlFormattingOptions(document))
    return undefined
  } catch (error) {
    if (!isPrettierSyntaxError(error)) return undefined

    const range = resolveDiagnosticRange(document, template, error)
    const diagnostic = new vscode.Diagnostic(
      range,
      error.message.split('\n')[0],
      vscode.DiagnosticSeverity.Error,
    )
    diagnostic.source = TEMPLATE_DIAGNOSTIC_SOURCE
    return diagnostic
  }
}

async function buildMdxDiagnostic(
  document: vscode.TextDocument,
  block: MdxMarkupBlock,
) {
  const source = sanitizeMdxBlockForDiagnostics(block)
  if (!source.includes('<')) return undefined

  try {
    await formatHtmlFragment(source, getHtmlFormattingOptions(document))
    return undefined
  } catch (error) {
    if (!isPrettierSyntaxError(error)) return undefined

    const range = resolveDocumentDiagnosticRange(
      document,
      block.range.start,
      block.content,
      error,
    )
    const diagnostic = new vscode.Diagnostic(
      range,
      error.message.split('\n')[0],
      vscode.DiagnosticSeverity.Error,
    )
    diagnostic.source = TEMPLATE_DIAGNOSTIC_SOURCE
    return diagnostic
  }
}

function sanitizeTemplateForDiagnostics(template: SupportedTaggedTemplate) {
  const chars = template.content.split('')

  for (const range of template.interpolationRanges) {
    const end = Math.min(chars.length, range.end)
    for (let index = Math.max(0, range.start); index < end; index++) {
      chars[index] = ' '
    }
  }

  return chars.join('')
}

function sanitizeMdxBlockForDiagnostics(block: MdxMarkupBlock) {
  const { placeholderContent: fencePlaceholderContent } = maskMdxFencedRegions(
    block.content,
  )
  return maskMdxExpressions(fencePlaceholderContent).placeholderContent
}

function isPrettierSyntaxError(error: unknown): error is {
  message: string
  loc?: {
    start?: { line?: number; column?: number }
    end?: { line?: number; column?: number }
  }
} {
  return !!error && typeof error === 'object' && 'message' in error
}

function resolveDiagnosticRange(
  document: vscode.TextDocument,
  template: SupportedTaggedTemplate,
  error: {
    loc?: {
      start?: { line?: number; column?: number }
      end?: { line?: number; column?: number }
    }
  },
) {
  return resolveDocumentDiagnosticRange(
    document,
    template.contentRange.start,
    template.content,
    error,
  )
}

function resolveDocumentDiagnosticRange(
  document: vscode.TextDocument,
  blockStart: vscode.Position,
  content: string,
  error: {
    loc?: {
      start?: { line?: number; column?: number }
      end?: { line?: number; column?: number }
    }
  },
) {
  const blockStartOffset = document.offsetAt(blockStart)
  const startOffset =
    blockStartOffset +
    getOffsetFromLineAndColumn(
      content,
      error.loc?.start?.line ?? 1,
      error.loc?.start?.column ?? 1,
    )
  const endOffset =
    blockStartOffset +
    getOffsetFromLineAndColumn(
      content,
      error.loc?.end?.line ?? error.loc?.start?.line ?? 1,
      error.loc?.end?.column ??
        (error.loc?.start?.column ? error.loc.start.column + 1 : 2),
    )

  const start = document.positionAt(startOffset)
  const end = document.positionAt(Math.max(startOffset + 1, endOffset))
  return new vscode.Range(start, end)
}

function getOffsetFromLineAndColumn(
  text: string,
  lineNumber: number,
  columnNumber: number,
) {
  const lines = text.split('\n')
  let offset = 0

  for (
    let index = 0;
    index < Math.max(0, lineNumber - 1) && index < lines.length;
    index++
  ) {
    offset += lines[index].length + 1
  }

  return offset + Math.max(0, columnNumber - 1)
}
