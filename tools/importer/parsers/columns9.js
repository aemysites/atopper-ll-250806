/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main grid containing the columns
  const grid = element.querySelector('.aem-Grid');
  if (!grid) return;

  // Find the two grid columns
  const columns = Array.from(grid.children);
  let imageCol = null;
  let textCol = null;

  // Identify columns by their classes
  columns.forEach(col => {
    if (col.classList.contains('image')) {
      imageCol = col;
    } else if (col.classList.contains('container')) {
      textCol = col;
    }
  });

  // --- Left Column: Image ---
  let imageEl = null;
  if (imageCol) {
    // Reference the actual <img> element
    imageEl = imageCol.querySelector('img');
  }

  // --- Right Column: Text ---
  let textBlock = null;
  if (textCol) {
    // Reference the actual text block element
    textBlock = textCol.querySelector('.cmp-text');
  }

  // Ensure both columns exist, but allow for missing data
  const headerRow = ['Columns (columns9)'];
  const contentRow = [imageEl || '', textBlock || ''];

  // Create the table for the Columns block
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
