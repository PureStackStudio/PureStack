import {
  createComposerBodyHtml,
  defineBadgeComponents,
  defineButtonComponents,
  defineComposerComponents,
  defineFlexComponents,
  defineFormComponents,
  defineIconComponents,
  definePanelComponents,
  defineTabsComponents,
} from '@purestack/ts-components'
import {
  lucide_bold,
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
  createApp,
  defineComponent,
  html,
  onUnmounted,
  type Ref,
  ref,
  type SRef,
  sref,
} from 'regor'

export interface ComposerAttachment {
  contentId: string
  file: File
  previewUrl: string
}

export interface ComposerInlineImages {
  messageHtml: Ref<string>
  previewUrls: SRef<Record<string, string>>
  attachments: SRef<ComposerAttachment[]>
  fileInput: SRef<HTMLInputElement | null>
  busy: Ref<boolean>
  status: Ref<string>
  choose: () => void
  select: (event: Event) => void
  receive: (event: CustomEvent<{ files: File[] }>) => void
  insertDemo: () => Promise<void>
  remove: (contentId: string) => void
}

const composerInlineImagesTemplate = html`<Flex direction="column">
  <Flex justify="between" align="center" wrap="true">
    <p class="text-eyebrow m-0">Inline image lab</p>
    <Badge tone="info" variant="surface">Local previews · no uploads</Badge>
  </Flex>
  <Composer id="composer-images-editor" label="Image message" :html="messageHtml"
    :imagePreviewUrls="previewUrls" minHeight="14rem" @files="receive"/>
  <input :ref="fileInput" type="file" accept="image/png,image/jpeg,image/webp,image/gif"
    multiple hidden @change="select"/>
  <Flex wrap="true">
    <Btn tone="accent" variant="surface" @click="choose">Choose images</Btn>
    <Btn variant="outline" :disabled="busy" @click="insertDemo">{{ busy ? 'Loading image…' : 'Insert demo image' }}</Btn>
  </Flex>
  <FormStatus role="status">{{ status }}</FormStatus>
  <Panel variant="surfaceAlt" bodyClass="p-3 min-w-0">
    <Tabs group="composer-images-output" selectedTab="composer-attachments" ariaLabel="Image model inspection" tabVariant="underline">
      <TabPane id="composer-attachments" label="Attachments">
        <p r-if="!attachments.length" class="m-0 text-muted">Add an image to see its file and content ID.</p>
        <Flex r-for="attachment in attachments" direction="column" class="py-3 bb-1 b-subtle">
          <Flex justify="between" align="center" wrap="true">
            <strong class="overflow-x-auto w-full">{{ attachment.file.name }}</strong>
            <Btn variant="outline" size="sm" :aria-label="'Remove ' + attachment.file.name" @click="remove(attachment.contentId)">Remove</Btn>
          </Flex>
          <span class="text-muted">{{ Math.ceil(attachment.file.size / 1024) }} KB · {{ attachment.file.type }}</span>
          <code class="overflow-x-auto">cid:{{ attachment.contentId }}</code>
        </Flex>
      </TabPane>
      <TabPane id="composer-images-html" label="HTML with cid: URLs">
        <pre class="overflow-x-auto m-0"><code id="composer-image-html">{{ messageHtml }}</code></pre>
      </TabPane>
    </Tabs>
  </Panel>
  <p class="text-muted m-0">You can also paste or drop image files into the editor. This example appends them to the message. PNG, JPEG, WebP and GIF files up to 5 MB each are accepted.</p>
</Flex>`

