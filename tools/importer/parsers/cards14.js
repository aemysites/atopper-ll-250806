/* global WebImporter */
export default function parse(element, { document }) {
  // Header row
  const headerRow = ['Cards (cards14)'];

  // Find all card top-level columns directly under this component
  // These are the .aem-GridColumn--default--4 > div > .cmp-container > ...
  const gridCols = Array.from(
    element.querySelectorAll(':scope > div > div > div > div > div.aem-Grid > div.aem-GridColumn--default--4')
  );

  const rows = [];

  gridCols.forEach(col => {
    // Get the card's .cmp-container with green background (the real card)
    const card = col.querySelector('.cmp-container.bg-ll-green05');
    if (!card) return; // Defensive

    // 1. IMAGE/ICON: Use the <picture> if present
    let picture = null;
    const img = card.querySelector('.image img');
    if (img) {
      picture = img.closest('picture');
    }
    // fallback: could be null (shouldn't happen given the HTML)

    // 2. TEXT CONTENT
    let textBlock = null;
    const textDiv = card.querySelector('.text .cmp-text');
    if (textDiv) {
      textBlock = textDiv;
    }

    // Only add a row if there is at least image and text
    if (picture && textBlock) {
      rows.push([picture, textBlock]);
    }
  });

  // Safety: If no rows, don't replace
  if (rows.length === 0) return;

  // Assemble the table
  const tableData = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(tableData, document);

  element.replaceWith(table);
}
