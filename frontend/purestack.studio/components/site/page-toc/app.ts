import {
  defineButtonComponents,
  defineFlexComponents,
  defineFormCheckComponent,
  defineFormInputField,
  definePanelComponents,
} from '@purestack/ts-components'
import { createApp, html } from 'regor'
import { defineTocPlaygroundControls } from './controls'
import { defineTocPlayground } from './playground'
import { defineTocPlaygroundSection } from './section'

const components = {
  TocPlayground: defineTocPlayground(),
  TocPlaygroundControls: defineTocPlaygroundControls(),
  TocPlaygroundSection: defineTocPlaygroundSection(),
  FormCheck: defineFormCheckComponent(),
  ...defineButtonComponents(),
  ...defineFlexComponents(),
  ...defineFormInputField(),
  ...definePanelComponents(),
}

for (const mount of document.querySelectorAll<HTMLElement>(
  'app[data-toc-playground]',
)) {
  createApp(
    { components, prefix: mount.id },
    {
      element: mount,
      template: html`<TocPlayground :prefix="prefix"/>`,
    },
  )
}
