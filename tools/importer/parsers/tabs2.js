/* global WebImporter */
export default function parse(element, { document }) {
  // Find nav containing the tabs
  const nav = element.querySelector('nav.c-blog-secondarynav');
  if (!nav) return;

  // Try to find the desktop or mobile version of the tabs
  let ulTabs = nav.querySelector('.c-blog-secondarynav__d-container ul.c-blog-secondarynav__nav-items');
  if (!ulTabs) {
    ulTabs = nav.querySelector('.c-blog-secondarynav__t-m-container ul.c-blog-secondarynav__nav-items');
  }
  if (!ulTabs) return;

  // Get all tab LI elements
  const tabLis = Array.from(ulTabs.children).filter(li => li.classList.contains('c-blog-secondarynav__list'));
  if (!tabLis.length) return;

  const rows = [];
  // Header row should have exactly one cell
  rows.push(['Tabs']);

  // Each tab row should have two cells: [tabLabel, tabContent]
  tabLis.forEach(tabLi => {
    // Extract tab label
    let tabLabel = '';
    const btn = tabLi.querySelector('button.c-blog-secondarynav__nav-item');
    if (btn) {
      tabLabel = Array.from(btn.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
        .map(n => n.textContent.trim()).join(' ');
      if (!tabLabel) tabLabel = btn.textContent.trim();
    } else {
      tabLabel = tabLi.textContent.trim();
    }

    // Extract tab content: use the real ul.subnav-items element
    let tabContent = '';
    const subnav = tabLi.querySelector('.c-blog-secondarynav__subnav-container ul.c-blog-secondarynav__subnav-items');
    if (subnav) tabContent = subnav;

    rows.push([tabLabel, tabContent]);
  });

  // Create block table using WebImporter
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Fix: ensure the header row has only one cell by setting colspan
  // and the rest of the rows have exactly two columns
  const trHeader = block.querySelector('tr:first-child');
  if (trHeader && trHeader.children.length === 1 && rows.length > 1 && rows[1].length === 2) {
    trHeader.firstElementChild.setAttribute('colspan', '2');
  }

  element.replaceWith(block);
}
