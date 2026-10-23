import { defineComponent, html } from 'regor'
import { palettePresets } from '../../theme/presets'

export interface PalettePicker {}

const template = html`<details class="palette-picker">
  <summary class="palette-picker__trigger" aria-label="Site color" title="Choose site color">
    <Icon name="tabler:palette" aria-hidden="true"/>
  </summary>
  <fieldset class="palette-picker__panel">
    <legend>Site color</legend>
    <p>Choose your site’s color palette.</p>
    <div class="palette-picker__options">
      ${palettePresets.map(renderColorOption).join('')}
    </div>
    <span class="palette-picker__note">Saved on this device.</span>
  </fieldset>
</details><PageScript src="/modules/palette-picker.ts"/>`

export function definePalettePickerComponent() {
  return defineComponent<PalettePicker>(template)
}

function renderColorOption(preset: (typeof palettePresets)[number]) {
  return html`<label class="palette-picker__option" data-site-color-option="${preset.id}">
    <input type="radio" name="site-palette" value="${preset.id}"/>
    <span class="palette-picker__swatch" aria-hidden="true"><Icon name="tabler:check"/></span>
    <span>${preset.label}</span>
  </label>`
}
