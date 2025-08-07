/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Find the actual column block root
  const container = element.querySelector('.c-blogcom__container');
  if (!container) return;

  // 2. Get the image (picture or img)
  const imageContainer = container.querySelector('.c-blogcom__image-container');
  let imageCol = [];
  if (imageContainer) {
    // Find <picture> or <img>
    const picture = imageContainer.querySelector('picture');
    if (picture) {
      imageCol = [picture];
    } else {
      const img = imageContainer.querySelector('img');
      if (img) imageCol = [img];
    }
  }

  // 3. Get the text content (headline and body)
  const contentContainer = container.querySelector('.c-blogcom__content');
  let textCol = [];
  if (contentContainer) {
    // Usually a div containing h2 and paragraph(s)
    const contentWrapper = contentContainer.firstElementChild;
    if (contentWrapper) {
      textCol = Array.from(contentWrapper.children);
    } else {
      textCol = Array.from(contentContainer.children);
    }
  }

  // 4. Build cells for the columns block (header row + content row)
  const cells = [
    ['Columns (columns38)'],
    [textCol, imageCol]
  ];

  // 5. Create the table and replace the element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
