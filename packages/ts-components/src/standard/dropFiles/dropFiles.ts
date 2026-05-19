import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  type SRef,
  sref,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'

export interface DropFileItem {
  id: string
  file: File
  name: string
  type: string
  size: number
  sizeLabel: string
  lastModified: number
  icon: string
}

export type DropFilesIconMap = Record<string, string>

export interface DropFilesAddOptions {
  accept?: RefOrValue<string> | string[]
  iconMap?: DropFilesIconMap | SRef<DropFilesIconMap>
  fileIcon?: RefOrValue<string>
  multiple?: RefOrValue<boolean>
  idSequence?: number
}

export interface DropFilesAddResult {
  files: DropFileItem[]
  idSequence: number
  acceptedCount: number
}

export interface DropFiles {
  files?: SRef<DropFileItem[]>
  accept?: RefOrValue<string> | string[]
  iconMap?: DropFilesIconMap | SRef<DropFilesIconMap>
  label?: RefOrValue<string>
  hint?: RefOrValue<string>
  emptyTitle?: RefOrValue<string>
  emptyText?: RefOrValue<string>
  disabled?: RefOrValue<boolean>
  multiple?: RefOrValue<boolean>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  uploadIcon?: RefOrValue<string>
  fileIcon?: RefOrValue<string>
  removeIcon?: RefOrValue<string>
  onChange?: (files: DropFileItem[]) => void
  inputElement?: ReturnType<typeof sref<HTMLInputElement | null>>
  dragging?: SRef<boolean>
  classes?: ComputedRef<string>
  acceptValue?: ComputedRef<string>
  resolvedMultiple?: ComputedRef<boolean>
  resolvedUploadIcon?: ComputedRef<string>
  resolvedRemoveIcon?: ComputedRef<string>
  hasFiles?: ComputedRef<boolean>
  openFileDialog?: () => void
  handleZoneKeydown?: (event: KeyboardEvent) => void
  handleInput?: (event: Event) => void
  handlePaste?: (event: ClipboardEvent) => void
  handleDragEnter?: (event: DragEvent) => void
  handleDragOver?: (event: DragEvent) => void
  handleDragLeave?: (event: DragEvent) => void
  handleDrop?: (event: DragEvent) => void
  removeFile?: (id: string) => void
  clear?: () => void
}

const DEFAULT_UPLOAD_ICON = 'lucide:cloud-upload'
const DEFAULT_FILE_ICON = 'lucide:file'
const DEFAULT_REMOVE_ICON = 'lucide:trash-2'

const DEFAULT_ICON_MAP: DropFilesIconMap = {
  'image/*': 'lucide:file-image',
  'text/*': 'lucide:file-text',
  'application/pdf': 'lucide:file-text',
  'application/zip': 'lucide:file-archive',
  'application/x-zip-compressed': 'lucide:file-archive',
  '.zip': 'lucide:file-archive',
}

const dropFilesTemplate = html`<div class="drop-files">
  <span class="drop-files__label" r-if="label">{{ label }}</span>
  <input
    class="drop-files__input"
    :ref="inputElement"
    type="file"
    :accept="acceptValue"
    :multiple="resolvedMultiple"
    :disabled="disabled"
    tabindex="-1"
    @change="handleInput"/>
  <div
    class="drop-files__zone"
    :class="classes"
    role="button"
    tabindex="0"
    :aria-disabled="disabled"
    @click="openFileDialog"
    @keydown="handleZoneKeydown"
    @paste="handlePaste"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop">
    <Icon class="drop-files__zone-icon" :name="resolvedUploadIcon"/>
    <span class="drop-files__zone-title">{{ emptyTitle || 'Add files' }}</span>
    <span class="drop-files__zone-text">
      {{ emptyText || 'Click, tap, paste, or drag files here.' }}
    </span>
    <span class="drop-files__hint" r-if="hint">{{ hint }}</span>
  </div>
  <ul class="drop-files__list" r-if="hasFiles" aria-label="Selected files">
    <li class="drop-files__item" r-for="item in files">
      <span class="drop-files__item-icon">
        <Icon :name="item.icon"/>
      </span>
      <span class="drop-files__item-body">
        <span class="drop-files__item-name">{{ item.name }}</span>
        <span class="drop-files__item-meta">{{ item.sizeLabel }}</span>
      </span>
      <button
        class="drop-files__remove"
        type="button"
        title="Remove file"
        aria-label="Remove file"
        :disabled="disabled"
        @click="removeFile(item.id)">
        <Icon :name="resolvedRemoveIcon"/>
      </button>
    </li>
  </ul>
</div>`

