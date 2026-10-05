import { describe, expect, it } from 'vitest'
import { createContentProcessor } from './compile'
import { compileMarkdown } from './md'
import { compileMdx } from './mdx'

type TreeNode = {
  type: string
  value?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: TreeNode[]
}

function walk(node: TreeNode, visit: (node: TreeNode) => void) {
  visit(node)
  for (const child of node.children ?? []) walk(child, visit)
}

const shoutText = () => (tree: TreeNode) => {
  walk(tree, (node) => {
    if (node.type === 'text' && node.value)
      node.value = node.value.toUpperCase()
  })
}

const prefixHeadingIds = () => (tree: TreeNode) => {
  walk(tree, (node) => {
    if (node.tagName === 'h2') {
      node.properties = { ...node.properties, id: 'custom-heading' }
    }
  })
}

describe('content processor', () => {
  it('runs remark plugins on the Markdown tree', async () => {
    const result = await compileMdx('Plain words.', {
      contentProcessor: createContentProcessor([shoutText]),
    })

    expect(result.bodyHtml).toContain('<p>PLAIN WORDS.</p>')
  })

  it('runs rehype plugins before the outline is collected', async () => {
    const result = await compileMdx('## Install\n\nText.', {
      contentProcessor: createContentProcessor([], [prefixHeadingIds]),
    })

    expect(result.bodyHtml).toContain('<h2 id="custom-heading">Install</h2>')
    expect(result.outline).toEqual([
      { id: 'custom-heading', title: 'Install', depth: 2 },
    ])
  })

  it('awaits asynchronous plugins', async () => {
    const delayedClass = () => async (tree: TreeNode) => {
      await new Promise((resolve) => setTimeout(resolve, 5))
      walk(tree, (node) => {
        if (node.tagName === 'p') node.properties = { className: ['lead'] }
      })
    }

    const result = await compileMarkdown('Hello.', {
      contentProcessor: createContentProcessor([], [delayedClass]),
    })

    expect(result.bodyHtml).toContain('<p class="lead">Hello.</p>')
  })

  it('shares one file between remark and rehype plugins', async () => {
    const countWords =
      () => (tree: TreeNode, file: { data: Record<string, unknown> }) => {
        let words = 0
        walk(tree, (node) => {
          if (node.type === 'text')
            words += node.value?.split(/\s+/).length ?? 0
        })
        file.data.words = words
      }
    const stampWords =
      () => (tree: TreeNode, file: { data: Record<string, unknown> }) => {
        tree.children?.push({
          type: 'element',
          tagName: 'footer',
          properties: {},
          children: [{ type: 'text', value: `${file.data.words} words` }],
        })
      }

    const result = await compileMdx('Three short words', {
      contentProcessor: createContentProcessor([countWords], [stampWords]),
    })

    expect(result.bodyHtml).toContain('<footer>3 words</footer>')
  })

  it('passes the source path to plugins, with forward slashes', async () => {
    let seenPath: unknown
    const readPath = () => (_tree: TreeNode, file: { path?: string }) => {
      seenPath = file.path
    }

    await compileMdx('Text.', {
      sourceRelPath: 'guides\\plugins.mdx',
      contentProcessor: createContentProcessor([readPath]),
    })

    expect(seenPath).toBe('guides/plugins.mdx')
  })

  it('keeps Regor component markup intact through the plugins', async () => {
    const result = await compileMdx(
      '<Badge tone="accent">New</Badge>\n\nSome text.',
      {
        contentProcessor: createContentProcessor(
          [shoutText],
          [prefixHeadingIds],
        ),
      },
    )

    expect(result.bodyHtml).toContain('<Badge tone="accent">New</Badge>')
    expect(result.bodyHtml).toContain('<p>SOME TEXT.</p>')
  })
})
