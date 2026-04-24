import type { CSSProps } from '@purestack/ts-css'
import type { StyleBuilder } from './styles'
import type { ThemeName } from './themeAssets'
import type { ThemePaletteCurrent } from './themePalette'

interface States {
  rest?: Partial<CSSProps>
  hover?: Partial<CSSProps>
  active?: Partial<CSSProps>
  disabled?: Partial<CSSProps>
  all?: boolean
}
type Preset = Record<string, States>

export function createPresets(
  styleBuilder: StyleBuilder,
  current: ThemePaletteCurrent,
  theme: ThemeName,
) {
  createFills(current, styleBuilder, theme)
  createBorders(current, styleBuilder, theme)
  createText(current, styleBuilder, theme)
  createTextBg(current, styleBuilder, theme)
  createInset(current, styleBuilder, theme)
}

function createPreset(
  fills: Preset,
  styleBuilder: StyleBuilder,
  theme: string,
) {
  for (const key in fills) {
    createStates(styleBuilder, key, theme, fills[key])
  }
}
function createStates(
  styleBuilder: StyleBuilder,
  key: string,
  theme: string,
  states: States,
) {
  // TODO: add all if hasAll true
  const hasAll = !!states.all
  if (states.rest)
    styleBuilder.select(`.${key}, .${key}-all`, theme).css(states.rest)

  if (states.hover)
    styleBuilder
      .select(`.${key}-hover:hover, .${key}-all:hover`, theme)
      .css(states.hover)

  if (states.active)
    styleBuilder
      .select(
        `.${key}-active:active, .${key}-active.active, .${key}-all:active, .${key}-all.active`,
        theme,
      )
      .css(states.active)

  if (states.disabled)
    styleBuilder
      .select(`.${key}-disabled:disabled, .${key}-all:disabled`, theme)
      .css(states.disabled)
}

function createBorders(
  current: ThemePaletteCurrent,
  styleBuilder: StyleBuilder,
  theme: string,
) {
  const borders: Preset = {
    'tone-border': {
      all: true,
      rest: {
        borderColor: current.tone,
      },
      hover: {
        borderColor: current.tone,
      },
      active: {
        borderColor: current.tone,
      },
    },
    'tone-border-surface': {
      all: true,
      rest: {
        borderColor: current.surface.rest.border,
      },
      hover: {
        borderColor: current.surface.hover.border,
      },
      active: {
        borderColor: current.surface.active.border,
      },
      disabled: {
        borderColor: current.surface.disabled.border,
      },
    },
    'tone-border-surface-alt': {
      all: true,
      rest: {
        borderColor: current.surfaceAlt.rest.border,
      },
      hover: {
        borderColor: current.surfaceAlt.hover.border,
      },
      active: {
        borderColor: current.surfaceAlt.active.border,
      },
      disabled: {
        borderColor: current.surfaceAlt.disabled.border,
      },
    },
    'tone-border-button': {
      all: true,
      rest: {
        borderColor: current.button.rest.border,
      },
      hover: {
        borderColor: current.button.hover.border,
      },
      active: {
        borderColor: current.button.active.border,
      },
      disabled: {
        borderColor: current.button.disabled.border,
      },
    },
  }
  createPreset(borders, styleBuilder, theme)
}

function createFills(
  current: ThemePaletteCurrent,
  styleBuilder: StyleBuilder,
  theme: string,
) {
  const fills: Preset = {
    'tone-fill': {
      rest: {
        background: current.tone,
      },
      hover: {
        background: current.tone,
      },
      active: {
        background: current.tone,
      },
    },
    'tone-fill-surface': {
      all: true,
      rest: {
        background: current.surface.rest.background,
      },
      hover: {
        background: current.surface.hover.background,
      },
      active: {
        background: current.surface.active.background,
      },
      disabled: {
        background: current.surface.disabled.background,
      },
    },
    'tone-fill-surface-alt': {
      all: true,
      rest: {
        background: current.surfaceAlt.rest.background,
      },
      hover: {
        background: current.surfaceAlt.hover.background,
      },
      active: {
        background: current.surfaceAlt.active.background,
      },
      disabled: {
        background: current.surfaceAlt.disabled.background,
      },
    },
    'tone-fill-button': {
      all: true,
      rest: {
        background: current.button.rest.background,
      },
      hover: {
        background: current.button.hover.background,
      },
      active: {
        background: current.button.active.background,
      },
      disabled: {
        background: current.button.disabled.background,
      },
    },
  }
  createPreset(fills, styleBuilder, theme)
}

function createText(
  current: ThemePaletteCurrent,
  styleBuilder: StyleBuilder,
  theme: string,
) {
  const text: Preset = {
    'tone-text': {
      rest: {
        borderColor: current.tone,
      },
      hover: {
        borderColor: current.tone,
      },
      active: {
        borderColor: current.tone,
      },
    },
    'tone-text-surface': {
      all: true,
      rest: {
        borderColor: current.surface.rest.text,
      },
      hover: {
        borderColor: current.surface.hover.text,
      },
      active: {
        borderColor: current.surface.active.text,
      },
      disabled: {
        borderColor: current.surface.disabled.text,
      },
    },
    'tone-text-surface-alt': {
      all: true,
      rest: {
        borderColor: current.surfaceAlt.rest.text,
      },
      hover: {
        borderColor: current.surfaceAlt.hover.text,
      },
      active: {
        borderColor: current.surfaceAlt.active.text,
      },
      disabled: {
        borderColor: current.surfaceAlt.disabled.text,
      },
    },
    'tone-text-button': {
      all: true,
      rest: {
        borderColor: current.button.rest.text,
      },
      hover: {
        borderColor: current.button.hover.text,
      },
      active: {
        borderColor: current.button.active.text,
      },
      disabled: {
        borderColor: current.button.disabled.text,
      },
    },
  }
  createPreset(text, styleBuilder, theme)
}

