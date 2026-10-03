import type { ComponentVariant } from '@purestack/ts-components'
import { getCurrentThemePalette, SEMANTIC_TONES } from '@purestack/ts-style'
import { defineComponent, html, type RefOrValue, unref } from 'regor'
import { resolveComponentClasses } from '../../packages/ts-components/src/standard/componentVariant'

const current = getCurrentThemePalette()
const purposes = [
  'Everyday structure',
  'Brand emphasis',
  'Featured capability',
  'Secondary emphasis',
  'Skin-defined meaning',
  'Restrained context',
  'Helpful information',
  'Positive confirmation',
  'Needs attention',
  'Critical condition',
]
const fills = [
  'tone-fill',
  'tone-fill-canvas',
  'tone-fill-surface',
  'tone-fill-surface-alt',
  'tone-fill-button',
  'tone-fill-flat',
  'tone-fill-flat-alt',
  'tone-fill-flat-solid',
  'tone-fill-spotlight',
  'tone-fill-glass',
]
const variants: ComponentVariant[] = [
  'solid',
  'surface',
  'surfaceAlt',
  'spotlight',
  'glass',
  'flat',
  'flatAlt',
  'flatSolid',
  'outlineFill',
  'outline',
  'subtle',
  'subtleBtn',
  'link',
  'sheen',
  'underline',
  'rail',
  'bracket',
  'none',
]

export function defineSemanticToneGallery() {
  return defineComponent<{ axis: RefOrValue<string> }>(
    html`<div class="component-appearance-grid tone-guide-gallery">
      <article class="component-appearance-cell" r-for="sample in samples" :data-tone-sample="sample.label">
        <code>{{ sample.label }}</code>
        <div r-if="axis === 'tones'" :class="sample.classes + ' rounded-md p-3'">
          <strong>{{ sample.description }}</strong><p class="fs-sm mb-2">One palette. Several useful roles.</p>
          <div class="tone-fill-surface-alt tone-text-surface-alt tone-border-surface-alt b-1 rounded-md p-2 mb-2">Alternate surface</div>
          <span class="d-inline-block tone-fill-button tone-text-button tone-border-button b-1 rounded-md p-2">Button role</span>
        </div>
        <div r-if="axis === 'fills'" :class="sample.classes + ' tone-guide-swatch rounded-md'"></div>
        <span r-if="axis === 'fills'" class="fs-sm">{{ sample.description }}</span>
        <div r-if="axis === 'insets' || axis === 'sizes'" :class="sample.classes + ' tone-guide-swatch rounded-md p-3'">Inset accent</div>
        <div r-if="axis === 'origins'" :class="sample.classes + ' rounded-md p-3 tone-guide-swatch'"><strong>Shared light</strong><div class="tone-fill-glass tone-border-surface-alt b-1 rounded-md p-3 mt-2">Glass follows the same origin</div></div>
        <div r-if="axis === 'states' || axis === 'variants'" class="tone--accent"><button type="button" :class="sample.classes + ' tone-guide-state p-3 w-full'" :disabled="sample.disabled" :style="sample.style">{{ sample.description }}</button></div>
        <p r-if="sample.note" class="fs-sm m-0">{{ sample.note }}</p>
      </article>
    </div>`,
    {
      props: ['axis'],
      context: (head) => {
        const axis = unref(head.props.axis)
        let samples: Array<{
          label: string
          classes: string
          description?: string
          disabled?: boolean
          style?: object
          note?: string
        }> = []
        if (axis === 'variants')
          samples = variants.map((variant) => ({
            label: variant,
            classes: resolveComponentClasses({
              tone: 'accent',
              variant,
              variantMode: 'stateful',
            }),
            description: variant,
          }))
        if (axis === 'tones')
          samples = SEMANTIC_TONES.map((tone, i) => ({
            label: `tone--${tone}`,
            classes: `tone--${tone} tone-fill-surface tone-border-surface tone-text-surface b-1`,
            description: purposes[i],
          }))
        if (axis === 'fills')
          samples = fills.map((fill, i) => ({
            label: fill,
            classes: `tone--accent ${fill}${fill === 'tone-fill-glass' ? ' tone-guide-glass-field' : ''}`,
            description: [
              'Direct tone color',
              'Canvas background',
              'Surface background',
              'Alternate surface background',
              'Button background',
              'Surface bgcolor only',
              'Alternate surface bgcolor only',
              'Button bgcolor only',
              'Field + radial light',
              'Light + translucent veil',
            ][i],
          }))
        if (axis === 'insets')
          samples = ['l', 'r', 't', 'b', 'x', 'y'].map((direction) => ({
            label: `tone-inset-${direction}`,
            classes: `tone--feature tone-fill-surface tone-text-surface tone-inset-${direction} inset-size-2`,
          }))
        if (axis === 'sizes')
          samples = [0, 1, 2, 3, 4, 5, 6].map((size) => ({
            label: `inset-size-${size}`,
            classes: `tone--info tone-fill-surface tone-text-surface tone-inset-l inset-size-${size}`,
          }))
        if (axis === 'origins')
          samples = [
            'top-left',
            'top',
            'top-right',
            'bottom-left',
            'bottom-right',
          ].map((origin) => ({
            label: `spotlight-from-${origin}`,
            classes: `tone--accent tone-fill-spotlight tone-text-surface-alt spotlight-from-${origin}`,
          }))
        if (axis === 'states')
          samples = (['surface', 'surfaceAlt', 'button'] as const).flatMap(
            (role) =>
              (['rest', 'hover', 'active', 'disabled'] as const).map(
                (state) => {
                  const suffix = role === 'surfaceAlt' ? 'surface-alt' : role
                  const token = current[role][state]
                  return {
                    label: `${suffix} · ${state}`,
                    classes: `b-1 rounded-md tone-fill-${suffix}-all tone-border-${suffix}-all tone-text-${suffix}-all${state === 'active' ? ' active' : ''}`,
                    description:
                      state === 'hover'
                        ? 'Hover token snapshot'
                        : state === 'active'
                          ? 'Persistent .active class'
                          : state === 'disabled'
                            ? 'Native disabled button'
                            : 'Rest · hover or press me',
                    disabled: state === 'disabled',
                    style:
                      state === 'hover'
                        ? {
                            background: token.background,
                            borderColor: token.border,
                            color: token.text,
                          }
                        : undefined,
                    note:
                      state === 'hover'
                        ? 'The hover token is painted directly so the state remains visible without a pointer.'
                        : undefined,
                  }
                },
              ),
          )
        return { ...head.props, samples }
      },
    },
  )
}
