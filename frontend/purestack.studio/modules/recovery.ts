for (const button of document.querySelectorAll<HTMLElement>(
  '[data-recovery-retry]',
)) {
  button.hidden = false
  button.addEventListener('click', () => window.location.reload())
}
