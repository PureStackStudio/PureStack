import { createComponent, html } from 'regor'

import { styleBuilder } from '../../styles'

interface CardGrid {
  title: string
}

const cardGridTemplate = html`<div class="card-grid">
  <div class="card-grid__title">Card Grid {{ title }}</div>
  <slot></slot>
</div>`

function registerCardGridStyles() {
  styleBuilder
    .select('.card-grid')
    .set('display', 'grid')
    .set('gap', '16px')
    .set('padding', '24px')
    .set('border-radius', '12px')
    .set('border', '1px solid #e6e6e6')

  styleBuilder
    .select('.card-grid__title')
    .set('font-size', '18px')
    .set('font-weight', 600)
    .set('color', '#222')
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
  styleBuilder
    .select('.card')
    .set('display', 'grid')
    .set('gap', '8px')
    .set('padding', '16px')
    .set('border-radius', '10px')
    .set('border', '1px solid #ededed')

  styleBuilder.select('.card__icon').set('font-weight', 600)
  styleBuilder.select('.card__title').set('color', '#444')
}

function createCardComponent() {
  return createComponent<Card>(cardTemplate, ['icon', 'title'])
}

export function createCardComponents() {
  registerCardGridStyles()
  registerCardStyles()
  return { card: createCardComponent(), cardGrid: createCardGridComponent() }
}
