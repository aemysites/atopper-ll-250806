/* global WebImporter */
export default function parse(element, { document }) {
  // Find the nav containing the tabs structure
  const nav = element.querySelector('nav.c-blog-secondarynav');
  if (!nav) return;

  // Prefer the desktop nav-items, else fallback to mobile
  let navList = nav.querySelector('.c-blog-secondarynav__d-container > .c-blog-secondarynav__nav-items');
  if (!navList) {
    navList = nav.querySelector('.c-blog-secondarynav__t-m-container > .c-blog-secondarynav__nav-items');
  }
  if (!navList) return;

  // Prepare tab rows as an array of [label, content]
  const tabRows = [];
  navList.querySelectorAll(':scope > li').forEach((li) => {
    // Extract tab label (clean, robust text extraction)
    let tabLabel = '';
    const button = li.querySelector('.c-blog-secondarynav__nav-item');
    if (button) {
      tabLabel = Array.from(button.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent)
        .join(' ').replace(/\s+/g, ' ').trim();
      if (!tabLabel) {
        tabLabel = button.textContent.replace(/\s*[▼▲⮟⮝]*$/g, '').trim();
      }
    }
    // Extract tab content: the full subnav container
    const tabContent = li.querySelector('.c-blog-secondarynav__subnav-container');
    if (tabLabel && tabContent) {
      tabRows.push([tabLabel, tabContent]);
    }
  });

  // Build the cells array: header must be a single cell row
  const cells = [
    ['Tabs (tabs37)']
  ];
  // All subsequent rows are 2-column: label, content
  for (const row of tabRows) {
    cells.push(row);
  }

  // Create table and ensure header row is a single cell, others are two cells
  const table = WebImporter.DOMUtils.createTable(cells, document);
  // Patch the header row so the first <th> has colspan=2 for proper structure
  const headerTr = table.querySelector('tr');
  if (headerTr && headerTr.children.length === 1 && tabRows.length > 0) {
    headerTr.children[0].setAttribute('colspan', '2');
  }
  element.replaceWith(table);
}
