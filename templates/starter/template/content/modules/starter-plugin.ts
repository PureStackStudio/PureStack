import { definePlugin } from 'purestack'
import { defineLandingComponents } from './components/landing'
import { defineFooterComponents } from './components/shell/footer'
import { registerStarterStyles } from './styles'
import { createStarterPalettes } from './theme/palette'

export const starterPlugin = definePlugin({
  name: 'starter-site',
  skins: { starter: { create: createStarterPalettes } },
  components: (config) => ({
    ...defineLandingComponents(),
    ...defineFooterComponents(config),
  }),
  hooks: { onConfigResolved: () => registerStarterStyles() },
})
