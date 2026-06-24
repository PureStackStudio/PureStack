import { describe, expect, it } from 'vitest'
import { stripRegorTemplateTags } from './regorTemplateTransform'

describe('stripRegorTemplateTags', () => {
  it('strips static Regor html and svg tagged templates', () => {
    const source = [
      "import { html, svg } from 'regor'",
      'const markup = html`<Btn>Save</Btn>`',
      'const icon = svg`<svg></svg>`',
    ].join('\n')

    const output = stripRegorTemplateTags(source)

    expect(output).toContain('const markup =     `<Btn>Save</Btn>`')
    expect(output).toContain('const icon =    `<svg></svg>`')
  })

  it('strips aliased and namespace Regor template imports', () => {
    const source = [
      "import { html as regorHtml } from 'regor'",
      "import * as Regor from 'regor'",
      'const markup = regorHtml`<Panel />`',
      'const icon = Regor.svg`<svg></svg>`',
    ].join('\n')

    const output = stripRegorTemplateTags(source)

    expect(output).toContain('const markup =          `<Panel />`')
    expect(output).toContain('const icon =          `<svg></svg>`')
  })

  it('strips after directives, comments, and multiple semicolon imports', () => {
    const source = [
      '"use client";',
      '// leading comment',
      "import { computed } from 'regor';",
      "import { html } from 'regor';",
      'const markup = html`<Panel />`',
    ].join('\n')

    const output = stripRegorTemplateTags(source)

    expect(output).toContain('const markup =     `<Panel />`')
  })

  it('strips after directive prologues without semicolons', () => {
    const source = [
      '"use client"',
      "import { html } from 'regor'",
      'const markup = html`<Panel />`',
    ].join('\n')

    const output = stripRegorTemplateTags(source)

    expect(output).toContain('const markup =     `<Panel />`')
  })

  it('does not strip non-Regor template tags', () => {
    const source = [
      "import { computed } from 'regor'",
      'const html = makeTemplateTag()',
      'const markup = html`<Panel />`',
    ].join('\n')

    expect(stripRegorTemplateTags(source)).toBe(source)
  })

  it('does not strip dynamic Regor templates', () => {
    const source = [
      "import { html } from 'regor'",
      'const markup = html`<Panel>${label}</Panel>`',
    ].join('\n')

    expect(stripRegorTemplateTags(source)).toBe(source)
  })

  it('does not strip when the imported tag name is shadowed', () => {
    const source = [
      "import { html } from 'regor'",
      'const render = (html: typeof String.raw) => html`<Panel />`',
    ].join('\n')

    expect(stripRegorTemplateTags(source)).toBe(source)
  })

  it('does not strip when the imported namespace is shadowed', () => {
    const source = [
      "import * as Regor from 'regor'",
      'function render(Regor: { html: typeof String.raw }) {',
      '  return Regor.html`<Panel />`',
      '}',
    ].join('\n')

    expect(stripRegorTemplateTags(source)).toBe(source)
  })

  it('ignores import-like text in comments', () => {
    const source = [
      "// import { html } from 'regor'",
      'const html = makeTemplateTag()',
      'const markup = html`<Panel />`',
    ].join('\n')

    expect(stripRegorTemplateTags(source)).toBe(source)
  })

  it('returns fast after the import prelude', () => {
    const source = [
      'console.log("boot")',
      "import { html } from 'regor'",
      'const markup = html`<Panel />`',
    ].join('\n')

    expect(stripRegorTemplateTags(source)).toBe(source)
  })
})
