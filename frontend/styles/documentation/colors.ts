import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'

export type DocumentationColors = ReturnType<typeof createDocumentationColors>

export const documentationColorBindings: DocumentationColors = {
  canvas: 'var(--ps-doc-canvas)',
  surface: 'var(--ps-doc-surface)',
  code: 'var(--ps-doc-code)',
  control: 'var(--ps-doc-control)',
  ink: 'var(--ps-doc-ink)',
  heading: 'var(--ps-doc-heading)',
  muted: 'var(--ps-doc-muted)',
  border: 'var(--ps-doc-border)',
  shadow: 'var(--ps-doc-shadow)',
  tint: 'var(--ps-doc-tint)',
  elevation: 'var(--ps-doc-elevation)',
}

/** Documentation uses the preset's actual hierarchy, including inset and control layers. */
export function createDocumentationColors(palette: ThemePalette) {
  const neutral = palette.semanticTone.neutral
  const shadow = `color-mix(in srgb, ${neutral.overlay} 22%, transparent)`

  return {
    canvas: neutral.canvas,
    surface: neutral.surface.rest.background,
    code: neutral.surfaceAlt.rest.background,
    control: neutral.button.rest.background,
    ink: neutral.surfaceAlt.rest.text,
    heading: neutral.text.default,
    muted: neutral.text.subtle,
    border: neutral.border.subtle,
    shadow,
    tint: palette.semanticTone.accent.surfaceAlt.rest.background,
    elevation: palette.effect.softShadow,
  }
}

export function setDocumentationColorVariables(
  root: Style,
  colors: DocumentationColors,
) {
  for (const [name, value] of Object.entries(colors)) {
    root.set(`--ps-doc-${name}`, value)
  }
}