function createTextBg(
  current: ThemePaletteCurrent,
  styleBuilder: StyleBuilder,
  theme: string,
) {
  const textBg: Preset = {
    'tone-text-bg-surface': {
      all: true,
      rest: {
        backgroundClip: 'text',
        backgroundImage: current.surface.rest.background,
        backgroundColor: current.surface.rest.background,
        color: 'transparent',
      },
      hover: {
        backgroundClip: 'text',
        backgroundImage: current.surface.hover.background,
        backgroundColor: current.surface.hover.background,
        color: 'transparent',
      },
      active: {
        backgroundClip: 'text',
        backgroundImage: current.surface.active.background,
        backgroundColor: current.surface.active.background,
        color: 'transparent',
      },
      disabled: {
        backgroundClip: 'text',
        backgroundImage: current.surface.disabled.background,
        backgroundColor: current.surface.disabled.background,
        color: 'transparent',
      },
    },
    'tone-text-bg-surface-alt': {
      all: true,
      rest: {
        backgroundClip: 'text',
        backgroundImage: current.surfaceAlt.rest.background,
        backgroundColor: current.surfaceAlt.rest.background,
        color: 'transparent',
      },
      hover: {
        backgroundClip: 'text',
        backgroundImage: current.surfaceAlt.hover.background,
        backgroundColor: current.surfaceAlt.hover.background,
        color: 'transparent',
      },
      active: {
        backgroundClip: 'text',
        backgroundImage: current.surfaceAlt.active.background,
        backgroundColor: current.surfaceAlt.active.background,
        color: 'transparent',
      },
      disabled: {
        backgroundClip: 'text',
        backgroundImage: current.surfaceAlt.disabled.background,
        backgroundColor: current.surfaceAlt.disabled.background,
        color: 'transparent',
      },
    },
    'tone-text-bg-button': {
      all: true,
      rest: {
        backgroundClip: 'text',
        backgroundImage: current.button.rest.background,
        backgroundColor: current.button.rest.background,
        color: 'transparent',
      },
      hover: {
        backgroundClip: 'text',
        backgroundImage: current.button.hover.background,
        backgroundColor: current.button.hover.background,
        color: 'transparent',
      },
      active: {
        backgroundClip: 'text',
        backgroundImage: current.button.active.background,
        backgroundColor: current.button.active.background,
        color: 'transparent',
      },
      disabled: {
        backgroundClip: 'text',
        backgroundImage: current.button.disabled.background,
        backgroundColor: current.button.disabled.background,
        color: 'transparent',
      },
    },
  }
  createPreset(textBg, styleBuilder, theme)
}

type Direction = 'top' | 'right' | 'bottom' | 'left' | 'all' | 'x' | 'y'
function createInsetString(
  directions: Direction | Direction[],
  size: string = '0.75em',
  color: string = 'red',
): string {
  const top = `inset 0 ${size} 0 0 ${color}`
  const right = `inset -${size} 0 0 0 ${color}`
  const bottom = `inset 0 -${size} 0 0 ${color}`
  const left = `inset ${size} 0 0 0 ${color}`
  const all = `inset 0 0 0 ${size} ${color}`

  const shadowMap: Record<Direction, string> = {
    top,
    right,
    bottom,
    left,
    all,
    x: `${left}, ${right}`, // Left and Right together
    y: `${top}, ${bottom}`, // Top and Bottom together
  }
  return (Array.isArray(directions) ? directions : [directions])
    .map((dir) => shadowMap[dir])
    .join(', ')
}

function createInset(
  current: ThemePaletteCurrent,
  styleBuilder: StyleBuilder,
  theme: string,
) {
  const size = '0.25em' // TODO: add optional css variable --inset-size
  const insetX: Partial<CSSProps> = {
    boxShadow: createInsetString('x', size, current.tone),
  }
  const insetY: Partial<CSSProps> = {
    boxShadow: createInsetString('y', size, current.tone),
  }
  const insetLeft: Partial<CSSProps> = {
    boxShadow: createInsetString('left', size, current.tone),
  }
  const insetRight: Partial<CSSProps> = {
    boxShadow: createInsetString('right', size, current.tone),
  }
  const insetTop: Partial<CSSProps> = {
    boxShadow: createInsetString('top', size, current.tone),
  }
  const insetBottom: Partial<CSSProps> = {
    boxShadow: createInsetString('bottom', size, current.tone),
  }
  const borders: Preset = {
    'tone-inset-x': {
      rest: insetX,
      hover: insetX,
      active: insetX,
    },
    'tone-inset-y': {
      rest: insetY,
      hover: insetY,
      active: insetY,
    },
    'tone-inset-left': {
      rest: insetLeft,
      hover: insetLeft,
      active: insetLeft,
    },
    'tone-inset-right': {
      rest: insetRight,
      hover: insetRight,
      active: insetRight,
    },
    'tone-inset-top': {
      rest: insetTop,
      hover: insetTop,
      active: insetTop,
    },
    'tone-inset-bottom': {
      rest: insetBottom,
      hover: insetBottom,
      active: insetBottom,
    },
  }
  createPreset(borders, styleBuilder, theme)
}
