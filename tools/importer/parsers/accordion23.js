/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion23)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title: find the button element and get its text (usually in h3)
    let titleText = '';
    const button = item.querySelector('[role="button"]');
    if (button) {
      const h3 = button.querySelector('h3');
      if (h3) {
        titleText = h3.textContent.trim();
      } else {
        titleText = button.textContent.trim();
      }
    }

    // Content: find the panel element
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentEl = null;
    if (panel) {
      const panelChildren = Array.from(panel.children);
      if (panelChildren.length === 1) {
        contentEl = panelChildren[0];
      } else if (panelChildren.length > 1) {
        contentEl = panelChildren;
      } else {
        contentEl = panel;
      }
    }

    // Push row: [titleText, content]
    rows.push([titleText, contentEl]);
  });

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
