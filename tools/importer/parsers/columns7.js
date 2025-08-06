/* global WebImporter */
export default function parse(element, { document }) {
  // Header row must be exactly one column, matching the block name
  const headerRow = ['Columns (columns7)'];

  // Find the aem-Grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Extract top-level columns (should be two for this layout)
  const columns = grid.querySelectorAll(':scope > div');
  if (columns.length < 2) return;

  // LEFT COLUMN: prefer image container or picture
  let leftCell = columns[0].querySelector('.c-image__container, picture, img');
  if (!leftCell) leftCell = columns[0];

  // RIGHT COLUMN: prefer .cmp-text, else container
  let rightCell = columns[1].querySelector('.cmp-text');
  if (!rightCell) rightCell = columns[1];

  // Compose table: header is single cell, content row is two columns
  const cells = [
    headerRow,       // first row, single cell
    [leftCell, rightCell] // second row, two columns
  ];

  // Build and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
