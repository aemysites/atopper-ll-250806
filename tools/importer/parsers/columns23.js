/* global WebImporter */
export default function parse(element, { document }) {
  // Find the icontext block containing the columns
  const icontext = element.querySelector('.icontext .c-icontxt');
  if (!icontext) return;

  // Get all items (columns)
  const items = icontext.querySelectorAll('.c-icontxt__item');

  // Build the columns row (all column fragments in one array)
  const columns = [];
  items.forEach(item => {
    const fragment = document.createDocumentFragment();
    const picture = item.querySelector('picture');
    if (picture) fragment.appendChild(picture);
    const textTitle = item.querySelector('.c-icontxt__item-text-title');
    if (textTitle) fragment.appendChild(textTitle);
    columns.push(fragment);
  });

  // Header row: exactly one cell
  const cells = [
    ['Columns (columns23)'],
    columns // this will be a single row (array) with one cell per column
  ];
  
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
