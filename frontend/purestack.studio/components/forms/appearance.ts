import {
  defineAutoCompleteInputComponents,
  defineButtonComponents,
  defineComposerComponents,
  defineDropFilesComponents,
  defineFlexComponents,
  defineFormComponents,
  defineFormInputField,
  defineFormSelectField,
  defineIconComponents,
  defineMultiAutoCompleteInputComponents,
} from '@purestack/ts-components'
import {
  lucide_bold,
  lucide_check,
  lucide_chevron_down,
  lucide_cloud_upload,
  lucide_code,
  lucide_eraser,
  lucide_file,
  lucide_file_archive,
  lucide_file_image,
  lucide_file_text,
  lucide_italic,
  lucide_link,
  lucide_list,
  lucide_list_ordered,
  lucide_loader_circle,
  lucide_trash_2,
  lucide_underline,
  lucide_x,
  tabler_align_center,
  tabler_align_left,
  tabler_align_right,
} from '@purestack/ts-svg-icons'
import { createApp, html } from 'regor'
import { defineFormAppearanceGallery } from '../../../docs/formAppearance'

const icons: Record<string, string> = {
  'lucide:bold': lucide_bold,
  'lucide:check': lucide_check,
  'lucide:chevron-down': lucide_chevron_down,
  'lucide:cloud-upload': lucide_cloud_upload,
  'lucide:code': lucide_code,
  'lucide:eraser': lucide_eraser,
  'lucide:file': lucide_file,
  'lucide:file-archive': lucide_file_archive,
  'lucide:file-image': lucide_file_image,
  'lucide:file-text': lucide_file_text,
  'lucide:italic': lucide_italic,
  'lucide:link': lucide_link,
  'lucide:list': lucide_list,
  'lucide:list-ordered': lucide_list_ordered,
  'lucide:loader-circle': lucide_loader_circle,
  'lucide:trash-2': lucide_trash_2,
  'lucide:underline': lucide_underline,
  'lucide:x': lucide_x,
  'tabler:align-center': tabler_align_center,
  'tabler:align-left': tabler_align_left,
  'tabler:align-right': tabler_align_right,
}

const components = {
  FormAppearanceGallery: defineFormAppearanceGallery(),
  ...defineFormComponents(),
  ...defineFormInputField(),
  ...defineFormSelectField(),
  ...defineAutoCompleteInputComponents(),
  ...defineMultiAutoCompleteInputComponents(),
  ...defineComposerComponents(),
  ...defineDropFilesComponents(),
  ...defineButtonComponents(),
  ...defineFlexComponents(),
  ...defineIconComponents((name) => icons[name] ?? ''),
}

export function mountFormAppearanceGalleries() {
  for (const host of document.querySelectorAll<HTMLElement>(
    '[data-form-gallery]',
  )) {
    createApp(
      {
        components,
        component: host.dataset.component,
        axis: host.dataset.axis,
        prefix: host.id,
      },
      {
        selector: `#${host.id}`,
        template: html`<FormAppearanceGallery :component="component" :axis="axis" :prefix="prefix"/>`,
      },
    )
  }
}
