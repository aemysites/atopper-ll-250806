/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Top heading + paragraph ---
  const mainTextBlock = element.querySelector('.cmp-text.default-list');

  // --- 2. Three cards/columns ---
  const cardContainers = element.querySelectorAll('.cmp-container--round-corners');
  const cardColumns = Array.from(cardContainers).map(container => {
    const img = container.querySelector('img');
    const p = container.querySelector('p');
    const div = document.createElement('div');
    if (img) div.appendChild(img.cloneNode(true));
    if (p) div.appendChild(p.cloneNode(true));
    return div;
  });

  // --- 3. Second heading + paragraph (Say goodbye...) ---
  // Find the h2 'Say goodbye...' and its paragraph
  let goodbyeHeading = null;
  let goodbyeParagraph = null;
  const goodbyeH2 = Array.from(element.querySelectorAll('h2')).find(h2 => h2.textContent.trim().toLowerCase().includes('say goodbye'));
  if (goodbyeH2) {
    const goodbyeDiv = goodbyeH2.closest('.cmp-text.default-list');
    if (goodbyeDiv) {
      goodbyeHeading = goodbyeDiv.querySelector('h2');
      goodbyeParagraph = goodbyeDiv.querySelector('p');
    }
  }

  // --- 4. Two-column section below ---
  let lowerImage = null;
  const lowerImages = element.querySelectorAll('img');
  lowerImages.forEach((img) => {
    if (img.alt && img.alt.toLowerCase().includes('credit score')) {
      lowerImage = img.cloneNode(true);
    }
  });
  let lowerTextBlock = null;
  const lowerH3 = element.querySelector('h3');
  if (lowerH3) {
    lowerTextBlock = lowerH3.closest('.cmp-text.default-list');
  }

  // --- Table Construction ---
  const headerRow = ['Columns (columns40)'];

  // Row 2: Top heading + paragraph, single cell
  const introRow = mainTextBlock ? [mainTextBlock.cloneNode(true)] : [];

  // Row 3: Three cards/columns (each as a column)
  const cardsRow = cardColumns.length ? cardColumns : [];

  // Row 4: Goodbye heading + paragraph, single cell
  let goodbyeRow = [];
  if (goodbyeHeading || goodbyeParagraph) {
    const div = document.createElement('div');
    if (goodbyeHeading) div.appendChild(goodbyeHeading.cloneNode(true));
    if (goodbyeParagraph) div.appendChild(goodbyeParagraph.cloneNode(true));
    goodbyeRow = [div];
  }

  // Row 5: Two columns, left is image, right is text block
  const lowerRow = (lowerImage || lowerTextBlock) ? [lowerImage || '', lowerTextBlock ? lowerTextBlock.cloneNode(true) : ''] : [];

  // Build the table rows
  const rows = [
    headerRow,
    introRow,
    cardsRow,
    goodbyeRow,
  ];
  if (lowerRow.length === 2) {
    rows.push(lowerRow);
  }

  // Remove empty rows and rows that are only empty strings
  const finalRows = rows.filter((row) => row.length > 0 && row.some(cell => cell && (typeof cell !== 'string' || cell.trim() !== '')));

  // Create the table
  const table = WebImporter.DOMUtils.createTable(finalRows, document);

  // Replace the original element
  element.replaceWith(table);
}
