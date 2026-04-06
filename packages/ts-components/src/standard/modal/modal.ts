import {
  getSemanticToneSurfaceClass,
  getSemanticToneTextClass,
  resolveSemanticTone,
} from '@purestack/ts-style'
import { tryResolveTsSsgContext } from 'packages/ts-common/src/resolveTsSsgContext'
import { type ComponentHead, defineComponent, html, isRef, unref } from 'regor'
import { registerModalStyles } from './modalStyle'

export interface Modal {
  id?: string
  title?: string
  tone?: string
  size?: string
  fade?: boolean | string
  slideFrom?: string
  showClose?: boolean | string
  titleId?: string
  rootClass?: string
  panelToneClass?: string
  titleToneClass?: string
}

export interface ModalTrigger {
  target?: string
  label?: string
}

const modalTemplate = html`<dialog
  class="modal"
  :class="rootClass"
  :id="id"
  :data-modal-id="id"
  data-modal-root
  role="dialog"
  aria-modal="true"
  :aria-labelledby="title ? titleId : undefined"
>
  <slot name="content">
    <article class="modal__panel" role="document" tabindex="-1">
      <div class="modal__surface" :class="panelToneClass">
        <header class="modal__header">
          <slot name="header">
            <h2 class="modal__title" :class="titleToneClass" :id="titleId" r-if="title">{{ title }}</h2>
          </slot>
          <Btn
            r-if="showClose"
            variant="ghost"
            size="sm"
            type="button"
            data-modal-close
            aria-label="Close dialog"
          >
            <span aria-hidden="true">X</span>
          </Btn>
        </header>
        <div class="modal__body">
          <slot name="body">
            <slot></slot>
          </slot>
        </div>
        <footer class="modal__footer"><slot name="footer"></slot></footer>
      </div>
    </article>
  </slot>
</dialog>`

const modalTriggerTemplate = html`<Btn type="button" :data-modal-target="target" data-modal-trigger>
  {{ label }}
</Btn>`

function createModalComponent() {
  return defineComponent<Modal>(modalTemplate, {
    props: ['id', 'title', 'tone', 'size', 'fade', 'slideFrom', 'showClose'],
    context: (head) => {
      markModalRuntimeEmbed(head)
      return resolveModal(head.props)
    },
  })
}

function createModalTriggerComponent() {
  return defineComponent<ModalTrigger>(modalTriggerTemplate, {
    props: ['target', 'label'],
    context: (head) => resolveModalTrigger(head.props),
  })
}

export function createModalComponents() {
  registerModalStyles()
  return {
    modal: createModalComponent(),
    modalTrigger: createModalTriggerComponent(),
  }
}

function resolveModal(props: Modal): Modal {
  const id = resolveModalId(props.id)
  const title = resolveText(props.title)
  const tone = resolveSemanticTone(props.tone)
  const size = resolveSize(props.size)
  const slideFrom = resolveSlideFrom(props.slideFrom)
  const fade = resolveBoolean(props.fade, true)
  const showClose = resolveBoolean(props.showClose, true)
  const rootClass = [
    `modal--size-${size}`,
    fade ? 'modal--fade' : '',
    slideFrom !== 'none' ? `modal--slide-${slideFrom}` : '',
    fade || slideFrom !== 'none' ? 'modal--animated' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return {
    id,
    title,
    size,
    fade,
    slideFrom,
    showClose,
    titleId: `${id}-title`,
    panelToneClass: getSemanticToneSurfaceClass(tone),
    titleToneClass: getSemanticToneTextClass(tone),
    rootClass,
  }
}

function resolveModalTrigger(props: ModalTrigger): ModalTrigger {
  return {
    target: resolveModalId(props.target),
    label: resolveText(props.label) || 'Open modal',
  }
}

function resolveModalId(value: unknown) {
  const normalized = resolveText(value)
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (normalized) return normalized
  return 'modal-default'
}

function resolveText(value: unknown) {
  if (isRef(value)) value = unref(value)
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : ''
}

function resolveSize(value: unknown) {
  const normalized = resolveText(value).toLowerCase()
  if (
    normalized === 'sm' ||
    normalized === 'md' ||
    normalized === 'lg' ||
    normalized === 'xl'
  ) {
    return normalized
  }
  return 'md'
}

function resolveSlideFrom(value: unknown) {
  const normalized = resolveText(value).toLowerCase()
  if (
    normalized === 'none' ||
    normalized === 'top' ||
    normalized === 'right' ||
    normalized === 'bottom' ||
    normalized === 'left'
  ) {
    return normalized
  }
  return 'none'
}

function resolveBoolean(value: unknown, fallback: boolean) {
  if (isRef(value)) value = unref(value)
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    if (normalized === 'true' || normalized === '1' || normalized === 'yes') {
      return true
    }
    if (normalized === 'false' || normalized === '0' || normalized === 'no') {
      return false
    }
  }
  return fallback
}

function markModalRuntimeEmbed(head: ComponentHead<Modal>) {
  tryResolveTsSsgContext(head)?.recordRuntimeEmbed('modal', 'head')
}
