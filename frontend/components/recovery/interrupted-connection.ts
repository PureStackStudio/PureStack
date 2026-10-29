import { defineComponent, html } from 'regor'

export interface InterruptedConnection {}

const template = html`<svg
  viewBox="0 0 480 350"
  class="w-full d-block tone--accent tone-text"
  aria-hidden="true"
  focusable="false"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <radialGradient id="interrupted-connection-glow">
      <stop stop-color="currentColor" stop-opacity="0.14"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </radialGradient>
    <filter
      id="interrupted-connection-shadow"
      x="-50%"
      y="-30%"
      width="200%"
      height="180%"
    >
      <feDropShadow
        dx="0"
        dy="12"
        stdDeviation="10"
        flood-color="currentColor"
        flood-opacity="0.1"/>
    </filter>
  </defs>
  <ellipse
    cx="240"
    cy="175"
    rx="190"
    ry="158"
    fill="url(#interrupted-connection-glow)"/>
  <g fill="none" stroke="currentColor">
    <ellipse
      cx="240"
      cy="177"
      rx="185"
      ry="119"
      transform="rotate(-18 240 177)"
      stroke-opacity="0.12"
      stroke-dasharray="3 8"/>
    <path
      d="M42 292H70Q94 292 94 268V248"
      stroke-opacity="0.1"
      stroke-width="2"/>
    <path
      d="M34 270H56Q78 270 78 248V188Q78 166 104 166"
      stroke-opacity="0.45"
      stroke-width="7"
      stroke-linecap="round"/>
    <path
      d="M376 192H396Q422 192 422 218V270"
      stroke-opacity="0.45"
      stroke-width="7"
      stroke-linecap="round"/>
    <path
      d="M422 285V295"
      stroke-opacity="0.2"
      stroke-width="7"
      stroke-linecap="round"/>
  </g>
  <g filter="url(#interrupted-connection-shadow)">
    <rect
      x="104"
      y="102"
      width="92"
      height="128"
      rx="20"
      fill="var(--ps-semantic-tone-neutral-canvas)"
      stroke="currentColor"
      stroke-opacity="0.35"
      stroke-width="1.5"/>
    <rect
      x="148"
      y="114"
      width="36"
      height="104"
      rx="11"
      fill="currentColor"
      opacity="0.08"/>
    <path
      d="M196 146H220M196 172H220"
      stroke="currentColor"
      stroke-opacity="0.8"
      stroke-width="8"
      stroke-linecap="round"/>
    <path
      d="M116 192V124Q116 114 126 114"
      fill="none"
      stroke="currentColor"
      stroke-opacity="0.12"
      stroke-width="2"
      stroke-linecap="round"/>
    <circle cx="125" cy="208" r="3" fill="currentColor" opacity="0.6"/>
    <rect
      x="284"
      y="128"
      width="92"
      height="128"
      rx="20"
      fill="var(--ps-semantic-tone-neutral-canvas)"
      stroke="currentColor"
      stroke-opacity="0.35"
      stroke-width="1.5"/>
    <rect
      x="296"
      y="140"
      width="36"
      height="104"
      rx="11"
      fill="currentColor"
      opacity="0.08"/>
    <path
      d="M260 170H284M260 196H284"
      stroke="currentColor"
      stroke-opacity="0.8"
      stroke-width="8"
      stroke-linecap="round"/>
    <path
      d="M364 218V150Q364 140 354 140"
      fill="none"
      stroke="currentColor"
      stroke-opacity="0.12"
      stroke-width="2"
      stroke-linecap="round"/>
    <circle cx="355" cy="234" r="3" fill="currentColor" opacity="0.3"/>
  </g>
  <g
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    opacity="0.7"
  >
    <path d="M236 141L247 130M242 154H254M232 165L241 175"/>
  </g>
  <g transform="translate(251 71)">
    <circle
      r="35"
      fill="none"
      stroke="currentColor"
      stroke-opacity="0.12"
      stroke-dasharray="2 6"/>
    <circle
      r="23"
      fill="var(--ps-semantic-tone-neutral-canvas)"
      stroke="currentColor"
      stroke-opacity="0.35"/>
    <path
      d="M0-9V2"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"/>
    <circle cy="9" r="1.8" fill="currentColor"/>
  </g>
  <g fill="currentColor">
    <circle cx="160" cy="284" r="3" opacity="0.2"/>
    <circle cx="177" cy="284" r="3" opacity="0.35"/>
    <circle cx="194" cy="284" r="3" opacity="0.6"/>
  </g>
  <path
    d="M365 78H377M371 72V84"
    stroke="currentColor"
    stroke-opacity="0.3"
    stroke-width="1.5"
    stroke-linecap="round"/>
</svg>`

export function defineInterruptedConnectionComponent() {
  return defineComponent<InterruptedConnection>(template)
}
