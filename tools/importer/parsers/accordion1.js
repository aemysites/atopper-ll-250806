/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const rows = [['Accordion (accordion1)']];
  // Find all h2s (accordion item titles) directly under the main element (could be deeply nested in practice, but in this structure, they're direct children)
  const h2s = Array.from(element.querySelectorAll('h2'));

  h2s.forEach((h2) => {
    // Exclude the table of contents or non-content h2s
    // The Table of Contents header always has the class 'c-article__table-of-content-bottom-title'
    if (h2.classList.contains('c-article__table-of-content-bottom-title')) return;
    // Only meaningful content h2s are included
    const title = h2;
    // Collect all nodes between this h2 and the next h2
    const contentNodes = [];
    let node = h2.nextSibling;
    while (node && !(node.nodeType === 1 && node.tagName === 'H2')) {
      if (node.nodeType === 1) {
        // Remove empty divs/spacers
        if (
          !(node.tagName === 'DIV' && !node.textContent.trim() && !node.querySelector('img,iframe,video,picture,ul,ol,table,h3,h4,h5,h6,p'))
        ) {
          contentNodes.push(node);
        }
      } else if (node.nodeType === 3 && node.textContent.trim()) {
        contentNodes.push(node);
      }
      node = node.nextSibling;
    }
    // Remove trailing empty nodes
    while (
      contentNodes.length > 0 &&
      ((contentNodes[contentNodes.length - 1].nodeType === 3 && !contentNodes[contentNodes.length - 1].textContent.trim()) ||
        (contentNodes[contentNodes.length - 1].nodeType === 1 && !contentNodes[contentNodes.length - 1].textContent.trim() && !contentNodes[contentNodes.length - 1].querySelector('img,iframe,video,picture,ul,ol,table,h3,h4,h5,h6,p')))
    ) {
      contentNodes.pop();
    }
    // Compose content cell
    let contentCell;
    if (contentNodes.length === 1) {
      contentCell = contentNodes[0];
    } else if (contentNodes.length > 1) {
      contentCell = contentNodes;
    } else {
      // If empty, provide an empty <div> so the output structure remains
      contentCell = document.createElement('div');
    }
    rows.push([title, contentCell]);
  });

  // Create the accordion block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
