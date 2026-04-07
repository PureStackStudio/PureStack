import {
  getSemanticToneIconClass,
  getSemanticToneSurfaceClass,
  getSemanticToneTextClass,
  resolveSemanticTone,
} from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'
import { registerAlertBoxStyles } from './alertBoxStyle'

export interface AlertBox {
  title?: RefOrValue<string>
  eyebrow?: RefOrValue<string>
  badge?: RefOrValue<string>
  meta?: RefOrValue<string>
  tone?: RefOrValue<string>
  icon?: RefOrValue<string>
  rootClass?: ComputedRef<string>
  titleToneClass?: ComputedRef<string>
  iconToneClass?: ComputedRef<string>
}

const alertBoxTemplate = html`<aside
  class="alert"
  :class="rootClass"
>
  <Icon class="expandable-panel__icon" :name="icon" :class="iconToneClass" r-if="icon" :wrap="true"/>
  <div class="alert__content">
    <div class="alert__header" r-if="title || eyebrow || badge">
      <p class="alert__eyebrow" r-if="eyebrow">{{ eyebrow }}</p>
      <h3 class="alert__title" :class="titleToneClass" r-if="title">{{ title }}</h3>
      <span class="alert__badge" r-if="badge">{{ badge }}</span>
    </div>
    <div class="alert__body"><slot></slot></div>
    <div class="alert__actions"><slot name="actions"></slot></div>
    <p class="alert__meta" r-if="meta">{{ meta }}</p>
  </div>
</aside>`

function createAlertBoxComponent() {
  return defineComponent<AlertBox>(alertBoxTemplate, {
    props: ['title', 'eyebrow', 'badge', 'meta', 'tone', 'icon'],
    context: (head) => resolveAlertBox(head.props),
  })
}

export function createAlertComponents() {
  registerAlertBoxStyles()
  return {
    alertBox: createAlertBoxComponent(),
  }
}

function resolveAlertBox(props: AlertBox): AlertBox {
  return {
    ...props,
    titleToneClass: computed(() =>
      getSemanticToneTextClass(resolveSemanticTone(unref(props.tone), 'info')),
    ),
    iconToneClass: computed(() =>
      getSemanticToneIconClass(resolveSemanticTone(unref(props.tone), 'info')),
    ),
    rootClass: computed(() =>
      getSemanticToneSurfaceClass(
        resolveSemanticTone(unref(props.tone), 'info'),
      ),
    ),
  }
}
