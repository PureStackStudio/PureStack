import { h } from '@purestack/ts-html'
import { createLogger, getLogger } from 'logpot'

async function main() {
  const logger = await createLogger({
    consoleTransport: {
      formatter: {
        kind: 'template',
        template: '\n{msg:#b40657}\n',
        printer: {
          objectFormatter: {
            showBrackets: false,
          },
        },
      },
    },
  })

  getLogger().debug(await run())
  await logger.close()
}

main().catch(console.error)

/**
 * Creates a <head> element populated with SEO tags according to SeoBasics.
 */
export function createHead(options: SeoBasics) {
  const meta = h('meta')
  const link = h('link')

  // Collect all tag descriptors
  const metaDescriptors: MetaTag[] = []
  const linkDescriptors: LinkTag[] = []

  // Basic tags
  if (options.charset) metaDescriptors.push({ charset: options.charset })
  if (options.viewport)
    metaDescriptors.push({ name: 'viewport', content: options.viewport })
  if (options.description)
    metaDescriptors.push({ name: 'description', content: options.description })

  // Custom collections
  if (options.metaTags) metaDescriptors.push(...options.metaTags)
  if (options.linkTags) linkDescriptors.push(...options.linkTags)

  // Open Graph and Twitter
  if (options.openGraph) {
    metaDescriptors.push(
      ...options.openGraph.map((tag) => ({
        property: tag.property,
        content: tag.content,
      })),
    )
  }
  if (options.twitter) {
    metaDescriptors.push(
      ...options.twitter.map((tag) => ({
        name: tag.name,
        content: tag.content,
      })),
    )
  }

  // Build children nodes
  const children = []

  // Title
  if (options.title) {
    children.push(h('title').children(h().text(options.title)))
  }

  // Render meta tags using Object.entries
  for (const desc of metaDescriptors) {
    const attrs = Object.entries(desc).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value !== undefined && value !== '') acc[key] = value
        return acc
      },
      {},
    )
    children.push(meta.attr(attrs))
  }

  // Render link tags using Object.entries
  for (const desc of linkDescriptors) {
    const attrs = Object.entries(desc).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value !== undefined && value !== '') acc[key] = value
        return acc
      },
      {},
    )
    children.push(link.attr(attrs))
  }

  return h('head').children(...children)
}

async function run() {
  const link = h('link')
  const meta = h('meta')
  const head = h('head').children(
    meta.attr({ charset: 'utf-8' }),
    meta.attr({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    }),
    h('title').children(h().text('Page | Page Title')),
    meta.attr({
      name: 'description',
      content: 'The purestack page.',
    }),
    link.attr({ rel: 'canonical', href: 'https://tenray.io/purestack' }),
    link.attr({
      rel: 'sitemap',
      href: 'https://tenray.io/purestack/sitemap-index.xml',
    }),
    link.attr({
      rel: 'shortcut icon',
      href: '/purestack/favicon.svg',
      type: 'image/svg+xml',
    }),
    meta.attr({
      name: 'generator',
      content: 'ts-ssg v1.0.0',
    }),
    meta.attrCustom({
      property: 'og:title',
      content: 'Page Title',
    }),
    meta.attrCustom({
      property: 'og:description',
      content: 'The purestack page.',
    }),
    meta.attrCustom({
      property: 'og:url',
      content: 'Page Title',
    }),
  )
  const html = h('html').attrCustom({
    lang: 'en',
    dir: 'ltr',
  })
  const body = h('body').children()
  const page = html.children(head, body)

  return await page.toPrettyHtml()
}
