import { type ThemePalette, themeSkins } from '@purestack/ts-style'
import { type DeepPartial, merge } from '@purestack/ts-util'
import { studioSkinShared } from './studioSkinShared'

type StudioTone = ThemePalette['semanticTone']['neutral']

interface LightToneColors {
  ink: string
  muted: string
  fill: string
  hover: string
  active: string
  tint: string
  tintHover: string
  tintActive: string
  border: string
}

function state(background: string, border: string, text: string) {
  return { background, bgcolor: background, border, text }
}

function spotlight(lit: string, deep: string) {
  return {
    field: `linear-gradient(165deg, ${lit} 0%, ${deep} 75%)`,
    light: '#ffffff66',
  }
}

function createLightTone(colors: LightToneColors): StudioTone {
  const {
    ink,
    muted,
    fill,
    hover,
    active,
    tint,
    tintHover,
    tintActive,
    border,
  } = colors
  const disabled = state('#eef1ed', '#d5ddd5', '#5f6e62')
  return {
    tone: fill,
    canvas: tint,
    spotlight: spotlight(tint, tintActive),
    canvascolor: tint,
    overlay: '#14291e40',
    text: { default: ink, subtle: muted },
    border: { default: border, subtle: border, focus: fill },
    root: {
      text: { default: ink, subtle: muted },
      border: { default: border, subtle: border, focus: fill },
    },
    surface: {
      rest: state(tint, border, ink),
      hover: state(tintHover, fill, ink),
      active: state(tintActive, fill, ink),
      disabled,
      focusRing: fill,
    },
    surfaceAlt: {
      rest: state(tintHover, border, ink),
      hover: state(tintActive, fill, ink),
      active: state(tintActive, active, ink),
      disabled,
      focusRing: fill,
    },
    button: {
      rest: state(fill, fill, '#ffffff'),
      hover: state(hover, hover, '#ffffff'),
      active: state(active, active, '#ffffff'),
      disabled,
      focusRing: fill,
    },
  }
}

