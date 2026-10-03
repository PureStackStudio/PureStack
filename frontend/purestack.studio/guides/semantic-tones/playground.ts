import {
  getCurrentThemePaletteVarName,
  SEMANTIC_TONES,
} from '@purestack/ts-style'
import { computed, createApp, html, ref, watchEffect } from 'regor'

const selectedTone = ref('info')
const selectedRole = ref('surface')
const pressed = ref(false)
const locked = ref(false)
const recipe = computed(
  () =>
    `tone--${selectedTone()} tone-fill-${selectedRole()}-all tone-border-${selectedRole()}-all tone-text-${selectedRole()}-all b-1 rounded-md p-3${pressed() ? ' active' : ''}`,
)
const inspector = ref('')

createApp(
  {
    selectedTone,
    selectedRole,
    pressed,
    locked,
    recipe,
    inspector,
    tones: SEMANTIC_TONES,
    reset: () => {
      selectedTone('info')
      selectedRole('surface')
      pressed(false)
      locked(false)
    },
  },
  {
    selector: 'app#tone-architecture-playground',
    template: html`<div class="component-recipe">
    <div class="component-guide-grid">
      <div><label for="tone-lab-tone">Selected palette</label><select id="tone-lab-tone" r-model="selectedTone" class="w-full p-2"><option r-for="tone in tones" :value="tone">{{ tone }}</option></select></div>
      <div><label for="tone-lab-role">Matched role</label><select id="tone-lab-role" r-model="selectedRole" class="w-full p-2"><option value="surface">surface</option><option value="surface-alt">surface-alt</option><option value="button">button</option></select></div>
    </div>
    <div class="d-flex gap-3 my-3"><label><input id="tone-lab-active" type="checkbox" r-model="pressed"/> Add .active</label><label><input id="tone-lab-disabled" type="checkbox" r-model="locked"/> Native disabled</label></div>
    <button id="tone-lab-preview" type="button" :class="recipe + ' w-full'" :disabled="locked" :aria-pressed="pressed" @click="pressed(!pressed())">{{ pressed ? 'Pressed appearance' : 'Hover me, then press me' }}</button>
    <p class="fs-sm">Hover uses :hover; pressing the pointer uses :active; the checkbox keeps .active visible. Disabled uses the native disabled attribute.</p>
    <strong>Exact class recipe</strong><pre class="runtime-code"><code>{{ recipe }}</code></pre>
    <strong>Computed current palette</strong><pre class="runtime-code"><code>{{ inspector }}</code></pre>
    <button type="button" class="tone--neutral tone-border-surface tone-text-surface b-1 rounded-md p-2" @click="reset">Reset recipe</button>
  </div>`,
  },
)

const refresh = () => {
  const preview = document.querySelector('#tone-lab-preview')
  if (!preview) return
  const style = getComputedStyle(preview)
  const role = selectedRole() === 'surface-alt' ? 'surfaceAlt' : selectedRole()
  inspector(
    [
      'tone',
      `${role}.rest.background`,
      `${role}.hover.background`,
      `${role}.active.background`,
      `${role}.disabled.background`,
      'text.default',
      'text.subtle',
      'border.default',
      `${role}.focusRing`,
    ]
      .map((path) => {
        const name = getCurrentThemePaletteVarName(path)
        return `${name}: ${style.getPropertyValue(name).trim()}`
      })
      .join('\n'),
  )
}
watchEffect(() => {
  recipe()
  requestAnimationFrame(refresh)
})
new MutationObserver(refresh).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['data-theme'],
})
