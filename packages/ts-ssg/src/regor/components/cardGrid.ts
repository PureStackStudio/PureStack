import { createComponent, html } from 'regor'

import { styleBuilder } from '../../style/styles'

interface CardGrid {
  title: string
}

const cardGridTemplate = html`<div class="card-grid">
  <div class="card-grid__title">Card Grid {{ title }}</div>
  <slot></slot>
</div>`

function registerCardGridStyles() {
  const baseGrid = (theme: string) =>
    styleBuilder
      .select('.card-grid', theme)
      .set('display', 'grid')
      .set('gap', '16px')
      .set('padding', '24px')
      .set('border-radius', '12px')

  baseGrid('light').set('border', '1px solid #e6e6e6')
  baseGrid('dark').set('border', '1px solid #2f2f2f')

  const baseTitle = (theme: string) =>
    styleBuilder
      .select('.card-grid__title', theme)
      .set('font-size', '18px')
      .set('font-weight', 600)

  baseTitle('light').set('color', '#222')
  baseTitle('dark').set('color', '#f0f0f0')
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
  const baseCard = (theme: string) =>
    styleBuilder
      .select('.card', theme)
      .set('display', 'grid')
      .set('gap', '8px')
      .set('padding', '16px')
      .set('border-radius', '10px')

  baseCard('light').set('border', '1px solid #ededed')
  baseCard('dark').set('border', '1px solid #353535')

  const baseIcon = (theme: string) =>
    styleBuilder.select('.card__icon', theme).set('font-weight', 600)
  baseIcon('light')
  baseIcon('dark')

  styleBuilder.select('.card__title', 'light').set('color', '#444')
  styleBuilder.select('.card__title', 'dark').set('color', '#d6d6d6')
}

function createCardComponent() {
  return createComponent<Card>(cardTemplate, ['icon', 'title'])
}

export function createCardComponents() {
  registerCardGridStyles()
  registerCardStyles()
  return { card: createCardComponent(), cardGrid: createCardGridComponent() }
}
