const form = document.querySelector<HTMLFormElement>(
  '.contact-form-demo form, form.contact-form-demo',
)
const confirmation = document.querySelector<HTMLElement>('.contact-demo-status')

form?.addEventListener('submit', (event) => {
  event.preventDefault()
  if (!form.reportValidity()) return
  confirmation?.removeAttribute('hidden')
  confirmation?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
})
