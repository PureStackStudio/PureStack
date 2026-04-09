import ts from 'typescript'
import * as vscode from 'vscode'
import {
  formatHtmlFragment,
  getHtmlFormattingOptions,
  getIndentUnit,
  getLineIndent,
  normalizeSelfClosingTagSpacing,
  shouldFormatOnSave,
} from './htmlFormatting'

export type SupportedTemplateTagName = 'html' | 'raw' | 'svg'

export interface SupportedTaggedTemplate {
  content: string
  contentRange: vscode.Range
  expressions: TemplateExpressionPlaceholder[]
  interpolationRanges: Array<{ start: number; end: number }>
  placeholderContent: string
  tagName: SupportedTemplateTagName
}

interface TemplateExpressionPlaceholder {
  placeholder: string
  source: string
}

const SUPPORTED_TEMPLATE_TAG_NAMES: SupportedTemplateTagName[] = [
  'html',
  'raw',
  'svg',
]

interface TemplateFormattingRequest {
  onlyWithinRange?: vscode.Range
  requireFormatOnSave?: boolean
}

export async function buildTemplateFormattingEdits(
  document: vscode.TextDocument,
  request: TemplateFormattingRequest = {},
) {
  if (document.languageId !== 'typescript') return []
  if (request.requireFormatOnSave && !shouldFormatTemplatesOnSave(document)) {
    return []
  }

  const templates = getSupportedTaggedTemplates(document).filter((template) =>
    request.onlyWithinRange
      ? template.contentRange.intersection(request.onlyWithinRange)
      : true,
  )
  if (templates.length === 0) return []

  const edits: vscode.TextEdit[] = []

  for (const template of templates) {
    const formatted = await formatTaggedTemplate(document, template)
    if (!formatted || formatted === template.content) continue

    edits.push(vscode.TextEdit.replace(template.contentRange, formatted))
  }

  return edits
}

export function getSupportedTaggedTemplates(
  document: vscode.TextDocument,
): SupportedTaggedTemplate[] {
  const sourceText = document.getText()
  const sourceFile = ts.createSourceFile(
    document.uri.fsPath,
    sourceText,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )
  const templates: SupportedTaggedTemplate[] = []

  visitNode(sourceFile)
  return templates

  function visitNode(node: ts.Node) {
    if (ts.isTaggedTemplateExpression(node)) {
      const template = createSupportedTaggedTemplate(node, sourceFile, document)
      if (template) templates.push(template)
    }

    ts.forEachChild(node, visitNode)
  }
}

export function isOffsetInsideSupportedTaggedTemplate(
  sourceFile: ts.SourceFile,
  offset: number,
) {
  let isInsideTemplate = false

  visitNode(sourceFile)
  return isInsideTemplate

  function visitNode(node: ts.Node) {
    if (isInsideTemplate) return
    if (offset < node.getStart(sourceFile) || offset >= node.getEnd()) return

    if (ts.isTaggedTemplateExpression(node)) {
      const templateTagName = getSupportedTemplateTagName(
        node.tag.getText(sourceFile),
      )
      if (!templateTagName) {
        ts.forEachChild(node, visitNode)
        return
      }

      const template = node.template
      if (
        offset >= template.getStart(sourceFile) &&
        offset < template.getEnd()
      ) {
        isInsideTemplate = true
        return
      }
    }

    ts.forEachChild(node, visitNode)
  }
}

