/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main accordion container
  const accordion = element.querySelector('.cmp-accordion');
  if (!accordion) return;

  // Get all accordion items (each FAQ block)
  const items = accordion.querySelectorAll(':scope > .cmp-accordion__item');

  // Prepare table rows
  const rows = [];
  // Header row: block name exactly as in the example
  rows.push(['Accordion (accordion24)']);

  items.forEach((item) => {
    // Title: find the title inside the button
    const button = item.querySelector('.cmp-accordion__button');
    let title = '';
    if (button) {
      const titleEl = button.querySelector('.cmp-accordion__title');
      if (titleEl) {
        title = titleEl.textContent.trim();
      } else {
        // fallback: use button's text content
        title = button.textContent.trim();
      }
    }
    // Content: find the panel content
    const panel = item.querySelector('.cmp-accordion__panel');
    let content = '';
    if (panel) {
      // Try to reference the actual content inside .text or .cmp-text
      const text = panel.querySelector('.text, .cmp-text');
      if (text && text.children.length === 1 && text.firstElementChild && text.firstElementChild.tagName === 'DIV') {
        // sometimes a wrapping div, go one level deeper
        content = text.firstElementChild;
      } else if (text) {
        content = text;
      } else {
        // fallback: reference all contents of the panel (excluding empty wrappers)
        // Remove the visually hidden CSS class if present
        const hiddenPanel = panel.cloneNode(true);
        hiddenPanel.classList.remove('cmp-accordion__panel--hidden');
        content = hiddenPanel;
      }
    }
    // Defensive: If nothing found, use empty string
    if (!title) title = '';
    if (!content) content = '';
    // Add the row: title as string, content as element or string
    rows.push([title, content]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the new block table
  element.replaceWith(table);
}
