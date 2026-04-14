import type { ThemePalette } from '@purestack/ts-style'
import {
  styleBuilder,
  type ThemeMode,
  type ThemeOptions,
  themes,
} from '@purestack/ts-style'

export function registerModalStyles() {
  themes.forEach((theme, palette, options) => {
    registerModalShellStyles(theme, palette, options)
    registerModalMotionStyles(theme)
    registerModalSizeStyles(theme)
  })
}

function registerModalShellStyles(
  theme: ThemeMode,
  palette: ThemePalette,
  options: ThemeOptions,
) {
  styleBuilder
    .select('.modal', theme)
    .position('fixed')
    .inset('0')
    .margin('0')
    .padding('0')
    .border('none')
    .background('transparent')
    .maxWidth('100vw')
    .maxHeight('100vh')
    .width('100%')
    .height('100%')
    .overflow('hidden')

  styleBuilder
    .select('.modal[open]', theme)
    .display('grid')
    .placeItems('center')

  styleBuilder.select('.modal:not([open])', theme).display('none')

  styleBuilder
    .select('.modal::backdrop', theme)
    .background(palette.semanticTone.neutral.overlay)
    .opacity('1')

  styleBuilder
    .select('.modal--fade::backdrop', theme)
    .opacity('0')
    .transition('opacity 420ms ease')

  styleBuilder.select('.modal--fade[open]::backdrop', theme).opacity('0.8')

  styleBuilder
    .select('.modal__panel', theme)
    .position('relative')
    .display('grid')
    .width('min(92vw, 640px)')
    .maxHeight('min(86vh, 900px)')
    .overflow('auto')
    .borderRadius(options.radii.lg)
    .border(`1px solid ${palette.semanticTone.neutral.border.default}`)
    .background(palette.semanticTone.neutral.surface.rest.background)
    .boxShadow(options.shadows.soft)
    .color(palette.semanticTone.neutral.text.default)
    .transform('translate3d(0, 0, 0)')
    .willChange('transform, opacity')
    .opacity('1')

  styleBuilder
    .select('.modal__surface', theme)
    .display('grid')
    .gap('14px')
    .minHeight('100%')
    .padding('18px')
    .borderRadius(options.radii.lg)

  styleBuilder
    .select('.modal__header', theme)
    .display('grid')
    .gridTemplateColumns('minmax(0, 1fr) auto minmax(0, 1fr)')
    .alignItems('center')
    .gap('10px')

  styleBuilder
    .select('.modal__title', theme)
    .gridColumn('2')
    .justifySelf('center')
    .margin('0')
    .fontSize('1.2rem')
    .lineHeight('1.3')
    .fontWeight('700')
    .textAlign('center')
    .color(palette.semanticTone.neutral.text.default)

  styleBuilder
    .select('.modal__header [data-modal-close]', theme)
    .gridColumn('3')
    .justifySelf('end')

  styleBuilder
    .select('.modal__body', theme)
    .display('grid')
    .minWidth('0')
    .lineHeight('1.6')
    .justifyItems('center')
    .textAlign('center')

  styleBuilder
    .select('.modal__footer', theme)
    .display('flex')
    .flexWrap('wrap')
    .alignItems('center')
    .justifyContent('center')
    .gap('10px')

  styleBuilder.select('.modal__footer:empty', theme).display('none')

  styleBuilder
    .select('.modal--animated .modal__panel', theme)
    .transition('transform 700ms cubic-bezier(0.16, 1, 0.3, 1)')

  styleBuilder
    .select('.modal--fade.modal--animated .modal__panel', theme)
    .transition(
      'transform 700ms cubic-bezier(0.16, 1, 0.3, 1), opacity 420ms ease',
    )

  styleBuilder
    .select(
      '.modal--fade[data-modal-state="opening"] .modal__panel, .modal--fade[data-modal-state="closing"] .modal__panel',
      theme,
    )
    .opacity('0')

  styleBuilder
    .select(
      '.modal--fade.modal--slide-top[data-modal-state="opening"] .modal__panel, .modal--fade.modal--slide-top[data-modal-state="closing"] .modal__panel, .modal--fade.modal--slide-right[data-modal-state="opening"] .modal__panel, .modal--fade.modal--slide-right[data-modal-state="closing"] .modal__panel, .modal--fade.modal--slide-bottom[data-modal-state="opening"] .modal__panel, .modal--fade.modal--slide-bottom[data-modal-state="closing"] .modal__panel, .modal--fade.modal--slide-left[data-modal-state="opening"] .modal__panel, .modal--fade.modal--slide-left[data-modal-state="closing"] .modal__panel',
      theme,
    )
    .opacity('0.45')

  styleBuilder
    .select(
      '.modal--fade[data-modal-state="opening"]::backdrop, .modal--fade[data-modal-state="closing"]::backdrop',
      theme,
    )
    .opacity('0')
}

function registerModalMotionStyles(theme: ThemeMode) {
  styleBuilder
    .select(
      '.modal--slide-top[data-modal-state="opening"] .modal__panel, .modal--slide-top[data-modal-state="closing"] .modal__panel',
      theme,
    )
    .transform('translate3d(0, calc(-50vh - 50%), 0)')

  styleBuilder
    .select(
      '.modal--slide-right[data-modal-state="opening"] .modal__panel, .modal--slide-right[data-modal-state="closing"] .modal__panel',
      theme,
    )
    .transform('translate3d(calc(50vw + 50%), 0, 0)')

  styleBuilder
    .select(
      '.modal--slide-bottom[data-modal-state="opening"] .modal__panel, .modal--slide-bottom[data-modal-state="closing"] .modal__panel',
      theme,
    )
    .transform('translate3d(0, calc(50vh + 50%), 0)')

  styleBuilder
    .select(
      '.modal--slide-left[data-modal-state="opening"] .modal__panel, .modal--slide-left[data-modal-state="closing"] .modal__panel',
      theme,
    )
    .transform('translate3d(calc(-50vw - 50%), 0, 0)')

  styleBuilder
    .select('.modal--animated .modal__panel', theme)
    .media('prefers-reduced-motion: reduce')
    .transition('none')

  styleBuilder
    .select('.modal::backdrop', theme)
    .media('prefers-reduced-motion: reduce')
    .transition('none')
}

function registerModalSizeStyles(theme: ThemeMode) {
  styleBuilder
    .select('.modal--size-sm .modal__panel', theme)
    .width('min(92vw, 420px)')
  styleBuilder
    .select('.modal--size-md .modal__panel', theme)
    .width('min(92vw, 640px)')
  styleBuilder
    .select('.modal--size-lg .modal__panel', theme)
    .width('min(94vw, 860px)')
  styleBuilder
    .select('.modal--size-xl .modal__panel', theme)
    .width('min(96vw, 1080px)')
}
