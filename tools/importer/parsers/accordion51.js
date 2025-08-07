/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion (accordion51) block structure: 2 cols, n rows, header row first
  // Each row: [title cell, content cell]

  // Helper: check if an element is an accordion heading (h2 or h3)
  function isAccordionHeading(node) {
    return node && node.nodeType === 1 && (node.tagName === 'H2' || node.tagName === 'H3');
  }

  // Find the main content container for the article
  // This is where the accordion structure appears
  const contentRoot = element.querySelector('.c-article__blog-bottom-content-text') || element;
  // The accordion starts at the first H2/H3 and continues until no H2/H3 left.
  const nodes = Array.from(contentRoot.childNodes);

  const cells = [['Accordion (accordion51)']];
  let i = 0;
  while (i < nodes.length) {
    // Find next heading
    while (i < nodes.length && !isAccordionHeading(nodes[i])) {
      i++;
    }
    if (i >= nodes.length) break;
    // Found a heading (title cell)
    const heading = nodes[i];
    i++;
    // Gather all nodes until the next heading
    const contentNodes = [];
    while (
      i < nodes.length &&
      !isAccordionHeading(nodes[i])
    ) {
      // Only meaningful nodes
      let node = nodes[i];
      if (
        (node.nodeType === 1 && (node.tagName !== 'DIV' || node.textContent.trim() !== '')) ||
        (node.nodeType === 3 && node.textContent.trim() !== '')
      ) {
        contentNodes.push(node);
      }
      i++;
    }
    // Create content cell (either a single node or a wrapper div)
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else {
      const wrapper = document.createElement('div');
      contentNodes.forEach(n => wrapper.appendChild(n));
      contentCell = wrapper;
    }
    // Add the row: [heading, contentCell]
    cells.push([heading, contentCell]);
  }

  // Replace the original element with the created table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
