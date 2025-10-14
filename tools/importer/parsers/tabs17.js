/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract tab label and content from nav structure
  function extractTabs(navItems) {
    const tabs = [];
    navItems.forEach((li) => {
      let labelEl = li.querySelector('.c-blog-secondarynav__nav-item');
      let label = '';
      if (labelEl) {
        // Check for dropdown arrow (caret)
        const arrow = labelEl.querySelector('.c-blog-secondarynav__arrow');
        if (arrow) {
          label = labelEl.childNodes[0].textContent.trim() + ' \u25BC';
        } else {
          label = labelEl.textContent.trim();
        }
      }
      // Tab content: extract all dropdown/subnav items as text if present
      let content = '';
      const contentEl = li.querySelector('.c-blog-secondarynav__subnav-container');
      if (contentEl) {
        const links = contentEl.querySelectorAll('.c-blog-secondarynav__subnav-item');
        if (links.length) {
          const frag = document.createElement('div');
          links.forEach(a => {
            frag.appendChild(a.cloneNode(true));
          });
          content = frag;
        } else {
          content = contentEl.cloneNode(true);
        }
      } else if (labelEl && labelEl.tagName === 'A') {
        content = labelEl.cloneNode(true);
      } else {
        content = document.createTextNode(label);
      }
      tabs.push([label, content]);
    });
    return tabs;
  }

  // Find the nav element
  const nav = element.querySelector('nav.c-blog-secondarynav');
  if (!nav) return;

  let tabRows = [];
  // Desktop navigation
  const dContainer = nav.querySelector('.c-blog-secondarynav__d-container');
  if (dContainer) {
    const navItems = dContainer.querySelectorAll('.c-blog-secondarynav__nav-items > .c-blog-secondarynav__list');
    tabRows = tabRows.concat(extractTabs(navItems));
  }
  // Mobile navigation
  const tContainer = nav.querySelector('.c-blog-secondarynav__t-m-container');
  if (tContainer) {
    const navItems = tContainer.querySelectorAll('.c-blog-secondarynav__nav-items > .c-blog-secondarynav__list');
    tabRows = tabRows.concat(extractTabs(navItems));
    // Also include the mobile nav-title button as a tab if present
    const navTitleBtn = tContainer.querySelector('.c-blog-secondarynav__nav-title');
    if (navTitleBtn) {
      let label = navTitleBtn.childNodes[0].textContent.trim();
      const arrow = navTitleBtn.querySelector('.c-blog-secondarynav__arrow');
      if (arrow) label += ' \u25BC';
      let content = document.createTextNode(label);
      tabRows.push([label, content]);
    }
  }

  // Table header row
  const headerRow = ['Tabs (tabs17)'];
  // Build table rows: each tab as [label, content]
  const cells = [headerRow, ...tabRows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
