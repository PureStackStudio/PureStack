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
  hasTitle?: boolean
  hasEyebrow?: boolean
  hasBadge?: boolean
  hasMeta?: boolean
  hasHeader?: boolean
  titleToneClass?: string
  iconToneClass?: string
}

const alertBoxTemplate = html`<aside
  class="alert"
  :class="rootClass"
>
  <Icon class="alert__icon" :class="iconToneClass" :name="icon || 'iconoir:headset-help'" />
  <div class="alert__content">
    <div class="alert__header" r-if="hasHeader">
      <p class="alert__eyebrow" r-if="hasEyebrow">{{ eyebrow }}</p>
      <h3 class="alert__title" :class="titleToneClass" r-if="hasTitle">{{ title }}</h3>
      <span class="alert__badge" r-if="hasBadge">{{ badge }}</span>
    </div>
    <div class="alert__body"><slot></slot></div>
    <div class="alert__actions"><slot name="actions"></slot></div>
    <p class="alert__meta" r-if="hasMeta">{{ meta }}</p>
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
    hasTitle: Boolean(props.title),
    hasEyebrow: Boolean(props.eyebrow),
    hasBadge: Boolean(props.badge),
    hasMeta: Boolean(props.meta),
    hasHeader: Boolean(props.title || props.eyebrow || props.badge),
    rootClass: getSemanticToneSurfaceClass(tone),
  }
}

function resolveTone(value?: string): SemanticTone {
  return resolveSemanticTone(value, 'info')
}
