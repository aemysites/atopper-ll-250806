/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the block name as the header row
  const headerRow = ['Columns (columns37)'];

  // Defensive: Find the icon-text grid wrapper
  // The actual items are inside .c-icontxt__items-wrapper > .c-icontxt__item
  const itemsWrapper = element.querySelector('.c-icontxt__items-wrapper');
  if (!itemsWrapper) return;

  // Get all icon-text items (columns)
  const items = Array.from(itemsWrapper.querySelectorAll('.c-icontxt__item'));
  if (!items.length) return;

  // For each item, build a cell with icon and text
  const columns = items.map((item) => {
    // Find the icon (picture or img)
    const iconPicture = item.querySelector('.c-icontxt__item-icon');
    // Defensive: fallback to img if picture not found
    let iconImg = iconPicture ? iconPicture.querySelector('img') : item.querySelector('img');
    // Find the text title (h5 > div > strong > sup)
    const titleSup = item.querySelector('.c-icontxt__item-text-title sup');
    // Defensive: fallback to textContent if sup not found
    let textContent = titleSup ? titleSup.textContent.trim() : '';
    // Create a wrapper div for cell content
    const cellDiv = document.createElement('div');
    cellDiv.style.textAlign = 'center';
    if (iconImg) cellDiv.appendChild(iconImg);
    if (textContent) {
      const textEl = document.createElement('div');
      textEl.style.fontWeight = 'bold';
      textEl.style.marginTop = '10px';
      textEl.textContent = textContent;
      cellDiv.appendChild(textEl);
    }
    return cellDiv;
  });

  // Build the table rows
  const rows = [headerRow, columns];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block
  element.replaceWith(block);
}
