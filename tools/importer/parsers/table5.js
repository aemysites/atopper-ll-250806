/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first non-empty table with at least one row and column
  const tables = Array.from(element.querySelectorAll('table'));
  let dataTable = null;
  for (const table of tables) {
    if (table.querySelector('tr') && table.querySelector('td,th')) {
      // Only consider tables that have at least one header and one data cell (actual data table)
      // Ignore tables with empty bodies
      if (table.querySelectorAll('tr').length > 0 && table.querySelectorAll('td,th').length > 0) {
        dataTable = table;
        break;
      }
    }
  }
  if (!dataTable) return;

  // Reference the original table node (do not clone or re-create rows/cells)
  // This ensures all text and markup from the table is preserved
  const headerRow = ['Table (table5)'];
  const contentRow = [dataTable];
  const cells = [headerRow, contentRow];

  // Create and replace with the block
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
