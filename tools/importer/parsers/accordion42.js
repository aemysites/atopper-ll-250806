/* global WebImporter */
export default function parse(element, { document }) {
  // Table header matches example exactly
  const headerRow = ['Accordion (accordion42)'];
  const rows = [];

  // Find the main accordion container (may or may not have cmp-accordion class on top level)
  let accordion = element.querySelector('.cmp-accordion');
  if (!accordion) accordion = element;

  // Get all accordion items
  const items = accordion.querySelectorAll('.cmp-accordion__item');

  items.forEach(item => {
    // Title cell: find the .cmp-accordion__button, then the heading inside
    let titleElem = null;
    const button = item.querySelector('.cmp-accordion__button');
    if (button) {
      const heading = button.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        titleElem = heading;
      } else {
        // fallback: use the button itself as the title
        titleElem = button;
      }
    } else {
      // fallback: use item's text content
      titleElem = document.createElement('div');
      titleElem.textContent = item.textContent.trim();
    }

    // Content cell: find the corresponding .cmp-accordion__panel
    let contentElem = null;
    const panel = item.querySelector('[data-cmp-hook-accordion="panel"]');
    if (panel) {
      // Try to find direct .text child or just use the panel's children
      const textContainer = panel.querySelector(':scope > .text');
      if (textContainer && textContainer.children.length > 0) {
        // Place all children of .text in a fragment
        const fragment = document.createElement('div');
        Array.from(textContainer.children).forEach(child => {
          fragment.appendChild(child);
        });
        contentElem = fragment;
      } else if (panel.children.length > 0) {
        const fragment = document.createElement('div');
        Array.from(panel.children).forEach(child => {
          fragment.appendChild(child);
        });
        contentElem = fragment;
      } else {
        // fallback: just use the text content
        contentElem = document.createElement('div');
        contentElem.textContent = panel.textContent.trim();
      }
    } else {
      // fallback: empty cell
      contentElem = document.createElement('div');
    }

    rows.push([titleElem, contentElem]);
  });

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace the original element with the new block
  element.replaceWith(table);
}
