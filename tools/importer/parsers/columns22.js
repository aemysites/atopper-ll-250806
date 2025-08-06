/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the main body container that holds the grid (columns)
  const body = element.querySelector('.cmp-container__body');
  if (!body) return;

  // The columns are inside a div.aem-Grid
  const grid = body.querySelector('.aem-Grid');
  if (!grid) return;

  // Collect direct grid columns (left is content, right is image)
  const columns = Array.from(grid.children).filter(col =>
    col.classList.contains('aem-GridColumn')
  );

  // Defensive: If no columns, exit
  if (columns.length === 0) return;

  // For each column, extract the main content block for that cell
  const cellEls = columns.map(col => {
    // Look for cmp-container__body for typical text columns
    let found;
    const nestedContainer = col.querySelector(':scope > div > .cmp-container__body');
    if (nestedContainer) {
      found = nestedContainer;
    } else if (col.classList.contains('image')) {
      // For image columns, prefer the c-image__container
      const imgContainer = col.querySelector('.c-image__container');
      if (imgContainer) {
        found = imgContainer;
      } else {
        // Fallback: just use the col itself
        found = col;
      }
    } else {
      // Last fallback: try direct text containers
      const textContainer = col.querySelector('.cmp-text, .text, .cmp-container__body');
      if (textContainer) {
        found = textContainer;
      } else {
        found = col;
      }
    }
    return found;
  });

  // Block table header must match: 'Columns (columns22)'
  const cells = [
    ['Columns (columns22)'],
    cellEls
  ];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
