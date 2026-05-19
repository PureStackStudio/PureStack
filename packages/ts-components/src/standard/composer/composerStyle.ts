import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerComposerStyles() {
  themes.forEach((theme, palette, options) => {
    registerComposerFieldStyles(theme, palette)
    registerComposerShellStyles(theme, palette, options)
    registerComposerToolbarStyles(theme, palette)
    registerComposerSurfaceStyles(theme, palette, options)
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

function registerComposerShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.composer', theme)
    .display('grid')
    .width('100%')
    .boxSizing('border-box')
    .overflow('hidden')
    .borderRadius(options.radii.md)
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
    .gap('4px')
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
    .borderRadius('6px')
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
  options: ThemeOptions,
) {
  styleBuilder.select('.composer__surface', theme).position('relative')

  styleBuilder
    .select('.composer__editor, .composer__source', theme)
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
    .select('.composer__editor', theme)
    .overflowY('auto')
    .whiteSpace('normal')

  styleBuilder
    .select('.composer__editor:empty::before', theme)
    .content('attr(data-placeholder)')
    .color(palette.current.text.subtle)
    .pointerEvents('none')

  styleBuilder
    .select('.composer__editor a', theme)
    .color(palette.current.tone)
    .textDecoration('underline')

  styleBuilder
    .select('.composer__editor img', theme)
    .maxWidth('100%')
    .height('auto')
    .borderRadius('4px')

  styleBuilder
    .select('.composer__editor table', theme)
    .maxWidth('100%')
    .borderCollapse('collapse')

  styleBuilder.select('.composer__editor p', theme).margin('0 0 0.7em')

  styleBuilder.select('.composer__editor p:last-child', theme).marginBottom('0')

  styleBuilder
    .select('.composer__editor ul, .composer__editor ol', theme)
    .margin('0 0 0.7em')
    .paddingLeft('1.4em')

  styleBuilder
    .select('.composer__source', theme)
    .display('block')
    .resize('vertical')
    .fontFamily('ui-monospace, SFMono-Regular, Menlo, Consolas, monospace')
    .background(palette.current.surface.rest.background)
    .borderTop(`1px solid ${palette.current.border.default}`)
    .borderBottomLeftRadius(options.radii.md)
    .borderBottomRightRadius(options.radii.md)
}
