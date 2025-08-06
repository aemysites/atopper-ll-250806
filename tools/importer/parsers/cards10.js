/* global WebImporter */
export default function parse(element, { document }) {
  // Get the main cmp-list (the direct child of .glide__track)
  const cmpList = element.querySelector('.cmp-list');
  if (!cmpList) return;
  // Grab all .cmp-list__container that are direct children (ignore clones for deduplication, but keep all for completeness)
  const containers = Array.from(cmpList.children).filter(el => el.classList.contains('cmp-list__container'));
  if (containers.length === 0) return;
  const cells = [['Cards (cards10)']];
  containers.forEach(container => {
    // Image cell: find the <img> inside .cmp-list__container__image-container
    const img = container.querySelector('.cmp-list__container__image-container img');
    // Text cell: collect existing elements in order
    const textContent = [];
    // Tag (optional)
    const tag = container.querySelector('.cmp-list__content__tag');
    if (tag) textContent.push(tag);
    // Title (should be a link with the .cmp-list__container__content__title inside)
    const titleLink = container.querySelector('.cmp-list__content__title');
    if (titleLink) {
      const titleDiv = titleLink.querySelector('.cmp-list__container__content__title');
      if (titleDiv) {
        // Create and append h3 with title text, wrapped by the same link
        const h3 = document.createElement('h3');
        h3.textContent = titleDiv.textContent.trim();
        // Reference the existing link, remove its children, and append h3
        while (titleLink.firstChild) titleLink.removeChild(titleLink.firstChild);
        titleLink.appendChild(h3);
        textContent.push(titleLink);
      } else {
        textContent.push(titleLink);
      }
    }
    // Description (optional)
    const desc = container.querySelector('.cmp-list__container__content__description');
    if (desc) textContent.push(desc);
    // Date/time/info (optional)
    const info = container.querySelector('.cmp-list__content-wrapper__info-time');
    if (info) textContent.push(info);
    // CTA/link (optional)
    const cta = container.querySelector('.cmp-list__container__content__link');
    if (cta) textContent.push(cta);
    // Compose the row for the table
    cells.push([
      img || '',
      textContent.length === 1 ? textContent[0] : textContent // preserve as array if needed
    ]);
  });
  // Build and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
