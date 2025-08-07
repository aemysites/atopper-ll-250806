/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as in the example
  const headerRow = ['Cards (cards3)'];
  // Select all article wrappers (excluding button container)
  const wrappers = Array.from(element.querySelectorAll(':scope > .c-articlelist__wrapper'));
  const rows = wrappers.map((wrapper) => {
    // Image cell (first cell)
    const imageContainer = wrapper.querySelector('.c-articlelist__image-container');
    let img = null;
    if (imageContainer) {
      img = imageContainer.querySelector('img');
    }
    // Text cell (second cell)
    // The link contains the title (used as text content in the screenshot),
    // there is no description in the provided HTML, so only the link text is present.
    const textContainer = wrapper.querySelector('.c-articlelist__text-container');
    let textCell = null;
    if (textContainer) {
      // Use the <a> as the content (referencing existing element)
      const link = textContainer.querySelector('a');
      textCell = link;
    }
    return [img, textCell];
  });
  // Build the final table with header and rows
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    ...rows
  ], document);
  // Replace the element with the new table
  element.replaceWith(table);
}
