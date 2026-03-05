import { defineComponent, html } from 'regor'
import { registerCardGridStyles, registerCardStyles } from './cardGridStyle'

interface CardGrid {
  title: string
}

const cardGridTemplate = html`<div class="card-grid">
  <div class="card-grid__title">Card Grid {{ title }}</div>
  <slot></slot>
</div>`

function createCardGridComponent() {
  return defineComponent<CardGrid>(cardGridTemplate, ['title'])
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

function createCardComponent() {
  return defineComponent<Card>(cardTemplate, ['icon', 'title'])
}

export function createCardComponents() {
  registerCardGridStyles()
  registerCardStyles()
  return { card: createCardComponent(), cardGrid: createCardGridComponent() }
}