function createSupportedTaggedTemplate(
  node: ts.TaggedTemplateExpression,
  sourceFile: ts.SourceFile,
  document: vscode.TextDocument,
) {
  const tagName = getSupportedTemplateTagName(node.tag.getText(sourceFile))
  if (!tagName) return undefined

  const template = node.template
  const innerStart = template.getStart(sourceFile) + 1
  const innerEnd = template.getEnd() - 1
  if (innerEnd < innerStart) return undefined

  const contentRange = new vscode.Range(
    document.positionAt(innerStart),
    document.positionAt(innerEnd),
  )

  if (ts.isNoSubstitutionTemplateLiteral(template)) {
    const content = sourceFile.text.slice(innerStart, innerEnd)
    return {
      content,
      contentRange,
      expressions: [],
      interpolationRanges: [],
      placeholderContent: content,
      tagName,
    }
  }

  const expressions: TemplateExpressionPlaceholder[] = []
  const interpolationRanges: Array<{ start: number; end: number }> = []
  let placeholderContent = sliceTemplateHeadContent(template.head, sourceFile)
  let currentContentOffset = placeholderContent.length

  template.templateSpans.forEach((span, index) => {
    const placeholder = `PURESTACK_EXPR_${index}_${tagName.toUpperCase()}`
    const interpolationEnd = span.literal.getStart(sourceFile) - innerStart + 1
    expressions.push({
      placeholder,
      source: sourceFile.text.slice(
        span.expression.getStart(sourceFile),
        span.expression.getEnd(),
      ),
    })
    interpolationRanges.push({
      start: currentContentOffset,
      end: interpolationEnd,
    })
    placeholderContent += placeholder
    const literalContent = sliceTemplateSpanLiteralContent(
      span.literal,
      sourceFile,
    )
    placeholderContent += literalContent
    currentContentOffset = interpolationEnd + literalContent.length
  })

  return {
    content: sourceFile.text.slice(innerStart, innerEnd),
    contentRange,
    expressions,
    interpolationRanges,
    placeholderContent,
    tagName,
  }
}

function getSupportedTemplateTagName(tagText: string) {
  const normalizedTag = tagText.trim()

  for (const tagName of SUPPORTED_TEMPLATE_TAG_NAMES) {
    if (normalizedTag === tagName || normalizedTag.endsWith(`.${tagName}`)) {
      return tagName
    }
  }

  return undefined
}

function sliceTemplateHeadContent(
  head: ts.TemplateHead,
  sourceFile: ts.SourceFile,
) {
  return sourceFile.text.slice(head.getStart(sourceFile) + 1, head.getEnd() - 2)
}

function sliceTemplateSpanLiteralContent(
  literal: ts.TemplateMiddle | ts.TemplateTail,
  sourceFile: ts.SourceFile,
) {
  const endOffset = ts.isTemplateTail(literal) ? 1 : 2
  return sourceFile.text.slice(
    literal.getStart(sourceFile) + 1,
    literal.getEnd() - endOffset,
  )
}

async function formatTaggedTemplate(
  document: vscode.TextDocument,
  template: SupportedTaggedTemplate,
) {
  const formattingOptions = getHtmlFormattingOptions(document)
  const source = template.placeholderContent.trim()

  if (!source.includes('<')) return undefined

  let formatted: string
  try {
    formatted = await formatHtmlFragment(source, formattingOptions)
  } catch (error) {
    console.warn(
      `[PureStack] Skipping template formatting for ${document.uri.fsPath}:`,
      error,
    )
    return undefined
  }

  const restored = restoreTemplateExpressions(
    normalizeSelfClosingTagSpacing(formatted.trim()),
    template.expressions,
  )

  if (!restored.includes('\n')) return restored

  const baseIndent = getLineIndent(
    document.lineAt(template.contentRange.start.line).text,
  )
  const indentUnit = getIndentUnit(formattingOptions)
  const indentedLines = restored
    .split(/\r?\n/)
    .map((line) =>
      line.length === 0 ? '' : `${baseIndent}${indentUnit}${line}`,
    )

  return `\n${indentedLines.join('\n')}\n${baseIndent}`
}

function restoreTemplateExpressions(
  formatted: string,
  expressions: TemplateExpressionPlaceholder[],
) {
  let restored = formatted

  for (const expression of expressions) {
    restored = restored
      .split(expression.placeholder)
      .join(`\${${expression.source}}`)
  }

  return restored
}

function shouldFormatTemplatesOnSave(document: vscode.TextDocument) {
  return shouldFormatOnSave(document)
}

export async function formatActiveEditorTemplates(
  editor: vscode.TextEditor,
  request: TemplateFormattingRequest = {},
) {
  const edits = await buildTemplateFormattingEdits(editor.document, {
    ...request,
  })
  if (edits.length === 0) return false

  return editor.edit((editBuilder) => {
    for (const edit of edits) {
      editBuilder.replace(edit.range, edit.newText)
    }
  })
}
