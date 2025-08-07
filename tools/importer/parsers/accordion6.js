/* global WebImporter */
export default function parse(element, { document }) {
  // Block header row exactly as required
  const headerRow = ['Accordion (accordion6)'];

  // Find the main content wrapper
  const contentRoot = element.querySelector('.c-article__blog-bottom-content');
  if (!contentRoot) return;

  // Find all h2s (accordion section titles)
  const h2s = Array.from(contentRoot.querySelectorAll('h2'));
  if (!h2s.length) return;

  // Helper: Collect all elements between two nodes
  function collectElementsBetween(start, end) {
    const nodes = [];
    let node = start.nextSibling;
    while (node && node !== end) {
      if (node.nodeType === 1) {
        // skip empty divs and spacers
        if (
          node.tagName === 'DIV' &&
          node.innerHTML.trim() === ''
        ) {
          node = node.nextSibling;
          continue;
        }
        nodes.push(node);
      }
      node = node.nextSibling;
    }
    return nodes;
  }

  // Build rows: each with [title, content]
  const rows = h2s.map((h2, i) => {
    const nextH2 = h2s[i + 1] || null;
    // Title cell: use the actual h2 element reference
    const titleCell = h2;
    // Content cell: all elements between h2 and nextH2
    const contentEls = collectElementsBetween(h2, nextH2);
    return [titleCell, contentEls];
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