function defineDropFilesComponent() {
  return defineComponent<DropFiles>(dropFilesTemplate, {
    props: [
      'files',
      'accept',
      'iconMap',
      'label',
      'hint',
      'emptyTitle',
      'emptyText',
      'disabled',
      'multiple',
      'tone',
      'variant',
      'uploadIcon',
      'fileIcon',
      'removeIcon',
      'onChange',
    ],
    context: (head) => resolveDropFiles(head),
  })
}

export function defineDropFilesComponents() {
  return {
    dropFiles: defineDropFilesComponent(),
  }
}

class DropFilesContext implements DropFiles {
  readonly files: SRef<DropFileItem[]>
  readonly accept?: RefOrValue<string> | string[]
  readonly iconMap?: DropFilesIconMap | SRef<DropFilesIconMap>
  readonly label?: RefOrValue<string>
  readonly hint?: RefOrValue<string>
  readonly emptyTitle?: RefOrValue<string>
  readonly emptyText?: RefOrValue<string>
  readonly disabled?: RefOrValue<boolean>
  readonly multiple?: RefOrValue<boolean>
  readonly tone?: RefOrValue<SemanticTone>
  readonly variant?: RefOrValue<ComponentVariant>
  readonly uploadIcon?: RefOrValue<string>
  readonly fileIcon?: RefOrValue<string>
  readonly removeIcon?: RefOrValue<string>
  readonly onChange?: (files: DropFileItem[]) => void
  readonly inputElement = sref<HTMLInputElement | null>(null)
  readonly dragging = sref(false)
  readonly classes: ComputedRef<string>
  readonly acceptValue: ComputedRef<string>
  readonly resolvedMultiple: ComputedRef<boolean>
  readonly resolvedUploadIcon: ComputedRef<string>
  readonly resolvedRemoveIcon: ComputedRef<string>
  readonly hasFiles: ComputedRef<boolean>
  private dragDepth = 0
  private idSequence = 0

  constructor(props: DropFiles) {
    Object.assign(this, props)
    this.files = props.files ?? sref<DropFileItem[]>([])
    this.classes = computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'surfaceAlt',
        classes: [
          this.dragging() ? 'drop-files__zone--dragging' : '',
          unref(this.disabled) ? 'drop-files__zone--disabled' : '',
        ],
      }),
    )
    this.acceptValue = computed(() =>
      resolveAccept(this.accept, this.iconMap).join(','),
    )
    this.resolvedMultiple = computed(() => unref(props.multiple) !== false)
    this.resolvedUploadIcon = computed(
      () => unref(props.uploadIcon) || DEFAULT_UPLOAD_ICON,
    )
    this.resolvedRemoveIcon = computed(
      () => unref(props.removeIcon) || DEFAULT_REMOVE_ICON,
    )
    this.hasFiles = computed(() => this.files().length > 0)
  }

  openFileDialog = () => {
    if (unref(this.disabled)) return
    this.inputElement()?.click()
  }

  handleZoneKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Enter' && event.key !== ' ') return
    event.preventDefault()
    this.openFileDialog()
  }

  handleInput = (event: Event) => {
    if (unref(this.disabled)) return

    const input = event.currentTarget as HTMLInputElement | null
    this.addFileList(input?.files)
    if (input) input.value = ''
  }

  handlePaste = (event: ClipboardEvent) => {
    if (unref(this.disabled)) return

    const files = event.clipboardData?.files
    if (!files || files.length === 0) return

    event.preventDefault()
    this.addFileList(files)
  }

  handleDragEnter = (event: DragEvent) => {
    if (unref(this.disabled) || !hasFileTransfer(event.dataTransfer)) return
    event.preventDefault()
    ++this.dragDepth
    this.dragging(true)
  }

  handleDragOver = (event: DragEvent) => {
    if (unref(this.disabled) || !hasFileTransfer(event.dataTransfer)) return
    event.preventDefault()
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
  }

  handleDragLeave = (event: DragEvent) => {
    if (unref(this.disabled) || !hasFileTransfer(event.dataTransfer)) return
    event.preventDefault()
    this.dragDepth = Math.max(0, this.dragDepth - 1)
    if (this.dragDepth === 0) this.dragging(false)
  }

  handleDrop = (event: DragEvent) => {
    if (unref(this.disabled) || !hasFileTransfer(event.dataTransfer)) return
    event.preventDefault()
    this.dragDepth = 0
    this.dragging(false)
    this.addFileList(event.dataTransfer?.files)
  }

  removeFile = (id: string) => {
    if (unref(this.disabled)) return
    this.writeFiles(this.files().filter((item) => item.id !== id))
  }

  clear = () => {
    if (unref(this.disabled)) return
    this.writeFiles([])
  }

  private addFileList(fileList: FileList | null | undefined) {
    if (!fileList || fileList.length === 0) return

    const result = addDropFiles(this.files(), Array.from(fileList), {
      accept: this.accept,
      iconMap: this.iconMap,
      fileIcon: this.fileIcon,
      multiple: this.multiple,
      idSequence: this.idSequence,
    })
    this.idSequence = result.idSequence
    if (result.acceptedCount === 0) return
    this.writeFiles(result.files)
  }

  private writeFiles(files: DropFileItem[]) {
    this.files(files)
    this.onChange?.(files)
  }
}

