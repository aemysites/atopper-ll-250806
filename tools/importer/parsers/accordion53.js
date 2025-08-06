/* global WebImporter */
export default function parse(element, { document }) {
  // Prepare header row as per the block name and example
  const headerRow = ['Accordion (accordion53)'];

  // Get the main content area for the accordion
  const content = element.querySelector('.c-article__blog-bottom-content-text');
  if (!content) return;

  // Get all child nodes (not just elements) to preserve text and structure
  const children = Array.from(content.childNodes);

  // Split content into accordion items by finding <h2> elements
  const rows = [];
  let i = 0;
  while (i < children.length) {
    const node = children[i];
    if (node.nodeType === 1 && node.tagName === 'H2') {
      // Title is the <h2> node itself
      const titleCell = node;
      // Content is everything until the next <h2>
      const contentNodes = [];
      let j = i + 1;
      while (j < children.length && !(children[j].nodeType === 1 && children[j].tagName === 'H2')) {
        const n = children[j];
        // Skip empty text nodes and empty <div>s only
        if (
          (n.nodeType === 3 && n.textContent.trim() === '') ||
          (n.nodeType === 1 && n.tagName === 'DIV' && n.innerHTML.trim() === '')
        ) {
          j++;
          continue;
        }
        contentNodes.push(n);
        j++;
      }
      // If contentNodes is empty, use empty string so we always have a cell
      let contentCell;
      if (contentNodes.length === 0) {
        contentCell = '';
      } else if (contentNodes.length === 1) {
        contentCell = contentNodes[0];
      } else {
        contentCell = contentNodes;
      }
      rows.push([titleCell, contentCell]);
      i = j;
    } else {
      i++;
    }
  }

  // Assemble the table
  if (rows.length > 0) {
    const cells = [headerRow, ...rows];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
