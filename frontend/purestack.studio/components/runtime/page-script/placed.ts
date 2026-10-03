const output = document.querySelector<HTMLOutputElement>(
  '#placed-script-result',
)
if (output)
  output.textContent = 'This module ran from the named placement target.'