export function createStudioLightPalette(): ThemePalette {
  const neutral: StudioTone = {
    tone: '#51695b',
    canvas: '#f6f8f4',
    spotlight: spotlight('#ffffff', '#e4ede3'),
    canvascolor: '#f6f8f4',
    overlay: '#14291e40',
    text: { default: '#1c2d24', subtle: '#57695e' },
    border: { default: '#b5c5b9', subtle: '#d6dfd6', focus: '#216e4b' },
    root: {
      text: { default: '#1c2d24', subtle: '#57695e' },
      border: { default: '#b5c5b9', subtle: '#d6dfd6', focus: '#216e4b' },
    },
    surface: {
      rest: state('#ffffff', '#d6dfd6', '#1c2d24'),
      hover: state('#edf3ed', '#a9bfae', '#1c2d24'),
      active: state('#e0ebe1', '#7a9e85', '#1c2d24'),
      disabled: state('#f1f4ef', '#d6dfd6', '#5f6e62'),
      focusRing: '#216e4b',
    },
    surfaceAlt: {
      rest: state('#eef3ed', '#cedbce', '#344b3d'),
      hover: state('#e4ede3', '#a9bfae', '#243d2d'),
      active: state('#d7e5d8', '#7a9e85', '#1c2d24'),
      disabled: state('#f1f4ef', '#d6dfd6', '#5f6e62'),
      focusRing: '#216e4b',
    },
    button: {
      rest: state('#e7eee6', '#b5c5b9', '#243d2d'),
      hover: state('#dce8dc', '#8eab95', '#1c3326'),
      active: state('#cddfce', '#577d61', '#162b1e'),
      disabled: state('#eef1ed', '#d5ddd5', '#5f6e62'),
      focusRing: '#216e4b',
    },
  }

  return merge(themeSkins.standard.create(['mint']).light, {
    ...studioSkinShared,
    accent: '#216e4b',
    effect: {
      glowPrimary: '0 0 1.75rem #216e4b12',
      glowSecondary: '0 0 1.75rem #26639610',
      panelShadow: 'none',
      panelShadowStrong: '0 8px 24px #193b2510',
      softShadow: '0 2px 8px #193b2506, 0 8px 24px #193b2508',
      strongShadow: '0 8px 24px #193b2514, 0 24px 64px #193b2514',
      floatingShadow: '0 2px 8px #193b2508, 0 20px 60px #193b2514',
      accentShadow: '0 8px 24px #216e4b1a',
      interactiveShadow: '0 2px 6px #193b2510',
      trackShadow: 'inset 0 1px 2px #193b2514',
      thumbShadow: '0 2px 5px #193b2526',
      overlayScrim: '#14291e40',
      focusGlow: '0 0 0 3px #216e4b33',
      insetShadow: 'inset 0 1px 4px #193b250c',
    },
    semanticTone: {
      neutral,
      accent: createLightTone({
        ink: '#175c3c',
        muted: '#426b51',
        fill: '#216e4b',
        hover: '#185d3e',
        active: '#124b31',
        tint: '#eaf5ec',
        tintHover: '#ddede1',
        tintActive: '#cbe3d2',
        border: '#a5cbb0',
      }),
      feature: createLightTone({
        ink: '#603b87',
        muted: '#6e587f',
        fill: '#70499a',
        hover: '#603b87',
        active: '#4e2f70',
        tint: '#f4eff9',
        tintHover: '#ece2f4',
        tintActive: '#dfd0ec',
        border: '#cebadf',
      }),
      secondary: createLightTone({
        ink: '#245d60',
        muted: '#47696b',
        fill: '#286b6e',
        hover: '#20585c',
        active: '#19474a',
        tint: '#ebf5f3',
        tintHover: '#dcece9',
        tintActive: '#c8e0dc',
        border: '#a5c9c3',
      }),
      custom: createLightTone({
        ink: '#84441f',
        muted: '#865c41',
        fill: '#985027',
        hover: '#80401c',
        active: '#6a3316',
        tint: '#fbf2e9',
        tintHover: '#f4e5d4',
        tintActive: '#ebd3bb',
        border: '#dbbd9c',
      }),
      ghost: {
        tone: 'currentColor',
        canvas: 'transparent',
        canvascolor: 'transparent',
        surface: {
          ...neutral.surface,
          rest: state('transparent', 'transparent', 'currentColor'),
        },
        surfaceAlt: {
          ...neutral.surfaceAlt,
          rest: state('transparent', 'transparent', 'currentColor'),
        },
        button: {
          ...neutral.button,
          rest: state('transparent', 'transparent', 'currentColor'),
        },
      },
      info: createLightTone({
        ink: '#245b87',
        muted: '#49677f',
        fill: '#28679a',
        hover: '#205681',
        active: '#19456a',
        tint: '#edf4fb',
        tintHover: '#deebf6',
        tintActive: '#cbdff0',
        border: '#aac9e1',
      }),
      success: createLightTone({
        ink: '#296039',
        muted: '#496d50',
        fill: '#2b733e',
        hover: '#235f32',
        active: '#1b4c28',
        tint: '#eef6eb',
        tintHover: '#dfedd9',
        tintActive: '#cde2c6',
        border: '#b0cda5',
      }),
      warning: createLightTone({
        ink: '#78540e',
        muted: '#7c6233',
        fill: '#835e14',
        hover: '#6d4c0e',
        active: '#583c09',
        tint: '#fbf5e3',
        tintHover: '#f5ebca',
        tintActive: '#ecdcac',
        border: '#d7c388',
      }),
      danger: createLightTone({
        ink: '#963939',
        muted: '#875454',
        fill: '#a83e3e',
        hover: '#913030',
        active: '#772626',
        tint: '#fcf0ed',
        tintHover: '#f6e0dc',
        tintActive: '#edcdc6',
        border: '#deb4ad',
      }),
    },
  } satisfies DeepPartial<ThemePalette>)
}
