/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main grid containing columns
  const mainGrid = element.querySelector('.aem-Grid');
  if (!mainGrid) return;

  // Find all grid columns
  const gridColumns = Array.from(mainGrid.children).filter(
    (child) => child.classList.contains('aem-GridColumn')
  );
  if (gridColumns.length < 2) return;

  // --- LEFT COLUMN: IMAGE ---
  let imageCell = null;
  for (const col of gridColumns) {
    const picture = col.querySelector('picture');
    if (picture) {
      imageCell = picture.cloneNode(true);
      break;
    }
  }

  // --- RIGHT COLUMN: Gather all text and button content ---
  let rightCell = document.createElement('div');

  // Find the .cmp-text block for heading and paragraph
  let cmpText = element.querySelector('.cmp-text');
  if (cmpText) {
    // Include ALL heading levels (h2, h3, etc.) and ALL paragraphs
    cmpText.querySelectorAll('h1, h2, h3, h4, h5, h6, p').forEach(el => {
      rightCell.appendChild(el.cloneNode(true));
    });
  }

  // Find the button inside the right column (deep search)
  let button = null;
  for (const col of gridColumns) {
    button = col.querySelector('.c-btn__container');
    if (button) {
      rightCell.appendChild(button.cloneNode(true));
      break;
    }
  }

  // Table structure: header, then two columns
  const headerRow = ['Columns (columns6)'];
  const rows = [headerRow, [imageCell, rightCell]];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
