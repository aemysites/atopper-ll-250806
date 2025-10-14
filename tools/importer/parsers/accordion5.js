/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header row
  const headerRow = ['Accordion (accordion5)'];
  const rows = [headerRow];

  // Find all accordion items (repeating pattern)
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: Find the button/trigger and extract the title
    const button = item.querySelector('[role="button"]');
    let titleEl = null;
    if (button) {
      // Usually the title is inside an h3 or similar inside the button
      titleEl = button.querySelector('.cmp-accordion__title');
      // Defensive: fallback to button if no h3
      if (!titleEl) {
        titleEl = button;
      }
    }

    // Content cell: Find the panel and its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentEl = null;
    if (panel) {
      // Defensive: use the first child with content
      // Usually a div.text > div.cmp-text > ...
      const textBlock = panel.querySelector('.text, .cmp-text');
      if (textBlock) {
        // If .cmp-text, use its children (preserve all rich content)
        if (textBlock.classList.contains('cmp-text')) {
          // Create a fragment to hold all children
          const frag = document.createDocumentFragment();
          Array.from(textBlock.childNodes).forEach((node) => frag.appendChild(node.cloneNode(true)));
          contentEl = frag;
        } else {
          contentEl = textBlock;
        }
      } else {
        // fallback to panel itself
        contentEl = panel;
      }
    }

    // Defensive: if no title or content, skip this item
    if (titleEl && contentEl) {
      rows.push([titleEl, contentEl]);
    }
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element with the block table
  element.replaceWith(block);
}
