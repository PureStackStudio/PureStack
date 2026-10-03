// Inspect the actual emitted tags, not a hand-written approximation of the output.
for (const sample of document.querySelectorAll<HTMLElement>(
  '[data-script-receipt]',
)) {
  const script = document.getElementById(sample.dataset.scriptReceipt ?? '')
  const code = sample.querySelector('code')
  if (!(script instanceof HTMLScriptElement) || !code) continue
  const attributes = [...script.attributes].map((attribute) => {
    const value = attribute.name === 'nonce' ? script.nonce : attribute.value
    return value ? `${attribute.name}="${value}"` : attribute.name
  })
  code.textContent = `<script\n  ${attributes.join('\n  ')}\n></script>`
  const placement = sample.querySelector('[data-script-placement]')
  if (placement)
    placement.textContent = `Actual parent: ${script.parentElement?.id ? `#${script.parentElement.id}` : script.parentElement?.tagName.toLowerCase()}`
}
