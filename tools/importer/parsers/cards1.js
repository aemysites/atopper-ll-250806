/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card containers (each card)
  const cardContainers = Array.from(
    element.querySelectorAll('.cmp-container.bg-ll-green05.cmp-container--round-corners')
  );

  // Defensive: If no cards found, do nothing
  if (!cardContainers.length) return;

  // Table header row - must match block name and variant exactly
  const headerRow = ['Cards (cards1)'];
  const rows = [headerRow];

  // For each card, extract image and text
  cardContainers.forEach(card => {
    // Image: Find the <img> inside the card
    const img = card.querySelector('img');
    // Defensive: If no image, skip this card
    if (!img) return;

    // Text: Find the .cmp-text inside the card
    const textBlock = card.querySelector('.cmp-text');
    // Defensive: If no text, skip this card
    if (!textBlock) return;

    // Instead of just .cmp-text, get all text content in the card (title, description, superscript)
    // We'll clone all <p> elements inside .cmp-text for richer content
    const paragraphs = Array.from(textBlock.querySelectorAll('p'));
    const textCell = document.createElement('div');
    paragraphs.forEach(p => textCell.appendChild(p.cloneNode(true)));

    rows.push([img.cloneNode(true), textCell]);
  });

  // Create the table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);

  // Now, add informational text below the table if present (not as a table row)
  const infoText = element.querySelector(
    '.aem-GridColumn--default--12 .cmp-text'
  );
  if (infoText) {
    const infoDiv = document.createElement('div');
    Array.from(infoText.querySelectorAll('p')).forEach(p => infoDiv.appendChild(p.cloneNode(true)));
    block.after(infoDiv);
  }
}
