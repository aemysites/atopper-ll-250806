/* global WebImporter */
export default function parse(element, { document }) {
  // Find the two main column containers with rounded corners
  const columnContainers = Array.from(
    element.querySelectorAll('.cmp-container--round-corners')
  );

  // Defensive fallback: if not found, try top-level grid columns
  let columns = [];
  if (columnContainers.length === 2) {
    columns = columnContainers.map((container) => {
      // Find the cmp-text block inside each container
      const textBlock = container.querySelector('.cmp-text');
      return textBlock || container;
    });
  } else {
    // Fallback: try to find top-level grid columns
    columns = Array.from(element.querySelectorAll('.aem-GridColumn--default--6'));
    columns = columns.map((col) => {
      const round = col.querySelector('.cmp-container--round-corners');
      if (round) {
        const textBlock = round.querySelector('.cmp-text');
        return textBlock || round;
      }
      return col;
    }).filter(Boolean);
    columns = columns.slice(0, 2);
  }

  // Ensure we have exactly two columns, fill with empty div if missing
  while (columns.length < 2) {
    columns.push(document.createElement('div'));
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns26)'];
  const contentRow = columns;

  // Create the table using WebImporter.DOMUtils.createTable
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  // Replace the original element with the table
  element.replaceWith(table);
}
