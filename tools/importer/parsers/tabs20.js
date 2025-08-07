/* global WebImporter */
export default function parse(element, { document }) {
  // Find all tab headers (blogcategorydivider)
  const allDividers = Array.from(element.querySelectorAll('.blogcategorydivider'));
  const tabRows = [];

  for (let i = 0; i < allDividers.length; i++) {
    const divider = allDividers[i];
    // Tab label: from h2 inside divider
    let label = '';
    const titleEl = divider.querySelector('.c-blogcategorydivider__title');
    if (titleEl) {
      label = titleEl.textContent.trim();
    } else {
      const h2 = divider.querySelector('h2');
      if (h2) label = h2.textContent.trim();
    }
    if (!label) label = 'Tab';

    // Gather content between this divider and the next divider
    const tabContentNodes = [];
    let n = divider.nextElementSibling;
    while (n && !n.classList.contains('blogcategorydivider')) {
      if (!n.classList.contains('spacer') &&
          n.querySelector('.articlespotlight, .cmp-list, .reference, .bloginternallist, .emailcapture, .c-bloginternallist')) {
        tabContentNodes.push(n);
      }
      n = n.nextElementSibling;
    }
    let tabContent = null;
    if (tabContentNodes.length === 1) {
      tabContent = tabContentNodes[0];
    } else if (tabContentNodes.length > 1) {
      tabContent = document.createElement('div');
      tabContentNodes.forEach(node => tabContent.appendChild(node));
    }
    if (!tabContent) tabContent = document.createTextNode('');
    tabRows.push([label, tabContent]);
  }

  // Header row should have two columns for correct alignment: [header, empty]
  const cells = [
    ['Tabs (tabs20)', ''],
    ...tabRows
  ];

  // After building the table, set colspan=2 for the header row to visually span both columns.
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Manually set colspan if possible
  const headerRow = table.querySelector('tr');
  if (headerRow && headerRow.children.length === 2) {
    headerRow.children[0].setAttribute('colspan', '2');
    headerRow.removeChild(headerRow.children[1]);
  }

  element.replaceWith(table);
}
