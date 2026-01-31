import { createComponent, html } from 'regor'

interface CardGrid {
  message: string
}

const cardGridTemplate = html`<div>
  <div>Card Grid {{ message }}</div>
</div>`

export const cardGrid = createComponent<CardGrid>(
  (head) => ({
    message: head.props.message,
  }),
  cardGridTemplate,
)

interface Card {
  icon: string
  text: string
}

const cardTemplate = html`<div>
  <div>icon: {{ icon }}</div>
  <div>Card {{ text }}</div>
</div>`

export const card = createComponent<Card>(() => ({}), cardTemplate)
