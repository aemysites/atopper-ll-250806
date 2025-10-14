/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;
  const cols = Array.from(grid.children);
  if (cols.length < 2) return;

  // Left column: text content (heading + paragraph)
  let leftCell = cols[0].querySelector('.cmp-text');
  if (!leftCell) leftCell = cols[0];

  // Right column: image
  let rightImg = cols[1].querySelector('img');
  if (!rightImg) rightImg = cols[1];

  // Build table
  const headerRow = ['Columns (columns7)'];
  const contentRow = [leftCell, rightImg];
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(table);
}
