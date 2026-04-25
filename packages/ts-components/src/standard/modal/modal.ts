import { tryResolveTsSsgContext } from '@purestack/ts-common'
import type { SemanticTone } from '@purestack/ts-style'
import {
  type ComponentHead,
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'
import {
  type ComponentVariant,
  resolveComponentClasses,
} from '../componentVariant'

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'
export type ModalSlideFrom = 'none' | 'top' | 'right' | 'bottom' | 'left'

export interface Modal {
  id?: string
  title?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  class?: RefOrValue<string>
  size?: RefOrValue<ModalSize>
  fade?: RefOrValue<boolean>
  slideFrom?: RefOrValue<ModalSlideFrom>
  showClose?: RefOrValue<boolean>
  titleId?: string
  rootClass?: ComputedRef<string>
  classes?: ComputedRef<string>
}

export interface ModalTrigger {
  target?: string
  label?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
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
      <div class="modal__surface" :class="classes">
        <header class="modal__header">
          <slot name="header">
            <h2 class="modal__title tone-text" :id="titleId" r-if="title">
              {{ title }}
            </h2>
          </slot>
          <Btn
            r-if="showClose"
            :variant="variant"
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

const modalTriggerTemplate = html`<Btn
  type="button"
  :tone="tone"
  :variant="variant"
  :data-modal-target="target"
  data-modal-trigger
>
  {{ label }}
</Btn>`

function defineModalComponent() {
  return defineComponent<Modal>(modalTemplate, {
    props: [
      'id',
      'title',
      'tone',
      'variant',
      'class',
      'size',
      'fade',
      'slideFrom',
      'showClose',
    ],
    context: (head) => {
      markModalRuntimeEmbed(head)
      return resolveModal(head.props)
    },
  })
}

function defineModalTriggerComponent() {
  return defineComponent<ModalTrigger>(modalTriggerTemplate, {
    props: ['target', 'label', 'tone', 'variant'],
    context: (head) => resolveModalTrigger(head.props),
  })
}

export function defineModalComponents() {
  return {
    modal: defineModalComponent(),
    modalTrigger: defineModalTriggerComponent(),
  }
}

function resolveModal(props: Modal): Modal {
  return {
    ...props,
    titleId: `${unref(props.id)}-title`,
    classes: computed(() =>
      resolveComponentClasses(props, {
        defaultVariant: 'surface',
      }),
    ),
    rootClass: computed(() => resolveModalRootClass(props)),
  }
}

function resolveModalTrigger(props: ModalTrigger): ModalTrigger {
  return {
    target: props.target,
    label: props.label,
    tone: props.tone,
    variant: props.variant,
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
