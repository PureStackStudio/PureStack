const button = document.querySelector<HTMLButtonElement>('#note-counter-button')
const output = document.querySelector<HTMLOutputElement>('#note-counter-output')
let clicks = 0

button?.addEventListener('click', () => {
  clicks += 1
  if (output)
    output.textContent = `${clicks} local click${clicks === 1 ? '' : 's'}`
})
