/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main related articles list block (cards15)
  const cardsBlock = element.querySelector('.list.typ--twocol-thumbnail');
  if (!cardsBlock) return;

  // Find all card containers
  const cardEls = Array.from(cardsBlock.querySelectorAll('.cmp-list__container'));

  // Prepare table header (exactly as in the example)
  const rows = [['Cards (cards15)']];

  // For each card, create a row with image/icon on the left, text content on the right
  cardEls.forEach(card => {
    // Left cell: image or icon (use the whole image container for resilience)
    const imageContainer = card.querySelector('.cmp-list__container__image-container');
    let imageCell = '';
    if (imageContainer) imageCell = imageContainer;

    // Right cell: all text content (use the full content container for flexibility)
    const contentContainer = card.querySelector('.cmp-list__container__content');
    let contentCell = '';
    if (contentContainer) contentCell = contentContainer;

    // Only add row if there is at least some content
    if (imageCell || contentCell) {
      rows.push([imageCell, contentCell]);
    }
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(table);
}
