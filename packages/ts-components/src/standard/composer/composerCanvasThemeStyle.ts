import { styleBuilder } from '@purestack/ts-style'
import type { ComposerCanvasStyleContext } from './composerCanvasStyleTypes'

export function registerComposerThemeCanvasStyles({
  palette,
  theme,
}: ComposerCanvasStyleContext) {
  styleBuilder
    .select('.composer__editor', theme)
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
    .borderRadius('0.25rem')

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
}
