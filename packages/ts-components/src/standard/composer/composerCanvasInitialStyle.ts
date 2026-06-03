import { styleBuilder } from '@purestack/ts-style'
import { registerComposerCanvasPreviewDefaults } from './composerCanvasSharedStyle'
import type { ComposerCanvasStyleContext } from './composerCanvasStyleTypes'

export function registerComposerInitialCanvasStyles(
  context: ComposerCanvasStyleContext,
) {
  styleBuilder
    .select('.composer__editor, .composer__editor *', context.theme)
    .all('initial')
    .boxSizing('border-box')

  registerComposerCanvasPreviewDefaults(context)
  registerComposerInitialCanvasElementDefaults(context)
}

function registerComposerInitialCanvasElementDefaults({
  theme,
}: ComposerCanvasStyleContext) {
  styleBuilder
    .select(
      [
        '.composer__editor a',
        '.composer__editor b',
        '.composer__editor cite',
        '.composer__editor code',
        '.composer__editor del',
        '.composer__editor em',
        '.composer__editor font',
        '.composer__editor i',
        '.composer__editor ins',
        '.composer__editor kbd',
        '.composer__editor s',
        '.composer__editor samp',
        '.composer__editor small',
        '.composer__editor span',
        '.composer__editor strong',
        '.composer__editor sub',
        '.composer__editor sup',
        '.composer__editor tt',
        '.composer__editor u',
        '.composer__editor var',
      ].join(', '),
      theme,
    )
    .display('inline')
    .font('inherit')
    .color('inherit')

  styleBuilder
    .select(
      [
        '.composer__editor address',
        '.composer__editor blockquote',
        '.composer__editor caption',
        '.composer__editor center',
        '.composer__editor dd',
        '.composer__editor div',
        '.composer__editor dl',
        '.composer__editor dt',
        '.composer__editor h1',
        '.composer__editor h2',
        '.composer__editor h3',
        '.composer__editor h4',
        '.composer__editor h5',
        '.composer__editor h6',
        '.composer__editor hr',
        '.composer__editor ol',
        '.composer__editor p',
        '.composer__editor pre',
        '.composer__editor ul',
      ].join(', '),
      theme,
    )
    .display('block')
    .font('inherit')
    .color('inherit')
    .lineHeight('inherit')
    .caretColor('inherit')

  styleBuilder
    .select('.composer__editor div:empty, .composer__editor p:empty', theme)
    .minHeight('1.55em')

  styleBuilder
    .select('.composer__editor br', theme)
    .display('inline')
    .font('inherit')
    .lineHeight('inherit')
    .caretColor('inherit')

  styleBuilder
    .select('.composer__editor strong, .composer__editor b', theme)
    .fontWeight('bold')

  styleBuilder
    .select(
      '.composer__editor em, .composer__editor i, .composer__editor cite',
      theme,
    )
    .fontStyle('italic')

  styleBuilder.select('.composer__editor small', theme).fontSize('80%')

  styleBuilder
    .select('.composer__editor sub', theme)
    .fontSize('75%')
    .verticalAlign('sub')

  styleBuilder
    .select('.composer__editor sup', theme)
    .fontSize('75%')
    .verticalAlign('super')

  styleBuilder
    .select('.composer__editor h1', theme)
    .fontSize('2em')
    .fontWeight('bold')
    .margin('0.67em 0')

  styleBuilder
    .select('.composer__editor h2', theme)
    .fontSize('1.5em')
    .fontWeight('bold')
    .margin('0.83em 0')

  styleBuilder
    .select('.composer__editor h3', theme)
    .fontSize('1.17em')
    .fontWeight('bold')
    .margin('1em 0')

  styleBuilder
    .select('.composer__editor h4', theme)
    .fontWeight('bold')
    .margin('1.33em 0')

  styleBuilder
    .select('.composer__editor h5', theme)
    .fontSize('0.83em')
    .fontWeight('bold')
    .margin('1.67em 0')

  styleBuilder
    .select('.composer__editor h6', theme)
    .fontSize('0.67em')
    .fontWeight('bold')
    .margin('2.33em 0')

  styleBuilder
    .select('.composer__editor blockquote', theme)
    .margin('1em 2.5rem')

  styleBuilder
    .select(
      '.composer__editor pre, .composer__editor code, .composer__editor kbd, .composer__editor samp, .composer__editor tt',
      theme,
    )
    .fontFamily('monospace')

  styleBuilder
    .select('.composer__editor ol, .composer__editor ul', theme)
    .margin('1em 0')
    .paddingLeft('2.5rem')

  styleBuilder.select('.composer__editor li', theme).display('list-item')

  styleBuilder.select('.composer__editor ul', theme).listStyle('disc')

  styleBuilder.select('.composer__editor ol', theme).listStyle('decimal')

  styleBuilder.select('.composer__editor table', theme).display('table')

  styleBuilder
    .select('.composer__editor caption', theme)
    .display('table-caption')

  styleBuilder
    .select('.composer__editor colgroup', theme)
    .display('table-column-group')

  styleBuilder.select('.composer__editor col', theme).display('table-column')

  styleBuilder
    .select('.composer__editor thead', theme)
    .display('table-header-group')

  styleBuilder
    .select('.composer__editor tbody', theme)
    .display('table-row-group')

  styleBuilder
    .select('.composer__editor tfoot', theme)
    .display('table-footer-group')

  styleBuilder.select('.composer__editor tr', theme).display('table-row')

  styleBuilder
    .select('.composer__editor td, .composer__editor th', theme)
    .display('table-cell')
    .verticalAlign('inherit')

  styleBuilder
    .select('.composer__editor th', theme)
    .fontWeight('bold')
    .textAlign('center')
}
