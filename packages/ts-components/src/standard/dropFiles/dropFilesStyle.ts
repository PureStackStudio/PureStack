import type { ThemePalette } from '@purestack/ts-style'
import { styleBuilder, type ThemeMode, themes } from '@purestack/ts-style'

export function registerDropFilesStyles() {
  themes.forEach((theme, palette) => {
    registerDropFilesFieldStyles(theme, palette)
    registerDropFilesZoneStyles(theme, palette)
    registerDropFilesListStyles(theme, palette)
  })
}

function registerDropFilesFieldStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder.select('.drop-files', theme).display('grid').gap('0.65em')

  styleBuilder
    .select('.drop-files__label', theme)
    .apply(palette.applyFont(palette.font.size.xxs, palette.font.weight.w700))
    .color(palette.current.tone)
    .lineHeight('1')

  styleBuilder
    .select('.drop-files__input', theme)
    .position('absolute')
    .width('1px')
    .height('1px')
    .overflow('hidden')
    .clip('rect(0 0 0 0)')
    .whiteSpace('nowrap')
}

function registerDropFilesZoneStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.drop-files__zone', theme)
    .display('grid')
    .justifyItems('center')
    .gap('0.35em')
    .boxSizing('border-box')
    .width('100%')
    .minHeight('9em')
    .padding('1.25em')
    .borderRadius(palette.radii.md)
    .border(`1px dashed ${palette.current.border.default}`)
    .background(palette.current.surfaceAlt.rest.background)
    .color(palette.current.text.default)
    .cursor('pointer')
    .textAlign('center')
    .transition(
      'border-color 160ms ease, background 160ms ease, box-shadow 160ms ease',
    )

  styleBuilder
    .select('.drop-files__zone:hover:not(.drop-files__zone--disabled)', theme)
    .borderColor(palette.current.tone)
    .background(palette.current.surface.rest.background)

  styleBuilder
    .select('.drop-files__zone:focus-visible', theme)
    .outline('none')
    .borderColor(palette.current.border.default)
    .boxShadow(`0 0 0 3px ${palette.current.border.focus}`)

  styleBuilder
    .select('.drop-files__zone--dragging', theme)
    .borderColor(palette.current.tone)
    .background(palette.current.button.hover.background)
    .boxShadow(`0 0 0 3px ${palette.current.border.focus}`)

  styleBuilder
    .select('.drop-files__zone--disabled', theme)
    .cursor('not-allowed')
    .opacity('0.58')

  styleBuilder
    .select('.drop-files__zone-icon', theme)
    .width('2.2em')
    .height('2.2em')
    .color(palette.current.tone)

  styleBuilder
    .select('.drop-files__zone-title', theme)
    .apply(palette.applyFont(palette.font.size.sm, palette.font.weight.w700))

  styleBuilder
    .select('.drop-files__zone-text, .drop-files__hint', theme)
    .apply(palette.applyFont(palette.font.size.xs))
    .color(palette.current.text.subtle)
}

function registerDropFilesListStyles(theme: ThemeMode, palette: ThemePalette) {
  styleBuilder
    .select('.drop-files__list', theme)
    .display('grid')
    .gap('0.45em')
    .padding('0')
    .margin('0')
    .listStyle('none')

  styleBuilder
    .select('.drop-files__item', theme)
    .display('grid')
    .gridTemplateColumns('auto minmax(0, 1fr) auto')
    .alignItems('center')
    .gap('0.65em')
    .boxSizing('border-box')
    .padding('0.6em')
    .borderRadius(palette.radii.md)
    .border(`1px solid ${palette.current.border.subtle}`)
    .background(palette.current.surface.rest.background)

  styleBuilder
    .select('.drop-files__item-icon', theme)
    .display('inline-grid')
    .placeItems('center')
    .width('2em')
    .height('2em')
    .borderRadius(palette.radii.sm)
    .background(palette.current.surfaceAlt.rest.background)
    .color(palette.current.tone)

  styleBuilder
    .select('.drop-files__item-icon .icon', theme)
    .width('1.1em')
    .height('1.1em')

  styleBuilder
    .select('.drop-files__item-body', theme)
    .display('grid')
    .minWidth('0')
    .gap('0.15em')

  styleBuilder
    .select('.drop-files__item-name', theme)
    .overflow('hidden')
    .textOverflow('ellipsis')
    .whiteSpace('nowrap')
    .apply(palette.applyFont(palette.font.size.sm, palette.font.weight.w700))

  styleBuilder
    .select('.drop-files__item-meta', theme)
    .apply(palette.applyFont(palette.font.size.xxs))
    .color(palette.current.text.subtle)

  styleBuilder
    .select('.drop-files__remove', theme)
    .display('inline-grid')
    .placeItems('center')
    .width('2.1em')
    .height('2.1em')
    .padding('0')
    .border('none')
    .borderRadius(palette.radii.sm)
    .background('transparent')
    .color(palette.current.text.subtle)
    .cursor('pointer')
    .transition('background 150ms ease, color 150ms ease')

  styleBuilder
    .select('.drop-files__remove:hover:not(:disabled)', theme)
    .background(palette.current.button.hover.background)
    .color(palette.current.button.hover.text)

  styleBuilder
    .select('.drop-files__remove:disabled', theme)
    .cursor('not-allowed')
    .opacity('0.55')

  styleBuilder
    .select('.drop-files__remove .icon', theme)
    .width('1em')
    .height('1em')
}
