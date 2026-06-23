import type { ThemePalette } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'
import { registerComposerInitialCanvasStyles } from './composerCanvasInitialStyle'
import { registerComposerRevertCanvasStyles } from './composerCanvasRevertStyle'
import type { ComposerCanvasStyleOption } from './composerCanvasStyleTypes'
import { registerComposerThemeCanvasStyles } from './composerCanvasThemeStyle'

const COMPOSER_CANVAS_STYLE: ComposerCanvasStyleOption = 'initial'

export function registerComposerStyles() {
  themes.forEach((theme, palette) => {
    registerComposerFieldStyles(theme, palette)
    registerComposerShellStyles(theme, palette)
    registerComposerToolbarStyles(theme, palette)
    registerComposerSurfaceStyles(theme, palette)
  })
}

function registerComposerFieldStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder.select('.composer-field', theme).display('grid').gap('0.6em')
  styleBuilder
    .select('.composer-field__label', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .color(palette.current.tone)
    .lineHeight('1')
}

function registerComposerShellStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.composer', theme)
    .display('grid')
    .width('100%')
    .boxSizing('border-box')
    .overflow('hidden')
    .borderRadius(palette.radii.md)
    .transition('border-color 160ms ease, box-shadow 160ms ease')

  styleBuilder
    .select('.composer:focus-within', theme)
    .borderColor(palette.current.border.default)
    .boxShadow(`0 0 0 3px ${palette.current.border.focus}`)
}

function registerComposerToolbarStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.composer__toolbar', theme)
    .display('flex')
    .alignItems('center')
    .gap('0.25rem')
    .padding('0.35em')
    .borderBottom(`1px solid ${palette.current.border.default}`)
    .background(palette.current.surfaceAlt.rest.background)

  styleBuilder
    .select('.composer__tool', theme)
    .display('inline-flex')
    .alignItems('center')
    .justifyContent('center')
    .width('2.1em')
    .height('2.1em')
    .padding('0')
    .border('none')
    .borderRadius('0.375rem')
    .background('transparent')
    .color(palette.current.text.default)
    .cursor('pointer')
    .transition('background 150ms ease, color 150ms ease')

  styleBuilder
    .select('.composer__tool:hover:not(:disabled)', theme)
    .background(palette.current.button.hover.background)
    .color(palette.current.button.hover.text)

  styleBuilder
    .select('.composer__tool[aria-pressed="true"]', theme)
    .background(palette.current.button.active.background)
    .color(palette.current.button.active.text)

  styleBuilder
    .select('.composer__tool:disabled', theme)
    .cursor('not-allowed')
    .opacity('0.55')

  styleBuilder
    .select('.composer__tool .icon', theme)
    .width('1.1em')
    .height('1.1em')

  styleBuilder
    .select('.composer__divider', theme)
    .width('1px')
    .height('1.4em')
    .margin('0 0.2em')
    .background(palette.current.border.default)

  styleBuilder.select('.composer__tool--source', theme).marginLeft('auto')
}

function registerComposerSurfaceStyles(
  theme: ThemeMode,
  palette: ThemePalette,
) {
  styleBuilder
    .select('.composer__surface', theme)
    .position('relative')
    .overflowX('auto')

  registerComposerCanvasStyles(theme, palette)

  styleBuilder
    .select('.composer__source', theme)
    .width('100%')
    .boxSizing('border-box')
    .padding('0.85em 0.95em')
    .border('none')
    .borderRadius('0')
    .outline('none')
    .background('transparent')
    .color(palette.current.text.default)
    .apply(palette.applyFont(palette.font.size.body))
    .lineHeight('1.55')

  styleBuilder
    .select('.composer__source', theme)
    .display('block')
    .resize('vertical')
    .fontFamily('ui-monospace, SFMono-Regular, Menlo, Consolas, monospace')
    .background(palette.current.surface.rest.background)
    .borderTop(`1px solid ${palette.current.border.default}`)
    .borderBottomLeftRadius(palette.radii.md)
    .borderBottomRightRadius(palette.radii.md)
}

function registerComposerCanvasStyles(theme: ThemeMode, palette: ThemePalette) {
  const context = { palette, theme }
  if (COMPOSER_CANVAS_STYLE === 'theme') {
    registerComposerThemeCanvasStyles(context)
    return
  }

  if (COMPOSER_CANVAS_STYLE === 'initial') {
    registerComposerInitialCanvasStyles(context)
    return
  }

  registerComposerRevertCanvasStyles(context)
}
