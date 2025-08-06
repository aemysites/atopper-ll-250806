/* global WebImporter */
export default function parse(element, { document }) {
  // Find the accordion root (the one with cmp-accordion)
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Table header as per instructions
  const headerRow = ['Accordion (accordion12)'];
  const rows = [headerRow];

  // Extract each accordion item
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');
  items.forEach(item => {
    // Title: .cmp-accordion__button contains .cmp-accordion__title
    let titleContent = '';
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const titleEl = button.querySelector('.cmp-accordion__title');
      if (titleEl) {
        titleContent = titleEl;
      } else {
        // Fallback: use button's text content
        titleContent = button;
      }
    }
    // Content: accordion panel
    let contentContent = '';
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Reference panel contents (all children of panel)
      // If panel contains only one child, use that child directly for a cleaner import
      if (panel.children.length === 1) {
        contentContent = panel.children[0];
      } else if (panel.children.length > 1) {
        contentContent = Array.from(panel.children);
      } else {
        // Fallback: empty string
        contentContent = '';
      }
    }
    rows.push([titleContent, contentContent]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
