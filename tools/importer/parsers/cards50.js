/* global WebImporter */
export default function parse(element, { document }) {
  // Always start with header row
  const cells = [['Cards (cards50)']];

  // 1. Collect the three "stat cards" with icons and single-line text
  const statCards = Array.from(element.querySelectorAll('.cmp-container--round-corners'));
  statCards.forEach(card => {
    const img = card.querySelector('img');
    // Use all .cmp-text children as text content
    const cmpText = card.querySelector('.cmp-text');
    let textContent = null;
    if (cmpText) {
      // Use the cmp-text element itself to preserve headings, formatting, etc.
      textContent = cmpText;
    }
    if (img && textContent) {
      cells.push([img, textContent]);
    }
  });

  // 2. Find the large card with image and text
  // Large image is in .image.aem-GridColumn--default--none
  const mainImgCol = element.querySelector('.image.aem-GridColumn--default--none');
  const img = mainImgCol && mainImgCol.querySelector('img');

  // Paired text: the next .container.responsivegrid containing a .cmp-text (but not inside .cmp-container--round-corners)
  let textContent = null;
  if (mainImgCol) {
    let sibling = mainImgCol.nextElementSibling;
    while (sibling) {
      if (
        sibling.matches('.container.responsivegrid') &&
        sibling.querySelector('.cmp-text')
      ) {
        // Only select first matching .cmp-text
        textContent = sibling.querySelector('.cmp-text');
        break;
      }
      sibling = sibling.nextElementSibling;
    }
  }
  if (img && textContent) {
    cells.push([img, textContent]);
  }

  // Only create the table if any cards found
  if (cells.length > 1) {
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
