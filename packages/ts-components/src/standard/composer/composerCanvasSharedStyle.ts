import { styleBuilder } from '@purestack/ts-style'
import type { ComposerCanvasStyleContext } from './composerCanvasStyleTypes'

const EMAIL_FONT =
  '15px/1.55 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif'

export function registerComposerCanvasPreviewDefaults({
  theme,
}: ComposerCanvasStyleContext) {
  styleBuilder
    .select('.composer__editor', theme)
    .display('block')
    .width('100%')
    .boxSizing('border-box')
    .padding('0')
    .border('none')
    .borderRadius('0')
    .outline('none')
    .background('#fff')
    .color('#182018')
    .font(EMAIL_FONT)
    .overflowY('auto')
    .overflowWrap('anywhere')
    .whiteSpace('normal')
    .cursor('text')
    .set('caret-color', '#182018')
    .set('user-select', 'text')
    .set('-webkit-user-select', 'text')

  styleBuilder
    .select('.composer__editor:empty::before', theme)
    .content('attr(data-placeholder)')
    .color('#777')
    .pointerEvents('none')

  styleBuilder
    .select('.composer__editor [data-puregate-composer-body]:empty::before', theme)
    .content('attr(data-placeholder)')
    .color('#777')
    .pointerEvents('none')

  styleBuilder
    .select('.composer__editor a', theme)
    .color('#1368d8')
    .textDecoration('underline')

  styleBuilder
    .select('.composer__editor img', theme)
    .maxWidth('100%')
    .height('auto')

  styleBuilder
    .select('.composer__editor table', theme)
    .maxWidth('100%')
    .borderCollapse('collapse')

  styleBuilder.select('.composer__editor p:first-child', theme).marginTop('0')

  styleBuilder.select('.composer__editor p:last-child', theme).marginBottom('0')
}