function createComposerInlineImages(): ComposerInlineImages {
  const messageHtml = ref(
    createComposerBodyHtml(
      '<p><strong>A little more than words.</strong></p><p>Add a product image, screenshot or the demo logo below.</p>',
    ),
  )
  const previewUrls = sref<Record<string, string>>({})
  const attachments = sref<ComposerAttachment[]>([])
  const fileInput = sref<HTMLInputElement | null>(null)
  const status = ref(
    'Images stay in this browser. The HTML model keeps portable cid: references.',
  )
  const busy = ref(false)
  let disposed = false

  const add = (files: File[]) => {
    const accepted = files.filter(
      (file) =>
        ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(
          file.type,
        ) &&
        file.size > 0 &&
        file.size <= 5 * 1024 * 1024,
    )
    const entries = accepted.map((file) => ({
      file,
      contentId: `${crypto.randomUUID()}@composer.demo`,
      previewUrl: URL.createObjectURL(file),
    }))
    if (entries.length) {
      const document = new DOMParser().parseFromString(
        messageHtml(),
        'text/html',
      )
      const first = document.body.firstElementChild
      const body =
        document.body.children.length === 1 && first?.tagName === 'DIV'
          ? first
          : document.body
      for (const entry of entries) {
        const paragraph = document.createElement('p')
        const image = document.createElement('img')
        image.src = `cid:${entry.contentId}`
        image.alt = entry.file.name
        image.style.width = '240px'
        paragraph.append(image)
        body.append(paragraph)
      }
      attachments([...attachments(), ...entries])
      previewUrls(
        Object.fromEntries(
          attachments().map((entry) => [entry.contentId, entry.previewUrl]),
        ),
      )
      messageHtml(document.body.innerHTML)
    }
    const skipped = files.length - entries.length
    status(
      `${entries.length} ${entries.length === 1 ? 'image' : 'images'} added.` +
        (skipped
          ? ` ${skipped} ${skipped === 1 ? 'file' : 'files'} skipped. Use a supported image under 5 MB.`
          : ''),
    )
  }

  onUnmounted(() => {
    disposed = true
    for (const entry of attachments()) URL.revokeObjectURL(entry.previewUrl)
  })

  return {
    messageHtml,
    previewUrls,
    attachments,
    fileInput,
    busy,
    status,
    choose: () => fileInput()?.click(),
    select: (event) => {
      const input = event.currentTarget as HTMLInputElement
      add(Array.from(input.files ?? []))
      input.value = ''
    },
    receive: (event) => add(event.detail.files),
    insertDemo: async () => {
      busy(true)
      try {
        const response = await fetch('/assets/pure-stack-logo.png')
        if (!response.ok) throw new Error('Image unavailable')
        const blob = await response.blob()
        if (!disposed)
          add([new File([blob], 'pure-stack-logo.png', { type: 'image/png' })])
      } catch {
        if (!disposed)
          status(
            'The demo image could not be loaded. Choose a local image instead.',
          )
      } finally {
        if (!disposed) busy(false)
      }
    },
    remove: (contentId) => {
      const entry = attachments().find((item) => item.contentId === contentId)
      if (!entry) return
      const document = new DOMParser().parseFromString(
        messageHtml(),
        'text/html',
      )
      for (const image of document.querySelectorAll('img')) {
        if (image.getAttribute('src') !== `cid:${contentId}`) continue
        const paragraph = image.parentElement
        image.remove()
        if (paragraph?.tagName === 'P' && !paragraph.hasChildNodes())
          paragraph.remove()
      }
      messageHtml(document.body.innerHTML)
      attachments(attachments().filter((item) => item !== entry))
      previewUrls(
        Object.fromEntries(
          attachments().map((item) => [item.contentId, item.previewUrl]),
        ),
      )
      URL.revokeObjectURL(entry.previewUrl)
      status(`Removed ${entry.file.name} and released its preview URL.`)
    },
  }
}

const composerInlineImages = defineComponent<ComposerInlineImages>(
  composerInlineImagesTemplate,
  {
    context: createComposerInlineImages,
  },
)
const icons: Record<string, string> = {
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
      ComposerInlineImages: composerInlineImages,
      ...defineComposerComponents(),
      ...defineBadgeComponents(),
      ...defineButtonComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...definePanelComponents(),
      ...defineTabsComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  {
    selector: 'app#composer-images-demo',
    template: html`<ComposerInlineImages/>`,
  },
)
