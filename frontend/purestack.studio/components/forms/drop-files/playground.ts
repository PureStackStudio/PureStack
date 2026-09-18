import {
  type DropFileItem,
  defineButtonComponents,
  defineDropFilesComponents,
  defineFlexComponents,
  defineFormComponents,
  defineIconComponents,
} from '@purestack/ts-components'
import {
  lucide_cloud_upload,
  lucide_file,
  lucide_file_archive,
  lucide_file_image,
  lucide_file_text,
  lucide_trash_2,
} from '@purestack/ts-svg-icons'
import {
  type ComputedRef,
  computed,
  createApp,
  defineComponent,
  html,
  type Ref,
  ref,
  type SRef,
  sref,
} from 'regor'

export interface DropFilesExample {
  selectedFiles: SRef<DropFileItem[]>
  allowMany: Ref<boolean>
  locked: Ref<boolean>
  totalBytes: ComputedRef<number>
  clear: () => void
}

const dropFilesExampleTemplate = html`<Flex direction="column">
  <DropFiles
    label="Project attachments"
    hint="Text, images and PDF files. Files stay in this browser."
    accept="text/*,image/*,.pdf"
    :files="selectedFiles"
    :multiple="allowMany"
    :disabled="locked"
  />
  <Flex wrap="true">
    <FormCheck
      id="files-multiple"
      label="Allow multiple files"
      :checked="allowMany"
    />
    <FormCheck id="files-disabled" label="Lock file selection" :checked="locked" />
    <Btn variant="link" :disabled="locked" @click="clear">Clear files</Btn>
  </Flex>
  <FormStatus>
    {{ selectedFiles.length }} files · {{ totalBytes }} bytes selected
  </FormStatus>
</Flex>`

function createDropFilesExample(): DropFilesExample {
  const selectedFiles = sref<DropFileItem[]>([])
  return {
    selectedFiles,
    allowMany: ref(true),
    locked: ref(false),
    totalBytes: computed(() =>
      selectedFiles().reduce((sum, item) => sum + item.size, 0),
    ),
    clear: () => selectedFiles([]),
  }
}

const component = defineComponent<DropFilesExample>(dropFilesExampleTemplate, {
  context: createDropFilesExample,
})
const icons: Record<string, string> = {
  'lucide:cloud-upload': lucide_cloud_upload,
  'lucide:file': lucide_file,
  'lucide:trash-2': lucide_trash_2,
  'lucide:file-image': lucide_file_image,
  'lucide:file-text': lucide_file_text,
  'lucide:file-archive': lucide_file_archive,
}

createApp(
  {
    components: {
      DropFilesExample: component,

      ...defineDropFilesComponents(),
      ...defineFlexComponents(),
      ...defineFormComponents(),
      ...defineButtonComponents(),
      ...defineIconComponents((name) => icons[name] ?? ''),
    },
  },
  { selector: 'app#drop-files-demo', template: html`<DropFilesExample />` },
)
