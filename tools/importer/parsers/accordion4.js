/* global WebImporter */
export default function parse(element, { document }) {
  // Header row for Accordion block
  const headerRow = ['Accordion (accordion4)'];

  // Helper to get all immediate children of a node
  const getImmediateChildren = (parent) => {
    return Array.from(parent.children);
  };

  // Find the main content area for the accordion
  const contentArea = element.querySelector('.c-article__blog-bottom-content-text');
  if (!contentArea) return;

  // Find all h2 and h3 that should be used as accordion titles
  const headings = Array.from(contentArea.querySelectorAll('h2, h3'));
  if (headings.length === 0) return;

  const accordionRows = [];

  headings.forEach((heading, idx) => {
    // Title is the heading element itself
    const titleCell = heading;
    // Gather all content until the next h2 or h3 (exclusive)
    const contentNodes = [];
    let current = heading.nextSibling;
    while (current) {
      // Stop at the next heading (h2/h3) or at the end
      if (
        current.nodeType === 1 && (current.tagName === 'H2' || current.tagName === 'H3')
      ) {
        break;
      }
      // Include element nodes (except empty divs) and non-empty text nodes
      if (
        (current.nodeType === 1 && (current.textContent.trim() !== '' || current.querySelector('*'))) ||
        (current.nodeType === 3 && current.textContent.trim() !== '')
      ) {
        contentNodes.push(current);
      }
      current = current.nextSibling;
    }
    // If just one child, pass as single, else as array (for createTable)
    const contentCell = contentNodes.length === 1 ? contentNodes[0] : (contentNodes.length > 1 ? contentNodes : '');
    accordionRows.push([titleCell, contentCell]);
  });

  // Compose the table for the Accordion block
  const tableCells = [headerRow, ...accordionRows];
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
