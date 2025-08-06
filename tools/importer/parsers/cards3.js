/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card lists in the element
  const cardLists = element.querySelectorAll('.list.typ--twocol-thumbnail');
  cardLists.forEach((block) => {
    const rows = [];
    // Table header per spec
    rows.push(['Cards']);
    // Card containers
    const containers = block.querySelectorAll('.cmp-list__container');
    containers.forEach(container => {
      // --- IMAGE CELL ---
      let imageEl = null;
      const imgA = container.querySelector('.cmp-list__container__image-container a');
      if (imgA) {
        const img = imgA.querySelector('img');
        if (img) imageEl = img;
      }
      // --- TEXT CELL ---
      const contentDiv = container.querySelector('.cmp-list__container__content');
      const textCell = [];
      if (contentDiv) {
        // Title (as strong)
        const titleLink = contentDiv.querySelector('.cmp-list__content__title');
        if (titleLink) {
          const titleDiv = titleLink.querySelector('.cmp-list__container__content__title');
          if (titleDiv) {
            const strong = document.createElement('strong');
            strong.textContent = titleDiv.textContent.trim();
            textCell.push(strong);
          }
        }
        // Description
        const desc = contentDiv.querySelector('.cmp-list__container__content__description');
        if (desc && desc.textContent.trim()) {
          textCell.push(document.createElement('br'));
          textCell.push(document.createTextNode(desc.textContent.trim()));
        }
        // Date and read time (in one line)
        const info = contentDiv.querySelector('.cmp-list__content-wrapper__info-time');
        if (info && info.textContent.trim()) {
          textCell.push(document.createElement('br'));
          const infoSpan = document.createElement('span');
          infoSpan.style.fontSize = 'smaller';
          infoSpan.textContent = info.textContent.trim();
          textCell.push(infoSpan);
        }
        // CTA link ("Read More")
        const cta = contentDiv.querySelector('.cmp-list__container__content__link');
        if (cta) {
          textCell.push(document.createElement('br'));
          textCell.push(cta);
        }
      }
      // Only add if there's image and text
      if (imageEl && textCell.length) {
        rows.push([imageEl, textCell]);
      }
    });
    // Create block and replace
    const table = WebImporter.DOMUtils.createTable(rows, document);
    block.replaceWith(table);
  });
}
