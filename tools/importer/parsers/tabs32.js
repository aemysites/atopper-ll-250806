/* global WebImporter */
export default function parse(element, { document }) {
  // Tabs (tabs32) block parsing
  // Header row as per guidelines
  const headerRow = ['Tabs (tabs32)'];

  // Find all tab items (li elements in nav)
  const nav = element.querySelector('.c-blog-secondarynav__nav-items');
  if (!nav) return;

  // Each tab is a li.c-blog-secondarynav__list
  const tabItems = Array.from(nav.querySelectorAll(':scope > li.c-blog-secondarynav__list'));

  // Build rows: each row is [tab label, tab content]
  // Tab label: icon + text
  // Tab content: list of links from subnav
  const rows = tabItems.map((li) => {
    // Tab label cell: icon + text
    const img = li.querySelector('img');
    const button = li.querySelector('button');
    const labelFrag = document.createDocumentFragment();
    if (img) labelFrag.appendChild(img.cloneNode(true));
    let labelText = '';
    if (button) {
      button.childNodes.forEach(n => {
        if (n.nodeType === Node.TEXT_NODE) {
          labelText += n.textContent;
        }
      });
      labelText = labelText.trim();
      if (!labelText && button.textContent) {
        labelText = button.textContent.trim();
      }
    }
    if (labelText) labelFrag.appendChild(document.createTextNode(labelText));

    // Tab content cell: all links in subnav, simplified to <a href>text</a> only
    const subnav = li.querySelector('.c-blog-secondarynav__subnav-items');
    let contentFrag = document.createDocumentFragment();
    if (subnav) {
      const links = Array.from(subnav.querySelectorAll('a'));
      links.forEach((a, i) => {
        // Create a simplified link (only href and text)
        const simpleA = document.createElement('a');
        simpleA.href = a.href;
        simpleA.textContent = a.textContent.trim();
        contentFrag.appendChild(simpleA);
        // Add line break between links except last
        if (i < links.length - 1) contentFrag.appendChild(document.createElement('br'));
      });
    } else {
      // If no subnav, include empty string
      contentFrag.appendChild(document.createTextNode(''));
    }

    return [labelFrag, contentFrag];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
