import type { ThemePalette } from '@purestack/ts-style'
import type { DeepPartial } from '@purestack/ts-util'

export const studioSkinShared = {
  font: {
    family: {
      base: "'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif",
    },
    size: {
      xxxs: '0.5625rem',
      xxs: '0.625rem',
      xs: '0.6875rem',
      sm: '0.75rem',
      body: '0.875rem',
      h6: '1rem',
      h5: '1.0625rem',
      h4: '1.1875rem',
      h3: '1.5rem',
      h2: '2.125rem',
      h1: '2.6875rem',
      display: '5rem',
    },
  },
  radii: { sm: '4px', md: '6px', lg: '8px' },
} satisfies DeepPartial<ThemePalette>
