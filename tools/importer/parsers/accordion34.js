/* global WebImporter */
export default function parse(element, { document }) {
  // Accordion block header
  const headerRow = ['Accordion (accordion34)'];
  const rows = [headerRow];

  // Find all accordion items
  const items = element.querySelectorAll('.cmp-accordion__item');

  items.forEach((item) => {
    // Title cell: Find the button and extract the title element (usually h3)
    const button = item.querySelector('[role="button"]');
    let titleCell = '';
    if (button) {
      const titleEl = button.querySelector('.cmp-accordion__title');
      // Reference the actual element, not its text
      titleCell = titleEl ? titleEl : button;
    }

    // Content cell: Find the panel and extract its content
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    let contentCell = '';
    if (panel) {
      // Defensive: Only include the actual content, not the panel wrapper
      // Find the first .text or .cmp-text inside the panel
      const textContent = panel.querySelector('.text, .cmp-text');
      // Reference the actual element, not its text
      contentCell = textContent ? textContent : panel;
    }

    rows.push([titleCell, contentCell]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
