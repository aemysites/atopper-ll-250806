/* global WebImporter */
export default function parse(element, { document }) {
  // Cards (cards14) block: 2 columns, multiple rows, first row is header
  const headerRow = ['Cards (cards14)'];
  const rows = [headerRow];

  // Select all card wrappers (including hidden ones)
  const cardWrappers = element.querySelectorAll('.c-articlelist__wrapper');

  cardWrappers.forEach((wrapper) => {
    // Image extraction: get the <img> inside .c-articlelist__image-container
    const imageContainer = wrapper.querySelector('.c-articlelist__image-container');
    let imageEl = null;
    if (imageContainer) {
      imageEl = imageContainer.querySelector('img');
    }

    // Text extraction: get the <a> inside .c-articlelist__text-container
    const textContainer = wrapper.querySelector('.c-articlelist__text-container');
    let textEl = null;
    if (textContainer) {
      textEl = textContainer.querySelector('a');
    }

    // Defensive: Only add row if both image and text are present
    if (imageEl && textEl) {
      rows.push([imageEl, textEl]);
    }
  });

  // Create table block
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element with block
  element.replaceWith(block);

  // Add the Show more button after the table, if present
  const buttonContainer = element.querySelector('.c-articlelist__button-container');
  if (buttonContainer) {
    const button = buttonContainer.querySelector('button');
    if (button) {
      block.after(button);
    }
  }
}
