import type { Element, Root, Text } from 'hast'
import { fromHtml } from 'hast-util-from-html'

import type { MdxCodeHighlighter } from './highlight'

export function applyShikiHighlighting(
  root: Root,
  highlighter: MdxCodeHighlighter,
) {
  const visit = (node: Root | Element) => {
    const children = node.children ?? []
    for (let index = 0; index < children.length; index += 1) {
      const child = children[index]
      if (child.type !== 'element') continue
      if (child.tagName === 'pre') {
        const highlighted = highlightPre(child, highlighter)
        if (highlighted) {
          children[index] = highlighted
          continue
        }
      }
      if (child.children && child.children.length > 0) {
        visit(child)
      }
    }
  }
  visit(root)
}

function highlightPre(
  pre: Element,
  highlighter: MdxCodeHighlighter,
): Element | undefined {
  const code = pre.children?.find(
    (child) => child.type === 'element' && child.tagName === 'code',
  ) as Element | undefined
  if (!code) return undefined
  const language = resolveLanguage(code) ?? resolveLanguage(pre)
  const text = collectText(code).trimEnd()
  if (text.length === 0) return undefined
  const html = highlighter.codeToHtml(text, language)
  const parsed = fromHtml(html, { fragment: true })
  const replacement = parsed.children?.find(
    (child) => child.type === 'element' && child.tagName === 'pre',
  ) as Element | undefined
  if (!replacement) return undefined
  normalizeShikiPre(replacement)
  return replacement
}

function resolveLanguage(node: Element): string | undefined {
  const props = node.properties ?? {}
  const className = props.className
  const classList =
    typeof className === 'string'
      ? className.split(/\s+/g)
      : Array.isArray(className)
        ? className.filter(
            (value): value is string => typeof value === 'string',
          )
        : []
  for (const entry of classList) {
    if (entry.startsWith('language-')) return entry.slice('language-'.length)
    if (entry.startsWith('lang-')) return entry.slice('lang-'.length)
  }
  const dataLang = props['data-language']
  return typeof dataLang === 'string' ? dataLang : undefined
}

function collectText(node: Element | Text): string {
  if (node.type === 'text') return node.value
  let text = ''
  for (const child of node.children ?? []) {
    if (child.type === 'text') {
      text += child.value
      continue
    }
    if (child.type === 'element') {
      text += collectText(child)
    }
  }
  return text
}

function normalizeShikiPre(pre: Element) {
  if (!pre.properties) pre.properties = {}
  pre.properties.className = mergeClassNames(pre.properties.className, 'shiki')
  const style =
    typeof pre.properties.style === 'string' ? pre.properties.style : ''
  pre.properties.style = stripStyle(style, [
    'background',
    'background-color',
    'color',
  ])
}

function mergeClassNames(value: unknown, ...names: string[]) {
  const current =
    typeof value === 'string'
      ? value.split(/\s+/g)
      : Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : []
  for (const name of names) {
    if (!current.includes(name)) current.push(name)
  }
  return current
}

function stripStyle(style: string, keys: string[]) {
  if (!style) return style
  const entries = style
    .split(';')
    .map((entry) => entry.trim())
    .filter((entry) => entry.length > 0)
  const filtered: string[] = []
  for (const entry of entries) {
    const [key] = entry.split(':').map((part) => part.trim().toLowerCase())
    if (!key || keys.includes(key)) continue
    filtered.push(entry)
  }
  return filtered.join('; ')
}
