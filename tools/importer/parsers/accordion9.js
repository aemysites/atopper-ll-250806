/* global WebImporter */
export default function parse(element, { document }) {
  // Find the content block to turn into accordion
  const mainContent = element.querySelector('.c-article__blog-bottom-content-text');
  if (!mainContent) return;
  
  // Accordion sections: split by each h2/h3 in order
  const headings = Array.from(mainContent.querySelectorAll('h2, h3'));
  if (!headings.length) return;

  // Compose rows: header row, then one row per accordion section
  const rows = [['Accordion (accordion9)']];

  headings.forEach((heading, idx) => {
    // Title cell: reference original heading element
    heading.removeAttribute('id'); // for output cleanliness
    const titleCell = heading;

    // Content cell: all nodes after this heading up to next heading or end
    const contentNodes = [];
    let node = heading.nextSibling;
    while (node && !(node.nodeType === 1 && (node.tagName === 'H2' || node.tagName === 'H3'))) {
      // Only add nodes with content
      if (node.nodeType === 1) {
        // skip empty divs
        if (!(node.tagName === 'DIV' && node.innerHTML.trim() === '')) {
          contentNodes.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        // preserve text nodes as spans
        const span = document.createElement('span');
        span.textContent = node.textContent;
        contentNodes.push(span);
      }
      node = node.nextSibling;
    }
    // Add the row, ensuring content is not missed
    if (contentNodes.length === 0) {
      rows.push([titleCell, '']);
    } else if (contentNodes.length === 1) {
      rows.push([titleCell, contentNodes[0]]);
    } else {
      rows.push([titleCell, contentNodes]);
    }
  });

  // Create accordion block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
