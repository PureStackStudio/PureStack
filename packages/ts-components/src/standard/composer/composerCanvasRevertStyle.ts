import { styleBuilder } from '@purestack/ts-style'
import { registerComposerCanvasPreviewDefaults } from './composerCanvasSharedStyle'
import type { ComposerCanvasStyleContext } from './composerCanvasStyleTypes'

export function registerComposerRevertCanvasStyles(
  context: ComposerCanvasStyleContext,
) {
  styleBuilder
    .select('.composer__editor, .composer__editor *', context.theme)
    .all('revert')
    .boxSizing('border-box')

  registerComposerCanvasPreviewDefaults(context)
}
