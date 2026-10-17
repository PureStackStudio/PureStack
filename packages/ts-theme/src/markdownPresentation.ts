import type { Element, Root } from 'hast'

/** Runs after content transforms so tables they introduce receive theme markup too. */
export function markdownPresentation(): (root: Root) => void {
  return wrapTablesInScrollContainers
}

function wrapTablesInScrollContainers(root: Root) {
  const visit = (node: Root | Element) => {
    const children = node.children ?? []
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      if (child.type !== 'element') continue
      if (child.tagName === 'table' && !isTableScrollContainer(node)) {
        const wrapper: Element = {
          type: 'element',
          tagName: 'div',
          properties: { className: ['table-scroll'] },
          children: [child],
        }
        children[i] = wrapper
        continue
      }
      visit(child)
    }
  }
  visit(root)
}

function isTableScrollContainer(node: Root | Element): node is Element {
  if (node.type !== 'element' || node.tagName !== 'div') return false
  const className = node.properties?.className
  if (typeof className === 'string') {
    return className.split(/\s+/).includes('table-scroll')
  }
  if (Array.isArray(className)) {
    return className.includes('table-scroll')
  }
  return false
}
