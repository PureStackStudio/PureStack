const output = document.querySelector<HTMLOutputElement>('#reading-time-result')
const text = document.querySelector('#reading-time-content')?.textContent ?? ''
const words = text.trim().split(/\s+/).filter(Boolean).length
if (output)
  output.textContent = `${words} words · about ${Math.max(1, Math.ceil(words / 200))} minute to read`
