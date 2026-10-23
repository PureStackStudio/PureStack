import type * as TypeScript from 'typescript-parser'
import ts from 'typescript-parser'
import { maskRegorExpressions, restoreRegorExpressions } from './expressions'

import { formatHtmlFragment, normalizeSelfClosingTagSpacing } from './html'
import {
  intersects,
  type SourceEdit,
  type SourceRange,
  type SourceText,
} from './source'

export type SupportedTemplateTagName = 'html' | 'svg'

export interface SupportedTaggedTemplate {
  content: string
  contentRange: SourceRange
  expressions: TemplateExpressionPlaceholder[]
  interpolationRanges: Array<{ start: number; end: number }>
  placeholderContent: string
  tagName: SupportedTemplateTagName
}

interface TemplateExpressionPlaceholder {
  placeholder: string
  source: string
}

const SUPPORTED_TEMPLATE_TAG_NAMES: SupportedTemplateTagName[] = ['html', 'svg']

interface TemplateFormattingRequest {
  onlyWithinRange?: SourceRange
}

export async function buildTemplateFormattingEdits(
  document: SourceText,
  request: TemplateFormattingRequest = {},
) {
  const templates = getSupportedTaggedTemplates(document).filter((template) =>
    request.onlyWithinRange
      ? intersects(template.contentRange, request.onlyWithinRange)
      : true,
  )
  if (templates.length === 0) return []

  const edits: SourceEdit[] = []

  for (const template of templates) {
    const formatted = await formatTaggedTemplate(document, template)
    if (!formatted || formatted === template.content) continue

    edits.push({
      ...template.contentRange,
      newText: document.preserveEol(formatted),
    })
  }

  return edits
}

export function getSupportedTaggedTemplates(
  document: SourceText,
): SupportedTaggedTemplate[] {
  const sourceText = document.text
  const sourceFile = ts.createSourceFile(
    document.filePath,
    sourceText,
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )
  const templates: SupportedTaggedTemplate[] = []

  visitNode(sourceFile)
  return templates

  function visitNode(node: TypeScript.Node) {
    if (ts.isTaggedTemplateExpression(node)) {
      const template = createSupportedTaggedTemplate(node, sourceFile)
      if (template) {
        templates.push(template)
        // The outer template owns its interpolations; never emit overlapping edits.
        return
      }
    }

    ts.forEachChild(node, visitNode)
  }
}

export function isOffsetInsideSupportedTaggedTemplate(
  sourceFile: TypeScript.SourceFile,
  offset: number,
) {
  let isInsideTemplate = false

  visitNode(sourceFile)
  return isInsideTemplate

  function visitNode(node: TypeScript.Node) {
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
  node: TypeScript.TaggedTemplateExpression,
  sourceFile: TypeScript.SourceFile,
) {
  const tagName = getSupportedTemplateTagName(node.tag.getText(sourceFile))
  if (!tagName) return undefined

  const template = node.template
  if (isLikelyPrematureRawBacktickClose(sourceFile.text, template)) {
    return undefined
  }

  const innerStart = template.getStart(sourceFile) + 1
  const innerEnd = template.getEnd() - 1
  if (innerEnd < innerStart) return undefined

  const contentRange = { start: innerStart, end: innerEnd }

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

function isLikelyPrematureRawBacktickClose(
  sourceText: string,
  template: TypeScript.TemplateLiteral,
) {
  return sourceText.startsWith('``', template.getEnd())
}

function sliceTemplateHeadContent(
  head: TypeScript.TemplateHead,
  sourceFile: TypeScript.SourceFile,
) {
  return sourceFile.text.slice(head.getStart(sourceFile) + 1, head.getEnd() - 2)
}

function sliceTemplateSpanLiteralContent(
  literal: TypeScript.TemplateMiddle | TypeScript.TemplateTail,
  sourceFile: TypeScript.SourceFile,
) {
  const endOffset = ts.isTemplateTail(literal) ? 1 : 2
  return sourceFile.text.slice(
    literal.getStart(sourceFile) + 1,
    literal.getEnd() - endOffset,
  )
}

async function formatTaggedTemplate(
  document: SourceText,
  template: SupportedTaggedTemplate,
) {
  const formattingOptions = document.options
  const source = template.placeholderContent.trim()
  const { expressions: regorExpressions, placeholderContent } =
    maskRegorExpressions(source)

  if (!placeholderContent.includes('<')) return undefined

  let formatted: string
  try {
    formatted = await formatHtmlFragment(placeholderContent, formattingOptions)
  } catch (error) {
    document.report(template.contentRange, error)
    return undefined
  }

  const restoredTemplateExpressions = restoreTemplateExpressions(
    normalizeSelfClosingTagSpacing(formatted.trim()),
    template.expressions,
  )

  return restoreRegorExpressions(restoredTemplateExpressions, regorExpressions)
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
