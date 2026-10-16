import type { PageTemplateMap } from '@purestack/ts-common'

export function resolvePageTemplate(
  name: string | undefined,
  templates: PageTemplateMap = {},
) {
  const templateName = normalizeTemplateName(name)
  const pageTemplate = templates[templateName]
  if (!pageTemplate) {
    const known = Object.keys(templates).sort().join(', ')
    throw new Error(
      `Unknown page template "${templateName}". Known templates: ${known || 'none'}`,
    )
  }
  return { pageTemplate, templateName }
}

function normalizeTemplateName(name: string | undefined) {
  if (typeof name !== 'string') return 'doc'
  const trimmed = name.trim()
  return trimmed.length > 0 ? trimmed : 'doc'
}
