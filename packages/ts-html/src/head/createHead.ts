import { h, TSNode } from '@purestack/ts-html'

import {
  HttpEquivMetaTag,
  LinkTag,
  NameMetaTag,
  PropertyMetaTag,
  ScriptTag,
  StyleTag,
} from './head'
import { HeadConfig } from './headConfig'

export function createHead(config: HeadConfig): TSNode<'head'> {
  const head = h('head')
  const meta = h('meta')
  const children = new Array<TSNode<''>>()

  if (config.charset) children.push(meta.attr({ charset: config.charset }))
  if (config.title) children.push(h('title').push(h().text(config.title)))

  if (config.base) {
    const { href, target } = config.base
    children.push(h('base').attrAll({ href, target }))
  }

  config.nameMetas?.forEach((m: NameMetaTag) => {
    children.push(meta.attr(m))
  })

  config.propertyMetas?.forEach((m: PropertyMetaTag) => {
    children.push(meta.attr(m))
  })

  config.httpEquivMetas?.forEach((m: HttpEquivMetaTag) => {
    children.push(
      meta.attr({
        'http-equiv': m.httpEquiv,
        content: m.content,
      }),
    )
  })

  config.links?.forEach((link: LinkTag) => {
    const attrs = {
      ...link,
    }
    children.push(h('link').attr(attrs))
  })

  config.styles?.forEach((style: StyleTag) => {
    children.push(h('style').raw(style.cssText))
  })

  config.scripts?.forEach((script: ScriptTag) => {
    const { src, type, async, defer, integrity, nonce, content } = script

    const attrs: Record<string, string> = {}
    if (src) attrs.src = src
    if (type) attrs.type = type
    if (async) attrs.async = '' // boolean attrs rendered as present
    if (defer) attrs.defer = ''
    if (integrity) attrs.integrity = integrity
    if (nonce) attrs.nonce = nonce

    const node = h('script').attr(attrs)
    children.push(content ? node.raw(content) : node)
  })

  if (config.noscript) children.push(h('noscript').raw(config.noscript.content))

  return head.push(...children)
}
