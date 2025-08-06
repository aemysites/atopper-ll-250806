/* global WebImporter */
export default function parse(element, { document }) {
  const headerRow = ['Cards (cards33)'];
  const cells = [headerRow];
  // Find the main 'cmp-list' for the card list (cards block)
  const cmpList = element.querySelector('.cmp-list');
  if (cmpList) {
    // For each card (article)
    const containers = cmpList.querySelectorAll(':scope > .cmp-list__container');
    containers.forEach((container) => {
      // Image: first cell
      let imgEl = null;
      const imageContainer = container.querySelector('.cmp-list__container__image-container');
      if (imageContainer) {
        const img = imageContainer.querySelector('img');
        if (img) imgEl = img;
      }

      // Text content: second cell
      const textContent = [];
      // Title (as heading, with link if present)
      const titleLink = container.querySelector('.cmp-list__content__title');
      if (titleLink) {
        // Move only the direct title text
        const h3 = document.createElement('h3');
        // Use the link as is (reference it)
        h3.appendChild(titleLink);
        // If the link contains a div, remove styling class from the div
        const titleDiv = titleLink.querySelector('.cmp-list__container__content__title');
        if (titleDiv) titleDiv.classList.remove('cmp-list__container__content__title');
        textContent.push(h3);
      }
      // Description
      const desc = container.querySelector('.cmp-list__container__content__description');
      if (desc) {
        textContent.push(desc);
      }
      // Date/time info (row of spans)
      const infoTime = container.querySelector('.cmp-list__content-wrapper__info-time');
      if (infoTime) {
        textContent.push(infoTime);
      }
      // CTA (Read More link)
      const cta = container.querySelector('.cmp-list__container__content__link');
      if (cta) {
        textContent.push(cta);
      }
      cells.push([imgEl, textContent]);
    });
    // Replace cmp-list with block table
    const table = WebImporter.DOMUtils.createTable(cells, document);
    cmpList.parentNode.replaceChild(table, cmpList);
  }
}