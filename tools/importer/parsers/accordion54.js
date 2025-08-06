/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to filter out empty divs (those with no text and no children)
  function isNonEmptyNode(node) {
    if (!node) return false;
    if (node.nodeType === Node.ELEMENT_NODE && node.tagName.toLowerCase() === 'div') {
      const txt = node.textContent.trim();
      return txt.length > 0 || node.children.length > 0;
    }
    return true;
  }

  // 1. Find the main content block containing the accordions
  const content = element.querySelector('.c-article__blog-bottom-content-text');
  if (!content) return;

  // 2. Get all direct children (filter out empty divs)
  const children = Array.from(content.childNodes).filter(isNonEmptyNode);

  // 3. Parse accordion panels: each panel starts with an h2
  const rows = [['Accordion (accordion54)']];
  let i = 0;
  while (i < children.length) {
    const curr = children[i];
    if (curr.nodeType === Node.ELEMENT_NODE && curr.tagName.toLowerCase() === 'h2') {
      // Title cell: the h2 element itself
      const titleEl = curr;
      // Content: collect subsequent siblings until next h2
      const contentEls = [];
      i++;
      while (
        i < children.length &&
        !(
          children[i].nodeType === Node.ELEMENT_NODE &&
          children[i].tagName.toLowerCase() === 'h2'
        )
      ) {
        // Filter out empty divs
        if (isNonEmptyNode(children[i])) {
          contentEls.push(children[i]);
        }
        i++;
      }
      // If no content, use an empty string
      rows.push([
        titleEl,
        contentEls.length ? contentEls : ''
      ]);
    } else {
      i++;
    }
  }

  // 4. Create the block and replace the original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
