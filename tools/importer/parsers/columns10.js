/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Columns block
  const headerRow = ['Columns (columns10)'];

  // Find the main nav container with list items (desktop version only)
  const navWrapper = element.querySelector('.c-blog-secondarynav__wrapper');
  let navList = null;
  if (navWrapper) {
    navList = navWrapper.querySelector('.c-blog-secondarynav__d-container ul.c-blog-secondarynav__nav-items');
  }
  if (!navList) {
    navList = element.querySelector('.c-blog-secondarynav__nav-items');
  }

  // Defensive: If no navList found, do nothing
  if (!navList) return;

  // Each <li> is a column: icon + label link (include all text content)
  const columns = [];
  navList.querySelectorAll(':scope > li').forEach((li) => {
    const img = li.querySelector('img');
    const link = li.querySelector('a');
    const cellContent = [];
    if (img) cellContent.push(img.cloneNode(true));
    if (link) {
      // Use link itself (preserves href and text)
      cellContent.push(link.cloneNode(true));
    } else {
      // If no link, include all text content from li
      const text = li.textContent.trim();
      if (text) cellContent.push(document.createTextNode(text));
    }
    // Also include any text nodes in li that are not inside the link (for robustness)
    li.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        cellContent.push(document.createTextNode(node.textContent.trim()));
      }
    });
    columns.push(cellContent);
  });

  // Build table: header row, then one row with all columns
  const rows = [headerRow, columns];
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block table
  element.replaceWith(table);
}
