import { docLayoutVars } from '../../ts-style/src/docLayoutVars'

export const DOC_LAYOUT_NAV_WIDTH_STORAGE_KEY = 'ts-ssg:doc-layout:nav-width'
export const DOC_LAYOUT_TOC_WIDTH_STORAGE_KEY = 'ts-ssg:doc-layout:toc-width'

export function readDocLayoutPxVar(name: string, fallback: number) {
  const raw = getComputedStyle(document.body).getPropertyValue(name).trim()
  const value = Number.parseFloat(raw)
  return Number.isFinite(value) ? value : fallback
}

export function applyStoredDocLayoutPreferences() {
  applyStoredLengthPreference(
    DOC_LAYOUT_NAV_WIDTH_STORAGE_KEY,
    docLayoutVars.userNavWidth,
    docLayoutVars.minNavWidth,
    docLayoutVars.maxNavWidth,
  )
  applyStoredLengthPreference(
    DOC_LAYOUT_TOC_WIDTH_STORAGE_KEY,
    docLayoutVars.userTocWidth,
    docLayoutVars.minTocWidth,
    docLayoutVars.maxTocWidth,
  )
}

function applyStoredLengthPreference(
  storageKey: string,
  cssVar: string,
  minVar: string,
  maxVar: string,
) {
  const stored = readStoredPixelValue(storageKey)
  if (stored === null) return
  const min = readDocLayoutPxVar(minVar, stored)
  const max = readDocLayoutPxVar(maxVar, stored)
  const clamped = clamp(stored, min, max)
  document.body.style.setProperty(cssVar, `${clamped}px`)
}

function readStoredPixelValue(storageKey: string) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return null
    const value = Number.parseFloat(raw)
    return Number.isFinite(value) ? value : null
  } catch {
    return null
  }
}

function clamp(value: number, min: number, max: number) {
  if (min > max) return value
  return Math.min(Math.max(value, min), max)
}
