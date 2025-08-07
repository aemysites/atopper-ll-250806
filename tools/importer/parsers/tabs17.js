/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main navigation block
  const nav = element.querySelector('.c-blog-secondarynav');
  if (!nav) return;

  // Try both desktop and mobile containers for nav items
  let navItemsList = nav.querySelector('.c-blog-secondarynav__d-container .c-blog-secondarynav__nav-items');
  if (!navItemsList) {
    navItemsList = nav.querySelector('.c-blog-secondarynav__t-m-container .c-blog-secondarynav__nav-items');
  }
  if (!navItemsList) return;

  // Find all direct children that represent tabs
  const tabLis = Array.from(navItemsList.children).filter(li => li.classList.contains('c-blog-secondarynav__list'));
  if (!tabLis.length) return;

  // Prepare rows: header, then one row per tab
  const rows = [];
  rows.push(['Tabs (tabs17)']); // Header row: exactly as required

  tabLis.forEach(tabLi => {
    // Get the first direct child: either <a> or <button> (with label text)
    const navItem = tabLi.querySelector(':scope > .c-blog-secondarynav__nav-item');
    if (!navItem) return;

    // Extract label text: skip arrow span text for <button>
    let label = '';
    if (navItem.tagName === 'A') {
      label = navItem.textContent.trim();
    } else if (navItem.tagName === 'BUTTON') {
      // Only use the text nodes (button text before dropdown span)
      navItem.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          label += node.textContent;
        }
      });
      label = label.trim();
    }

    // Extract tab content: reference existing elements for tab content
    let contentElem = null;
    if (navItem.tagName === 'A') {
      // For single link tabs, reference the parent li (keeps context, incl. <a>)
      contentElem = tabLi;
    } else if (navItem.tagName === 'BUTTON') {
      // For dropdowns, reference the .c-blog-secondarynav__subnav-container if present, otherwise the whole li
      const subnav = tabLi.querySelector(':scope > .c-blog-secondarynav__subnav-container');
      contentElem = subnav || tabLi;
    }

    // Only add row if both label and content are present
    if (label && contentElem) {
      rows.push([label, contentElem]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
