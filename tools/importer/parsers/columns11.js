/* global WebImporter */
export default function parse(element, { document }) {
  // Drill down to the main container
  let container = element;
  while (
    container &&
    container.children.length === 1 &&
    container.firstElementChild.tagName === 'DIV'
  ) {
    container = container.firstElementChild;
  }

  // Find the image column
  let imageCol = container.querySelector('.c-blogcom__image-container picture, .c-blogcom__image-container img');
  if (!imageCol) {
    // Fallback: look for first picture or img inside container
    imageCol = container.querySelector('picture, img');
  }
  // Reference the actual image element, not clone
  if (imageCol && imageCol.tagName !== 'IMG' && imageCol.querySelector('img')) {
    imageCol = imageCol.querySelector('img');
  }

  // Find the content column
  let contentCol = container.querySelector('.c-blogcom__content');
  let contentCell = [];
  if (contentCol) {
    // Headline
    const headline = contentCol.querySelector('h1, h2, h3, h4, h5, h6');
    if (headline) contentCell.push(headline);
    // Paragraph (prefer .c-blogcom__paragraph, fallback to p)
    const paragraph = contentCol.querySelector('.c-blogcom__paragraph, p');
    if (paragraph) contentCell.push(paragraph);
    // Button (prefer a, fallback to button)
    const button = contentCol.querySelector('a, button');
    if (button) contentCell.push(button);
  }

  // If no content found, fallback to all children
  if (contentCell.length === 0 && contentCol) {
    contentCell = Array.from(contentCol.children);
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns11)'];
  const secondRow = [imageCol, contentCell];

  // Build the table
  const table = WebImporter.DOMUtils.createTable([headerRow, secondRow], document);

  // Replace the original element
  element.replaceWith(table);
}
