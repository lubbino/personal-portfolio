document.addEventListener('DOMContentLoaded', () => {
  const headers = document.querySelectorAll('.collapsible-header');

  headers.forEach(header => {
    header.setAttribute('tabindex', '0');

    header.addEventListener('click', () => toggleSection(header));
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleSection(header);
      }
    });
  });

  function toggleSection(header) {
    const content = header.nextElementSibling;
    const isOpen = content.classList.toggle('open');
    header.classList.toggle('active', isOpen);
    header.setAttribute('aria-expanded', isOpen);

    if (isOpen) {
      content.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
});
