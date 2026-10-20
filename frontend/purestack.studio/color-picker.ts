import {
  DEFAULT_SITE_COLOR,
  isSiteColor,
  SITE_COLOR_STORAGE_KEY,
  studioColorPresets,
  type SiteColor,
} from '../theme/studioColorPresets'

const root = document.documentElement
const pickerSelector = '.studio-color-picker'

function applyColor(color: SiteColor) {
  root.dataset.siteColor = color
  const label = studioColorPresets.find((preset) => preset.id === color)?.label
  for (const picker of document.querySelectorAll<HTMLDetailsElement>(
    pickerSelector,
  )) {
    picker
      .querySelector('summary')
      ?.setAttribute('aria-label', `Site color: ${label}`)
    for (const input of picker.querySelectorAll<HTMLInputElement>(
      'input[type="radio"]',
    )) {
      input.checked = input.value === color
    }
  }
}

function saveColor(color: SiteColor) {
  applyColor(color)
  let message = 'Saved on this device.'
  try {
    localStorage.setItem(SITE_COLOR_STORAGE_KEY, color)
  } catch {
    message = 'Applied for this visit.'
  }
  for (const note of document.querySelectorAll('.studio-color-picker__note')) {
    note.textContent = message
  }
}

function closePickers(returnFocus = false) {
  for (const picker of document.querySelectorAll<HTMLDetailsElement>(
    `${pickerSelector}[open]`,
  )) {
    picker.open = false
    if (returnFocus) picker.querySelector('summary')?.focus()
  }
}

document.addEventListener('change', (event) => {
  const input = event.target
  if (!(input instanceof HTMLInputElement) || !input.closest(pickerSelector))
    return
  if (isSiteColor(input.value)) saveColor(input.value)
})

document.addEventListener('click', (event) => {
  if (event.target instanceof Element && !event.target.closest(pickerSelector))
    closePickers()
})

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closePickers(true)
})

window.addEventListener('storage', (event) => {
  if (event.key !== SITE_COLOR_STORAGE_KEY && event.key !== null) return
  applyColor(isSiteColor(event.newValue) ? event.newValue : DEFAULT_SITE_COLOR)
})

const initial = root.dataset.siteColor
applyColor(isSiteColor(initial) ? initial : DEFAULT_SITE_COLOR)
