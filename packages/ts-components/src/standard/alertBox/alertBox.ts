import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
import {
  type ComputedRef,
  computed,
  defineComponent,
  html,
  type RefOrValue,
  unref,
} from 'regor'

export interface AlertBox {
  title?: RefOrValue<string>
  eyebrow?: RefOrValue<string>
  badge?: RefOrValue<string>
  meta?: RefOrValue<string>
  tone?: RefOrValue<SemanticTone>
  icon?: RefOrValue<string>
  toneClass?: ComputedRef<string>
}

const alertBoxTemplate = html`<aside class="alert tone-surface" :class="toneClass">
  <Icon
    class="expandable-panel__icon tone-icon"
    :name="icon"
    r-if="icon"
    :framed="true"/>
  <div class="alert__content">
    <div class="alert__header" r-if="title || eyebrow || badge">
      <p class="alert__eyebrow" r-if="eyebrow">{{ eyebrow }}</p>
      <h3 class="alert__title tone-text" r-if="title">
        {{ title }}
      </h3>
      <Badge :tone="tone" r-if="badge">{{ badge }}</Badge>
    </div>
    <div class="alert__body"><slot></slot></div>
    <div class="alert__actions"><slot name="actions"></slot></div>
    <p class="alert__meta" r-if="meta">{{ meta }}</p>
  </div>
</aside>`

function defineAlertBoxComponent() {
  return defineComponent<AlertBox>(alertBoxTemplate, {
    props: ['title', 'eyebrow', 'badge', 'meta', 'tone', 'icon'],
    context: (head) => resolveAlertBox(head.props),
  })
}

export function defineAlertComponents() {
  return {
    alertBox: defineAlertBoxComponent(),
  }
}

function resolveAlertBox(props: AlertBox): AlertBox {
  return {
    ...props,
    toneClass: computed(() => getSemanticToneClass(unref(props.tone), 'info')),
  }
}
