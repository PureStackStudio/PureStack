import { createComponent, html } from 'regor'

interface CardGrid {
  title: string
}

const cardGridTemplate = html`<div>
  <div>Card Grid {{ title }}</div>
  <slot></slot>
</div>`

export const cardGrid = createComponent<CardGrid>(
  (head) => {
    head.disableSwitch = true
    return {
      title: head.props.title,
    }
  },
  cardGridTemplate,
  {
    props: ['message', 'stagger'],
  },
)

interface Card {
  icon: string
  title: string
}

const cardTemplate = html`<div>
  <div>icon: {{ icon }}</div>
  <div>Card {{ title }}</div>
  <slot></slot>
</div>`

export const card = createComponent<Card>(
  (head) => {
    head.disableSwitch = true
    return {
      icon: head.props.icon,
      title: head.props.title,
    }
  },
  cardTemplate,
  {
    props: ['icon', 'title'],
  },
)
