/** Perceptual lightness and material contrast, independent of the hue family. */
export interface SurfaceProfile {
  canvas: number
  surface: number
  surfaceAlt: number
  control: number
  border: number
  borderSubtle: number
  ink: number
  muted: number
  chroma: number
  tint: number
  shadow: number
}

/** Each preset has its own tonal hierarchy rather than sharing a tinted ramp. */
export const surfaceProfiles = {
  // Crisp slate, white cards, and clearly inset code surfaces.
  cobalt: {
    light: {
      canvas: 0.956,
      surface: 0.995,
      surfaceAlt: 0.928,
      control: 0.958,
      border: 0.78,
      borderSubtle: 0.865,
      ink: 0.25,
      muted: 0.45,
      chroma: 0.08,
      tint: 0.16,
      shadow: 0.85,
    },
    dark: {
      canvas: 0.255,
      surface: 0.34,
      surfaceAlt: 0.312,
      control: 0.405,
      border: 0.51,
      borderSubtle: 0.445,
      ink: 0.94,
      muted: 0.79,
      chroma: 0.2,
      tint: 0.2,
      shadow: 0.85,
    },
  },
  // Airier lavender with soft, elevated panels.
  violet: {
    light: {
      canvas: 0.965,
      surface: 0.995,
      surfaceAlt: 0.945,
      control: 0.925,
      border: 0.81,
      borderSubtle: 0.89,
      ink: 0.28,
      muted: 0.46,
      chroma: 0.1,
      tint: 0.12,
      shadow: 1.1,
    },
    dark: {
      canvas: 0.3,
      surface: 0.39,
      surfaceAlt: 0.355,
      control: 0.44,
      border: 0.54,
      borderSubtle: 0.475,
      ink: 0.95,
      muted: 0.81,
      chroma: 0.14,
      tint: 0.14,
      shadow: 1.1,
    },
  },
  // Mineral surfaces with stronger, graphic separation.
  teal: {
    light: {
      canvas: 0.947,
      surface: 0.984,
      surfaceAlt: 0.914,
      control: 0.942,
      border: 0.76,
      borderSubtle: 0.85,
      ink: 0.255,
      muted: 0.44,
      chroma: 0.12,
      tint: 0.18,
      shadow: 0.7,
    },
    dark: {
      canvas: 0.27,
      surface: 0.365,
      surfaceAlt: 0.33,
      control: 0.43,
      border: 0.525,
      borderSubtle: 0.455,
      ink: 0.94,
      muted: 0.8,
      chroma: 0.18,
      tint: 0.18,
      shadow: 0.7,
    },
  },
  // Muted forest materials, softer than the mineral palette.
  emerald: {
    light: {
      canvas: 0.96,
      surface: 0.99,
      surfaceAlt: 0.93,
      control: 0.91,
      border: 0.79,
      borderSubtle: 0.875,
      ink: 0.26,
      muted: 0.45,
      chroma: 0.075,
      tint: 0.12,
      shadow: 0.9,
    },
    dark: {
      canvas: 0.285,
      surface: 0.36,
      surfaceAlt: 0.34,
      control: 0.41,
      border: 0.5,
      borderSubtle: 0.44,
      ink: 0.94,
      muted: 0.8,
      chroma: 0.115,
      tint: 0.12,
      shadow: 0.9,
    },
  },
  // Warm paper in light mode; a brighter bronze surfaces in dark mode.
  amber: {
    light: {
      canvas: 0.945,
      surface: 0.985,
      surfaceAlt: 0.91,
      control: 0.94,
      border: 0.75,
      borderSubtle: 0.84,
      ink: 0.28,
      muted: 0.44,
      chroma: 0.16,
      tint: 0.16,
      shadow: 1.15,
    },
    dark: {
      canvas: 0.325,
      surface: 0.42,
      surfaceAlt: 0.385,
      control: 0.47,
      border: 0.57,
      borderSubtle: 0.5,
      ink: 0.96,
      muted: 0.835,
      chroma: 0.2,
      tint: 0.14,
      shadow: 1.15,
    },
  },
  // Clean blush paper and restrained, warm stone layers.
  rose: {
    light: {
      canvas: 0.972,
      surface: 0.999,
      surfaceAlt: 0.944,
      control: 0.928,
      border: 0.82,
      borderSubtle: 0.89,
      ink: 0.265,
      muted: 0.46,
      chroma: 0.09,
      tint: 0.1,
      shadow: 0.9,
    },
    dark: {
      canvas: 0.295,
      surface: 0.38,
      surfaceAlt: 0.35,
      control: 0.44,
      border: 0.53,
      borderSubtle: 0.465,
      ink: 0.95,
      muted: 0.81,
      chroma: 0.1,
      tint: 0.1,
      shadow: 0.9,
    },
  },
} satisfies Record<string, { light: SurfaceProfile; dark: SurfaceProfile }>
