import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'
import { themes } from '../../style/themeOptions'

interface CardGrid {
  title: string
}

const cardGridTemplate = html`<div class="card-grid">
  <div class="card-grid__title">Card Grid {{ title }}</div>
  <slot></slot>
</div>`

function registerCardGridStyles() {
  themes.forEach((theme, palette, options) => {
        styleBuilder
      .select('.card-grid', theme)
      .display('grid')
      .gap('16px')
      .padding('24px')
      .borderRadius(options.radii.md)
      .border(`1px solid ${palette.border.subtle}`)

    styleBuilder
      .select('.card-grid__title', theme)
      .fontSize('18px')
      .fontWeight('600')
      .color(palette.text.default)
  })
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
  themes.forEach((theme, palette, options) => {
        styleBuilder
      .select('.card', theme)
      .display('grid')
      .gap('8px')
      .padding('16px')
      .borderRadius(options.radii.md)
      .border(`1px solid ${palette.border.default}`)

    styleBuilder.select('.card__icon', theme).fontWeight('600')

    styleBuilder
      .select('.card__title', theme)
      .color(palette.text.subtle)
  })
}

function createCardComponent() {
  return createComponent<Card>(cardTemplate, ['icon', 'title'])
}

export function createCardComponents() {
  registerCardGridStyles()
  registerCardStyles()
  return { card: createCardComponent(), cardGrid: createCardGridComponent() }
}
