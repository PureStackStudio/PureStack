import {
  getSemanticToneIconClass,
  getSemanticToneSurfaceClass,
  getSemanticToneTextClass,
  resolveSemanticTone,
  type SemanticTone,
} from '@purestack/ts-style'
import { defineComponent, html } from 'regor'
import { registerAlertBoxStyles } from './alertBoxStyle'

export interface AlertBox {
  title?: string
  eyebrow?: string
  badge?: string
  meta?: string
  tone?: string
  icon?: string
  rootClass?: string
  titleToneClass?: string
  iconToneClass?: string
}

const alertBoxTemplate = html`<aside
  class="alert"
  :class="rootClass"
>
  <Icon class="alert__icon" :class="iconToneClass" :name="icon || 'iconoir:headset-help'" />
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
  const tone = resolveTone(props.tone)

  return {
    ...props,
    titleToneClass: getSemanticToneTextClass(tone),
    iconToneClass: getSemanticToneIconClass(tone),
    rootClass: getSemanticToneSurfaceClass(tone),
  }
}

function resolveTone(value?: string): SemanticTone {
  return resolveSemanticTone(value, 'info')
}
