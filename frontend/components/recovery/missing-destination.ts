import { defineComponent, html } from 'regor'

export interface MissingDestination {}

const template = html`<svg
  viewBox="0 0 480 350"
  class="w-full d-block tone--accent tone-text"
  aria-hidden="true"
  focusable="false"
  xmlns="http://www.w3.org/2000/svg"
>
  <defs>
    <radialGradient id="missing-destination-glow">
      <stop stop-color="currentColor" stop-opacity="0.12"/>
      <stop offset="1" stop-color="currentColor" stop-opacity="0"/>
    </radialGradient>
    <pattern
      id="missing-destination-grid"
      width="20"
      height="20"
      patternUnits="userSpaceOnUse"
    >
      <circle cx="1" cy="1" r="0.8" fill="currentColor" opacity="0.2"/>
    </pattern>
    <filter
      id="missing-destination-shadow"
      x="-30%"
      y="-30%"
      width="160%"
      height="180%"
    >
      <feDropShadow
        dx="0"
        dy="12"
        stdDeviation="12"
        flood-color="currentColor"
        flood-opacity="0.08"/>
    </filter>
  </defs>
  <ellipse
    cx="290"
    cy="170"
    rx="185"
    ry="155"
    fill="url(#missing-destination-glow)"/>
  <rect
    x="20"
    y="30"
    width="440"
    height="280"
    rx="32"
    fill="url(#missing-destination-grid)"/>
  <ellipse
    cx="295"
    cy="173"
    rx="162"
    ry="115"
    transform="rotate(-18 295 173)"
    fill="none"
    stroke="currentColor"
    stroke-opacity="0.12"
    stroke-dasharray="3 8"/>
  <path
    d="M34 280H94Q158 280 158 216V202"
    fill="none"
    stroke="currentColor"
    stroke-opacity="0.12"
    stroke-width="2"/>
  <path
    d="M44 246H98Q122 246 122 222V166Q122 142 146 142H194"
    fill="none"
    stroke="currentColor"
    stroke-opacity="0.7"
    stroke-width="3"
    stroke-linecap="round"/>
  <path
    d="M204 142H226"
    fill="none"
    stroke="currentColor"
    stroke-opacity="0.5"
    stroke-width="3"
    stroke-linecap="round"
    stroke-dasharray="2 8"/>
  <circle
    cx="44"
    cy="246"
    r="9"
    fill="var(--ps-semantic-tone-neutral-canvas)"
    stroke="currentColor"
    stroke-width="2"/>
  <circle cx="44" cy="246" r="3" fill="currentColor"/>
  <circle
    cx="122"
    cy="194"
    r="5"
    fill="var(--ps-semantic-tone-neutral-canvas)"
    stroke="currentColor"
    stroke-width="2"/>
  <circle cx="194" cy="142" r="4" fill="currentColor"/>
  <g filter="url(#missing-destination-shadow)">
    <rect
      x="224"
      y="64"
      width="210"
      height="182"
      rx="18"
      fill="var(--ps-semantic-tone-neutral-canvas)"
      stroke="currentColor"
      stroke-opacity="0.3"/>
    <path d="M224 102H434" stroke="currentColor" stroke-opacity="0.16"/>
    <g fill="currentColor" opacity="0.35">
      <circle cx="244" cy="84" r="3"/>
      <circle cx="256" cy="84" r="3"/>
      <circle cx="268" cy="84" r="3"/>
    </g>
    <path
      d="M294 84H350"
      stroke="currentColor"
      stroke-opacity="0.12"
      stroke-width="4"
      stroke-linecap="round"/>
    <text
      x="329"
      y="181"
      text-anchor="middle"
      fill="currentColor"
      font-family="system-ui, sans-serif"
      font-size="68"
      font-weight="650"
      letter-spacing="-4"
    >
      404
    </text>
    <path
      d="M291 208H367"
      stroke="currentColor"
      stroke-opacity="0.18"
      stroke-width="3"
      stroke-linecap="round"/>
    <path
      d="M310 220H348"
      stroke="currentColor"
      stroke-opacity="0.1"
      stroke-width="3"
      stroke-linecap="round"/>
  </g>
  <g transform="translate(393 289)" stroke="currentColor">
    <circle
      r="18"
      fill="var(--ps-semantic-tone-neutral-canvas)"
      stroke-opacity="0.2"/>
    <path d="M0-25V-21M0 21V25M-25 0H-21M21 0H25" stroke-opacity="0.3"/>
    <path
      d="M-6 6L-2-2L6-6L2 2Z"
      fill="currentColor"
      fill-opacity="0.3"
      stroke-width="1.5"
      stroke-linejoin="round"/>
  </g>
  <path
    d="M76 74H88M82 68V80"
    stroke="currentColor"
    stroke-opacity="0.4"
    stroke-width="1.5"
    stroke-linecap="round"/>
  <circle cx="178" cy="286" r="3" fill="currentColor" opacity="0.3"/>
</svg>`

export function defineMissingDestinationComponent() {
  return defineComponent<MissingDestination>(template)
}
