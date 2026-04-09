import { tryResolveTsSsgContext } from '@purestack/ts-common'
import {
  getSemanticToneSurfaceClass,
  getSemanticToneTextClass,
  resolveSemanticTone,
  type SemanticTone,
} from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'
export type ModalSlideFrom = 'none' | 'top' | 'right' | 'bottom' | 'left'

export interface Modal {
  id?: string
  title?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  size?: RefOrValue<ModalSize>
  fade?: RefOrValue<boolean>
  slideFrom?: RefOrValue<ModalSlideFrom>
  showClose?: RefOrValue<boolean>
  titleId?: string
  rootClass?: ComputedRef<string>
  panelToneClass?: ComputedRef<string>
  titleToneClass?: ComputedRef<string>
}

export interface ModalTrigger {
  target?: string
  label?: RefOrValue<string>
}

const modalTemplate = html`<dialog
  class="modal"
  :class="rootClass"
  :id="id"
  :data-modal-id="id"
  data-modal-root
  role="dialog"
  aria-modal="true"
  :aria-labelledby="titleId"
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
            tone="neutral"
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

export function defineModalComponents() {
  return {
    modal: createModalComponent(),
    modalTrigger: createModalTriggerComponent(),
  }
}

function resolveModal(props: Modal): Modal {
  return {
    ...props,
    titleId: `${unref(props.id)}-title`,
    panelToneClass: computed(() =>
      getSemanticToneSurfaceClass(resolveSemanticTone(unref(props.tone))),
    ),
    titleToneClass: computed(() =>
      getSemanticToneTextClass(resolveSemanticTone(unref(props.tone))),
    ),
    rootClass: computed(() => resolveModalRootClass(props)),
  }
}

function resolveModalTrigger(props: ModalTrigger): ModalTrigger {
  return {
    target: props.target,
    label: props.label,
  }
}

function resolveModalRootClass(props: Modal) {
  const size = unref(props.size) || 'md'
  const slideFrom = unref(props.slideFrom) || 'none'
  const fade = unref(props.fade) ?? true
  return [
    `modal--size-${size}`,
    fade ? 'modal--fade' : '',
    slideFrom !== 'none' ? `modal--slide-${slideFrom}` : '',
    fade || slideFrom !== 'none' ? 'modal--animated' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function markModalRuntimeEmbed(head: ComponentHead<Modal>) {
  tryResolveTsSsgContext(head)?.recordRuntimeEmbed('modal', 'head')
}