function resolveDropFiles(head: ComponentHead<DropFiles>) {
  return new DropFilesContext(head.props) as DropFiles
}

export function addDropFiles(
  currentFiles: DropFileItem[],
  files: File[],
  options: DropFilesAddOptions = {},
): DropFilesAddResult {
  const accept = resolveAccept(options.accept, options.iconMap)
  const accepted = files
    .filter((file) => acceptsFile(file, accept))
    .map((file) => createDropFileItem(file, options))

  let idSequence = options.idSequence ?? 0
  const sequenced = accepted.map((item) => {
    ++idSequence
    return {
      ...item,
      id: createFileId(item.file, idSequence),
    }
  })
  if (sequenced.length === 0)
    return { files: currentFiles, idSequence, acceptedCount: 0 }

  if (unref(options.multiple) === false) {
    return {
      files: [sequenced[0]],
      idSequence,
      acceptedCount: 1,
    }
  }

  const next = [...currentFiles]
  let addedCount = 0
  for (const item of sequenced) {
    if (!next.some((existing) => isSameFile(existing.file, item.file))) {
      next.push(item)
      ++addedCount
    }
  }

  return { files: next, idSequence, acceptedCount: addedCount }
}

function createDropFileItem(
  file: File,
  options: DropFilesAddOptions,
): DropFileItem {
  return {
    id: '',
    file,
    name: file.name,
    type: file.type,
    size: file.size,
    sizeLabel: formatFileSize(file.size),
    lastModified: file.lastModified,
    icon: resolveFileIcon(
      file,
      readIconMap(options.iconMap),
      unref(options.fileIcon) || DEFAULT_FILE_ICON,
    ),
  }
}

function createFileId(file: File, sequence: number) {
  return [sequence, file.name, file.size, file.lastModified].join(':')
}

function readAccept(value: RefOrValue<string> | string[] | undefined) {
  return Array.isArray(value) ? value : unref(value)
}

function readIconMap(
  value: DropFilesIconMap | SRef<DropFilesIconMap> | undefined,
) {
  return typeof value === 'function' ? value() : value
}

function resolveAccept(
  accept: RefOrValue<string> | string[] | undefined,
  iconMap: DropFilesIconMap | SRef<DropFilesIconMap> | undefined,
) {
  const resolvedAccept = normalizeAccept(readAccept(accept))
  if (resolvedAccept.length > 0) return resolvedAccept

  const resolvedIconMap = readIconMap(iconMap)
  return resolvedIconMap ? normalizeAccept(Object.keys(resolvedIconMap)) : []
}

function normalizeAccept(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => item.split(','))
      .map(normalizeAcceptToken)
      .filter(Boolean)
  }

  if (!value) return []
  return value.split(',').map(normalizeAcceptToken).filter(Boolean)
}

function normalizeAcceptToken(value: string) {
  return value.trim().toLowerCase()
}

function acceptsFile(file: File, accept: string[]) {
  if (accept.length === 0) return true
  return accept.some((token) => matchesAcceptToken(file, token))
}

function matchesAcceptToken(file: File, token: string) {
  if (!token) return false

  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()
  if (token.startsWith('.')) return name.endsWith(token)
  if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1))
  return type === token
}

function resolveFileIcon(
  file: File,
  iconMap: DropFilesIconMap | undefined,
  fallback: string,
) {
  const mergedMap = { ...DEFAULT_ICON_MAP, ...(iconMap ?? {}) }
  for (const [accept, icon] of Object.entries(mergedMap)) {
    if (matchesAcceptToken(file, normalizeAcceptToken(accept)) && icon) {
      return icon
    }
  }

  return fallback
}

function hasFileTransfer(dataTransfer: DataTransfer | null) {
  if (!dataTransfer) return false
  return Array.from(dataTransfer.types).includes('Files')
}

function isSameFile(left: File, right: File) {
  return (
    left.name === right.name &&
    left.size === right.size &&
    left.type === right.type &&
    left.lastModified === right.lastModified
  )
}

function formatFileSize(size: number) {
  if (!Number.isFinite(size) || size <= 0) return '0 B'

  const units = ['B', 'KB', 'MB', 'GB']
  let value = size
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    ++unit
  }

  return `${value >= 10 || unit === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`
}
