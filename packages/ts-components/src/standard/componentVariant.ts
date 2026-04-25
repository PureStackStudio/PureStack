import { getSemanticToneClass, type SemanticTone } from '@purestack/ts-style'
import { type RefOrValue, unref } from 'regor'

export type ComponentVariant =
  | 'none'
  | 'solid'
  | 'surface'
  | 'surfaceAlt'
  | 'outlineFill'
  | 'outline'
  | 'subtle'
  | 'link'
  | 'sheen'
  | 'underline'
  | 'rail'
  | 'bracket'

export const DEFAULT_COMPONENT_VARIANT: ComponentVariant = 'solid'

export interface ComponentClassProps {
  tone?: RefOrValue<SemanticTone>
  variant?: RefOrValue<ComponentVariant>
  class?: RefOrValue<string>
}

export interface ResolveComponentClassesOptions {
  defaultVariant?: ComponentVariant
  classes?: Array<RefOrValue<string | undefined | false>>
}

const COMPONENT_VARIANT_CLASSES: Record<ComponentVariant, string> = {
  none: '',
  solid:
    'b-1 rounded-md tone-fill-button-all tone-border-button-all tone-text-button-all',
  surface:
    'b-1 rounded-md tone-fill-surface-all tone-border-surface-all tone-text-surface-all',
  surfaceAlt:
    'b-1 rounded-md tone-fill-surface-alt-all tone-border-surface-alt-all tone-text-surface-alt-all',
  outlineFill:
    'b-2 rounded-md tone-border-button-all tone-text tone-fill-button-hover tone-text-button-hover tone-fill-button-active tone-text-button-active',
  outline:
    'b-2 b-2-hover rounded-md tone-border-button-hover tone-fill-button-active tone-text tone-text-button-hover tone-fill-button-active tone-text-button-active',
  subtle:
    'b-0 rounded-md tone-text tone-fill-surface-hover tone-fill-surface-active',
  link: 'underline-hover tone-text',
  sheen: 'tone-text-bg-button-all fs-h1 pad-1 fw-900 uppercase',
  underline: 'tone-inset-b-hover tone-inset-b-active tone-text',
  rail: 'bl-1 inset-size-4 padl-4 padr-3 tone-inset-l-hover tone-border-button-all tone-text tone-fill-active tone-text-button-active',
  bracket:
    'tone-inset-y-hover tone-inset-y-active tone-text tone-fill-active tone-text-button-active',
}

export function resolveComponentVariantClassName(
  variant: RefOrValue<ComponentVariant> | undefined,
  defaultVariant: ComponentVariant = DEFAULT_COMPONENT_VARIANT,
) {
  const resolvedVariant = unref(variant) || defaultVariant
  return COMPONENT_VARIANT_CLASSES[resolvedVariant]
}

export function resolveComponentClasses(
  props: ComponentClassProps,
  options: ResolveComponentClassesOptions = {},
) {
  return [
    resolveComponentVariantClassName(props.variant, options.defaultVariant),
    getSemanticToneClass(unref(props.tone)),
    ...(options.classes || []).map(unref),
    unref(props.class) || '',
  ]
    .filter(Boolean)
    .join(' ')
}
