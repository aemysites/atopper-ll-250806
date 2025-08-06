/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing the two bloginternallist blocks
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Get all direct child bloginternallist columns
  const cols = Array.from(grid.children)
    .filter(div => div.classList.contains('bloginternallist'));

  // If there are no columns, do nothing
  if (cols.length === 0) return;

  // Compose the content row for the columns block
  const contentRow = cols.map(col => {
    // We want the whole content of the column as a cell
    // Use the .c-bloginternallist block inside each column (referencing, not cloning)
    const block = col.querySelector('.c-bloginternallist');
    if (block) {
      return block;
    }
    // fallback: if not found, use the column itself (should not happen here)
    return col;
  });

  // The header row must contain only ONE cell (single element in the array)
  const cells = [
    ['Columns (columns46)'],
    contentRow,
  ];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element directly
  element.replaceWith(table);
}
