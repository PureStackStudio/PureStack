// Query each enhancement root; do not bind one global input to several widgets.
for (const region of document.querySelectorAll<HTMLElement>(
  '[data-reading-example]',
)) {
  const text = region.querySelector<HTMLElement>('[data-reading-content]')
  const output = region.querySelector<HTMLOutputElement>(
    '[data-reading-result]',
  )
  const rate = region.querySelector<HTMLInputElement>('[data-reading-rate]')
  if (!text || !output || !rate) continue
  const update = () => {
    const words = (text.textContent ?? '')
      .trim()
      .split(/\s+/)
      .filter(Boolean).length
    const wordsPerMinute = Math.max(1, Number(rate.value) || 200)
    output.textContent = `${words} words · about ${Math.max(1, Math.ceil(words / wordsPerMinute))} minute${Math.ceil(words / wordsPerMinute) > 1 ? 's' : ''} to read`
  }
  rate.addEventListener('input', update)
  update()
}
