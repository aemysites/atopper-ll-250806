/* global WebImporter */
export default function parse(element, { document }) {
  // Cards block: 1 column, multiple rows, each row is a card
  // The element may contain text directly, not just children

  const rows = [];
  // Header row as per spec
  rows.push(['Cards']);

  // Collect all text content from the element (including direct text nodes)
  // If there are children, include their full content
  let cardContent = '';
  if (element.children.length > 0) {
    // If there are children, concatenate their text
    Array.from(element.children).forEach((child) => {
      if (child.textContent.trim().length > 0) {
        cardContent += child.textContent.trim() + ' ';
      }
    });
    cardContent = cardContent.trim();
  } else {
    // If no children, use the element's own text
    cardContent = element.textContent.trim();
  }

  if (cardContent.length > 0) {
    rows.push([cardContent]);
  }

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
