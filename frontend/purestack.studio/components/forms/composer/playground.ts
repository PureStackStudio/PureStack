import {
  type ComponentVariant,
  createComposerBodyHtml,
  defineBadgeComponents,
  defineButtonComponents,
  defineComposerComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineGridComponents,
  defineIconComponents,
  definePanelComponents,
  defineTabsComponents,
  type FormSelectOption,
} from '@purestack/ts-components'
import type { SemanticTone } from '@purestack/ts-style'
import {
  lucide_bold,
  lucide_chevron_down,
  lucide_code,
  lucide_eraser,
  lucide_italic,
  lucide_link,
  lucide_list,
  lucide_list_ordered,
  lucide_underline,
  tabler_align_center,
  tabler_align_left,
  tabler_align_right,
} from '@purestack/ts-svg-icons'
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
} from 'regor'
import { mountFormAppearanceGalleries } from '../appearance'

export interface ComposerPlayground {
  messageHtml: Ref<string>
  messageText: Ref<string>
  editorLabel: Ref<string>
  editorPlaceholder: Ref<string>
  disabled: Ref<boolean>
  tone: Ref<SemanticTone>
  variant: Ref<ComponentVariant>
  height: Ref<string>
  words: ComputedRef<number>
  tones: FormSelectOption[]
  variants: FormSelectOption[]
  heights: FormSelectOption[]
  release: () => void
  reply: () => void
  clear: () => void
  reset: () => void
}

const releaseHtml = createComposerBodyHtml(
  '<h2>Ready for your next release</h2><p>Build with <strong>typed components</strong>, a shared theme and a little less ceremony.</p><ul><li>Explore the interactive component guides.</li><li>Try both rich text and HTML source.</li><li>Share your feedback with the team.</li></ul><p><a href="https://purestack.studio/">Explore PureStack</a></p>',
)
const replyHtml = createComposerBodyHtml(
  '<p>Hi Alex,</p><p>Thanks for trying the preview. Your feedback helped us improve <strong>keyboard navigation</strong> and the new component guides.</p><blockquote>Can we use the same theme across the whole app?</blockquote><p>Yes. Components inherit the active skin, so your interface stays consistent.</p><p>Best,<br>The PureStack team</p>',
)

const composerPlaygroundTemplate = html`<Flex direction="column">
  <Flex justify="between" align="center" wrap="true">
    <p class="text-eyebrow m-0">A draft, two live outputs</p>
    <Badge tone="accent" variant="surface">{{ disabled ? 'Editing disabled' : 'Live editor' }}</Badge>
  </Flex>
  <Flex wrap="true">
    <Btn variant="outline" size="sm" @click="release">Load release note</Btn>
    <Btn variant="outline" size="sm" @click="reply">Load support reply</Btn>
    <Btn variant="outline" size="sm" @click="clear">Empty draft</Btn>
  </Flex>
  <Composer id="composer-playground-editor" :html="messageHtml" :text="messageText"
    :label="editorLabel" :placeholder="editorPlaceholder" :disabled="disabled"
    :tone="tone" :variant="variant" :minHeight="height"/>
  <Flex justify="between" wrap="true">
    <span class="text-muted" id="composer-counts">{{ words }} words · {{ messageText.length }} text characters</span>
    <span class="text-muted">Select text, then choose a toolbar action.</span>
  </Flex>
  <Grid columns="1" columnsMd="3">
    <FormSelectField id="composer-tone" label="Tone" :model="tone" :options="tones"/>
    <FormSelectField id="composer-variant" label="Variant" :model="variant" :options="variants"/>
    <FormSelectField id="composer-height" label="Minimum height" :model="height" :options="heights"/>
  </Grid>
  <Grid columns="1" columnsMd="2">
    <FormInputField id="composer-label" label="Editor label" :model="editorLabel"/>
    <FormInputField id="composer-placeholder" label="Empty-state hint" :model="editorPlaceholder"/>
  </Grid>
  <Flex justify="between" align="center" wrap="true">
    <FormCheck id="composer-disabled" label="Disable editing and toolbar" :checked="disabled"/>
    <Btn variant="link" @click="reset">Reset playground</Btn>
  </Flex>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <p class="text-eyebrow mt-0">Model inspector</p>
    <Tabs group="composer-model" selectedTab="composer-model-text" ariaLabel="Live model values" tabVariant="underline">
      <TabPane id="composer-model-text" label="Plain text">
        <pre id="composer-text-output" class="max-h-inspector overflow-auto ws-pre-wrap m-0">{{ messageText || 'The draft is empty.' }}</pre>
      </TabPane>
      <TabPane id="composer-model-html" label="HTML">
        <pre class="overflow-x-auto m-0"><code id="composer-html-output">{{ messageHtml || 'The draft is empty.' }}</code></pre>
      </TabPane>
    </Tabs>
    <p class="text-muted mb-0">These values update as you type. The HTML source button in the editor lets you edit the markup itself.</p>
  </Panel>
</Flex>`

function createComposerPlayground(): ComposerPlayground {
  const messageHtml = ref(releaseHtml)
  const messageText = ref('')
  const editorLabel = ref('Release note')
  const editorPlaceholder = ref('What would you like to share?')
  const disabled = ref(false)
  const tone = ref<SemanticTone>('neutral')
  const variant = ref<ComponentVariant>('surfaceAlt')
  const height = ref('18rem')
  return {
    messageHtml,
    messageText,
    editorLabel,
    editorPlaceholder,
    disabled,
    tone,
    variant,
    height,
    words: computed(() =>
      messageText().trim() ? messageText().trim().split(/\s+/).length : 0,
    ),
    tones: [
      'neutral',
      'accent',
      'secondary',
      'info',
      'success',
      'warning',
      'danger',
      'feature',
    ].map((value) => ({ value, label: value })),
    variants: [
      'surfaceAlt',
      'surface',
      'flat',
      'flatAlt',
      'outline',
      'outlineFill',
      'solid',
      'subtle',
      'none',
    ].map((value) => ({ value, label: value })),
    heights: ['12rem', '18rem', '24rem'].map((value) => ({
      value,
      label: value,
    })),
    release: () => messageHtml(releaseHtml),
    reply: () => messageHtml(replyHtml),
    clear: () => messageHtml(''),
    reset: () => {
      messageHtml(releaseHtml)
      editorLabel('Release note')
      editorPlaceholder('What would you like to share?')
      disabled(false)
      tone('neutral')
      variant('surfaceAlt')
      height('18rem')
    },
  }
}

const composerPlayground = defineComponent<ComposerPlayground>(
  composerPlaygroundTemplate,
  {
    context: createComposerPlayground,
  },
)
const icons: Record<string, string> = {
  'lucide:chevron-down': lucide_chevron_down,
  'lucide:bold': lucide_bold,
  'lucide:italic': lucide_italic,
  'lucide:underline': lucide_underline,
  'tabler:align-left': tabler_align_left,
  'tabler:align-center': tabler_align_center,
  'tabler:align-right': tabler_align_right,
  'lucide:list': lucide_list,
  'lucide:list-ordered': lucide_list_ordered,
  'lucide:link': lucide_link,
  'lucide:eraser': lucide_eraser,
  'lucide:code': lucide_code,
}

createApp(
  {
    components: {
      ComposerPlayground: composerPlayground,
      ...defineComposerComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineFormInputField(),
      ...defineFormSelectField(),
      ...defineGridComponents(),
      ...definePanelComponents(),
      ...defineTabsComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  { selector: 'app#composer-demo', template: html`<ComposerPlayground/>` },
)

mountFormAppearanceGalleries()
