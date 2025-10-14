/* global WebImporter */
export default function parse(element, { document }) {
  // Extract all columns (should be two)
  const columns = Array.from(
    element.querySelectorAll('.bloginternallist.aem-GridColumn')
  );

  // Defensive fallback: if not found, try immediate children
  if (columns.length === 0) {
    columns.push(...element.querySelectorAll(':scope > div .bloginternallist'));
  }

  // Compose each column's cell content
  const columnCells = columns.map(col => {
    // Heading section
    const heading = col.querySelector('.c-bloginternallist__heading');
    const headingIcon = heading && heading.querySelector('img');
    const headingTitle = heading && heading.querySelector('h3');
    const headingFrag = document.createDocumentFragment();
    if (headingIcon) headingFrag.appendChild(headingIcon);
    if (headingTitle) headingFrag.appendChild(headingTitle);

    // List section
    const list = col.querySelector('.c-bloginternallist__list');
    let listFrag;
    if (list) {
      listFrag = document.createElement('ul');
      Array.from(list.children).forEach(li => {
        const liFrag = document.createElement('li');
        const icon = li.querySelector('img');
        if (icon) liFrag.appendChild(icon);
        const link = li.querySelector('a');
        if (link) liFrag.appendChild(link);
        listFrag.appendChild(liFrag);
      });
    }

    // Compose column cell
    const cellFrag = document.createDocumentFragment();
    cellFrag.appendChild(headingFrag);
    if (listFrag) cellFrag.appendChild(listFrag);
    return cellFrag;
  });

  // Table structure
  const headerRow = ['Columns (columns24)'];
  const contentRow = columnCells;
  const rows = [headerRow, contentRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
