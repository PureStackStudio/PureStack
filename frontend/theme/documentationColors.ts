import type { Style } from '@purestack/ts-css'
import type { ThemePalette } from '@purestack/ts-style'

export type DocumentationColors = ReturnType<typeof createDocumentationColors>

export const documentationColorBindings: DocumentationColors = {
  canvas: 'var(--ps-studio-doc-canvas)',
  surface: 'var(--ps-studio-doc-surface)',
  code: 'var(--ps-studio-doc-code)',
  control: 'var(--ps-studio-doc-control)',
  ink: 'var(--ps-studio-doc-ink)',
  heading: 'var(--ps-studio-doc-heading)',
  muted: 'var(--ps-studio-doc-muted)',
  border: 'var(--ps-studio-doc-border)',
  shadow: 'var(--ps-studio-doc-shadow)',
  tint: 'var(--ps-studio-doc-tint)',
  elevation: 'var(--ps-studio-doc-elevation)',
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
    root.set(`--ps-studio-doc-${name}`, value)
  }
}
