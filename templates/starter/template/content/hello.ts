const button = document.querySelector<HTMLButtonElement>('#hello-button')
const output = document.querySelector<HTMLOutputElement>('#hello-output')

button?.addEventListener('click', () => {
  if (output) output.textContent = 'Hello from your new PureStack site!'
})

export {}
