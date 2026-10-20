import { defineComponent, html } from 'regor'
import { studioColorPresets } from '../theme/studioColorPresets'

const template = html`<details class="studio-color-picker">
  <summary class="studio-color-picker__trigger" aria-label="Site color" title="Choose site color">
    <Icon name="tabler:palette" aria-hidden="true"/>
  </summary>
  <fieldset class="studio-color-picker__panel">
    <legend>Site color</legend>
    <p>Choose your site’s color palette.</p>
    <div class="studio-color-picker__options">
      ${studioColorPresets.map(renderColorOption).join('')}
    </div>
    <span class="studio-color-picker__note">Saved on this device.</span>
  </fieldset>
</details><PageScript src="/color-picker.ts"/>`

export function defineStudioColorPickerComponent() {
  return defineComponent(template)
}

function renderColorOption(preset: (typeof studioColorPresets)[number]) {
  return html`<label class="studio-color-picker__option" data-site-color-option="${preset.id}">
    <input type="radio" name="studio-site-color" value="${preset.id}"/>
    <span class="studio-color-picker__swatch" aria-hidden="true"><Icon name="tabler:check"/></span>
    <span>${preset.label}</span>
  </label>`
}
