import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { getThemeOptions, getThemePalette } from '../../style/themeOptions'

interface CardGrid {
  title: string
}

const cardGridTemplate = html`<div class="card-grid">
  <div class="card-grid__title">Card Grid {{ title }}</div>
  <slot></slot>
</div>`

function registerCardGridStyles() {
  const themeOptions = getThemeOptions()
  const palette = (theme: string) => getThemePalette(theme, themeOptions)

  const baseGrid = (theme: string) =>
    styleBuilder
      .select('.card-grid', theme)
      .display('grid')
      .gap('16px')
      .padding('24px')
      .borderRadius(themeOptions.radii.md)

  baseGrid('light').border(`1px solid ${palette('light').cardGrid.border}`)
  baseGrid('dark').border(`1px solid ${palette('dark').cardGrid.border}`)

  const baseTitle = (theme: string) =>
    styleBuilder
      .select('.card-grid__title', theme)
      .fontSize('18px')
      .fontWeight('600')

  baseTitle('light').color(palette('light').cardGrid.title)
  baseTitle('dark').color(palette('dark').cardGrid.title)
}

function createCardGridComponent() {
  return createComponent<CardGrid>(cardGridTemplate, ['title'])
}

interface Card {
  icon: string
  title: string
}

const cardTemplate = html`<div class="card">
  <div class="card__icon">icon: {{ icon }}</div>
  <div class="card__title">Card {{ title }}</div>
  <slot></slot>
</div>`

function registerCardStyles() {
  const themeOptions = getThemeOptions()
  const palette = (theme: string) => getThemePalette(theme, themeOptions)

  const baseCard = (theme: string) =>
    styleBuilder
      .select('.card', theme)
      .display('grid')
      .gap('8px')
      .padding('16px')
      .borderRadius(themeOptions.radii.md)

  baseCard('light').border(`1px solid ${palette('light').card.border}`)
  baseCard('dark').border(`1px solid ${palette('dark').card.border}`)

  const baseIcon = (theme: string) =>
    styleBuilder.select('.card__icon', theme).fontWeight('600')
  baseIcon('light')
  baseIcon('dark')

  styleBuilder
    .select('.card__title', 'light')
    .color(palette('light').card.title)
  styleBuilder.select('.card__title', 'dark').color(palette('dark').card.title)
}

function createCardComponent() {
  return createComponent<Card>(cardTemplate, ['icon', 'title'])
}

export function createCardComponents() {
  registerCardGridStyles()
  registerCardStyles()
  return { card: createCardComponent(), cardGrid: createCardGridComponent() }
}
